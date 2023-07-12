import { React, useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Group, Input } from '../Form'
import { Card, CardBody, Button } from '../../Components';
import * as CmsService from '../../Services/CmsService';
import ReactQuill from 'react-quill';
import Toast from '../Toast';
import 'react-quill/dist/quill.snow.css';
import { EditImageBrowser, UploadTitle } from './Components/EditImageBrowser';

const ContactCms = () => {
    const page = ('Contact');
    const [titleImage, setTitleImage] = useState('');
    const [textBody, setTextBody] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [templateID, setTemplateID] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [deletedTitleImage, setDeletedTitleImage] = useState(null);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    //finds page by name and sets variables 
    const findPage = (page) => {
        CmsService.findPage(page)
            .then((response) => {
                setTitleImage(response.image);
                setTextBody(response.textBody);
                setServiceID(response.serviceId);
                setTemplateID(response.templateId);
                setPublicKey(response.publicKey);
            })
    }
    //handle errors
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

    //you already know
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
        console.log("errors", errors);
        return isValid
    }

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!isValid()) {
            setIsLoading(false);
            errorShake();
            return
        }

        //uploads image, needs refinement e.g if already has image, use diffent method
        var titleImageId = null;
        console.log("title", titleImage, user);
        if (titleImage) {
            titleImageId = await UploadTitle(titleImage, user);
            console.log("id", titleImageId)
        }

        const onCancel = (e) => {

        }

        //prepare json package
        const body = {
            page: "Contact",
            image: titleImageId,
            pdf: null,
            textBody: textBody,
            serviceId: serviceID,
            templateId: templateID,
            publicKey: publicKey,
        }
        console.log(JSON.stringify(body))
        //send it 
        CmsService.updatePage(page, JSON.stringify(body))
            .then(response => {
                Toast('Page has been updated successfully!', 'success');
                setErrors();
            })
            .catch((error) => {
                Toast('Failed to update user!', 'danger');
                console.log(error, 'failed to update page')
                errorShake();
            })
            .finally(() =>
                setIsLoading(false)
            )
    }

    useEffect(() => {
        findPage(page);
    }, [page]);

    const handleQuillEdit = (value) => {
        setTextBody(value)
    }

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
                                <div className="d-xl-flex" style={{ border: "1px dashed", margin: "15px" }}>
                                    <EditImageBrowser
                                        titleImage={titleImage}
                                        setTitleImage={setTitleImage}
                                        deletedTitleImage={deletedTitleImage}
                                        setDeletedTitleImage={setDeletedTitleImage}
                                    />
                                </div>
                            </Group>
                        </Col>
                        <Col
                            sm={12}
                            md={12}>
                            <Group>
                                <label htmlFor='text' style={{ padding: "1rem" }}>Edit text</label>
                                <ReactQuill
                                    value={textBody}
                                    onChange={handleQuillEdit}
                                    placeholder='wish this would work'
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