import { React, useRef, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, CloseButton } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import Toast from '../../Toast';
import * as FileService from '../../../Services/FileService';
import * as CmsService from '../../../Services/CmsService';

function UploadPdf({ page }) {
    const form = useRef();
    const fileInput = useRef();
    const [titleImage, setTitleImage] = useState('');
    const [oldFileId, setOldFileId] = useState('');
    const [uploadFile, setUploadFile] = useState('');
    const [imageId, setImageId] = useState();
    const [textBody, setTextBody] = useState();
    const [fileLink, setFileLink] = useState();
    const [errors, setErrors] = useState();
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

    //gets the page info from db
    const findPage = (page) => {
        //finds page using page name
        CmsService.findPage(page)
            .then((response) => {
                setImageId(response.image);
                setOldFileId(response.pdf);
                setTextBody(response.textBody);
                setFileLink(response.publicKey);
            })
    }

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0])
    }

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            let pdfID = null;
            //upload pdf and get ID
            if (uploadFile) {
                const formData = new FormData();
                formData.append('file', uploadFile);
                formData.append('userId', user);
                const response = await FileService.uploadSingle(formData);
                console.log(response);
                pdfID = response.file._id
            }

            //create payload to send to db
            const body = {
                page: page,
                image: imageId,
                pdf: pdfID,
                textBody: textBody,
                serviceId: "pdf",
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
        findPage(page.page);
    }, [page]);

    return (
        <>
            <h1>UploadPdf</h1>
            <Form ref={form}>
                <Row>
                    <Col
                        sm={12}
                        md={12}>
                        <p>Current: {oldFileId}</p>
                        <div style={{ border: "1px dashed", margin: "1rem" }}>
                            <input type='file' placeholder={oldFileId} ref={fileInput} style={{ padding: "1rem" }} onChange={handleFileChange} />

                        </div>
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
} export default UploadPdf;