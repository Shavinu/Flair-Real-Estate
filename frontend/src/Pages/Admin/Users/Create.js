import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Button,
  Card,
  Col,
  ContentHeader,
  DatePicker,
  Row,
} from '../../../Components';
import CardBody from '../../../Components/Card/CardBody';
import * as UserService from '../../../Services/UserService';
import * as GroupService from '../../../Services/GroupService';
import { Group, Input, Label, Select } from '../../../Components/Form';
import utils from '../../../Utils';
import * as AuthServices from '../../../Services/AuthService';
import Toast from '../../../Components/Toast';
import moment from 'moment';
import "../Layout.css";

const Create = () => {
  const [groups, setGroups] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [accType, setAccType] = useState('');
  const [jobType, setJobType] = useState('');
  const [company, setCompany] = useState('');
  const [licence, setLicence] = useState('');
  const [verifiedLicence, setVerifiedLicence] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [group, setGroup] = useState('');

  const [errors, setErrors] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getGroupList = () => {
    GroupService.getGroupList().then((response) => {
      setGroups(response);
    });
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

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      errors = { ...errors, email: 'Please provide email address!' };
      isValid = false;
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address!' };
      isValid = false;
    }

    if (!firstName) {
      errors = { ...errors, firstName: 'Please provide your first name!' };
      isValid = false;
    }

    if (!lastName) {
      errors = { ...errors, lastName: 'Please provide your last name!' };
      isValid = false;
    }

    if (!phoneNo) {
      errors = { ...errors, phoneNo: 'Please provide your phone number!' };
      isValid = false;
    }

    if (phoneNo && isNaN(+phoneNo)) {
      errors = { ...errors, phoneNo: 'Please provide valid phone number!' };
      isValid = false;
    }

    if (!accType) {
      errors = { ...errors, accType: 'Please select role!' };
      isValid = false;
    }

    if (!password) {
      errors = { ...errors, password: 'Please enter password!' };
      isValid = false;
    }

    if (password && confirmationPassword !== password) {
      errors = { ...errors, confirmationPassword: 'Password not match!' };
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
      errorShake();
      return;
    }

    AuthServices.verifyLicence(accType, licence)
      .then((response) => {
        if (response?.error) {
          setAlertMessage(response.error.message);
          // Toast('Licence verification failed!', 'warning');
          setIsLoading(false);
          errorShake();
          return;
        }

        if (response?.message === 'Licence is valid') {
          setAlertMessage();
          // Toast('Licence verified!', 'success');
          setVerifiedLicence(true);

          const body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            mobileNo: mobileNo,
            phoneNo: phoneNo,
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: city,
            country: country,
            postcode: postcode,
            accType: accType,
            jobType: jobType,
            company: company,
            licence: licence,
            group: group,
          };

          if (group) {
            body.group = group;
          }

          UserService.createUser(body)
            .then((response) => {
              Toast('User has been created successfully!', 'success');
              setErrors();
              setTimeout(() => {
                navigate(`/users/${response._id}`);
              }, 500);
            })
            .catch(() => {
              // Toast('Failed to create user!', 'danger');
              errorShake();
            })
            .finally(() => setIsLoading(false));
        } else {
          setAlertMessage(response.data.message);
          Toast('Licence verification failed!', 'warning');
          errorShake();
          setIsLoading(false);
          return;
        }
      })
      .catch((error) => {
        setAlertMessage('An error occurred while verifying the licence.');
        Toast('Licence verification failed!', 'warning');
        errorShake();
        setIsLoading(false);
        return;
      });
  };

  const onCancel = (e) => {};

  useEffect(() => {
    getGroupList();
  }, []);

  return ( <>
    <Container className="content-container">
      <ContentHeader
        headerTitle='Create User'
        breadcrumb={[
          { name: 'Home', link: '/' },
          { name: 'Users', link: '/users' },
          { name: 'Create', active: true },
        ]}
        options={
          <div>
            <Link
              type='reset'
              className='btn waves-effect waves-light mr-75'
              to={`/users`}>
              Cancel
            </Link>
            <Button
              className='btn btn-primary waves-effect waves-light'
              onClick={onSubmit}
              isLoading={isLoading}>
              Create
            </Button>
          </div>
        }
      />
      <Row>
        <Col
          sm={12}
          lg={8}>
          <Card header='Account Information'>
            <CardBody>
              <div className='media mb-2'>
                <div className='mr-2 my-25'>
                  <img
                    src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/default/avatar.jpg`}
                    alt='users avatar'
                    className='users-avatar-shadow rounded'
                    height='90'
                    width='90'
                  />
                </div>
                <div className='media-body mt-50'>
                  <h4 className='media-heading'>
                    {firstName} {lastName}
                  </h4>
                  <div className='col-12 d-flex mt-1 px-0'>
                    <Button className='btn btn-primary mr-75'>Change</Button>
                    <Button className='btn btn-outline-danger mr-75'>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='firstname'>First Name</Label>
                    <Input
                      name='firstName'
                      value={firstName}
                      placeholder='First Name'
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      error={errors?.firstName}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      name='lastName'
                      value={lastName}
                      placeholder='Last Name'
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      error={errors?.lastName}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      name='email'
                      value={email}
                      placeholder='Email'
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      error={errors?.email}
                    />
                  </Group>
                </Col>
              </Row>
              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      name='Password'
                      type='password'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      error={errors?.password}
                      autoComplete={'new-password'}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='password_confirmation'>
                      Confirm Password
                    </Label>
                    <Input
                      name='password_confirmation'
                      type='password'
                      value={confirmationPassword}
                      onChange={(e) => {
                        setConfirmationPassword(e.target.value);
                      }}
                      error={errors?.confirmationPassword}
                      autoComplete={'new-password'}
                    />
                  </Group>
                </Col>
              </Row>
              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='mobile'>Mobile</Label>
                    <Input
                      name='mobile'
                      value={mobileNo}
                      placeholder='Mobile Number'
                      onChange={(e) => {
                        setMobileNo(e.target.value);
                      }}
                      error={errors?.mobileNo}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input
                      name='phone'
                      value={phoneNo}
                      placeholder='Phone Number'
                      onChange={(e) => {
                        setPhoneNo(e.target.value);
                      }}
                      error={errors?.company}
                    />
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card header='Office address'>
            <CardBody>
              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='address_line_1'>Address line 1</Label>
                    <Input
                      name='address_line_1'
                      value={addressLine1}
                      placeholder='Address Line 1'
                      onChange={(e) => {
                        setAddressLine1(e.target.value);
                      }}
                      error={errors?.addressLine1}
                    />
                  </Group>
                  <Group>
                    <Label htmlFor='address_line_1'>Address line 2</Label>
                    <Input
                      name='address_line_1'
                      value={addressLine2}
                      placeholder='Address Line 2'
                      onChange={(e) => {
                        setAddressLine2(e.target.value);
                      }}
                      error={errors?.addressLine2}
                    />
                  </Group>
                  <Group>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      name='city'
                      value={city}
                      placeholder='City'
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      error={errors?.city}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label htmlFor='postcode'>Post Code</Label>
                    <Input
                      name='Postcode'
                      value={postcode}
                      placeholder='Postcode'
                      onChange={(e) => {
                        setPostcode(e.target.value);
                      }}
                      error={errors?.postcode}
                    />
                  </Group>
                  <Group>
                    <Label htmlFor='country'>Country</Label>
                    <Input
                      name='country'
                      value={country}
                      placeholder='Country'
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      error={errors?.country}
                    />
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col
          sm={12}
          lg={4}>
          <Card header='Occupation'>
            <CardBody>
              <Group>
                <Label htmlFor='role'>Role</Label>
                <Select
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'agent', label: 'Agent' },
                    { value: 'moderator', label: 'Moderator' },
                    { value: 'builder', label: 'Builder' },
                    { value: 'user', label: 'User' },
                  ]}
                  value={accType}
                  onChange={(value) => setAccType(value)}
                  error={errors?.accType}
                />
              </Group>
              <Group>
                <Label htmlFor='job'>Job Type</Label>
                <Select
                  options={[
                    {
                      value: 'incharge',
                      label: 'Licence Incharge (Class 1 only)',
                    },
                    {
                      value: 'agent',
                      label: 'Licence Real Estate Agent (Class 1 or Class 2)',
                    },
                    { value: 'assistant', label: 'Assistant Agent' },
                  ]}
                  name='job'
                  value={jobType}
                  onChange={(value) => setJobType(value)}
                  error={errors?.jobType}
                />
              </Group>
              <Group>
                <Label htmlFor='company'>Company</Label>
                <Input
                  name='company'
                  value={company}
                  placeholder='Company'
                  onChange={(e) => {
                    setCompany(e.target.value);
                  }}
                  error={errors?.company}
                />
              </Group>
              <Group>
                <Label for='licence'>Licence Number</Label>
                <Input
                  name='license'
                  value={licence}
                  onChange={(e) => setLicence(e.target.value)}
                  error={errors?.licence}
                />
              </Group>
              <Group>
                <Label htmlFor='group'>Group</Label>
                <Select
                  options={groups.map((group) => ({
                    value: group._id,
                    label: group.groupName,
                  }))}
                  value={group}
                  onChange={(value) => setGroup(value)}
                  error={errors?.group}
                />
              </Group>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </Container>
    </>
  );
};

export default Create;
