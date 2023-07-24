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
        </Container>
    );
}

export default Frontpage;