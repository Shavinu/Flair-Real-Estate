import { React, useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Group from '../Form/Group'
import { Card, CardBody, Button } from '../../Components';
import * as CmsService from '../../Services/CmsService'
import 'react-quill/dist/quill.snow.css';
import UploadPdf from './Components/UploadPdf'
import UploadLink from './Components/UploadLink'
import UploadText from './Components/uploadText'

const NewsCms = () => {
    const page = 'News';
    const form = useRef();
    const fileInput = useRef();
    const [oldFileId, setOldFileId] = useState('');
    const [uploadFile, setUploadFile] = useState('');
    const [user, setUser] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [index, setIndex] = useState(0);

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
            })
    }

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0])
    }



    useEffect(() => {
        findPage(page);
    }, [page]);

    return (
        <>

            <h1>Edit News Articles</h1>
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
                                    <UploadPdf page={{ page }} />
                                </div>
                                <div className="tabContent" hidden={index !== 1}>
                                    <UploadLink page={{ page }} />
                                </div>
                                <div className="tabContent" hidden={index !== 2}>
                                    <UploadText page={{ page }} />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card >
        </>
    );
};

export default NewsCms;