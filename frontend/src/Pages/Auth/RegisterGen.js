import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Group, Input, Label } from "../../Components/Form";
import utils from "../../Utils";
import * as AuthServices from '../../Services/AuthServices';
import Toast from "../../Components/Toast";
import { Alert, Button } from "../../Components";
import Register from "./Register";

const RegisterGen = () => {
  const [type, setType] = useState('agent')
  const [page, setPage] = useState(1)

  return <>
    {
      page == 2 && <Register type={type}/>
    }
    <section class='row flexbox-container'>
      <div class='col-xl-8 col-10 d-flex justify-content-center'>
        <div class='card bg-authentication rounded-0 mb-0'>
          <div class='row m-0'>
            <div class='col-lg-6 d-lg-block d-none text-center align-self-center pl-0 pr-3 py-0'>
              <img
                src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/pages/register.jpg`}
                alt='branding logo'
              />
            </div>
            <div class='col-lg-6 col-12 p-0'>
              <div class='card rounded-0 mb-0 p-2'>
                <div class='card-header pt-50 pb-1'>
                  <div class='card-title'>
                    <h4 class='mb-0'>I AM A...</h4>
                  </div>
                </div>
                <p class='px-2'>
                  Tell us what type of account you would like to create
                </p>
                <div class='card-content'>
                  <div class='card-body'>
                    <Button onClick={() =>{
                      setType('agent')
                      setPage(2)
                    }} class='btn btn-outline-primary float-right btn-inline mb-50'>Real Estate Agent</Button>

                    <Button onClick={() =>{
                      setType('dev')
                      setPage(2)
                    }} class='btn btn-outline-primary float-left btn-inline mb-50'>Builder</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
}

export default RegisterGen
