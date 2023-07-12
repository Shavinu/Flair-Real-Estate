import { React, useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Group from '../Form/Group'
import { Card, CardBody, Button } from '../../Components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toast from '../Toast';
import { EditImageBrowser, UploadTitle } from './Components/EditImageBrowser';
import * as CmsService from '../../Services/CmsService';

const AboutCms = () => {
    const form = useRef();
    const fileInput = useRef();
    const page = ('About');
    const [titleImage, setTitleImage] = useState('');
    const [textBody, setTextBody] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const [deletedTitleImage, setDeletedTitleImage] = useState(null);

    //gets the page info from db
    const findPage = (page) => {
        //finds page using page name
        CmsService.findPage(page)
            .then((response) => {
                setTitleImage(response.image);
                setTextBody(response.textBody);
            })
    }


    //handles error feedback
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

    //checks validly 
    const isValid = () => {
        let isValid = true;
        let errors = {}

        if (!textBody) {
            errors = { ...errors, textBody: 'Please provide some text!' }
            isValid = false
        }
        setErrors(errors);
        console.log("errors", errors);
        return isValid
    }

    //handles submit duh
    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!isValid()) {
            setIsLoading(false);
            errorShake();
            return
        }

        //uploads image and returns 
        var titleImageId = null;
        console.log("title", titleImage, user);
        if (titleImage) {
            titleImageId = await UploadTitle(titleImage, deletedTitleImage, user);
            console.log("id", titleImageId)
            setIsLoading(false)
        }

        const onCancel = (e) => {

        }

        //prepare json package to send to db
        const body = {
            page: "About",
            image: titleImageId,
            pdf: null,
            textBody: textBody,
            serviceId: "",
            templateId: "",
            publicKey: "",
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

    const handleQuillEdit = (value) => {
        setTextBody(value)
    }

    useEffect(() => {
        findPage(page);
    }, [page]);

    return (
        <>
            <h1>Edit About page</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
                    <Row>
                        <Col
                            sm={12}
                            md={12}>
                            <Group>
                                <label htmlFor='image'>Edit image</label>
                                <div style={{ border: "1px dashed", margin: "1rem" }}>
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
                                    placeholder='place text here'
                                    error={errors?.textBody}
                                />

                            </Group>
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

export default AboutCms;