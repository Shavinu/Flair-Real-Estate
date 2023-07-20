import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useState } from 'react';
import { Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "../Layout.css";
import { Stack } from 'react-bootstrap';

const Frontpage = () => {

    const [listings, setlistings] = useState([])
    const [users, setUsers] = useState([])
    const [usersByType, setUsersByType] = useState([])
    const [usersByLicense, setUsersByLicense] = useState([])
    const [projectByAvailability, setProjectByAvailability] = useState([])
    const [projects, setProjects] = useState([])


    const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    //Piechart colors
    const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
    //End of piechart colors for usersbytype

    //Piechart colors for usersbylicense
    const COLORSforLicense = ['#00C49F', '#0088FE'];
    const RADIANforLicense = Math.PI / 180;
    const renderCustomizedLabelLicense = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIANforLicense);
        const y = cy + radius * Math.sin(-midAngle * RADIANforLicense);

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
    //End of piechart colors for usersbylicense

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

    useEffect(() => {
        ListingService.getAllListings()
            .then((response) => {
                setlistings(response);
            })
        UserService.getUserList()
            .then((response) => {
                setUsers(response);
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

    //Users by type
    useEffect(() => {
        let builder = 0,
            moderator = 0,
            agent = 0,
            user = 0;
        users.forEach((users) => {
            if (users.accType === "builder") return builder++;
            if (users.accType === "moderator") return moderator++;
            if (users.accType === "agent") return agent++;
            if (users.accType === "user") return user++;
        });
        setUsersByType([
            { name: 'builder', qty: builder },
            { name: 'moderator', qty: moderator },
            { name: 'agent', qty: agent },
            { name: 'user', qty: user },
        ]);
    }, [users]);
    //End of users by type

    //Users by license
    useEffect(() => {
        let Licensed = 0,
            unLicensed = 0
        users.forEach((users) => {
            if (users.verifiedLicence === true) return Licensed++;
            if (users.verifiedLicence === false) return unLicensed++;
        });
        setUsersByLicense([
            { name: false, qty: Licensed },
            { name: true, qty: unLicensed }
        ]);
    }, [users]);
    //End of users by license

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


    //Extract userNames
    const filteredUserData = users.map((item) => {
        const userName = item.firstName;
        return {
            userName: item.userName
        }
    })
    const Usercount = filteredUserData.length;

    //Extracting recent user details
    const filternewUserDate = users.map((item) => {
        const userName = item.firstName;
        const userDate = item.createdAt;
        const userChangeDate = item.updatedAt;
        return {
            userName: item.firstName,
            userDate: item.createdAt,
            userChangeDate: item.updatedAt
        }
    })


    // Function to remove characters after "T" in the date string
    function removeTimeFromDate(dateString) {
        if (dateString && dateString.includes('T')) {
            return dateString.split('T')[0] ;
        }
        return dateString;
    }

    // Loop through the array and modify the "userDate" field
    for (let i = 0; i < filternewUserDate.length; i++) {
        filternewUserDate[i].userDate = removeTimeFromDate(filternewUserDate[i].userDate);
    }
    // Loop through the array and modify the "userChangeDate" field
    for (let i = 0; i < filternewUserDate.length; i++) {
        filternewUserDate[i].userChangeDate = removeTimeFromDate(filternewUserDate[i].userChangeDate);
    }
          

    //Extract projectNames and maxPrice
    const filteredProjectData = projects.map((item) => {
        const projectName = item.projectName;
        return {
            projectName: item.projectName,
            minPrice: item.projectPriceRange[0].maxPrice,
            maxPrice: item.projectPriceRange[0].minPrice,
            projectStatus: item.projectStatus
        }
    })
    const Projectcount = filteredProjectData.length;





    // Extract listingName and minPrice
    const filteredData = listings.map((item) => {
        const listingName = item.listingName.split(',')[0].trim();
        return {
            listingName: item.listingName,
            minPrice: item.priceRange[0].minPrice,
            maxPrice: item.priceRange[0].maxPrice,
            landSize: item.landSize
        };
    });
    const Listingcount = filteredData.length;

    //X axis
    const filteredDataX = listings.map((item) => {
        return {
            listingName: item.listingName,
        };
    });


    // Extract listing names before the first comma
    const filteredDat2 = listings.map((item) => {
        const listingName = item.listingName.split(',')[0].trim();
        return {
            listingName: listingName,
            maxPrice: item.priceRange[0].maxPrice,
        };
    });


    return (
        <Container className="content-container">
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <div>
                            <h1>Flair Real Estate Admin Dashboard</h1>
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
                                <h5>Number of users</h5>
                                <br />
                                <p><h1>{Usercount}</h1></p>

                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of projects</h5>
                                <br />
                                <p><h1>{Projectcount}</h1></p>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of listings</h5>
                                <br />
                                <p><h1>{Listingcount}</h1></p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                    </Row>
                </Card>
            </Col>
            <br />
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>User summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <Col lg={6}>
                                    <PieChart width={200} height={200}>
                                        <Pie
                                            data={usersByType}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="qty"
                                        >
                                            {usersByType.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </Col>
                                <Stack gap={2}>
                                    <h6>Users by type</h6>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {COLORS.map((color, i) => (
                                            <Stack key={color} alignItems="center" spacing={1}>
                                                <div style={{ width: 20, height: 20, background: color }} />
                                                <small style={{ opacity: 0.7 }}>
                                                    {/* {capitalizeFirstLetter(usersByType[i]?.name.toString())} */}
                                                    {(usersByType[i]?.name.toString())}
                                                </small>
                                            </Stack>
                                        ))}
                                    </div>
                                </Stack>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <PieChart width={200} height={200}>
                                    <Pie
                                        data={usersByLicense}
                                        labelLine={false}
                                        label={renderCustomizedLabelLicense}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="qty"
                                    >
                                        {usersByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORSforLicense[index % COLORSforLicense.length]} />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                                <Stack gap={2}>
                                    <h6>Licensed builders</h6>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {COLORSforLicense.map((color, i) => (
                                            <Stack key={color} alignItems="center" spacing={1}>
                                                <div style={{ width: 20, height: 20, background: color }} />
                                                <small style={{ opacity: 0.7 }}>
                                                    {/* {capitalizeFirstLetter(usersByLicense[i]?.name.toString())} */}
                                                    {(usersByLicense[i]?.name.toString())}
                                                </small>
                                            </Stack>
                                        ))}
                                    </div>
                                </Stack>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                            <h6>Recent user account changes</h6><br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Create Date</th>
                                        <th>Update Date</th>
                                    </tr><br/>
                                </thead>
                                <tbody>
                                    
                                    {filternewUserDate.slice(0,5).map((item) => (
                                        <tr key={item.userName}>
                                            <td>{item.userName}</td>
                                            <td>{item.userDate}</td>
                                            <td>{item.userChangeDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <br /><br />
                        <p><br />Description</p>
                        <p>
                            In the user summary segment, each types of users are divided to give a quick glance of the user diversity in the website. Each types of users can be identified by hovering over the required portion of the pie chart.
                            The second element shows the percentage of license builders registered with Flair Real Estate. Finally, the recent user account changes are displayed according to the recent dates and update dates. This feature lets the 
                            admin know what users have been registered and updated their profiles. 
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
                        <Col lg={5}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Minimum and Maxium prices of listings</h6><br/>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={filteredData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
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
                        </Col>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Landsize by listings</h6><br/>
                                <ResponsiveContainer width={400} height={300}>
                                <PieChart >
                                    <Pie
                                        dataKey="landSize"
                                        startAngle={180}
                                        endAngle={0}
                                        data={filteredData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                        
                                    />
                                    <Tooltip/>
                                </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col lg={3}>
                        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                            <div>
                                <p><h6>Types of listings</h6><br/></p>
                            <ul>
                                {listings.map(item => (
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
                        <p><ul>Listings of the Flair Real Estate are graphically shown. The maximum and the minimum prices of the listings are contrasted accordingly.
                            The land sizes of the each listing entries are presented in the second pie chart as it makes easier to identify the average listing landsizes.
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
                        <h4>Project summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={9}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Minimum and Maxium prices of projects</h6><br/>
                                <BarChart
                                    width={900}
                                    height={300}
                                    data={filteredProjectData}
                                    margin={{
                                        top: 0,
                                        right: 15,
                                        left: 20,
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
                        </Col>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Active and deactive projects</h6><br/>
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
            <br/><br/>
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <div>

                            <ul>
                                {listings.map(item => (
                                    <li key={item.listingName}>{item.type}</li>
                                ))}
                            </ul>
                            <br></br>
                            <p>{JSON.stringify(filteredProjectData)}</p>
                            <p>{Projectcount}</p>
                            <p>{JSON.stringify(users)}</p>
                            <p>{JSON.stringify(filternewUserDate.slice(0,5))}</p>
                            <br/><br/>
                            <p>modifiedJsonArray</p>
                            <br/>
                            <table border={1}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filternewUserDate.slice(0,5).map((item) => (
                                        <tr key={item.userName}>
                                            <td>{item.userName}</td>
                                            <td>{item.userDate}</td>
                                            <td>{item.userChangeDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <br></br>
                            <br></br>
                            <h2>Available listings by minimum prices</h2>
                            <div style={{ width: '100%', height: 300 }}>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={filteredData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="listingName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="minPrice" fill="#8884d8" label />
                                </BarChart>
                            </div>
                        </div>
                    </Row>
                </Card>
                <br></br>
                <br></br>
                <div>
                    <Row>
                        <Card>
                            <Card.Subtitle className="text-white lead bg-dark p-1 mt-0 mb-1 rounded" style={{ background: 'linear-gradient(to right, rgba(167, 169, 239, 1), rgba(178, 156, 226, 0.8))' }}>Available listings by maximum prices</Card.Subtitle>

                            <div style={{ width: '100%', height: 300 }}>
                             *136   <ResponsiveContainer>
                                    <PieChart>
                                        <Pie dataKey="maxPrice" data={filteredDat2} fill="#990033" label />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Row>
                </div>

            </Col>
        
        </Container>
    );
}

export default Frontpage;