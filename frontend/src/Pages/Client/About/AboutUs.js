import "./AboutUs.css";
import { React, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as FileService from '../../../Services/FileService'
import * as CmsService from '../../../Services/CmsService';

const AboutUs = () => {
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
      <div style={{ margin: "7rem", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
        <h1>About Us</h1>
        <img style={{ padding: "2rem", margin: "auto", width: "99%" }} src={imageUrls[image]} alt="About Us" />
        <div style={{ margin: "auto", width: "80%" }} dangerouslySetInnerHTML={{ __html: bodyText }} />
      </div>
    </>

  );
}

export default AboutUs;
