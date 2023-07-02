import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as AuthServices from '../../Services/AuthService';
import { Alert } from '../../Components';
import axios from 'axios'

const Verified = () => {

  const [alertMessage, setAlertMessage] = useState('');
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        AuthServices.verifyEmail(param.userId, param.token)
        .then((response) => {
          if (response?.error) {
            console.log(response.error.message);
            setAlertMessage(response.error.message);
            return;
          } else{
            setValidUrl(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setAlertMessage(error);
          return;
        });

      } catch (error) {
        setValidUrl(false);
      }
    }
    verifyEmailUrl()
  }, [param])


  return (
    <>
      <section className='row flexbox-container'>
        <div className='col-xl-8 col-11 d-flex justify-content-center'>
          <div className='card bg-authentication rounded-0 mb-0'>
            <div className='row m-0'>
              <div className='col-lg-6 d-lg-block d-none text-center align-self-center px-1 py-0'>
              {validUrl ? (
                <img
                  src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/tick.png`}
                  width='50%'
                  alt='green tick'
                />
              ) : (
                <img
                  className='m-75'
                  src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/cross.png`}
                  width='50%'
                  alt='red cross'
                />
              )}

              </div>
              <div className='col-lg-6 col-12 p-0'>
                <div className='card rounded-0 mb-0 px-2'>
                  <div className='card-header pb-1'>
                    <div className='card-title'>
                    {validUrl ? (
                      <h4 className='mb-0'>Verification success!</h4>
                    ) : (
                      <div>
                        <h4 className='mb-0'>Error</h4>
                      </div>
                    )}
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='card-body pt-0'>
                      {validUrl ? (
                        <div>
                          <p className='px-2'>
                            Your email has been successfully verified. Use the link below to sign in.
                          </p>
                          <p>
                            <Link
                              to='/auth/login'
                              className=''>
                              Sign In
                            </Link>
                          </p>
                        </div>
                        ) : (
                          <p>
                            {alertMessage}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Verified;
