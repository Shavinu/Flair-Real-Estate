import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  ContentHeader,
  DatePicker,
  Row,
} from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Input, Label, Select } from '../../Components/Form';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import moment from 'moment';

const ViewProfile = () => {
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [accType, setAccType] = useState();
  const [licence, setLicence] = useState();
  const [verificationStatus, setVerificationStatus] = useState();
  // const [birthday, setBirthday] = useState();
  const [company, setCompany] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [postcode, setPostcode] = useState();
  const [password, setPassword] = useState();
  const [confirmationPassword, setConfirmationPassword] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const getUserDetailById = (id) => {
    UserService.getUserDetailById(id).then((response) => {
      setUser(response);
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setPhoneNo(response.phoneNo);
      setAccType(response.accType);
      setLicence(response.licence)
      setVerificationStatus(response.verifiedlicence)
      // setBirthday(response.birthday);
      // setCompany(response.company);
      setCompany("LJ Hooker")
      setAddressLine1(response.addressLine1);
      setAddressLine2(response.addressLine2);
      setCity(response.city);
      setCountry(response.country);
      setPostcode(response.postcode);
    });
  };

  // const onChangeBirthday = (value: any) => {
  //   console.log(value);
  //   setBirthday(moment(value).toISOString());
  // };

  // const isValid = () => {
  //   let isValid = true;
  //   let errors = {};

  //   if (!email) {
  //     errors = { ...errors, email: 'Please provide email address!' };
  //     isValid = false;
  //   }

  //   if (email && !utils.string.isValidEmail(email)) {
  //     errors = { ...errors, email: 'Please provide a valid email address!' };
  //     isValid = false;
  //   }

  //   if (!firstName) {
  //     errors = { ...errors, firstName: 'Please provide your first name!' };
  //     isValid = false;
  //   }

  //   if (!lastName) {
  //     errors = { ...errors, lastName: 'Please provide your last name!' };
  //     isValid = false;
  //   }

  //   if (!phoneNo) {
  //     errors = { ...errors, phoneNo: 'Please provide your phone number!' };
  //     isValid = false;
  //   }

  //   if (!accType) {
  //     errors = { ...errors, lastName: 'Please select role!' };
  //     isValid = false;
  //   }

  //   if (password && confirmationPassword !== password) {
  //     errors = { ...errors, confirmationPassword: 'Password not match!' };
  //     isValid = false;
  //   }

  //   setErrors(errors);
  //   return isValid;
  // };

  // const onSubmit = (e) => {
  //   setIsLoading(true);
  //   e.preventDefault();
  //   if (!isValid()) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   const body = {
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email,
  //     phoneNo: phoneNo,
  //     accType: accType,
  //     birthday: birthday,
  //     company: company,
  //     addressLine1: addressLine1,
  //     addressLine2: addressLine2,
  //     city: city,
  //     country: country,
  //     postcode: postcode,
  //   };

  //   if (password) {
  //     body.password = password;
  //   }

  //   UserService.updateUser(id, body)
  //     .then((response) => {
  //       Toast('User has been updated successfully!', 'success');
  //       getUserDetailById(id);
  //       setErrors();
  //     })
  //     .catch(() => {
  //       Toast('Failed to update user!', 'danger');
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  useEffect(() => {
    getUserDetailById(id);
  }, [id]);

  return (
    <>
      <ContentHeader
        headerTitle='My Profile'
        breadcrumb={[
          { name: 'Home', link: '/' },
          { name: 'Profile', link: `/profile/view/${id}`, active: true },
        ]}
        // options={
        //   <Button
        //     className='btn btn-primary waves-effect waves-light'
        //     onClick={onSubmit}
        //     isLoading={isLoading}>
        //     Save
        //   </Button>
        // }
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
                  <row className='col-12 d-flex mt-1 px-0'>
                    <Col
                     sm={12}
                     md={6}>
                      <Group>
                        <h6>Email</h6>
                        <span>{email}</span>
                      </Group>
                    </Col>
                    <Col
                     sm={12}
                     md={6}>
                      <Group>
                        <h6>Phone</h6>
                        <span>{phoneNo}</span>
                      </Group>
                     </Col>
                  </row>
                </div>
              </div>

              <Row>
                {/* <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <Label for='firstname'>First Name (*)</Label>
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
                    <Label for='lastName'>Last Name (*)</Label>
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
                </Col> */}
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <h6>Role</h6>
                    <span>{accType}</span>
                  </Group>
                  <Group>
                    <h6>Company</h6>
                    <span>{company}</span>
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  {/* <Group>
                    <h6>Email</h6>
                    <span>{email}</span>
                  </Group> */}
                  <Group>
                    <h6>License Number</h6>
                    <span>{licence}</span>
                  </Group>
                  <Group>
                    <h6>License Verification Status</h6>
                    <span>{verificationStatus}</span>
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* <Card header='Personal Information'>
            <CardBody>
              <Row>
                <Col
                  sm={12}
                  md={6}>
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
                  </Group>
                  <Group>
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
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card> */}
        </Col>
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
      </Row>
    </>
  );
};

export default ViewProfile;
