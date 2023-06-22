import { Link, useNavigate, useParams } from 'react-router-dom';
import './Login.css';
import { useState, useEffect } from 'react';
import { Group, Input, Label } from '../../Components/Form';
import * as AuthServices from '../../Services/AuthService';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import { Alert, Button } from '../../Components';

const Login = () => {
  const [validUrl, setValidUrl] = useState();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const param = useParams();

  useEffect(() => {
    const resetPasswordUrl = async () => {
      try {
        AuthServices.resetPassword(param.userId, param.token)
        .then((response) => {
          if (response?.error) {
            console.log(response.error.message)
            setAlertMessage(response.error.message);
            setMessage();
            return;
          } else{
            setValidUrl(true);
          }
        })
        .catch((error) => {
          console.log(error);
          return;
        });

      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    }
    resetPasswordUrl()
  }, [param])


  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!password) {
      errors = { ...errors, password: 'Please provide a password' };
      isValid = false;
    }

    if (!passwordConfirmation) {
      errors = { ...errors, passwordConfirmation: 'Please confirm password' };
      isValid = false;
    }

    if (passwordConfirmation && passwordConfirmation !== password) {
      errors = { ...errors, passwordConfirmation: 'Passwords do not match' };
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

    AuthServices.updatePassword({
      userId: param.userId,
      token: param.token,
      password: password,
    })
      .then((response) => {
        setAlertMessage();
        setMessage('Password has been updated');
        setUpdated(true);
      })
      .catch((response) => {
        if (
          response.response?.data?.error &&
          response.response?.data?.error.message
        ) {
          setAlertMessage(response.response?.data?.error.message);
        }
        setMessage(response.response?.data?.message);
        setAlertMessage('');
        errorShake();
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
                      <h4 className='mb-0'>Reset Password</h4>
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
                      icon={<i class='feather icon-info mr-1 align-middle'></i>}
                    />
                  )}
                  {updated ? (
                      <Link
                        to='/auth/login'
                        className='centre'>
                        Sign In
                      </Link>
                  ) : (
                  <div className='card-content'>
                    <div className='card-body pt-0'>
                    {validUrl && (
                      <div>
                        <p className='px-2'>
                          Enter your new password
                        </p>
                        <form
                        onSubmit={onSubmit}
                        className='pt-1'>
                        <Group className='form-label-group'>
                          <Input
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors?.password}
                          />
                          <Label for='password'>Password</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            type='password'
                            name='password_confirmation'
                            value={passwordConfirmation}
                            placeholder='Confirm Password'
                            onChange={(e) =>
                              setPasswordConfirmation(e.target.value)
                            }
                            error={errors?.passwordConfirmation}
                          />
                          <Label for='password'>Password</Label>
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
                    )}
                    </div>
                  </div>
                  )}
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

export default Login;
