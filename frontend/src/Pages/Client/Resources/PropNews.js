import { React, useRef, useState, useEffect } from 'react';
import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import HomeHero from "../../../Components/HomeHero";
import "./ResourcesPage.css";
import * as CmsService from '../../../Services/CmsService';
import * as FileService from '../../../Services/FileService';

const PropNews = () => {
  const page = ('News');
  const [titleImage, setTitleImage] = useState('');
  const [fileLink, setFileLink] = useState();
  const [pdfId, setPdfId] = useState();
  const [imageId, setImageId] = useState();
  const [textBody, setTextBody] = useState();
  const [index, setIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState({});

  //gets the page info from db
  const findPage = (page) => {
    //finds page using page name
    CmsService.findPage(page)
      .then((response) => {
        setTitleImage(response.image);
        setPdfId(response.pdf);
        setTextBody(response.textBody);
        setFileLink(response.publicKey);
        getImageUrl(response.image);
        FileService.getFileUrl(response.pdf);
        checkMethod(response.serviceId);
      })
  }

  const checkMethod = (method) => {

    if (String(method) === 'text') {
      setIndex(0);
    } else if (String(method) === 'pdf') {
      setIndex(1);
      setFileLink(FileService.streamFile(pdfId));
    } else if (String(method) === 'link') {
      setIndex(1);
    } else {
      console.log('error');
    }
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
    console.log("page Forund", imageId)
  }, [page]);

  return (
    <>
      {/* <!-- BEGIN Navigation--> */}
      <HomeHero
        cName="villain"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />
      {/* <!-- END Navigation--> */}
      <div className="resources-page">
        <h1>Property News</h1>
        <iframe src='https://drive.google.com/file/d/1S4vU3_X1GD2bCefG-IkoiGpK6KrP11pY/preview' width={"80%"} height={"1150px"} style={{ margin: "auto" }} />
      </div>
    </>
  );
}

export default PropNews;