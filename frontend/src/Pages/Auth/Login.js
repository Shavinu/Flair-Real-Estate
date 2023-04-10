import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import { Group, Input, Label } from '../../Components/Form';
import * as AuthServices from '../../Services/AuthServices';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import { Alert, Button } from '../../Components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isValid = () => {
    let isValid = true
    let errors = {}

    if (!email) {
      errors = { ...errors, email: 'Please provide email address!' }
      isValid = false
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!password) {
      errors = { ...errors, password: 'Please provide a password!' }
      isValid = false
    }

    setErrors(errors);

    return isValid
  }

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      return
    }

    AuthServices.login({
      email: email,
      password: password,
    })
      .then((response) => {
        setAlertMessage();
        Toast('Login successfully!', 'success');
        navigate('/');
      })
      .catch((response) => {
        if (response.response.data?.error && response.response.data?.error.message) {
          setAlertMessage(response.response.data.error.message);
        }
        Toast('Login failed!', 'warning');
      })
      .finally(() =>
        setIsLoading(false)
      )
  }

  return (
    <>
      <section className='row flexbox-container'>
        <div className='col-xl-8 col-11 d-flex justify-content-center'>
          <div className='card bg-authentication rounded-0 mb-0'>
            <div className='row m-0'>
              <div className='col-lg-6 d-lg-block d-none text-center align-self-center px-1 py-0'>
                <img
                  src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/pages/login.png`}
                  alt='branding logo'
                />
              </div>
              <div className='col-lg-6 col-12 p-0'>
                <div className='card rounded-0 mb-0 px-2'>
                  <div className='card-header pb-1'>
                    <div className='card-title'>
                      <h4 className='mb-0'>Login</h4>
                    </div>
                  </div>
                  <p className='px-2'>
                    Welcome back, please login to your account.
                  </p>
                  {alertMessage &&
                    <Alert className="mx-2" type="danger" message={alertMessage} icon={<i class="feather icon-info mr-1 align-middle"></i>} />
                  }
                  <div className='card-content'>
                    <div className='card-body pt-0'>
                      <form onSubmit={onSubmit} className="pt-1">
                        <Group className="form-label-group" hasIconLeft>
                          <Input name="email"
                            value={email}
                            icon="feather icon-user"
                            placeholder="Email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            error={errors?.email}
                          />
                          <Label for="email">Email</Label>
                        </Group>

                        <Group className="form-label-group" hasIconLeft>
                          <Input type="password"
                            name="password"
                            placeholder='Password'
                            icon='feather icon-lock'
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                            error={errors?.password}
                          />
                          <Label for="password">Password</Label>
                        </Group>

                        <div className='form-group d-flex justify-content-between align-items-center'>
                          <div className='text-left'>
                            <fieldset className='checkbox'>
                              <div className='vs-checkbox-con vs-checkbox-primary'>
                                <input type='checkbox' />
                                <span className='vs-checkbox'>
                                  <span className='vs-checkbox--check'>
                                    <i className='vs-icon feather icon-check'></i>
                                  </span>
                                </span>
                                <span className=''>Remember me</span>
                              </div>
                            </fieldset>
                          </div>
                          <div className='text-right'>
                            <a
                              href='auth-forgot-password.html'
                              className='card-link'>
                              Forgot Password?
                            </a>
                          </div>
                        </div>
                        <Link
                          to='/auth/register'
                          className='btn btn-outline-primary float-left btn-inline'>
                          Register
                        </Link>
                        <Button className='btn btn-primary float-right btn-inline'
                          type="submit"
                          isLoading={isLoading}
                          onClick={onSubmit}
                        >Login</Button>
                      </form>
                    </div>
                  </div>
                  <div className='login-footer'>
                    <div className='divider'>
                      <div className='divider-text'>OR</div>
                    </div>
                    <div className='footer-btn d-inline'>
                      <a
                        href='#'
                        className='btn btn-facebook'>
                        <span className='fa fa-facebook'></span>
                      </a>
                      <a
                        href='#'
                        className='btn btn-twitter white'>
                        <span className='fa fa-twitter'></span>
                      </a>
                      <a
                        href='#'
                        className='btn btn-google'>
                        <span className='fa fa-google'></span>
                      </a>
                      <a
                        href='#'
                        className='btn btn-github'>
                        <span className='fa fa-github-alt'></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </>
  );
};

export default Login;
