import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as UserService from '../../Services/UserService';
import { Container, Alert, Button } from '../../Components';

const RequestChange = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState('');
  const [validUrl, setValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');
  const [userName, setUserName] = useState('');
  const param = useParams();

  const getUserDetailById = (id) => {
    UserService.getUserDetailById(id).then((response) => {
      setCurrentCompany(response.company);
      setUserName(response.firstName + " " + response.lastName)
    });
  };

  useEffect(() => {
    const verifyRequestUrl = async () => {
      try {
        UserService.verifyRequest(param.userId, param.token, param.company)
          .then((response) => {
            if (response?.error) {
              setAlertMessage(response.error.message);
              setMessage();
              return;
            } else {
              setValidUrl(true);
              getUserDetailById(param.userId);
            }
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyRequestUrl();
  }, [param]);

  const errorShake = () => {
    window.jQuery('button[type=submit]').addClass('animated headShake bg-red');

    window
      .jQuery('button[type=submit]')
      .on(
        'webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
          window
            .jQuery('button[type=submit]')
            .delay(200)
            .removeClass('animated headShake bg-red');
        }
      );
  };

  const deleteToken = () => {
    const body = {
      userId: param.userId,
      token: param.token,
      company: param.company.replaceAll('-', ' '),
    };

    UserService.deleteToken(body)
      .then((response) => {
        console.log('Token deleted successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    const body = {
      company: param.company.replaceAll('-', ' '),
    };

    UserService.updateUser(param.userId, body)
      .then((response) => {
        setMessage("User's company has been successfully updated");
        setAlertMessage();
        setChosen(true);
        deleteToken();
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage(error);
        setMessage();
        errorShake();
        deleteToken();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
    <Container className="content-container">
      <section className='row flexbox-container'>
        <div className='col-xl-8 col-11 d-flex justify-content-center'>
          <div className='card bg-authentication rounded-0 mb-0'>
            <div className='row m-0'>
              <div className='p-0'>
                <div className='card rounded-0 mb-0 px-2'>
                  <div className='card-header pb-1'>
                    <div className='card-title'>
                      <h4 className='mb-0'>Company Change Request</h4>
                    </div>
                  </div>
                  {alertMessage && (
                    <Alert
                      className='mx-2'
                      type='danger'
                      message={alertMessage}
                      icon={
                        <i className='feather icon-info mr-1 align-middle'></i>
                      }
                    />
                  )}
                  {message && (
                    <Alert
                      className='mx-2'
                      type='success'
                      message={message}
                    />
                  )}
                  {!chosen && (
                    <div className='card-content'>
                      <div className='card-body pt-0'>
                        {validUrl && (
                          <div>
                            <p>User {userName} (ID: {param.userId}) requests to change their company from <b>{currentCompany}</b> to <b>{param.company}</b></p>
                            <p className='px-2'>Approve Company Change?</p>
                            <form
                              onSubmit={onSubmit}
                              className='pt-1'>
                              <Button
                                type='submit'
                                className='btn btn-primary waves-effect waves-light mr-75'
                                onClick={onSubmit}
                                isLoading={isLoading}>
                                Approve
                              </Button>
                              <Button
                                className='btn waves-effect waves-light mr-75'
                                onClick={() => {
                                  setChosen(true);
                                  setMessage('Request has been denied');
                                  setAlertMessage();
                                  deleteToken();
                                }}>
                                Deny
                              </Button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Container>
    </>
  );
};

export default RequestChange;
