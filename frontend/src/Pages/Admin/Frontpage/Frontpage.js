import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useState } from 'react';
import { Col, Card } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "../Layout.css";
import { Stack } from 'react-bootstrap';

const Frontpage = () => {

    const [listings, setlistings] = useState([])
    const [listingsByRegion, setlistingsByRegion] = useState([])
    const [users, setUsers] = useState([])
    const [UsersName, setUsersName] = useState([])
    const [usersByType, setUsersByType] = useState([])
    const [usersByLicense, setUsersByLicense] = useState([])
    const [projectByAvailability, setProjectByAvailability] = useState([])
    const [projects, setProjects] = useState([])


    //Get userID for the frontpage
    const SetFrontPagePart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userID = user.payload._id;

        return userID;
    }
    const ID = SetFrontPagePart();

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

    useEffect(() => {
        ListingService.getAllListings()
            .then((response) => {
                setlistings(response);
            })
        UserService.getUserList()
            .then((response) => {
                setUsers(response);
            })
        UserService.getUserList()
            .then((response) => {
                setUsersName(response);
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
        let Builder = 0,
            Moderator = 0,
            Agent = 0,
            User = 0;
        users.forEach((users) => {
            if (users.accType === "builder") return Builder++;
            if (users.accType === "moderator") return Moderator++;
            if (users.accType === "agent") return Agent++;
            if (users.accType === "user") return User++;
        });
        setUsersByType([
            { name: 'builder', qty: Builder },
            { name: 'moderator', qty: Moderator },
            { name: 'agent', qty: Agent },
            { name: 'user', qty: User },
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


    //Extract userNames
    const filteredUserData = users.map((item) => {
        //const userName = item.firstName;
        return {
            userName: item.userName
        }
    })
    const Usercount = filteredUserData.length;
            

    //Extract projectNames and maxPrice
    const filteredProjectData = projects.map((item) => {
        //const projectName = item.projectName;
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
        //const listingName = item.listingName.split(',')[0].trim();
        return {
            listingName: item.listingName,
            minPrice: item.priceRange[0].minPrice,
            maxPrice: item.priceRange[0].maxPrice,
            landSize: item.landSize
        };
    });
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
    const filteredLoginUser = UsersName.map((item) => {
        const uID = item._id;

        if (uID === ID) {
            return {
                _id: item._id,
                firstName: item.firstName,
                lastName: item.lastName
            };
        }
        else { return {} }
    })
    const filteredFirstNames = filteredLoginUser.map(item => item ? item.firstName : null).filter(firstName => firstName !== null);
//End of extracting the login user first name


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
            <Col lg={12}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Row>
                        <h4>Quick summary</h4>
                        <br /><br />
                    </Row>
                    <Row>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Welcome</h5>
                                <br />
                                <p><h1><i>{filteredFirstNames}</i></h1></p>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of users</h5>
                                <br />
                                <p><h1>{Usercount}</h1></p>

                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h5>Number of projects</h5>
                                <br />
                                <p><h1>{Projectcount}</h1></p>
                            </Card>
                        </Col>
                        <Col lg={3}>
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
                        <p>
                            Flair Real Estate admin dashboard lets you walk through all the main functions at a glance.
                        </p>
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
                        <Col lg={9}>
                        <ResponsiveContainer>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Minimum and Maxium prices of listings</h6><br/>
                                <BarChart
                                    width={800}
                                    height={300}
                                    data={filteredData}
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
                                    <Legend />
                                    <Bar dataKey="minPrice" fill="#8884d8" />
                                    <Bar dataKey="maxPrice" fill="#82ca9d" />
                                </BarChart>

                            </Card>
                            </ResponsiveContainer>
                        </Col>
                        </Row><br/>
                        <Row>
                        <Col lg={7}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">                                
                            <h6>Listings by region of all listings in Flair Real Estate</h6>
                                    <PieChart width={300} height={200}>
                                        <Pie
                                            data={listingsByRegion}
                                            labelLine={false}
                                            label={renderCustomizedLabelBySuburb}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="qty"
                                        >
                                            {listingsByRegion.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                <Stack gap={2}>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
                                <p><h6>Types of listings</h6><br/></p>
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
                        <p><ul>Listings of the Flair Real Estate are graphically shown. The maximum and the minimum prices of the listings are contrasted accordingly.
                            The region distribution of the available listings entries are presented in the second pie chart as it makes easier to identify the average listing regions.
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
                            <ResponsiveContainer>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                                <h6>Minimum and Maxium prices of projects</h6><br/>
                                <BarChart
                                    width={900}
                                    height={300}
                                    data={filteredProjectData}
                                    margin={{
                                        top: 0,
                                        right: 5,
                                        left: 5,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="projectName" />
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
            <p>{JSON.stringify(ID)}</p>
            <p>{JSON.stringify(filteredFirstNames)}</p>
            {/* <Col lg={12}>
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
                            <p>{JSON.stringify(listingsByRegion)}</p>
                            <p>{JSON.stringify(listings)}</p>
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

            </Col> */}
        
        </Container>
    );
}

export default Frontpage;