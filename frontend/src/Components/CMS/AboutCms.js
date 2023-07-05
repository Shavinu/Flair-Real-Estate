import { React, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Group from '../Form/Group'
import { Card, CardBody, Button } from '../../Components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toast from '../Toast';

const AboutCms = () => {
    const form = useRef();
    const fileInput = useRef();



    return (
        <>
            <h1>Edit About page</h1>
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
                                        placeholder="Enter a Description"
                                    />
                                </Group>
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

export default AboutCms;