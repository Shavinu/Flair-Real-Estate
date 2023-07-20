import { React, useRef, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Group from '../../Form/Group'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toast from '../../Toast';
import { EditImageBrowser, UploadTitle } from './EditImageBrowser';
import * as CmsService from '../../../Services/CmsService';

function UploadText() {
    const page = ('Buyers');
    const [titleImage, setTitleImage] = useState('');
    const [fileLink, setFileLink] = useState();
    const [pdfId, setPdfId] = useState();
    const [imageId, setImageId] = useState();
    const [textBody, setTextBody] = useState();
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const [deletedTitleImage, setDeletedTitleImage] = useState(null);

    const handleQuillEdit = (value) => {
        setTextBody(value)
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

    //gets the page info from db
    const findPage = (page) => {
        //finds page using page name
        CmsService.findPage(page)
            .then((response) => {
                setTitleImage(response.image);
                setPdfId(response.pdf);
                setTextBody(response.textBody);
                setFileLink(response.publicKey);
            })
    }



    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {

            //uploads image and returns 
            var titleImageId = null;
            console.log("title", titleImage, user);
            if (titleImage) {
                titleImageId = await UploadTitle(titleImage, deletedTitleImage, user);
                console.log("id", titleImageId);
                setImageId(titleImageId);
                setIsLoading(false);
            }

            //create payload to send to db   ## serviceID is being used to store method type ##
            const body = {
                page: page,
                image: titleImageId,
                pdf: pdfId,
                textBody: textBody,
                serviceId: "text",
                templateId: "",
                publicKey: fileLink,
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

        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    }


    useEffect(() => {
        findPage(page);
        console.log("page Forund", imageId)
    }, [page]);

    return (
        <>
            <h1>UploadText</h1>
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

                <Row>


                    <Col
                        sm={12}
                        md={6}
                        style={{ display: "flex", justifyContent: "right" }}>
                        <Button className='btn btn-primary mr-75' style={{ paddingInline: "1.2em" }} type='submit' onClick={onSubmit}>Save</Button>
                    </Col>
                    <Col
                        sm={12}
                        md={6}>
                        <Button className='btn btn-primary mr-75' type='cancel' value='cancel'>Cancel</Button>
                    </Col>
                </Row>
            </Row>
        </>
    )
} export default UploadText;