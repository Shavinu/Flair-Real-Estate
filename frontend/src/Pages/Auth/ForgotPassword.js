import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import { Group, Input, Label } from '../../Components/Form';
import * as AuthServices from '../../Services/AuthService';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import { Alert, Button } from '../../Components';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      errors = { ...errors, email: 'Please provide email address' };
      isValid = false;
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address' };
      isValid = false;
    }
    setErrors(errors);

    return isValid;
  };

  const errorShake = () => {
    window.jQuery('button[type=submit]').addClass('animated headShake bg-red');

    window
      .jQuery('button[type=submit]')
      .on(
        'webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
          window.jQuery('button[type=submit]').delay(200).removeClass('animated headShake bg-red');
        }
      );
  };

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      errorShake();
      return;
    }

    AuthServices.forgotPassword({
      email: email,
    })
      .then((response) => {
        setAlertMessage();
        setMessage(response.message)
      })
      .catch((response) => {
        if (
          response.response?.data?.error &&
          response.response?.data?.error.message
        ) {
          setAlertMessage(response.response?.data?.error.message);
          setMessage();
          errorShake();
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <section className='row flexbox-container'>
        <div className='col-xl-8 col-11 d-flex justify-content-center'>
          <div className='card bg-authentication rounded-0 mb-0'>
            <div className='row m-0'>
              <div className='p-0'>
                <div className='card rounded-0 mb-0 px-2'>
                  <div className='card-header pb-1'>
                    <div className='card-title'>
                      <h4 className='mb-0'>Forgot Password</h4>
                    </div>
                  </div>
                  <p className='px-2'>
                    Please enter your email
                  </p>
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
                      // icon={<i className='feather icon-info mr-1 align-middle'></i>}
                    />
                  )}
                  <div className='card-content'>
                    <div className='card-body pt-0'>
                      <form
                        onSubmit={onSubmit}
                        className='pt-1'>
                        <Group
                          className='form-label-group'
                          hasIconLeft>
                          <Input
                            name='email'
                            value={email}
                            icon='feather icon-user'
                            placeholder='Email'
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            error={errors?.email}
                          />
                          <Label for='email'>Email</Label>
                        </Group>
                        <Button
                          className='btn btn-primary float-right btn-inline'
                          type='submit'
                          isLoading={isLoading}
                          onClick={onSubmit}>
                          Submit
                        </Button>
                      </form>
                    </div>
                  </div>
                  <p className='m-75'>
                    Not a member?{' '}
                    <span>
                      <Link
                        to='/auth/register'
                        className=''>
                        Register Now
                      </Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
