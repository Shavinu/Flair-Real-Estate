import "./ContactForm.css";
import { React, useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import Toast from '../../../Components/Toast';
import * as FileService from '../../../Services/FileService'
import * as CmsService from '../../../Services/CmsService';
import HomeHero from "../../../Components/HomeHero";

const Contact = () => {
    const [image, setImage] = useState('');
    const [imageUrls, setImageUrls] = useState({});
    const [serviceID, setServiceID] = useState('');
    const [templateID, setTemplateID] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const page = "Contact";
    const form = useRef();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [message, setMessage] = useState('');

    //finds contact page in cms db
    const findPage = (page) => {
        CmsService.findPage(page)
            .then((response) => {
                setImage(response.image);
                getImageUrl(response.image);
                setServiceID(response.serviceId);
                setTemplateID(response.templateId);
                setPublicKey(response.publicKey);
                console.log(serviceID, templateID, publicKey);
            })
    }

    //calls a function from file service to find image on db by ID 
    const getImageUrl = async (imageId) => {
        if (!imageUrls[imageId]) {
            const url = await FileService.getImageUrl(imageId);
            setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
        }
    };

    useEffect(() => {
        findPage(page);
    }, [page]);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(serviceID, templateID, form.current, publicKey)
            .then((result) => {
                console.log(result.text);
                Toast('Message sent successfully!', 'success');
            }, (error) => {
                console.log(error.text);
                Toast('Message sent unsuccessfully', 'warning');
            });
        //Toast('Message sent successfully!', 'success');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNo('');
        setMessage('');
    };

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
            <div className="form-container">
                <h1>Send us a message!</h1>
                <form ref={form} onSubmit={sendEmail}>
                    <input placeholder="Name" />
                    <input placeholder="Email" />
                    <input placeholder="Subject" />
                    <textarea placeholder="Message" rows="4"></textarea>
                    <button>Send Message</button>
                </form>
            </div>
        </>
    );
};

export default Contact;
