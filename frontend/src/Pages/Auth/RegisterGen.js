import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Group, Input, Label } from '../../Components/Form';
import utils from '../../Utils';
import * as AuthServices from '../../Services/AuthService';
import Toast from "../../Components/Toast";
import { Alert, Button, Card, Col, Row } from "../../Components";
import CardBody from "../../Components/Card/CardBody";
import Register from "./Register";

const RegisterGen = () => {
  const [type, setType] = useState('agent');
  const [page, setPage] = useState(1);
  
  return <>
    {
      page === 2 ? <Register type={type} page={setPage}/>:

      <section className='row flexbox-container'>
      <div className='col-xl-8 col-10 d-flex justify-content-center'>
        <div className='card bg-authentication rounded-0 mb-0'>
          <div className='row m-0'>
            <div className='col-lg-6 d-lg-block d-none text-center align-self-center pl-0 pr-3 py-0'>
              <img
                src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/pages/register.jpg`}
                alt='branding logo'
              />
            </div>
            <div className='col-lg-6 col-12 p-0'>
              <div className='card rounded-0 mb-0 p-2'>
                <div className='card-header pt-50 pb-1'>
                  <div className='card-title'>
                    <h4 className='mb-0'>I AM A...</h4>
                  </div>
                </div>
                <p className='px-2'>
                  Tell us what type of account you would like to create
                </p>
                <Card>
                  <CardBody>
                    <Button className="btn btn-primary btn-block mt-0" onClick={() =>{
                      setType('agency')
                      setPage(2)
                    }}>Real Estate Agency</Button>

                    <Button className="btn btn-primary btn-block mb-2" onClick={() =>{
                      setType('agent')
                      setPage(2)
                    }}>Real Estate Agent</Button>

                    <Button className="btn btn-primary btn-block" onClick={() =>{
                      setType('builder')
                      setPage(2)
                    }}>Builder</Button>

                    <Button className="btn btn-primary btn-block" onClick={() =>{
                      setType('developer')
                      setPage(2)
                    }}>Developer</Button>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
        </section>
    }
  </>;
};

export default RegisterGen;
