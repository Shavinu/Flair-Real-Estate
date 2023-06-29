import { React, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Group, Input, Label, Select } from '../../Components/Form';
import { Button, Card, ContentHeader } from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import emailjs from '@emailjs/browser';
import Toast from '../../Components/Toast';

const ContactForm = () => {
    const form = useRef();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [message, setMessage] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_bsnl3ou', 'template_wf1ghio', form.current, 'vEod6td5SndHAMftY')
            .then((result) => {
                console.log(result.text);
                Toast('Message sent successfully!', 'success');
            }, (error) => {
                console.log(error.text);
                Toast('Message sent unsuccessfully', 'warning');
            });
        //Toast('Message sent successfully!', 'success');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNo('');
        setMessage('');
    };

    return (
        <>
            <h1>Contact Us</h1>
            <Card header='How can we help'>
                <CardBody>
                    <form ref={form} onSubmit={sendEmail}>
                        <Row>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <Label htmlFor='firstname'>First Name</Label>
                                    <Input name='firstName' type='text' placeholder='First Name'
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                        }} />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <Label htmlFor='lastName'>Last Name</Label>
                                    <Input name='lastName' type='text' placeholder='Last Name'
                                        value={lastName}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                        }} />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <Label htmlFor='Email'>Email</Label>
                                    <Input name='Email' type='email' placeholder='Email'
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }} />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <Label htmlFor='phoneNumber'>Phone Number</Label>
                                    <Input name='phoneNumber' type='number' placeholder='phoneNumber'
                                        value={PhoneNo}
                                        onChange={(e) => {
                                            setPhoneNo(e.target.value);
                                        }} />
                                </Group>
                            </Col>

                            <Col
                                sm={12}
                                md={12}>
                                <Group>
                                    <Label htmlFor='message'>Message</Label>
                                    <Input name='message' type='text' placeholder='message'
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                        }} />
                                </Group>
                            </Col>

                            <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', }}>
                                <Button className='btn btn-primary mr-75' type='submit' value='Send'>Submit</Button>
                            </Container>
                        </Row>
                    </form>
                </CardBody>
            </Card>
        </>
    );
};

export default ContactForm;