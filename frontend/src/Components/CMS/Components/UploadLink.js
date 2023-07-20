import { React, useRef, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, CloseButton } from 'react-bootstrap';
import Toast from '../../Toast';
import * as CmsService from '../../../Services/CmsService';

function UploadLink() {
    const page = ('Buyers');
    const form = useRef();
    const fileInput = useRef();
    const [errors, setErrors] = useState();
    const [fileLink, setFileLink] = useState();
    const [pdfId, setPdfId] = useState();
    const [imageId, setImageId] = useState();
    const [textBody, setTextBody] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;


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


    //gets the page info from db   ### here public key is being used to store link ###
    const findPage = (page) => {
        //finds page using page name
        CmsService.findPage(page)
            .then((response) => {
                setImageId(response.image);
                setFileLink(response.publicKey);
                setPdfId(response.pdf);
                setTextBody(response.textBody);
            })
    }

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            //create payload to send to db   ## serviceID is being used to store method type ##
            const body = {
                page: page,
                image: imageId,
                pdf: pdfId,
                textBody: textBody,
                serviceId: "link",
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
    }, [page]);

    return (
        <>
            <h1>UploadLink</h1>
            <Form ref={form}>
                <Row>
                    <Col sm={12}
                        md={12}>
                        <label htmlFor='link'>Upload PDF link: </label>
                        <input name='link' style={{ marginLeft: "1rem", width: '79%', marginBottom: "2rem" }}
                            onChange={(e) => {
                                setFileLink(e.target.value);
                            }}
                            placeholder={fileLink}
                            error={errors?.fileLink}
                        />
                    </Col>
                </Row>
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
            </Form>
        </>
    )
} export default UploadLink;