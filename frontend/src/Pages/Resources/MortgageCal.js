import React from 'react';
import NavbarUser from '../../Components/NavbarUser';
import Sidebar from '../../Components/Sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import Form from '../../Components/Calculator/From'

const MortgageCal = () => {
    return (
        <>
            <NavbarUser />

            <Container>
                <Row >
                </Row>
                <Row style={{ marginTop: "5rem" }}>
                   
                    <Col xs={9}>
                        <h1>Mortgage Calculator</h1>
                        <Form />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default MortgageCal;