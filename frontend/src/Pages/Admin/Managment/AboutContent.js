import { React, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Group, Input, Label, Select } from '../../../Components/Form';
import { Button, Card, ContentHeader } from '../../../Components';
import { CardBody } from '../../../Components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AboutContent = () => {
    const form = useRef();
    const fileInput = useRef();
    return (
        <>
            <h1>Edit About page</h1>
            <Card>
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
                        </Row>
                    </Form>
                </CardBody>
            </Card >
        </>
    );
};

export default AboutContent;