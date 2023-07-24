import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useState } from 'react';
import { Col, Card } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import { Stack } from 'react-bootstrap';


const Frontpage = () => {


    const [projects, setProjects] = useState([])
    const [projectByAvailability, setProjectByAvailability] = useState([])
    const [listings, setlistings] = useState([])
    const [listingsByRegion, setlistingsByRegion] = useState([])

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


    //Listing type filter
    const filteredListingTypeData = listings.map((item) => {
        const listingType = item.listingName.split(',')[0].trim();
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
                                {/* <p><h1>{Usercount}</h1></p> */}

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
                        <br/>
                        <Col lg={4}>
                            <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                            <h6>Listings by region</h6>
                                <Col lg={6}>
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
                                                <Cell key={`cell-${index}`} fill={COLORSBySuburb[index % COLORSBySuburb.length]} />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </Col>
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
        </Container>
    );
}

export default Frontpage;