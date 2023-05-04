import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  ContentHeader,
  Row,
} from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Input, Label, Select } from '../../Components/Form';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import moment from 'moment';

const EditProfile = ({ page }) => {
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [accType, setAccType] = useState();
  const [licence, setLicence] = useState();
  const [verificationStatus, setVerificationStatus] = useState();
  const [company, setCompany] = useState();
  // const [addressLine1, setAddressLine1] = useState();
  // const [addressLine2, setAddressLine2] = useState();
  // const [city, setCity] = useState();
  // const [country, setCountry] = useState();
  // const [postcode, setPostcode] = useState();
  const [password, setPassword] = useState();
  const [confirmationPassword, setConfirmationPassword] = useState();

  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const getUserDetailById = () => {
    UserService.getUserDetailById(id).then((response) => {
      setUser(response);
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setMobileNo(response.mobileNo)
      setPhoneNo(response.phoneNo);
      setAccType(response.accType);
      setLicence(response.licence)
      response.verifiedLicence ? setVerificationStatus("Verified") : setVerificationStatus("Unverified")
      setCompany(response.company);
      // setAddressLine1(response.addressLine1);
      // setAddressLine2(response.addressLine2);
      // setCity(response.city);
      // setCountry(response.country);
      // setPostcode(response.postcode);
    });
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

    // if (!accType) {
    //   errors = { ...errors, lastName: 'Please select role!' };
    //   isValid = false;
    // }

    if (password && confirmationPassword !== password) {
      errors = { ...errors, confirmationPassword: 'Password not match!' };
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const onCancel = (e) =>{
    page(1);
  }

  const changeLicence = () => {
    console.log("change licence")
  }

  const changeEmail = () => {
    console.log("change email")
  }

  const changePassword = () => {
    console.log("change password")
  }

  const addMobile = () => {
    console.log("add mobile")
  }

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      return;
    }

    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobileNo: mobileNo,
      phoneNo: phoneNo,
      accType: accType,
      company: company,
      // addressLine1: addressLine1,
      // addressLine2: addressLine2,
      // city: city,
      // country: country,
      // postcode: postcode,
    };

    if (password) {
      body.password = password;
    }

    UserService.updateUser(id, body)
      .then((response) => {
        Toast('User has been updated successfully!', 'success');
        getUserDetailById(id);
        setErrors();
      })
      .catch(() => {
        Toast('Failed to update user!', 'danger');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getUserDetailById(id);
  }, [id]);

  return (
    <>
      <ContentHeader
        headerTitle='Edit Profile'
        breadcrumb={[
          { name: 'Home', link: '/' },
          { name: 'Profile', link: `/profile/edit/${id}`, active: true },
        ]}
        options={
          <div className='col-12 d-flex mt-1 px-0'>
            <Button
              type='reset'
              className='btn waves-effect waves-light mr-75'
              onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className='btn btn-primary waves-effect waves-light mr-75'
              onClick={onSubmit}
              isLoading={isLoading}>
              Save
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
                    alt='avatar'
                    className='users-avatar-shadow rounded'
                    height='90'
                    width='90'
                  />
                </div>
                <div className='media-body mt-50'>
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
                    <Label for='firstname'><h6>First Name</h6></Label>
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
                    <Label for='lastName'><h6>Last Name</h6></Label>
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
                    <label for='email'><h6>Email</h6></label>
                    <span
                    className='float-right'
                    onClick={changeEmail}
                    style={{'cursor': 'pointer'}}>
                      <i><u>Change</u></i>
                    </span>
                    <div name='email'>{email}</div>
                    {/* <Label for='email'>Email (*)</Label>
                    <Input
                      name='email'
                      value={email}
                      placeholder='Email'
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      error={errors?.email}
                    /> */}
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <label for='password'><h6>Password</h6></label>
                    <span
                    className='float-right'
                    name='password'
                    onClick={changePassword}
                    style={{'cursor': 'pointer'}}>
                      <i><u>Change</u></i>
                    </span>
                    {/* <Label for='password'>Password</Label>
                    <Input
                      name='Password'
                      type='password'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      error={errors?.password}
                    /> */}
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label for='mobile'><h6>Mobile</h6></Label>
                    <span>{
                      mobileNo ? (
                        <Input
                        name='mobile'
                        value={mobileNo}
                        placeholder='Mobile Number'
                        onChange={(e) => {
                          setMobileNo(e.target.value);
                        }}
                        error={errors?.mobileNo}
                      />
                      ) : (
                        <span
                        className='float-right'
                        onClick={addMobile}
                        style={{'cursor': 'pointer'}}>
                          <i><u>Add Mobile</u></i>
                        </span>
                      )}
                    </span>
                    <div name='mobile'>{mobileNo}</div>
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label for='phone'><h6>Phone</h6></Label>
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
                <Col
                sm={12}
                md={6}>
                  {/* <Group>
                    <Label for='role'>Role (*)</Label>
                    <Select
                      options={[
                        { value: 'agent', label: 'Agent' },
                        { value: 'builder', label: 'Builder' },
                      ]}
                      value={accType}
                      onChange={(value) => setAccType(value)}
                      error={errors?.accType}
                    />
                  </Group> */}
                  <Group>
                    <h6>Role</h6>
                    <span>{accType}</span>
                  </Group>
                  <Group>
                    <Label for='company'><h6>Company</h6></Label>
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
                </Col>
                <Col
                sm={12}
                md={6}>
                  {/* <Group>
                    <Label for='licence'>Licence</Label>
                    <Input
                      name='licnece'
                      value={licence}
                      placeholder='Licence Number'
                      onChange={(e) => {
                        setLicence(e.target.value);
                      }}
                      error={errors?.licence}
                    />
                  </Group> */}
                  <Group>
                    <Label for='licence'><h6>Licence</h6></Label>
                    <span
                    name='licence'
                    className='float-right'
                    onClick={changeLicence}
                    style={{'cursor': 'pointer'}}>
                      <i><u>Change</u></i>
                    </span>
                    <div>{licence}</div>
                  </Group>
                  <Group>
                    <h6>Licence Verification Status</h6>
                    <span>{verificationStatus}</span>
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* <Card header='More Information'>
            <CardBody>
              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <h5>Personal Information</h5>
                  <Group>
                    <Label for='phoneNo'>Phone Number (*)</Label>
                    <Input
                      name='phoneNo'
                      value={phoneNo}
                      placeholder='Phone Number'
                      onChange={(e) => {
                        setPhoneNo(e.target.value);
                      }}
                      error={errors?.phoneNo}
                    />
                  </Group>




                  {/* <Group>
                    <Label for='postcode'>Post Code</Label>
                    <Input
                      name='Postcode'
                      value={postcode}
                      placeholder='Postcode'
                      onChange={(e) => {
                        setPostcode(e.target.value);
                      }}
                      error={errors?.postcode}
                    />
                  </Group><Group>
                    <Label for='birthday'>Birthday</Label>
                    <DatePicker
                      onChange={onChangeBirthday}
                      value={birthday}
                      options={{
                        dateFormat: 'd-m-Y',
                      }}
                    />
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <h5>Address</h5>
                  <Group>
                    <Label for='address_line_1'>Address line 1</Label>
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
                    <Label for='address_line_1'>Address line 2</Label>
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
                    <Label for='city'>City</Label>
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
                  <Group>
                    <Label for='country'>Country</Label>
                    <Input
                      name='country'
                      value={country}
                      placeholder='Country'
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      error={errors?.country}
                    />
                  </Group> */}
                </Col>
              </Row>
            {/* </CardBody>
          </Card> */}
        {/* </Col> */}
        {/* <Col
          sm={12}
          lg={4}>
          <Card header='Settings'>
            <CardBody>
              <Group>
                <Label for='role'>Role</Label>
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
            </CardBody>
          </Card>

          <Card header='Password'>
            <CardBody>
              <Group>
                <Label for='password'>Password</Label>
                <Input
                  name='Password'
                  type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  error={errors?.password}
                />
              </Group>
              <Group>
                <Label for='password_confirmation'>Confirm Password</Label>
                <Input
                  name='password_confirmation'
                  type='password'
                  value={confirmationPassword}
                  onChange={(e) => {
                    setConfirmationPassword(e.target.value);
                  }}
                  error={errors?.confirmationPassword}
                />
              </Group>
            </CardBody>
          </Card>
        </Col> */}
      {/* </Row> */}
    </>
  );
};

export default EditProfile;
