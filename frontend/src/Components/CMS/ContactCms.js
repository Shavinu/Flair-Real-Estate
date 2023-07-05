import { React, useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Group, Input } from '../Form'
import { Card, CardBody, Button } from '../../Components';
import * as CmsService from '../../Services/CmsService';
import ReactQuill from 'react-quill';
import Toast from '../Toast';
import 'react-quill/dist/quill.snow.css';

const ContactCms = () => {
    const page = ('Contact');
    const fileInput = useRef();
    const [image, setImage] = useState('');
    const [textBody, setTextBody] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [templateID, setTemplateID] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)

    const findPage = (page) => {
        CmsService.findPage(page)
            .then((response) => {
                setImage(response.image);
                setTextBody(response.textBody);
                setServiceID(response.serviceId);
                setTemplateID(response.templateId);
                setPublicKey(response.publicKey);
            })
    }

    const errorShake = () => {
        window.jQuery('button[type=submit]').addClass('animated headShake bg-red');

        window
            .jQuery('button[type=submit]')
            .on(
                'webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    window.jQuery('button[type=submit]').delay(200).removeClass('animated headShake bg-red');
                }
            );
    };

    const isValid = () => {
        let isValid = true;
        let errors = {}

        if (!textBody) {
            errors = { ...errors, textBody: 'Please provide some text!' }
            isValid = false
        }

        if (!serviceID) {
            errors = { ...errors, email: 'Please provide a serviceID!' }
            isValid = false
        }

        if (!templateID) {
            errors = { ...errors, firstName: 'Please provide a templateID!' }
            isValid = false
        }

        if (!publicKey) {
            errors = { ...errors, lastName: 'Please provide your publicKey!' }
            isValid = false
        }
        setErrors(errors);
        console.log(errors);
        return isValid
    }

    const onSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!isValid()) {
            setIsLoading(false);
            errorShake();
            return
        }

        const onCancel = (e) => {

        }

        const body = {
            page: "Contact",
            image: null,
            pdf: null,
            textBody: textBody,
            serviceId: serviceID,
            templateId: templateID,
            publicKey: publicKey,
        }
        console.log(JSON.stringify(body))

        CmsService.updatePage(page, JSON.stringify(body))
            .then(response => {
                Toast('Page has been updated successfully!', 'success');
                setErrors();
            })
            .catch((error) => {
                Toast('Failed to update user!', 'danger');
                console.log(error, 'failed here')
                errorShake();
            })
            .finally(() =>
                setIsLoading(false)
            )
    }

    useEffect(() => {
        findPage(page);
    }, [page]);

    return (
        <>

            <h1>Edit Contact Page</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
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
                                    defaultValue={textBody}
                                    onChange={(e) => {
                                        setTextBody(e.value);
                                    }}
                                    error={errors?.textBody}

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
                                    value={serviceID}
                                    onChange={(e) => {
                                        setServiceID(e.target.value);
                                    }}
                                    error={errors?.serviceID}
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
                                    value={templateID}
                                    placeholder='Template ID'
                                    onChange={(e) => {
                                        setTemplateID(e.target.value);
                                    }}
                                    error={errors?.templateID}
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
                                    value={publicKey}
                                    placeholder='Public Key'
                                    onChange={(e) => {
                                        setPublicKey(e.target.value);
                                    }}
                                    error={errors?.publicKey}
                                />
                            </Group>
                        </Col>
                        <Col>
                        </Col>
                        <Col
                            sm={12}
                            md={6}
                            style={{ display: "flex", justifyContent: "right" }}>
                            <Button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light mr-75'
                                onClick={onSubmit}
                                isLoading={isLoading}>
                                Save
                            </Button>
                        </Col>
                        <Col
                            sm={12}
                            md={6}>
                            <Button className='btn btn-primary mr-75' type='cancel' value='cancel'>Cancel</Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card >
        </>
    );
};

export default ContactCms;