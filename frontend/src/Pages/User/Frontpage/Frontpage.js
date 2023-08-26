import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import * as FileService from "../../../Services/FileService";
import { useEffect, useMemo, useState } from 'react';
import { Col, Card, Carousel, Tab, Tabs  } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RowModalListingDelete, RowModalProjectDelete } from './ConfirmModal';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import utils from "../../../Utils";
import { Stack } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";
import Listings from '../../Listing/List';
import CardBody from "../../../Components/Card/CardBody";
import { Button, ContentHeader, DatePicker, Dropdown } from "../../../Components";
import DataTable from 'react-data-table-component';
import Toast from "../../../Components/Toast";


const Frontpage = () => {

    const [Users2, setUsers] = useState([])
    const [projects, setProjects] = useState([])
    const [listings, setlistings] = useState([])
    const [activeTab, setActiveTab] = useState('Listings');   
    const [titleImageProject, setTitleImageProject] = useState('')
    const [selectedRowListing, setSelectedRowListing] = useState(null);
    const [selectedRowProject, setSelectedRowProject] = useState(null);
    const [showConfirmDeleteModalListing, setShowConfirmDeleteModalListing] = useState(false);
    const [showConfirmDeleteModalProject, setShowConfirmDeleteModalProject] = useState(false);
    const [showListingModal, setShowListingModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        UserService.getUserList()
            .then((response) => {
                setUsers(response);
            })
        ListingService.getAllListings()
            .then((response) => {
                setlistings(response);
            })
        ProjectService.getAllProjects()
            .then((response) => {
                setProjects(response);
            })
    }, []);


    //Get userID for the frontpage
    const SetFrontPagePart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userID = user.payload._id;

        return userID;
    }
    const ID = SetFrontPagePart();

    //Extract username and listings/ projects
    const filteredLoginUser = Users2.map((item) => {
        const uID = item._id;

        if (uID === ID) {
            return {
                _id: item._id,
                firstName: item.firstName,
                lastName: item.lastName,
                verified: item.verified,
            };
        }
        else {return {}}
    })
    const filteredFirstNames = filteredLoginUser.map(item => item ? item.firstName : null).filter(firstName => firstName !== null);
    const filteredLastNames = filteredLoginUser.map(item => item ? item.lastName : null).filter(lastName => lastName !== null);
    //const filteredVerified = filteredLoginUser.filter(item => item.verified === true);
    //End of extracting the login user first name
    
    ////////////////////////////////////////////USER FAVORITES/////////////////////////////////////////////////////////////
    const filteredFavListingData = Users2
    .filter(item => item._id === ID)
    .map((item) => {
        return {
            _id: item._id,
            favorites: item.favorites,
            
        }
    })
    const listingFavorites = filteredFavListingData.map(item => item.favorites.listings).flat();
    const projectFavorites = filteredFavListingData.map(item => item.favorites.projects).flat();
    const countFavListings = listingFavorites.length;
    const conuntFavProjects = projectFavorites.length;  
    const titleWithProjectVariable = `Projects - ${conuntFavProjects}`;
    const titleWithListingVariable = `Listings - ${countFavListings}`;


    const filteredListings = listings.filter(item => listingFavorites.includes(item._id));

    const filteredListingDetails = filteredListings.map(item => ({
        _id: item._id,
        listingName: item.listingName,
        type: item.type,
        status: item.status,
        streetAddress: item.streetAddress,
        createdAt: item.createdAt,
    }));

    const filteredProjects = projects.filter(item => projectFavorites.includes(item._id));

    const filteredProjectDetails = filteredProjects.map(item => ({
        _id: item._id,
        projectName: item.projectName,
        projectType: item.projectType,
        projectStatus: item.projectStatus,
        projectLocation: item.projectLocation[0].locationName,
        createdAt: item.createdAt,
    }));
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////PROJECTS//////////////////////////////////////////////////////////////////////

    //Extract projectNames, status and created date
    const filteredProjectData = projects.map((item) => {
        return {
            _id: item._id,
            projectName: item.projectName,
            projectStatus: item.projectStatus,
            createdAt: item.createdAt,
            projectLocation: item.projectLocation.locationName,
            projectTitleImage: item.projectTitleImage,
        }
    })

    const today = new Date(); // Current date and time

    const sortedCreatedProjects = projects
        .filter(item => {
            const createdAtDate = new Date(item.createdAt);
            const timeDifference = today - createdAtDate;
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days

            return daysDifference <= 20; // Keep only listings created within the last 14 days
        })
        .map(item => ({
            _id: item._id,
            projectName: item.projectName,
            projectStatus: item.projectStatus,
            createdAt: item.createdAt,
            projectLocation: item.projectLocation.locationName,
            projectTitleImage: item.projectTitleImage,
        }));

    const countOfNewProjects = sortedCreatedProjects.length;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////LISTINGS//////////////////////////////////////////////////////////////////////
    const filteredListingData = listings.map((item) => {
        return {
            _id: item._id,
            listingType: item.listingType,
            listingName: item.listingName,
            streetAddress: item.streetAddress,
            titleImage: item.titleImage,
            createdAt: item.createdAt,
        }
    })
    

    const sortedCreatedListings = listings
    .filter(item => {
        const createdAtDate = new Date(item.createdAt);
        const timeDifference = today - createdAtDate;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        return daysDifference <= 20; // Keep only listings created within the last 14 days
    })
    .map(item => ({
        _id: item._id,
        listingName: item.listingName,
        createdAt: item.createdAt,
        streetAddress: item.streetAddress,
        titleImage: item.titleImage,
    }));

    const countOfNewListings = sortedCreatedListings.length;

    const imageList = sortedCreatedListings.map((listing) => ({
        titleImage: listing.titleImage,
        listingName: listing.listingName,  }));


        

    const [titleImageListing, setTitleImageListing] = useState('')

    useEffect(() => {
        getImgURL(imageList?.titleImageListing);
    }, [imageList.titleImageListing]);

    const getImgURL = async (img) => {
        try {
            const fetchedImageURL = FileService.getImageUrl(img);
            setTitleImageListing(fetchedImageURL);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getImgURL2(imageList?.titleImageProject);
    }, [imageList.titleImageProject]);

    const getImgURL2 = async (img) => {
        try {
            const fetchedImageURL = FileService.getImageUrl(img);
            setTitleImageProject(fetchedImageURL);
        } catch (error) {
            console.error(error);
        }
    };
    

    const listingColumns = useMemo(() => [
        {
            name: 'Listing Name',
            selector: row => row.listingName || '--',
            sortable: true,
        },
        {
            name: 'Listing Type',
            selector: row => row.type || '--',
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status || '--',
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.streetAddress || '--',
            sortable: true,
        },

        {
            name: 'Added on',
            selector: row => row.createdAt,
            cell: row => row.createdAt ? utils.dateFormat(row.createdAt) : '--',
            sortable: true,
        },
        {
            name: "Actions",
            button: true,
            cell: row => (<>
                <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={(e) => onListingDelete(row)}>
                    <i className="feather icon-trash-2"></i>
                </Button>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/listings/${row._id}`} target="_blank">
                    <i className="feather icon-corner-up-right"></i>
                </Link>
            </>)
        }
    ], []);

    const projectColumns = useMemo(() => [
        {
            name: 'Project Name',
            selector: row => row.projectName || '--',
            sortable: true,
        },
        {
            name: 'Project Type',
            selector: row => row.projectType || '--',
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.projectStatus || '--',
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.projectLocation || '--',
            sortable: true,
        },

        {
            name: 'Added on',
            selector: row => row.createdAt,
            cell: row => row.createdAt ? utils.dateFormat(row.createdAt) : '--',
            sortable: true,
        },
        {
            name: "Actions",
            button: true,
            cell: row => (<>
                <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={(e) => onProjectDelete(row)}>
                    <i className="feather icon-trash-2"></i>
                </Button>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/projects/${row._id}`} target="_blank">
                    <i className="feather icon-corner-up-right"></i>
                </Link>
            </>)
        }
    ], []);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////IMAGE Carousel Links///////////////////////////////////
        const handleCarouselItemClickListing = (listing) => {
          // Handle the click event here

          console.log('Carousel item clicked:', listing);
          const listingUrl = `/listings/${listing._id}`;
          window.open(listingUrl, '_blank');
        };
        const handleCarouselItemClickProject = (project) => {
            // Handle the click event here
  
            console.log('Carousel item clicked:', project);
            const projectUrl = `/projects/${project._id}`;
            window.open(projectUrl, '_blank');
          };
    ///////////////////////////////////////////////////////////////////////// 


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Deleting Listing
    const handleOpenModalListing = (row) => {
        //console.log("row", row);
        setSelectedRowListing(row);
        setShowListingModal(true);
      };
  const onListingDelete = (row) => {
    setSelectedRowListing(row);
    setShowConfirmDeleteModalListing(true);
  }

  const onConfirmDeleteListing = () => {
    const Listingid = selectedRowListing._id;
    console.log(Listingid);
    
    const dislikeListingData = {
        userId: ID,
        favoriteType: "listings",
        favoriteId: Listingid
    };
    UserService.deleteFavorite(dislikeListingData)
      .then(() => {
        Toast('Listing removed successfully', 'success');
        window.location.reload();
      })
      .catch(() => {
        Toast('Removing failed!', 'danger');
      })
      .finally(() => setShowConfirmDeleteModalListing(false))
      setShowConfirmDeleteModalListing(false);
  }

  const handleCloseListingDelete = () => {
    setShowConfirmDeleteModalListing(false);
  };
  //END of Listing

  //Begin delete project

    //For Project
    const handleOpenModalProject = (row) => {
        //console.log("row", row);
        setSelectedRowProject(row);
        setShowProjectModal(true);
      };
  const onProjectDelete = (row) => {
    setSelectedRowProject(row);
    setShowConfirmDeleteModalProject(true);
  }

  const onConfirmDeleteProject = () => {
    const Projectid = selectedRowProject._id;
    console.log(Projectid);
    const dislikeProjectData = {
        userId: ID,
        favoriteType: "projects",
        favoriteId: Projectid
    };
    console.log('Type of myVariable:', typeof Projectid);
    //console.log(JSON.stringify(objectId));
    UserService.deleteFavorite(dislikeProjectData)
      .then(() => {
        setSelectedRowProject([]);
        Toast('Project removed successfully', 'success');
        //ListingService.getAllListings();//Trying to refresh
        window.location.reload();
      })
      .catch(() => {
        Toast('Removing failed!', 'danger');
        console.log("NOOOOOOOOOO");
      })
      .finally(() => setShowConfirmDeleteModalProject(false))
    setShowConfirmDeleteModalProject(false);
  }

  const handleCloseProjectDelete = () => {
    setShowConfirmDeleteModalProject(false);
  };
  /////////////////////////////////////////////////////////////////
  //END of Project
    return (
        <Container className="content-container">
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <div>
                            <h1>Flair Real Estate User Dashboard</h1>
                        </div>
                    </Row>
                </Card>
            </Col>
            <br/>
            <Col lg={9}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Quick summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Welcome</h5>
                                <br />
                                <p><h1>{filteredFirstNames} {filteredLastNames}</h1></p>

                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of new projects</h5>
                                <br />
                                <p><h1>{countOfNewProjects}</h1></p>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of new listings</h5>
                                <br />
                                <p><h1>{countOfNewListings}</h1></p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p>
                            Flair Real Estate agent dashboard lets you know what are the new listings, projects that are added since your last login.
                        </p>
                    </Row>
                </Card>
            </Col>
            <br />

            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Featured Listings</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>New listings</h6><br />
                                    <div>
                                        {/* <Card.Img
                                            variant="top"
                                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                            src={titleImage}
                                        /> */}

                                        <Carousel>
                                            {sortedCreatedListings.map((listing, index) => (
                                                <Carousel.Item key={index} onClick={() => handleCarouselItemClickListing(listing)}>
                                                    <img
                                                        className="d-block w-50"
                                                        src={FileService.getImageUrl(listing?.titleImage)}  // Add the appropriate property for the image URL
                                                        alt={listing.listingName}
                                                    />
                                                    <div className="carousel-caption d-none d-md-block">
                                                        <h5>{listing.listingName}</h5>
                                                        <p>{listing.streetAddress}</p> {/* Replace with your description property */}
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>

                                    </div>
                                </Card>
                            </ResponsiveContainer>

                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p><ul>Your listings of the Flair Real Estate are graphically shown. The maximum and the minimum prices of the listings are contrasted for your easiness.
                            The regional distribution of the available listings entries in Flair Real Estate are presented in the second pie chart as it makes easier to identify the average listing regions.
                            In the third segment, it is the types of popular listings that are shown.
                        </ul>
                        </p>
                    </Row>
                </Card>
            </Col>
            <br/>
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Featured Projects</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>New projects</h6><br />
                                    <div>
                                        <Carousel>
                                            {sortedCreatedProjects.map((project, index) => (
                                                <Carousel.Item key={index} onClick={() => handleCarouselItemClickProject(project)}>
                                                    <img
                                                        className="d-block w-20"
                                                        src={FileService.getImageUrl(project?.projectTitleImage)}  // Add the appropriate property for the image URL
                                                        alt={project.projectName}
                                                    />
                                                    <div className="carousel-caption d-none d-md-block">
                                                        <h5>{project.projectName}</h5>
                                                        <p>{project.projectLocation}</p> {/* Replace with your description property */}
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>

                                    </div>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p><ul>Your listings of the Flair Real Estate are graphically shown. The maximum and the minimum prices of the listings are contrasted for your easiness.
                            The regional distribution of the available listings entries in Flair Real Estate are presented in the second pie chart as it makes easier to identify the average listing regions.
                            In the third segment, it is the types of popular listings that are shown.
                        </ul>
                        </p>
                    </Row>
                </Card>
            </Col>
            <br />

            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Favorites</h4>
                        <br /><br />
                    </Row>
                    <Row>
                    <Col>
                        <ResponsiveContainer>
                            <Row>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <Tabs activeKey={activeTab} onSelect={handleTabChange}>
                                        <Tab eventKey="Listings" title={titleWithListingVariable}>
                                            <CardBody>
                                                <DataTable
                                                    columns={listingColumns}
                                                    data={filteredListingDetails}
                                                    pagination
                                                    highlightOnHover />
                                            </CardBody>
                                        </Tab>
                                        <Tab eventKey="Projects" title={titleWithProjectVariable}>
                                            <CardBody>
                                                <DataTable
                                                    columns={projectColumns}
                                                    data={filteredProjectDetails}
                                                    // onRowClicked={onRowClickedListing}
                                                    highlightOnHover
                                                    pagination />
                                            </CardBody>
                                        </Tab>
                                    </Tabs>
                                </Card>
                            </Row>
                        </ResponsiveContainer>
                    </Col>
                        <RowModalListingDelete show={showConfirmDeleteModalListing}
                            setShow={handleOpenModalListing}
                            onDelete={onConfirmDeleteListing}
                            handleClose={handleCloseListingDelete}
                            rowData={selectedRowListing}
                        />
                        <RowModalProjectDelete show={showConfirmDeleteModalProject}
                            setShow={handleOpenModalProject}
                            onDelete={onConfirmDeleteProject}
                            handleClose={handleCloseProjectDelete}
                            rowData={selectedRowProject}
                        />
                        <br />
                    </Row>
                    <br />
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p><ul>You can manage your favorite listings and projects from here. Either click the arrow icon 
                            to open the specific listing or project or remove a specific listing or project from your favorite list.
                        </ul>
                        </p>
                    </Row>
                </Card>
            </Col>
            <br/>
            {/* <p>{JSON.stringify(filteredProjects)}</p>
            <p>{JSON.stringify(filteredFavListingData)}</p>
            <p>{JSON.stringify(projectFavorites)}</p>
            <br/>
            <p>{JSON.stringify(filteredListingDetails)}</p>
            <p>{JSON.stringify(filteredProjectDetails)}</p> */}
        </Container>
    );
}

export default Frontpage;