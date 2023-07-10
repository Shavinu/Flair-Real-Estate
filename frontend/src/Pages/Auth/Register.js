import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Group, Input, Label, Select } from '../../Components/Form';
import utils from '../../Utils';
import * as AuthServices from '../../Services/AuthService';
import Toast from '../../Components/Toast';
import { Alert, Button, Card } from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import { isValidPassword } from '../../Utils/string';

const Register = ({ type, page }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [licence, setLicence] = useState('');
  const [verifiedLicence, setVerifiedLicence] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

    if (!jobType) {
      errors = { ...errors, jobType: 'Please provide your job title' };
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
      errors = { ...errors, passwordConfirmation: 'Passwords do not match' };
      isValid = false;
    }

    if (!isValidPassword(password)) {
      errors = {
        ...errors,
        password: 'Password does not follow password requirements',
      };
      isValid = false;
    }

    setErrors(errors);

    return isValid;
  };

  const onReset = (e) => {
    page(1);
  };

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

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      errorShake();
      return;
    }

    AuthServices.verifyLicence(type, licence)
      .then((response) => {
        if (response?.error) {
          setAlertMessage(response.error.message);
          setIsLoading(false);
          errorShake();
          return;
        }

        if (response?.message === 'Licence is valid') {
          setAlertMessage();
          setVerifiedLicence(true);

          AuthServices.register({
            firstName: firstName,
            lastName: lastName,
            mobileNo: mobileNo,
            phoneNo: phoneNo,
            email: email,
            password: password,
            company: company,
            jobType: jobType,
            licence: licence,
            verifiedLicence: verifiedLicence,
            accType: type,
            verified: false,
          })
            .then((response) => {
              if (response?.message) {
                setAlertMessage();
                Toast(response.message);
                setMessage(response.message);
              }
            })
            .catch((response) => {
              if (
                response.response.data?.error &&
                response.response.data?.error.message
              ) {
                setMessage();
                setAlertMessage(response.response.data.error.message);
              }
              errorShake();
            })
            .finally(() => setIsLoading(false));
        } else {
          console.log(response.data.message);
          setAlertMessage('Licence verification failed');
          setMessage();
          errorShake();
          setIsLoading(false);
          return;
        }
      })
      .catch((error) => {
        setAlertMessage('An error occurred while verifying the licence.');
        setMessage();
        errorShake();
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
                  src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/logo/logo.png`}
                  alt='branding logo'
                  width='80%'
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
                  {message && (
                    <Alert
                      className='mx-2'
                      type='success'
                      message={message}
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
                            name='mobile'
                            value={mobileNo}
                            placeholder='Mobile Number'
                            onChange={(e) => setMobileNo(e.target.value)}
                            error={errors?.mobileNo}
                          />
                          <Label for='mobile'>Mobile Number</Label>
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
                          <p>
                            If you do not have a licence, use your corporate
                            licence
                          </p>
                          <Input
                            name='license'
                            value={licence}
                            placeholder={
                              type !== 'assistant agent'
                                ? 'License Number'
                                : 'Certificate Number'
                            }
                            onChange={(e) => setLicence(e.target.value)}
                            error={errors?.licence}
                          />
                          <Label for='license'>
                            {type !== 'assistant agent'
                              ? 'License Number'
                              : 'Certificate Number'}
                          </Label>
                        </Group>
                        {type !== 'builder' && type !== 'developer' && (
                          <Group className='form-label-group'>
                            <Label htmlFor='job'>Job Title</Label>
                            <Select
                              options={[
                                {
                                  value: 'incharge',
                                  label: 'Licence Incharge (Class 1 only)',
                                },
                                {
                                  value: 'agent',
                                  label:
                                    'Licence Real Estate Agent (Class 1 or Class 2)',
                                },
                                {
                                  value: 'assistant',
                                  label: 'Assistant Agent',
                                },
                              ]}
                              name='job'
                              value={jobType}
                              onChange={(value) => setJobType(value)}
                              error={errors?.jobType}
                            />
                          </Group>
                        )}
                        <p>
                          Paswords must be at least 8 characters long and have:
                          <ul>
                            <li>
                              at least <b>one uppercase letter</b>
                            </li>
                            <li>
                              at least <b>one lowercase letter</b>
                            </li>
                            <li>
                              at least <b>one digit</b>
                            </li>
                            <li>
                              at least <b>one special character</b>
                            </li>
                          </ul>
                        </p>
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
                          <Label for='password_confirmation'>
                            Confirm Password
                          </Label>
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
                                  I accept the <a href=''>terms & conditions</a>
                                  .
                                  {/* the above needs to be implemented. The below Register button should not be
                                  clickable unless this is ticked. Terms and conditions must link to t&c provided
                                  by Flair Real Estate*/}
                                </span>
                              </div>
                            </fieldset>
                          </div>
                        </div>
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
                    <p>
                      Already a member?{' '}
                      <span>
                        <Link
                          to='/auth/login'
                          className=''>
                          Sign In
                        </Link>
                      </span>
                    </p>
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
