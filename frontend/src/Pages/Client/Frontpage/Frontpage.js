import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useState, useMemo } from 'react';
import { Col, Card } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import utils from "../../../Utils";
import { Link, useParams } from "react-router-dom";
import { BarChart, Bar, Cell, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import DataTable from 'react-data-table-component';
import { Stack } from 'react-bootstrap';


const Frontpage = () => {

    const [Users2, setUsers] = useState([])
    const [projects, setProjects] = useState([])
    const [projectByAvailability, setProjectByAvailability] = useState([])
    const [listings, setlistings] = useState([])
    const [listingsByRegion, setlistingsByRegion] = useState([])

    //Get userID for the frontpage
    const SetFrontPagePart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userID = user.payload._id;

        return userID;
    }
    const ID = SetFrontPagePart();

    //Piechart colors for listing by subrub
    const COLORSBySuburb = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8A0C40', '#3807EB'];
    const RADIANBySuburb = Math.PI / 180;
    const renderCustomizedLabelBySuburb = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIANBySuburb);
        const y = cy + radius * Math.sin(-midAngle * RADIANBySuburb);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    //End of piechart colors for for listing by subrub

    //Piechart colors for projectsbyAvailability
    const COLORSforAvailability = ['#00C49F', '#0088FE'];
    const RADIANforAvailability = Math.PI / 180;
    const renderCustomizedLabelAvailability = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIANforAvailability);
        const y = cy + radius * Math.sin(-midAngle * RADIANforAvailability);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    //End of piechart colors for projectsbyAvailability


    //Listings by region
    useEffect(() => {
        let NewSouthWales = 0,
            Queensland = 0,
            Victoria = 0,
            SouthAustralia = 0,
            WesternAustralia = 0,
            NorthernTerritory = 0
        listings.forEach((listings) => {
            if (listings.region === "New South Wales") return NewSouthWales++;
            if (listings.region === "Queensland") return Queensland++;
            if (listings.region === "Victoria") return Victoria++;
            if (listings.region === "South Australia") return SouthAustralia++;
            if (listings.region === "Western Australia") return WesternAustralia++;
            if (listings.region === "Northern Territory") return NorthernTerritory++;
        });
        setlistingsByRegion([
            { region: 'New South Wales', qty: NewSouthWales },
            { region: 'Queensland', qty: Queensland },
            { region: 'Victoria', qty: Victoria },
            { region: 'South Australia', qty: SouthAustralia },
            { region: 'Western Australia', qty: WesternAustralia },
            { region: 'Northern Territory', qty: NorthernTerritory }
        ]);
    }, [listingsByRegion]);
    //End listing by region

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
        ProjectService.getAllProjects()
            .then((response) => {
                setProjectByAvailability(response);
            })
    }, []);

    //Projects by availability
    useEffect(() => {
        let Active = 0,
            Deactive = 0
        projects.forEach((projects) => {
            if (projects.projectStatus === "Active") return Active++;
            if (projects.projectStatus === "Deactive") return Deactive++;
        });
        setProjectByAvailability([
            { projectStatus: "Active", qty: Active },
            { projectStatus: "Deactive", qty: Deactive }
        ]);
    }, [projectByAvailability]);
    //End of projects by availability

    //Extract projectNames and maxPrice
    const filteredProjectData = projects.map((item) => {
        return {
            projectName: item.projectName,
            projectOwner: item.projectOwner._id,
            minPrice: item.projectPriceRange[0].maxPrice,
            maxPrice: item.projectPriceRange[0].minPrice,
            projectStatus: item.projectStatus
        }
    })
    const filteredProjects = filteredProjectData.filter(project => project.projectOwner === ID);
    const Projectcount = filteredProjectData.length;


    //Extract Project details by Owner
    const filteredProjectDataByOwner = projects.map((item) => {
        return {
            projectid: item._id || '',
            projectName: item.projectName,
            projectOwner: item.projectOwner._id,
            createdAt: item.createdAt,
            location: item.projectLocation[0].locationName
        }
    })


    //Filtering the userID with filtered projectArray
    const filteredUserProjects = filteredProjectDataByOwner.filter(project => project.projectOwner === ID);
    const ProjectcountByOwner = filteredUserProjects.length;
    //End


    // Extract listingName and minPrice
    const filteredListingDataByOwner = listings.map((item) => {
        //const listingName = item.listingName.split(',')[0].trim();
        return {
            listingid: item._id || '',
            listingName: item.listingName,
            streetAddress: item.streetAddress,
            createdAt: item.createdAt,
            devloper: item.devloper
        };
    });

    //Filtering the userID with filtered listingsArray
    const filteredUserListings = filteredListingDataByOwner.filter(project => project.devloper === ID);
    const ListingscountByOwner = filteredUserListings.length;
    //End


    // Extract listingName and minPrice
    const filteredData = listings.map((item) => {
        //const listingName = item.listingName.split(',')[0].trim();
        return {
            listingName: item.listingName,
            devloper: item.devloper,
            minPrice: item.priceRange[0].minPrice,
            maxPrice: item.priceRange[0].maxPrice,
            landSize: item.landSize
        };
    });
    const filteredListings = filteredData.filter(project => project.devloper === ID);
    const Listingcount = filteredData.length;


    //Listing type filter
    const filteredListingTypeData = listings.map((item) => {
        //const listingType = item.listingName.split(',')[0].trim();
        return {
            type: item.type
        };
    });
    //Extract same type of listing
    // Create a Set to store unique types
    const uniqueTypes = new Set();

    // Filter the array to keep only unique types
    const uniqueArray = filteredListingTypeData.filter(item => {
        if (!uniqueTypes.has(item.type)) {
            uniqueTypes.add(item.type);
            return true;
        }
        return false;
    });



    //Extract username and listings/ projects
    const filteredLoginUser = Users2.map((item) => {
        const uID = item._id;

        if (uID === ID) {
            return {
                _id: item._id,
                firstName: item.firstName,
                lastName: item.lastName
            };
        }
        else {return {}}
    })
    const filteredFirstNames = filteredLoginUser.map(item => item ? item.firstName : null).filter(firstName => firstName !== null);
    //End of extracting the login user first name


    const listingColumns = useMemo(() => [
        {
            name: 'Listing Name',
            selector: row => row.listingName || '--',
            sortable: true,
        },
        {
            name: 'Listing Status',
            selector: row => row.listingStatus || '--',
            cell: row => row.listingStatus ? 'Active' : 'Not active',
            sortable: true,
        },
        {
            name: 'Approved',
            selector: row => row.listingApproved || '--',
            cell: row => row.projectApproved ? 'Approved' : 'Not approved',
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => row.updatedAt,
            cell: row => row.createdAt ? utils.dateFormat(row.createdAt) : '--',
            sortable: true,
        },
        {
            name: "Actions",
            button: true,
            cell: row => (<>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/listings/${row.listingid}`} target="_blank">
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
            name: 'Project Status',
            selector: row => row.projectStatus || '--',
            cell: row => row.projectStatus ? 'Active' : 'Not active',
            sortable: true,
        },
        {
            name: 'Project Approved',
            selector: row => row.projectApproved || '--',
            cell: row => row.projectApproved ? 'Approved' : 'Not approved',
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
            cell: row => row.createdAt ? utils.dateFormat(row.createdAt) : '--',
            sortable: true,
        },
        {
            name: "Actions",
            button: true,
            cell: row => (<>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/projects/${row.projectid}`} target="_blank">
                    <i className="feather icon-corner-up-right"></i>
                </Link>
            </>)
        }
    ], []);


    return (
        <Container className="content-container">
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <div>
                            <h1>Flair Real Estate Agent Dashboard</h1>
                        </div>
                    </Row>
                </Card>
            </Col>
            <br />
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
                                <p><h1>{filteredFirstNames}</h1></p>

                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of your projects</h5>
                                <br />
                                <p><h1>{ProjectcountByOwner}</h1></p>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of your listings</h5>
                                <br />
                                <p><h1>{ListingscountByOwner}</h1></p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p>
                            Flair Real Estate agent dashboard lets you walk through your listings, projects.
                        </p>
                    </Row>
                </Card>
            </Col>
            <br />
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Listings summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Minimum and Maxium prices of your listings</h6><br />
                                    <BarChart
                                        width={1130}
                                        height={270}
                                        data={filteredListings}
                                        margin={{
                                            top: 5,
                                            right: 3,
                                            left: 3,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="listingName" />
                                        {/* <YAxis /> */}
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="minPrice" fill="#8884d8" />
                                        <Bar dataKey="maxPrice" fill="#82ca9d" />
                                    </BarChart>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col lg={7}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Listings by region of all listings in Flair Real Estate</h6>
                                <PieChart width={300} height={200}>
                                    <Pie
                                        data={listingsByRegion}
                                        labelLine={false}
                                        label={renderCustomizedLabelBySuburb}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="qty"
                                    >
                                        {listingsByRegion.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORSBySuburb[index % COLORSBySuburb.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <Stack gap={2}>
                                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                        {COLORSBySuburb.map((color, i) => (
                                            <Stack key={color} alignItems="center" spacing={1}>
                                                <div style={{ width: 20, height: 20, background: color }} />
                                                <small style={{ opacity: 0.7 }}>
                                                    {/* {capitalizeFirstLetter(usersByType[i]?.name.toString())} */}
                                                    {(listingsByRegion[i]?.region)}
                                                </small>
                                            </Stack>
                                        ))}
                                    </div>
                                </Stack>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <div>
                                    <p><h6>All types of listings in Flair Real Estate</h6><br /></p>
                                    <ul>
                                        {uniqueArray.map(item => (
                                            <li key={item.listingName}>{item.type}</li>
                                        ))}
                                    </ul>
                                </div>

                            </Card>
                        </Col>
                    </Row>


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
            <br />
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Project summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={9}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Minimum and Maxium prices of your projects</h6><br />

                                    <BarChart
                                        width={800}
                                        height={300}
                                        data={filteredProjects}
                                        margin={{
                                            top: 0,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="projectName" />
                                        {/* <YAxis /> */}
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="minPrice" fill="#8884d8" />
                                        <Bar dataKey="maxPrice" fill="#82ca9d" />
                                    </BarChart>

                                </Card>
                            </ResponsiveContainer>
                        </Col>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Active and deactive projects in Flair Real Estate</h6><br />
                                <Col lg={6}>
                                    <PieChart width={200} height={200}>
                                        <Pie
                                            data={projectByAvailability}
                                            labelLine={false}
                                            label={renderCustomizedLabelAvailability}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="qty"
                                        >
                                            {projectByAvailability.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORSforAvailability[index % COLORSforAvailability.length]} />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </Col>
                                <Stack gap={2}>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {COLORSforAvailability.map((color, i) => (
                                            <Stack key={color} alignItems="center" spacing={1}>
                                                <div style={{ width: 20, height: 20, background: color }} />
                                                <small style={{ opacity: 0.7 }}>
                                                    {/* {capitalizeFirstLetter(usersByType[i]?.name.toString())} */}
                                                    {(projectByAvailability[i]?.projectStatus)}
                                                </small>
                                            </Stack>
                                        ))}
                                    </div>
                                </Stack>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p>
                            The project summary element, the first graph describes the lowest and the highest project prices related to the each project. It is clear to identify which and what project is costly.
                            Using the hover interactive function enabled, admin can easily identify and get more details.
                            In the last segment of the project summary, active and deactive projects can be quickly analysed. The percentage is much more accurate and clear to understand.
                        </p>
                    </Row>
                </Card>
            </Col>
            <br />
            <Col lg={12}>

                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Your summary</h4>
                        <br />
                        <p>
                            As one of our agents, your listings are displayed below in project and listing categories. 
                        </p>
                        <br />
                    </Row>
                    <br/>
                    <Row>
                        <h5>Projects</h5>
                        <br /><br />
                    </Row>
                    <Col lg={12}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <Row>
                                    <DataTable
                                        columns={projectColumns}
                                        data={filteredUserProjects}
                                        pagination
                                        highlightOnHover />
                                </Row>
                            </Card>
                        </Col>
                        <br/><br/>
                    <Row>
                        <h5>Listings</h5>
                        <br /><br />
                    </Row>
                        <Col lg={12}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <Row>
                                    <DataTable
                                        columns={listingColumns}
                                        data={filteredUserListings}
                                        pagination
                                        highlightOnHover />
                                </Row>
                            </Card>
                        </Col><br/><br/>
                    <br />
                    
                    <br />
                </Card>
            </Col>
            <br />
            <br />
            {/* <p><h2>User ID - {ID}</h2></p>
            <p>{JSON.stringify(filteredLoginUser)}</p>
            <p>{JSON.stringify(filteredFirstNames)}</p><br /> */}
            {/* <p>{JSON.stringify(projectsByOwner)}</p> */}
            {/* <p>{JSON.stringify(projectsByOwner.projects[0].projectName)}</p>
            <p>{JSON.stringify(projectsByOwner.projects[0].projectLocation[0].locationName)}</p> */}
            <br />
            {/* <p>{JSON.stringify(filteredUserListings)}</p> */}
            <p></p>
        </Container>
    );
}

export default Frontpage;