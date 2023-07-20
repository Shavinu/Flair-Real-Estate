import { React, useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Group from '../Form/Group'
import { Card, CardBody, Button } from '../../Components';
import 'react-quill/dist/quill.snow.css';
import Toast from '../Toast';
import * as FileService from '../../Services/FileService';
import * as CmsService from '../../Services/CmsService';
//import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Upload } from '../../Pages/File';
import UploadPdf from './Components/UploadPdf'
import UploadLink from './Components/UploadLink'
import UploadText from './Components/uploadText'

const ArticlesCms = () => {
    const form = useRef();
    const page = 'Buyers';
    const fileInput = useRef();
    const [oldFileId, setOldFileId] = useState('');
    const [uploadFile, setUploadFile] = useState('');
    const [linkUrl, setlinkUrl] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const [index, setIndex] = useState(0);

    //gets the page info from db
    const findPage = (page) => {
        //finds page using page name
        CmsService.findPage(page)
            .then((response) => {
                setOldFileId(response.pdf);
                setlinkUrl(response.textBody)
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

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0])
    }

    //handles submit duh
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


            //prepare json package to send to db
            const body = {
                page: "Buyers",
                image: null,
                pdf: pdfID,
                textBody: "",
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

    const onCancel = (e) => {

    }


    useEffect(() => {
        findPage(page);
    }, [page]);

    return (
        <>
            <h1>Edit Articles</h1>
            <Card style={{ marginLeft: "20%", marginTop: "2rem" }}>
                <CardBody>
                    <Form ref={form}>
                        <Row>
                            <Col
                                sm={12}
                                md={12}>
                                <Group>
                                    <DropdownButton id="dropdown-basic-button" title="Select Method">
                                        <Dropdown.Item onClick={() => { setIndex(0) }}>Upload PDF</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setIndex(1) }}>Upload Link</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setIndex(2) }}>Upload Text</Dropdown.Item>
                                    </DropdownButton>
                                </Group>
                            </Col>
                            <Col
                                sm={12}
                                md={12}>
                                <div className="tabContent" hidden={index !== 0}>
                                    <UploadPdf />
                                </div>
                                <div className="tabContent" hidden={index !== 1}>
                                    <UploadLink />
                                </div>
                                <div className="tabContent" hidden={index !== 2}>
                                    <UploadText />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card >
        </>
    );
};

export default ArticlesCms;