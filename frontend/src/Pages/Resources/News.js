import React from 'react';
import NavbarUser from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

const News = () => {
    return (
        <>
            <NavbarUser />

            <Container>
                <Row >
                </Row>
                <Row style={{ marginTop: "5rem" }}>
                    
                    <Col xs={9}>
                        <h1>News</h1>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default News;