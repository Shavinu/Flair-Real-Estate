import * as ListingService from '../../../Services/ListingService';
import { useEffect, useState } from 'react';
import { Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';

const Frontpage = () => {

    const [listings, setlistings] = useState([])

    useEffect(() => {
        ListingService.getAllListings()
            .then((response) => {
                setlistings(response);
            })
    }, []);

    // Extract listingName and minPrice
    const filteredData = listings.map((item) => {
        const listingName = item.listingName.split(',')[0].trim();
        return {
            listingName: item.listingName,
            minPrice: item.priceRange[0].minPrice,
        };
    });

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
            <Col lg={8}>
          <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
            <Row>
        <div>
            <h1>Filtered Data:</h1>
            <ul>
                {listings.map(item => (
                    <li key={item.listingName}>{item.type}</li>
                ))}
            </ul>
            <br></br>
            <p>{JSON.stringify(filteredData)}</p>
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
                        <Bar dataKey="minPrice" fill="#8884d8" label/>
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
                <ResponsiveContainer>
                    <PieChart>
                        <Pie dataKey="maxPrice" data={filteredDat2} fill="#990033" label />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <h2>Available listings</h2>
            </Card>
            </Row>
        
        </div>

        </Col>
        </Container>
    );
}

export default Frontpage;