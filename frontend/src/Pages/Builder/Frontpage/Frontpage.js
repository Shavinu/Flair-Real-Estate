import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useState } from 'react';
import { Col, Card } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import { Stack } from 'react-bootstrap';


const Frontpage = () => {

    const [Users2, setUsers] = useState([])
    const [projects, setProjects] = useState([])
    const [projectByAvailability, setProjectByAvailability] = useState([])
    const [listings, setlistings] = useState([])

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

    //Get userID for the frontpage
    const SetFrontPagePart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userID = user.payload._id;

        return userID;
    }
    const ID = SetFrontPagePart();


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
    const filteredProjects = filteredProjectData.filter(project => project.projectOwner === ID);//For the Graph
    const Projectcount = filteredProjectData.length;
    //Finding the avgPrice of the listings by devloper
    const avgProjectPrices = filteredProjects.map(projects => {
        const averagePrice = ((projects.minPrice + projects.maxPrice) / 2);
        return { projectName: projects.projectName, averagePrice: averagePrice };
    });
        //End of finding avgPrice of listings

    // Extract listingName and minPrice
    const filteredData = listings.map((item) => {
        return {
            listingName: item.listingName,
            devloper: item.devloper,
            minPrice: item.priceRange[0].minPrice,
            maxPrice: item.priceRange[0].maxPrice,
            landSize: item.landSize
        };
    });
    const filteredListings = filteredData.filter(listing => listing.devloper === ID);
    const Listingcount = filteredData.length;

    //Finding the avgPrice of the listings by devloper
    const avgPrices = filteredListings.map(listing => {
        const averagePrice = ((listing.minPrice + listing.maxPrice) / 2);
        return { listingName: listing.listingName, averagePrice: averagePrice };
    });
    //End of finding avgPrice of listings

    // Extract listingName,street address and developer
    const filteredListingDataByOwner = listings.map((item) => {
        return {
            listingName: item.listingName,
            streetAddress: item.streetAddress,
            devloper: item.devloper
        };
    });

    //Filtering the userID with filtered listingsArray
    const filteredUserListings = filteredListingDataByOwner.filter(project => project.devloper === ID);
    const ListingscountByOwner = filteredUserListings.length;
    //End


    //Extract Project details by Owner
    const filteredProjectDataByOwner = projects.map((item) => {
        return {
            projectName: item.projectName,
            projectOwner: item.projectOwner._id,
            location: item.projectLocation[0].locationName
        }
    })


    //Filtering the userID with filtered projectArray
    const filteredUserProjects = filteredProjectDataByOwner.filter(project => project.projectOwner === ID);
    const ProjectcountByOwner = filteredUserProjects.length;
    //End


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
    const filteredLicense = filteredLoginUser.map(item => item ? item.verified : null).filter(item => item === true || item === false);


    //Get userID for the frontpage
    const setLicenseValid = () => {
        if (filteredLicense.includes(true)) {
            return "valid";
        } else {
            return "Invalid";
        }
    }
    const licenseValidity = setLicenseValid();




    const filteredLicenseNumber = filteredLoginUser.map(item => item ? item.licence : null).filter(value => typeof value === "string");
    //
    //End of extracting the login user first name

    //Filtering the userID with filtered projectArray
    const filteredOtherBuilders = Users2.filter(type => type.accType === 'builder');
    const otherBuilderCount = filteredOtherBuilders.length;
    //End

    return (
        <Container className="content-container">
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <div>
                            <h1>Flair Real Estate Builder Dashboard</h1>
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
                                    <h5>Number of your projects</h5>
                                    <br />
                                    <p><h1>{ProjectcountByOwner} </h1></p>
                                </Card>
                            </Col>
                            <Col lg={3}>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h5>Number of your listings</h5>
                                    <br />
                                    <p><h1>{ListingscountByOwner} </h1></p>
                                </Card>
                            </Col>
                            <Col lg={3}>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h5>Your license validity</h5>
                                    <br />
                                    <p><h2>{JSON.stringify(filteredLicenseNumber).slice(2, -2)} is {licenseValidity} </h2></p>
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
            
            <br />
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Listings summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={8}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Minimum and Maxium prices of your listings</h6><br />
                                    <LineChart
                                        width={700}
                                        height={300}
                                        data={filteredListings}
                                        
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="listingName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="minPrice" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="maxPrice" stroke="#82ca9d" />
                                    </LineChart>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                        <Col lg={4}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Average prices of your listings</h6><br />
                                    <BarChart
                                        width={300}
                                        height={300}
                                        data={avgPrices}
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="listingName" />

                                        <Tooltip />
                                        {/* <Legend /> */}
                                        <Bar dataKey="averagePrice" fill="#FF8042" />
                                    </BarChart>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                    <br />
                </Card>
            </Col>
            <br />
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Project summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <br /><br />
                        <Col lg={8}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Minimum and Maxium prices of your projects</h6><br />
                                    <LineChart
                                        width={700}
                                        height={300}
                                        data={filteredProjects}
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="projectName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="minPrice" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="maxPrice" stroke="#82ca9d" />
                                    </LineChart>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                        <Col lg={4}>
                            <ResponsiveContainer>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <h6>Average prices of your listings</h6><br />
                                    <BarChart
                                        width={300}
                                        height={300}
                                        data={avgProjectPrices}
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="projectName" />

                                        <Tooltip />
                                        
                                        <Bar dataKey="averagePrice" fill="#FF8042" />
                                    </BarChart>
                                </Card>
                            </ResponsiveContainer>
                        </Col>
                    </Row><br />
                </Card>
            </Col>
            <br/>
            <div class="container">
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Col lg={12}>
                        <p><h4>Your summary </h4><h3></h3></p>
                        <div class="row">
                            <Col lg={6}>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <Row>
                                        <h5>Listings summary</h5>
                                        <br /><br />
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Listing Name</th>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <th>Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUserListings.map((listing, index) => (
                                                    <tr key={index}>
                                                        <td>{listing.listingName}</td>&nbsp;
                                                        <td>{listing.streetAddress}</td>
                                                    </tr>
                                                ))}
                                            </tbody><br />
                                        </table>
                                    </Row>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                    <Row>
                                        <h5>Projects summary</h5>
                                        <br /><br />
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Project Name</th>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <th>Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUserProjects.map((project, index) => (
                                                    <tr key={index}>
                                                        <td>{project.projectName}</td>&nbsp;
                                                        <td>{project.location}</td>
                                                    </tr>
                                                ))}
                                            </tbody><br />
                                        </table>
                                    </Row>
                                </Card>
                            </Col>
                        </div>
                    </Col>
                    <br />
                    <p>Description</p>
                    <p>Flair Real Estate builder dashboard lets you see your projects and listings.</p>
                </Card>
            </div>

            {/* <br /><br /><br />
            <p>TESTING</p>
            <p>{JSON.stringify({ filteredUserProjects })}</p>
            <p>{JSON.stringify({ filteredLicense })} - {JSON.stringify({})}</p>
            <p>{JSON.stringify({ filteredLoginUser })}</p>
            <p>{JSON.stringify({ ID })}</p>
            <br /> */}

        </Container>
    );
}

export default Frontpage;