import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Col, Card, Tab, Tabs } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import { RowModal, ListingRowModal, ProjectRowModal } from './RowModal';
import { RowModalUserDelete, RowModalUserApprove, RowModalListingApprove, RowModalListingDelete, RowModalProjectApprove, RowModalProjectDelete } from './ConfirmModal';
import Toast from "../../../Components/Toast";
import { Button, ContentHeader, DatePicker, Dropdown } from "../../../Components";
import { Stack } from 'react-bootstrap';
import utils from "../../../Utils";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';


const Frontpage = () => {

  const [Users2, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [approveUsers, setApproveUsers] = useState([]);

  const [projects, setProjects] = useState([])
  const [listings, setlistings] = useState([])

  //Delete confirmation modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmDeleteModalListing, setShowConfirmDeleteModalListing] = useState(false);
  const [showConfirmDeleteModalProject, setShowConfirmDeleteModalProject] = useState(false);  

  //Approve confirmation modal
  const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false);
  const [showConfirmApproveModalListing, setShowConfirmApproveModalListing] = useState(false);
  const [showConfirmApproveModalProject, setShowConfirmApproveModalProject] = useState(false);

  //Arrays for boostrap modal from datatable rows
  const [showModal, setShowModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  //Arrays for row data
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowListing, setSelectedRowListing] = useState(null);
  const [selectedRowProject, setSelectedRowProject] = useState(null);

  //Boostrap tabs for user, listing and projects
  const [activeTabUser, setActiveTabUser] = useState('unapproved');
  const [activeTabProject, setActiveTabProject] = useState('unapproved');
  const [activeTabListing, setActiveTabListing] = useState('unapproved');

  const handleTabChangeProject = (tab) => {
    setActiveTabProject(tab);
  };

  const handleTabChangeListing = (tab) => {
    setActiveTabListing(tab);
  };

  const handleTabChangeUser = (tab) => {
    setActiveTabUser(tab);
  };

  useEffect(() => {
    UserService.getUserList()
      .then((response) => {
        setUsers(response);
      })
    UserService.getUserList()
      .then((response) => {
        setApproveUsers(response);
      })
    ProjectService.getAllProjects()
      .then((response) => {
        setProjects(response);
      })
    ListingService.getAllListings()
      .then((response) => {
        setlistings(response);
      })
  }, []);

  //Extracting the project details
  const filteredProjects = projects.map(project => ({
    _id: project._id,
    projectName: project.projectName,
    projectType: project.projectType,
    projectOwner: project.projectOwner.firstName,
    phoneNumber: project.projectOwner.phoneNo,
    email: project.projectOwner.email,
    licence: project.projectOwner.licence,
    locationName: project.projectLocation[0].locationName,
    projectStatus: project.projectStatus,
    region: project.projectLocation[0].region,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    projectApproved: project.projectApproved,
    projectTitleImage: project.projectTitleImage,
    projectPriceRange: project.projectPriceRange
  }));


  const filteredunApprovedProjects = filteredProjects.filter(project => project.projectApproved === false);//For the Graph
  const countfilteredunApprovedProjects = filteredunApprovedProjects.length;
  const filteredApprovedProjects = filteredProjects.filter(project => project.projectApproved === true);//For the Graph

  // Extract listing details
  const filteredListings = listings.map((item) => {
    return {
      _id: item._id,
      listingName: item.listingName,
      type: item.type,
      region: item.region,
      suburb: item.suburb,
      project: item.project,
      devloper: item.devloper,
      streetAddress: item.streetAddress,
      updatedAt: item.updatedAt,
      titleImage: item.titleImage,
      listingApproved: item.listingApproved
    };
  });


  const userMap = {};
  Users2.forEach(user => {
    userMap[user._id] = user;
  });

  const listingsWithOwners = filteredListings.map(item => {
    const owner = userMap[item.devloper];
    if (owner) {
      return {
        ...item,
        devloper: owner
      };
    }
    return item;
  });

  const projectMap = {};
  projects.forEach(project => {
    projectMap[project._id] = project;
  });

  const listingsWithProjects = listingsWithOwners.map(item => {
    const owner = projectMap[item.project];
    if (owner) {
      return {
        ...item,
        project: owner.projectName
      };
    }
    return item;
  });

  const filteredunapprovedListingData = listingsWithProjects.map(item => ({
    _id: item._id,
    titleImage: item.titleImage,
    project: item.project,
    listingName: item.listingName,
    type: item.type,
    project: item.project,
    suburb: item.suburb,
    devloper: item.devloper.firstName,
    devLastname: item.devloper.lastName,
    devMobile: item.devloper.mobileNo,
    devMobile2: item.devloper.phoneNo,
    email: item.devloper.email,
    devLicence: item.devloper.verified,
    streetAddress: item.streetAddress,
    region: item.region,
    updatedAt: item.updatedAt,
    listingApproved: item.listingApproved
  }));

  const filteredunApprovedListings = filteredunapprovedListingData.filter(item => item.listingApproved === false);
  const countfilteredunApprovedListings = filteredunApprovedListings.length;
  const filteredApprovedListings = filteredunapprovedListingData.filter(item => item.listingApproved === true);//For the Graph


  //Extracting the user details that are unapproved
  const filteredunapprovedUserData = approveUsers.map(item => ({
    _id: item._id,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    phoneNo: item.phoneNo,
    accType: item.accType,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    city: item.city,
    licence: item.licence,
    company: item.company,
    postcode: item.postcode,
    verified: item.verified,
    verifiedLicence: item.verifiedLicence
  }));

  const filteredunApprovedUser = filteredunapprovedUserData.filter(item => item.verified == false);
  const countfilteredunApprovedUsers = filteredunApprovedUser.length;
  const filteredApprovedUsers = filteredunapprovedUserData.filter(item => item.verified === true);

  const userunApprovedColumns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row._id || '--',
      sortable: true,
    },
    {
      name: 'First Name',
      selector: row => row.firstName || '--',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName || '--',
      sortable: true,
      hide: true,
    },
    {
      name: 'Email',
      selector: row => row.email || '--',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNo || '--',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => utils.string.capitalize(row.accType) || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.createdAt) : '--',
      sortable: true,
    },
    {
      name: 'City',
      selector: row => row.city,
      sortable: true,
    },
    {
      name: 'Country',
      selector: row => row.country,
      sortable: true,
    },
    {
      name: 'Postcode',
      selector: row => row.postcode,
      sortable: true,
    },
    ,
    {
      name: 'License Verified',
      selector: row => row.verifiedLicence,
      cell: row => row.verifiedLicence ? 'Verified' : 'Not verified',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={() => onSelectApprove(row)}>
          <i className="feather icon-user-check"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onSelectDelete(row)}>
          <i className="feather icon-user-x"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModal(row)}>
          <i className="feather icon-eye"></i>
        </Button>
      </>)
    }
  ], []);
  const usercolumnsToDisplay = userunApprovedColumns.filter(column => column.name !== 'ID' 
  && column.name !== 'Postcode' && column.name !== 'Country' && column.name !== 'City' && column.name !== 'Last Modified At');

  const userApprovedColumns = useMemo(() => [
    {
      name: 'First Name',
      selector: row => row.firstName || '--',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName || '--',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email || '--',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNo || '--',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => utils.string.capitalize(row.accType) || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: 'License Verified',
      selector: row => row.verifiedLicence,
      cell: row => row.verifiedLicence ? 'Verified' : 'Not verified',
      sortable: true,
    }
  ], []);

  const projectColumns = useMemo(() => [
    {
      name: 'Project Name',
      selector: row => row.projectName || '--',
      sortable: true,
    },
    {
      name: 'Property Type',
      selector: row => row.projectType || '--',
      sortable: true,
    },
    {
      name: 'Project Owner',
      selector: row => row.projectOwner || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.locationName || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => onProjectApproval(row)}>
          <i className="feather icon-check"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={(e) => onProjectDelete(row)}>
          <i className="feather icon-trash"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModalProject(row)}>
          <i className="feather icon-eye"></i>
        </Button>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/projects/${row._id}`} target="_blank">
          <i className="feather icon-corner-up-right"></i>
        </Link>
      </>)
    }
  ], []);

  const projectApprovedColumns = useMemo(() => [
    {
      name: 'Project Name',
      selector: row => row.projectName || '--',
      sortable: true,
    },
    {
      name: 'Property Type',
      selector: row => row.projectType || '--',
      sortable: true,
    },
    {
      name: 'Project Owner',
      selector: row => row.projectOwner || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.locationName || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/projects/${row._id}`} target="_blank">
          <i className="feather icon-corner-up-right"></i>
        </Link>
      </>)
    }
  ], []);

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
      name: 'Developer',
      selector: row => row.devloper || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.streetAddress || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => onListingApproval(row)}>
          <i className="feather icon-check"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={(e) => onListingDelete(row)}>
          <i className="feather icon-trash"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModalListing(row)}>
          <i className="feather icon-eye"></i>
        </Button>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/listings/${row._id}`} target="_blank">
          <i className="feather icon-corner-up-right"></i>
        </Link>
      </>)
    }
  ], []);

  const listingApprovedColumns = useMemo(() => [
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
      name: 'Developer',
      selector: row => row.devloper || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.streetAddress || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/listings/${row._id}`} target="_blank">
          <i className="feather icon-corner-up-right"></i>
        </Link>
      </>)
    }
  ], []);


  //For Users
  const handleOpenModal = (row) => {
    //console.log("row", row);
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  //END for Users

  //For view Listing in a modal
  const handleOpenModalListing = (row) => {
    //console.log("row", row);
    setSelectedRowListing(row);
    setShowListingModal(true);
  };

  const handleCloseModalListing = () => {
    setSelectedRowListing([]);
    setShowListingModal(false);
  };

  //Approving the listing
  const onListingApproval = (row) => {
    setSelectedRowListing(row);
    setShowConfirmApproveModalListing(true);
  }

  const onConfirmApproveListing = () => {
    const Userid = selectedRowListing._id;
    ListingService.approveListing({ id: Userid })
      .then(() => {
        setSelectedRowListing([]);
        Toast('Listing approved successfully', 'success');
        //ListingService.getAllListings();//Trying to refresh
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed approve!', 'danger');
      })
      .finally(() => setShowConfirmApproveModalListing(false))
      setShowConfirmApproveModalListing(false);
  }

  const handleCloseListingApprove = () => {
    setShowConfirmApproveModalListing(false);
  };

  //Deleting Listing
  const onListingDelete = (row) => {
    setSelectedRowListing(row);
    setShowConfirmDeleteModalListing(true);
  }

  const onConfirmDeleteListing = () => {
    const Listingid = selectedRowListing._id;
    console.log(Listingid);
    ListingService.deleteListing(Listingid)
      .then(() => {
        //setSelectedRowListing([]);
        Toast('Listing deleted successfully', 'success');
        //console.log(response);
        //ListingService.getAllListings();//Trying to refresh
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed delete!', 'danger');
      })
      .finally(() => setShowConfirmDeleteModalListing(false))
      setShowConfirmDeleteModalListing(false);
  }

  const handleCloseListingDelete = () => {
    setShowConfirmDeleteModalListing(false);
  };
  //END of Listing

  //For Project
  const handleOpenModalProject = (row) => {
    //console.log("row", row);
    setSelectedRowProject(row);
    setShowProjectModal(true);
  };

  const handleCloseModalProject = () => {
    setShowProjectModal(false);
  };

  ///////////////////////////////////////////////////////////////
  //Approving project
  const onProjectApproval = (row) => {
    setSelectedRowProject(row);
    setShowConfirmApproveModalProject(true);
  }

  const onConfirmApproveProject = () => {
    const Userid = selectedRowProject._id;
    ProjectService.approveProjects({ id: Userid })
      .then(() => {
        setSelectedRowProject([]);
        Toast('Project approved successfully', 'success');
        //ListingService.getAllListings();//Trying to refresh
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed approve!', 'danger');
      })
      .finally(() => setShowConfirmApproveModalProject(false))
    setShowConfirmApproveModalProject(false);
  }

  const handleCloseProjectApprove = () => {
    setShowConfirmApproveModalProject(false);
  };
  ///END of approving project


  //Begin delete project
  const onProjectDelete = (row) => {
    setSelectedRowProject(row);
    setShowConfirmDeleteModalProject(true);
  }

  const onConfirmDeleteProject = () => {
    const Projectid = selectedRowProject._id;
    console.log(Projectid);
    console.log('Type of myVariable:', typeof Projectid);
    //console.log(JSON.stringify(objectId));
    ProjectService.deleteProject(Projectid)
      .then(() => {
        setSelectedRowProject([]);
        Toast('Project deleted successfully', 'success');
        //ListingService.getAllListings();//Trying to refresh
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed delete!', 'danger');
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


  //Deleting the user
  const onSelectDelete = (row) => {
    setSelectedUsers([]);
    setSelectedUsers(row);
    setShowConfirmDeleteModal(true);
  }
  const handleCloseUserDelete = () => {
    setShowConfirmDeleteModal(false);
  };

  const onConfirmDeleteUsers = () => {
    const Userid = selectedUsers._id;

    UserService.deleteUser(Userid)
      .then(() => {
        setSelectedUsers([]);
        Toast('Delete successfully', 'success');
        //UserService.getUserList();
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed to delete user!', 'danger');
      })
      .finally(() => setShowConfirmDeleteModal(false))
    setShowConfirmDeleteModal(false);
  }
  //END of deleteing the user

  const onSelectApprove = (row) => {
    setSelectedUsers([]);
    setSelectedUsers(row);
    setShowConfirmApproveModal(true);
  }
  const onConfirmApproveUsers = () => {
    const Userid = selectedUsers._id
    console.log(Userid);
    console.log(JSON.stringify(selectedUsers));
    UserService.approveUser({ id: Userid })
      .then(() => {
        setSelectedUsers([]);
        Toast('Approved successfully', 'success');
        //UserService.getUserList();
        window.location.reload();
      })
      .catch(() => {
        Toast('Failed to approve users!', 'danger');
        console.log('Failed to approve user!');
      })
      .finally(() => setShowConfirmApproveModal(false))
    setShowConfirmApproveModal(false);
  }

  const handleCloseUserApprove = () => {
    setShowConfirmApproveModal(false);
  };

  //Extracting the approved listing ID once the row is clicked
  var listingRowID = null;  
  const onRowClickedListing = (row) => {
    listingRowID = row._id;
    console.log('Listing clicked row id:', listingRowID);
    
  }

  var projectRowID = null;
  const onRowClickedProject = (row) => {
    projectRowID = row._id;
    console.log('Project clicked row id:', projectRowID);
  }



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
        licence: item.licence
      };
    }
    else { return {} }
  })
  const filteredFirstNames = filteredLoginUser.map(item => item ? item.firstName : null).filter(firstName => firstName !== null);

  return (
    <Container className="content-container">
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <div>
              <h1>Flair Real Estate Moderator Dashboard</h1>
            </div>
          </Row>
        </Card>
      </Col>
      <br />
      <div class="container">
        <Col lg={12}>
          <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
            <Row>
              <h4>Quick summary 🔦</h4>
              <br /><br />
            </Row>
            <Row>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Welcome</h5>
                  <br />
                  <p><h1>{filteredFirstNames}</h1></p>

                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending user accounts</h5>
                  <br />
                  <p><h1>{countfilteredunApprovedUsers} </h1></p>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending listings</h5>
                  <br />
                  <p><h1>{countfilteredunApprovedListings} </h1></p>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending projects</h5>
                  <br />
                  <p><h1>{countfilteredunApprovedProjects} </h1></p>
                </Card>
              </Col>
            </Row>
            <Row>
              <br /><br />
              <p><br />Description</p>
              <p>
                Flair Real Estate agent dashboard lets you walk through your listings, projects including the total number of
                builders in our Flair Real Estate.
              </p>
            </Row>
          </Card>
        </Col>
      </div>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>User account approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabUser} onSelect={handleTabChangeUser}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          <DataTable
                            columns={usercolumnsToDisplay}
                            data={filteredunApprovedUser}
                            //selectableRows
                            //onSelectedRowsChange={onSelectedRowsChange}
                            //onRowClicked={(row) => handleOpenModal(row)}
                            pagination 
                            highlightOnHover/>
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={userApprovedColumns}
                            data={filteredApprovedUsers}
                            pagination
                            highlightOnHover />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
            <RowModal
              show={showModal}
              handleClose={handleCloseModal}
              rowData={selectedRow}
            />
            <RowModalUserDelete show={showConfirmDeleteModal}
              setShow={setShowConfirmDeleteModal}
              onDelete={onConfirmDeleteUsers}
              handleClose={handleCloseUserDelete}
              rowData={selectedUsers}
            />
             <RowModalUserApprove show={showConfirmApproveModal}
              setShow={handleOpenModal}
              onApprove={onConfirmApproveUsers}
              handleClose={handleCloseUserApprove}
              rowData={selectedUsers}
            />
          </Row>
          <br />
        </Card>
      </Col>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>Listing approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <br /><br />
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabListing} onSelect={handleTabChangeListing}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          <DataTable
                            columns={listingColumns}
                            data={filteredunApprovedListings}
                            pagination
                            highlightOnHover />
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={listingApprovedColumns}
                            data={filteredApprovedListings}
                            onRowClicked={onRowClickedListing}
                            highlightOnHover
                            pagination />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
            <ListingRowModal
              show={showListingModal}
              handleCloseListing={handleCloseModalListing}
              rowData={selectedRowListing}
              onApprove={onConfirmApproveListing}
            />
            <RowModalListingApprove show={showConfirmApproveModalListing}
              setShow={handleOpenModalListing}
              onApprove={onConfirmApproveListing}
              handleClose={handleCloseListingApprove}
              rowData={selectedRowListing}
            />
            <RowModalListingDelete show={showConfirmDeleteModalListing}
              setShow={handleOpenModalListing}
              onDelete={onConfirmDeleteListing}
              handleClose={handleCloseListingDelete}
              rowData={selectedRowListing}
            />
          </Row><br />
        </Card>
      </Col>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>Project approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <br /><br />
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabProject} onSelect={handleTabChangeProject}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          <DataTable
                            columns={projectColumns}
                            data={filteredunApprovedProjects}
                            highlightOnHover
                            pagination />
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={projectApprovedColumns}
                            data={filteredApprovedProjects}
                            highlightOnHover
                            onRowClicked={onRowClickedProject}
                            pagination />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
            <ProjectRowModal
              show={showProjectModal}
              handleCloseProject={handleCloseModalProject}
              onApprove={onConfirmApproveProject}
              rowData={selectedRowProject}
            />
            <RowModalProjectApprove show={showConfirmApproveModalProject}
              setShow={handleOpenModalProject}
              onApprove={onConfirmApproveProject}
              handleClose={handleCloseProjectApprove}
              rowData={selectedRowProject}
            />
            <RowModalProjectDelete show={showConfirmDeleteModalProject}
              setShow={handleOpenModalProject}
              onDelete={onConfirmDeleteProject}
              handleClose={handleCloseProjectDelete}
              rowData={selectedRowProject}
            />
          </Row><br />
        </Card>
      </Col><br /><br />
      {/* <p>{JSON.stringify(listingsWithProjects)}</p><br></br> */}
      {/* <p>{JSON.stringify(filteredunapprovedListingData)}</p> */}
      {/* <p>{JSON.stringify(listingsWithOwners)}</p><br />
      <p>{JSON.stringify(filteredunapprovedListingData)}</p>
<br/><br/>
      <p>{JSON.stringify(listingsWithProjects)}</p> */}
      <br />
    </Container>
  );
}

export default Frontpage;