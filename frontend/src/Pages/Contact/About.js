import { React, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as FileService from '../../Services/FileService'
import * as CmsService from '../../Services/CmsService';

const About = () => {
    const [image, setImage] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [imageUrls, setImageUrls] = useState({});
    const page = "About";

    //get page by name
    const findPage = (page) => {
        CmsService.findPage(page)
            .then((response) => {
                setImage(response.image);
                setBodyText(response.textBody);
                getImageUrl(response.image)
                console.log(bodyText)
            })
    }
    //get image by ID
    const getImageUrl = async (imageId) => {
        if (!imageUrls[imageId]) {
            const url = await FileService.getImageUrl(imageId);
            setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
        }
    };

    useEffect(() => {
        findPage(page);
    }, [page]);

    return (
        <>

            <h1>About Us</h1>
            <img src={imageUrls[image]} alt="About Us" />
            <p>info: {bodyText}</p>
        </>
    );
};

export default About;