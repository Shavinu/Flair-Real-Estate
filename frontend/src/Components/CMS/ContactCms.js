import { React, useRef, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Group, Input } from '../Form'
import { Card, CardBody, Button } from '../../Components';
import ReactQuill from 'react-quill';
import Toast from '../Toast';
import 'react-quill/dist/quill.snow.css';

const ContactCms = () => {
    const form = useRef();
    const fileInput = useRef();
    const [ServiceID, setServiceID] = useState('');
    const [TemplateID, setTemplateID] = useState('');
    const [PublicKey, setPublicKey] = useState('');
    var serviceDefult = "123qwe45";
    var templateDefult = "ZXC987";
    var keyDefult = "ASDF1234567";
    var textDefult = "Get in contact Now. Our team of proffessionals are ready to answer any questions you may have."

    const handleSubmit = (e) => {
    }
    return (
        <>

            <h1>Edit Contact Page</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
                    <Form ref={form} onSubmit={e => e.preventDefault()}>
                        <Row>
                            <Col
                                sm={12}
                                md={12}>
                                <Group>
                                    <label htmlFor='image'>Edit image</label>
                                    <div style={{ border: "1px dashed", margin: "1rem" }}>
                                        <input type='file' ref={fileInput} style={{ padding: "1rem" }} />
                                    </div>
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={12}>
                                <Group>
                                    <label htmlFor='text' style={{ padding: "1rem" }}>Edit text</label>
                                    <ReactQuill
                                        value={textDefult}
                                    //onChange={handleListingDescriptionChange}

                                    />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <label htmlFor='ServiceID'>Service ID:</label>
                                    <Input
                                        name='ServiceID'
                                        value={serviceDefult}

                                        onChange={(e) => {
                                            setServiceID(e.target.value);
                                        }}
                                    />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <label htmlFor='TemplateID'>Template ID:</label>
                                    <Input
                                        name='TemplateID'
                                        value={templateDefult}
                                        placeholder='Template ID'
                                        onChange={(e) => {
                                            setTemplateID(e.target.value);
                                        }}
                                    />
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Group>
                                    <label htmlFor='PublicKey'>Public Key:</label>
                                    <Input
                                        name='PublicKey'
                                        value={keyDefult}
                                        placeholder='Public Key'
                                        onChange={(e) => {
                                            setPublicKey(e.target.value);
                                        }}
                                    />
                                </Group>
                            </Col>
                            <Col>
                            </Col>
                            <Col
                                sm={12}
                                md={6}
                                style={{ display: "flex", justifyContent: "right" }}>
                                <Button className='btn btn-primary mr-75' style={{ paddingInline: "1.2em" }} type='submit' value='submit' onClick={handleSubmit()}>Save</Button>
                            </Col>
                            <Col
                                sm={12}
                                md={6}>
                                <Button className='btn btn-primary mr-75' type='cancel' value='cancel'>Cancel</Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card >
        </>
    );
};

export default ContactCms;