import { React, useRef, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Group, Input } from '../Form'
import { Card, CardBody, Button } from '../../Components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ContactCms = () => {
    const form = useRef();
    const fileInput = useRef();
    const [ServiceID, setServiceID] = useState('');
    const [TemplateID, setTemplateID] = useState('');
    const [PublicKey, setPublicKey] = useState('');


    return (
        <>
            <h1>Edit Contact Page</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
                    <Form ref={form}>
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
                                        //value={listingDescription}
                                        //onChange={handleListingDescriptionChange}
                                        placeholder="Enter Listing Description"
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
                                        value={ServiceID}
                                        placeholder='Service ID'
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
                                        value={TemplateID}
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
                                        value={PublicKey}
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
                                <Button className='btn btn-primary mr-75' style={{ paddingInline: "1.2em" }} type='submit' value='Send'>Save</Button>
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