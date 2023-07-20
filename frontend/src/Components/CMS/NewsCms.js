import { React, useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Group from '../Form/Group'
import { Card, CardBody, Button } from '../../Components';
import ReactQuill from 'react-quill';
import * as FileService from '../../Services/FileService';
import * as CmsService from '../../Services/CmsService'
import Toast from '../Toast';
import 'react-quill/dist/quill.snow.css';

const NewsCms = () => {
    const page = 'News';
    const fileInput = useRef();
    const [oldFileId, setOldFileId] = useState('');
    const [uploadFile, setUploadFile] = useState('');
    const [user, setUser] = useState('');
    const [linkUrl, setlinkUrl] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)

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
                setOldFileId(response.pdf);
                setlinkUrl(response.textBody)
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
                page: "News",
                image: null,
                pdf: pdfID,
                textBody: linkUrl,
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
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        findPage(page);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user.payload._id);
        }
    }, [page]);

    return (
        <>
            <h1>Edit News Page</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
                    <Row>
                        <Col
                            sm={12}
                            md={12}>
                            <Group>
                                <label htmlFor='pdf'>Upload PDF:</label>
                                <div style={{ border: "1px dashed", margin: "1rem" }}>
                                    <input type='file' placeholder={oldFileId} ref={fileInput} style={{ padding: "1rem" }} onChange={handleFileChange} />
                                </div>
                                <h4>Or Upload link:</h4>
                            </Group>
                        </Col>
                        <Col
                            sm={12}
                            md={12}>
                            <Group>
                                <label htmlFor='link'>Upload PDF link: </label>
                                <input name='link' value={linkUrl} style={{ marginLeft: "1rem", width: '79%' }}
                                    onChange={(e) => {
                                        setlinkUrl(e.target.value);
                                    }}
                                    error={errors?.linkUrl}
                                />
                            </Group>
                        </Col>
                        <Col
                            sm={12}
                            md={6}
                            style={{ display: "flex", justifyContent: "right" }}>
                            <Button className='btn btn-primary mr-75' type='submit' style={{ paddingInline: "1.2em" }} onClick={onSubmit}>Save</Button>
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

export default NewsCms;