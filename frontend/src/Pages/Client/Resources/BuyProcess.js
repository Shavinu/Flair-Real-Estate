import { React, useRef, useState, useEffect } from 'react';
import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import HomeHero from "../../../Components/HomeHero";
import "./ResourcesPage.css";
import * as CmsService from '../../../Services/CmsService';
import * as FileService from '../../../Services/FileService';

const BuyProcess = () => {
  const page = ('Buyers');
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
        checkMethod(response.serviceId);
        getImageUrl(response.image);
      })
  }

  const checkMethod = (method) => {
    if (method == "text") {
      setIndex(0);
    }
    if (method == "pdf") {
      setIndex(1);
    }
    if (method == "link") {
      setIndex(2);
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
        <div className="tabContent" hidden={index !== 0}>
          <div style={{ margin: "2rem", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
            <img style={{ padding: "2rem", margin: "auto", width: "99%" }} src={imageUrls[titleImage]} alt="Article Image" />
            <div style={{ margin: "auto", width: "80%" }} dangerouslySetInnerHTML={{ __html: textBody }} />
          </div>

        </div>
        <div className="tabContent" hidden={index !== 1}>
          <h1>Insert PDF doc here</h1>
        </div>
        <div className="tabContent" hidden={index !== 2}>
          <div style={{ margin: "2rem", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
            <iframe src={fileLink} width={"80%"} height={"1150px"} style={{ margin: "auto" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BuyProcess;