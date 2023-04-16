import { Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Group, Input, Label } from '../../Components/Form';
import utils from '../../Utils';
import * as AuthServices from '../../Services/AuthServices';
import Toast from '../../Components/Toast';
import { Alert, Button } from '../../Components';
import RegisterGen from './RegisterGen';

const Register = ({ type }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agency, setAgency] = useState('')
  const [license, setLicense] = useState('')
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = () => {
    let isValid = true;
    let errors = {};
    if (!firstName) {
      errors = { ...errors, firstName: 'Please provide first name' };
      isValid = false;
    }

    if (!lastName) {
      errors = { ...errors, lastName: 'Please provide last name' };
      isValid = false;
    }

    if (!phoneNo) {
      errors = { ...errors, phoneNo: 'Please provide phone number' };
      isValid = false;
    }

    if (!email) {
      errors = { ...errors, email: 'Please provide email address' };
      isValid = false;
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address' };
      isValid = false;
    }

    if (!agency) {
      errors = { ...errors, agency: 'Please provide real estate agency' };
      isValid = false;
    }

    if (!license) {
      errors = { ...errors, license: 'Please provide license' };
      isValid = false;
    }

    if (!password) {
      errors = { ...errors, password: 'Please provide a password' };
      isValid = false;
    }

    if (!passwordConfirmation) {
      errors = { ...errors, passwordConfirmation: 'Please confirm password' };
      isValid = false;
    }

    if (passwordConfirmation && passwordConfirmation !== password) {
      errors = { ...errors, passwordConfirmation: 'Password does not match' };
      isValid = false;
    }

    setErrors(errors);

    return isValid;
  };

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      return;
    }

    AuthServices.register({
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo,
      email: email,
      password: password,
      agency: agency,
      license: license,
      accType: type,
    })
      .then((response) => {
        setAlertMessage();
        Toast('Register successfully!', 'success');
        navigate('/');
      })
      .catch((response) => {
        if (
          response.response.data?.error &&
          response.response.data?.error.message
        ) {
          setAlertMessage(response.response.data.error.message);
        }
        Toast('Register failed!', 'warning');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
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
                      <h4 class='mb-0'>Create Account</h4>
                    </div>
                  </div>
                  <p class='px-2'>
                    Fill the form below to create a new account.
                  </p>
                  {alertMessage && (
                    <Alert
                      className='mx-2'
                      type='danger'
                      message={alertMessage}
                      icon={<i class='feather icon-info mr-1 align-middle'></i>}
                    />
                  )}
                  <div class='card-content'>
                    <div class='card-body'>
                      <form onSubmit={onSubmit}>
                        <Group className='form-label-group'>
                          <Input
                            name='first_name'
                            value={firstName}
                            placeholder='First Name'
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errors?.firstName}
                          />
                          <Label for='first_name'>First Name</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='last_name'
                            value={lastName}
                            placeholder='Last Name'
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors?.lastName}
                          />
                          <Label for='last_name'>Last Name</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='phone'
                            value={phoneNo}
                            placeholder='Phone Number'
                            onChange={(e) => setPhoneNo(e.target.value)}
                            error={errors?.phoneNo}
                          />
                          <Label for='phone'>Phone Number</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors?.email}
                          />
                          <Label for='email'>Email</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='agency'
                            value={agency}
                            placeholder='Agency'
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors?.agency}
                          />
                          <Label for='email'>Email</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='license'
                            value={license}
                            placeholder='License Number'
                            onChange={(e) => setEmail(e.target.value)} // need to wait till it is verified
                            error={errors?.license}
                          />
                          <Label for='email'>Email</Label>
                        </Group>
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
                        <div class='form-group row'>
                          <div class='col-12'>
                            <fieldset class='checkbox'>
                              <div class='vs-checkbox-con vs-checkbox-primary'>
                                <input type='checkbox' />
                                <span class='vs-checkbox'>
                                  <span class='vs-checkbox--check'>
                                    <i class='vs-icon feather icon-check'></i>
                                  </span>
                                </span>
                                <span class=''>
                                  {' '}
                                  I accept the terms & conditions.
                                </span>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <Link
                          to='/auth/login'
                          class='btn btn-outline-primary float-left btn-inline mb-50'>
                          Login
                        </Link>
                        <Button
                          type='submit'
                          className='btn btn-primary float-right btn-inline mb-50'
                          onClick={onSubmit}
                          isLoading={isLoading}>
                          Register
                        </Button>
                      </form>
                    </div>s
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

export default Register;
