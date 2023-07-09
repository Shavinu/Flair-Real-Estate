import "./ContactForm.css";
import { React, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import Toast from '../../../Components/Toast';
import HomeHero from "../../../Components/HomeHero";

const Contact = () => {
    const form = useRef();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [message, setMessage] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_bsnl3ou', 'template_wf1ghio', form.current, 'vEod6td5SndHAMftY')
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
            cName="hero"
            heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
            title="Real Estate"
            text="Send us a message!"
            btnClass="hide"
            url="/"
        />
        {/* <!-- END Navigation--> */}
            <div className="form-container">
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
