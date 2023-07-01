import React from 'react';
import NavbarUser from '../../Components/NavbarUser';
import Sidebar from '../../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

const BuyersArticles = () => {
    return (
        <>
            <NavbarUser />

            <Container>
                <Row >
                </Row>
                <Row style={{ marginTop: "5rem" }}>
                    
                    <Col xs={9}>
                        <h1>Buyers Articles</h1>

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BuyersArticles;