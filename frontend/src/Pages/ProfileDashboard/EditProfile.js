import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button, Card, Col, Modal, ContentHeader, Row } from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Input, Label, Select } from '../../Components/Form';
import * as AuthServices from '../../Services/AuthService';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import moment from 'moment';

const EditProfile = ({ page }) => {
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [accType, setAccType] = useState("");
  const [licence, setLicence] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [company, setCompany] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  // const [password, setPassword] = useState();
  // const [confirmationPassword, setConfirmationPassword] = useState();

  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [alertMessage, setAlertMessage] = useState('');

  const getUserDetailById = () => {
    UserService.getUserDetailById(id).then((response) => {
      setUser(response);
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setMobileNo(response.mobileNo);
      setPhoneNo(response.phoneNo);
      setAccType(response.accType);
      setLicence(response.licence);
      response.verifiedLicence
        ? setVerificationStatus('Verified')
        : setVerificationStatus('Unverified');
      setCompany(response.company);
      setAddressLine1(response.addressLine1);
      setAddressLine2(response.addressLine2);
      setCity(response.city);
      setCountry(response.country);
      setPostcode(response.postcode);
    });
  };

  const onCancel = (e) => {
    page(1);
  };

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!firstName) {
      errors = { ...errors, firstName: 'Please provide your first name' };
      isValid = false;
    }

    if (!lastName) {
      errors = { ...errors, lastName: 'Please provide your last name' };
      isValid = false;
    }

    if (!phoneNo) {
      errors = { ...errors, phoneNo: 'Please provide your phone number' };
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const isCurrPasswordValid = () => {
    let isValid = true;
    let errors = {};

    if (!currentPassword) {
      errors = { ...errors, currentPassword: 'Please enter your password' };
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const isNewPasswordValid = () => {
    let isValid = true;
    let errors = {};

    if (!newPassword) {
      errors = { ...errors, newPassword: 'Please enter a new password' };
      isValid = false;
    }
    if (!confirmNewPassword) {
      errors = { ...errors, confirmNewPassword: 'Please confirm new password' };
      isValid = false;
    }

    if(newPassword != confirmNewPassword){
      errors = { ...errors, confirmNewPassword: 'Password does not match' };
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const isNewEmailValid = () => {
    let isValid = true;
    let errors = {};

    if (!newEmail) {
      errors = { ...errors, newEmail: 'Please provide new email address' };
      isValid = false;
    }

    if (newEmail && !utils.string.isValidEmail(newEmail)) {
      errors = { ...errors, email: 'Please provide a valid email address' };
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const validatePassword = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isCurrPasswordValid()) {
      setIsLoading(false);
      return;
    }
    AuthServices.login({
      email: email,
      password: currentPassword,
    })
      .then((response) => {
        setAlertMessage();
        setCurrentPassword("");
        setModalStep(2);
        Toast('Login successfully!', 'success');
      })
      .catch((response) => {
        if (response.response?.data?.error && response.response?.data?.error.message) {
          setAlertMessage(response.response.data.error.message);
        }
        Toast('Password is incorrect', 'warning');
      })
      .finally(() => setIsLoading(false));
  };

  const changePassword = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isNewPasswordValid()) {
      setIsLoading(false);
      return;
    }

    const body = {
      password: newPassword,
    };

    UserService.updateUser(id, body)
      .then((response) => {
        Toast('Password has been updated successfully!', 'success');
        getUserDetailById(id);
        setErrors();
        // setShowPasswordChangeModal(false);
        setModalStep(1);
        setNewPassword("");
        setConfirmNewPassword("");
      })
      .catch(() => {
        Toast('Failed to update password!', 'danger');
      })
      .finally(() => setIsLoading(false));
  };

  const changeEmail = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isNewEmailValid()) {
      setIsLoading(false);
      return;
    }

    const body = {
      email: newEmail,
    };

    UserService.updateUser(id, body)
      .then((response) => {
        Toast('Email has been updated successfully!', 'success');
        getUserDetailById(id);
        setErrors();
        setModalStep(1);
        // setShowEmailChangeModal(false);
        setEmail(newEmail);
        setNewEmail("");
      })
      .catch(() => {
        Toast('Failed to update email', 'danger');
      })
      .finally(() => setIsLoading(false));
  };

  const addMobile = () => {
    console.log('add mobile');
  };

  const changeLicence = () => {
    console.log('change licence');
  };


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
      // email: email,
      mobileNo: mobileNo,
      phoneNo: phoneNo,
      // accType: accType,
      // company: company,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      country: country,
      postcode: postcode,
    };

    // if (password) {
    //   body.password = password;
    // }

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
                    <Label htmlFor='firstname'>
                      <h6>First Name</h6>
                    </Label>
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
                    <Label htmlFor='lastName'>
                      <h6>Last Name</h6>
                    </Label>
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
                    <label htmlFor='email'>
                      <h6>Email</h6>
                    </label>
                    <span
                      className='float-right'
                      name="email"
                      data-backdrop="true"
                      data-target="#email_change_modal"
                      data-toggle="modal"
                      onClick={() => setModalStep(1)}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Change</u>
                      </i>
                    </span>
                    <div name='email'>{email}</div>
                    {/* <Label htmlFor='email'>Email (*)</Label>
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
                    <label htmlFor='password'>
                      <h6>Password</h6>
                    </label>
                    <span
                      className='float-right'
                      name='password'
                      data-backdrop="true"
                      data-target="#password_change_modal"
                      data-toggle="modal"
                      onClick={() => setModalStep(1)}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Change</u>
                      </i>
                    </span>
                    {/* <Label htmlFor='password'>Password</Label>
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
                    <Label htmlFor='mobile'>
                      <h6>Mobile</h6>
                    </Label>
                    <span>
                      {mobileNo ? (
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
                          style={{ cursor: 'pointer' }}>
                          <i>
                            <u>Add Mobile</u>
                          </i>
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
                    <Label htmlFor='phone'>
                      <h6>Phone</h6>
                    </Label>
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
                  <Group>
                    <h6>Role</h6>
                    <span>{accType}</span>
                  </Group>
                  <Group>
                    <Label htmlFor='company'>
                      <h6>Company</h6>
                    </Label>
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
                    <Label htmlFor='licence'>Licence</Label>
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
                    <Label htmlFor='licence'>
                      <h6>Licence</h6>
                    </Label>
                    <span
                      name='licence'
                      className='float-right'
                      onClick={changeLicence}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Change</u>
                      </i>
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

          <Card header='Office Address'>
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
      </Row>

      <Modal
        id='password_change_modal'
        show={showPasswordChangeModal}
        setShow={setShowPasswordChangeModal}
        title='Change Password'
        size='lg'
        isStatic>
        {modalStep === 1 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <p>Please enter your password to access this.</p>
                <Label>
                  Current Password:
                  <Input
                    className='mr-75'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={errors?.currentPassword}
                  />
                </Label>
                <Button
                  className='btn btn-outline-primary btn-inline mr-75'
                  type='submit'
                  onClick={validatePassword}
                  >
                  Next
                </Button>
              </Group>
            </Col>
          </Row>
        )}
        {modalStep === 2 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <Label>
                  New Password:
                  <Input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors?.newPassword}
                  />
                </Label>
                <Label>
                  Confirm New Password:
                  <Input
                    type='password'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    error={errors?.confirmNewPassword}
                  />
                </Label>
                <Button
                  className='btn btn-outline-primary btn-inline'
                  type='submit'ord
                  onClick={changePassword}
                  >
                  Change Password
                </Button>
              </Group>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        id='email_change_modal'
        show={showEmailChangeModal}
        setShow={setShowEmailChangeModal}
        title='Change Email'
        size='lg'
        isStatic>
        {modalStep === 1 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <p>Please enter your password to access this.</p>
                <Label>
                  Password:
                  <Input
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={errors?.currentPassword}
                  />
                </Label>
                <Button
                  className='btn btn-outline-primary btn-inline'
                  type='submit'
                  onClick={validatePassword}
                  >
                  Next
                </Button>
              </Group>
            </Col>
          </Row>
        )}
        {modalStep === 2 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <Label>
                  New Email:
                  <Input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    error={errors?.newEmail}
                  />
                </Label>
                <Button
                  className='btn btn-outline-primary btn-inline'
                  type='submit'
                  onClick={changeEmail}
                  >
                  Change Email
                </Button>
              </Group>
            </Col>
          </Row>
        )}
      </Modal>
    </>
  );
};

export default EditProfile;
