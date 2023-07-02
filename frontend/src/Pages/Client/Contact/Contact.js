import "./ContactForm.css";
import { React, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import Toast from '../../../Components/Toast';

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
            <div className="form-container">
        		  <h1>Send a message to us!</h1>
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
