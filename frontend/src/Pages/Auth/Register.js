import { Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Group, Input, Label } from '../../Components/Form';
import utils from '../../Utils';
import * as AuthServices from '../../Services/AuthService';
import Toast from '../../Components/Toast';
import { Alert, Button, Card } from '../../Components';
import RegisterGen from './RegisterGen';
import CardBody from '../../Components/Card/CardBody';

const Register = ({ type, page }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [licence, setLicence] = useState('');
  const [verifiedLicence, setVerifiedLicence] = useState('');
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

    if (!company) {
      errors = { ...errors, company: 'Please provide your company' };
      isValid = false;
    }

    if (!licence) {
      errors = { ...errors, licence: 'Please provide licence number' };
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

  const onReset = (e) =>{
    page(1);
  }

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      return;
    }
  
    AuthServices.verifyLicence(type, licence)
      .then((response) => {
        if (response?.error) {
          setAlertMessage(response.error.message);
          Toast('Licence verification failed!', 'warning');
          setIsLoading(false);
          return;
        }
  
        if (response?.message === 'Licence is valid') {
          setAlertMessage();
          Toast('Licence verified!', 'success');
          setVerifiedLicence(true);
  
          AuthServices.register({
            firstName: firstName,
            lastName: lastName,
            phoneNo: phoneNo,
            email: email,
            password: password,
            company: company,
            licence: licence,
            verifiedLicence: true,
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
        } else {
          setAlertMessage(response.data.message);
          Toast('Licence verification failed!', 'warning');
          setIsLoading(false);
          return;
        }
      })
      .catch((error) => {
        setAlertMessage('An error occurred while verifying the licence.');
        Toast('Licence verification failed!', 'warning');
        setIsLoading(false);
        return;
      });
  };  

  return (
    <>
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
                      <h4 className='mb-0'>Create Account</h4>
                    </div>
                  </div>
                  <p className='px-2'>
                    Fill the form below to create a new {type} account.
                  </p>
                  {alertMessage && (
                    <Alert
                      className='mx-2'
                      type='danger'
                      message={alertMessage}
                      icon={<i class='feather icon-info mr-1 align-middle'></i>}
                    />
                  )}
                  <Card>
                    <CardBody>
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
                            name='company'
                            value={company}
                            placeholder='Company'
                            onChange={(e) => setCompany(e.target.value)}
                            error={errors?.company}
                          />
                          <Label for='company'>Company</Label>
                        </Group>
                        <Group className='form-label-group'>
                          <Input
                            name='license'
                            value={licence}
                            placeholder={type !== 'assistant agent'
                            ? 'License Number'
                            : 'Certificate Number'}
                            onChange={(e) => setLicence(e.target.value)}
                            error={errors?.licence}
                          />
                          <Label for='license'>
                            {type !== 'assistant agent'
                              ? 'License Number'
                              : 'Certificate Number'}
                          </Label>
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
                        <div className='form-group row'>
                          <div className='col-12'>
                            <fieldset className='checkbox'>
                              <div className='vs-checkbox-con vs-checkbox-primary'>
                                <input type='checkbox' />
                                <span className='vs-checkbox'>
                                  <span className='vs-checkbox--check'>
                                    <i className='vs-icon feather icon-check'></i>
                                  </span>
                                </span>
                                <span className=''>
                                  {' '}
                                  I accept the terms & conditions.
                                </span>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <Link
                          to='/auth/login'
                          className='btn btn-outline-primary float-left btn-inline mb-50'>
                          Login
                        </Link>
                        <Button
                          type='submit'
                          className='btn btn-primary float-right btn-inline mb-50'
                          onClick={onSubmit}
                          isLoading={isLoading}>
                          Register
                        </Button>
                        <Button
                          type='reset'
                          className='btn btn-secondary float-left btn-inline ml-50 mr-1'
                          onClick={onReset}>
                          Back
                        </Button>
                      </form>
                    </CardBody>
                  </Card>
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
