import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Modal,
  ContentHeader,
  Row,
  Alert,
} from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Input, Label, Select } from '../../Components/Form';
import * as AuthServices from '../../Services/AuthService';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import * as GroupService from '../../Services/GroupService';

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

const EditProfile = ({ page }) => {
  const [user, setUser] = useState();
  const [image, setImage] = useState({ avatar: '' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [accType, setAccType] = useState('');
  const [jobType, setJobType] = useState('');
  const [licence, setLicence] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [company, setCompany] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [group, setGroup] = useState('');
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const [modalStep, setModalStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const getGroupDetailById = (id) => {
    GroupService.getGroupDetailById(id).then((response) => {
      setGroup(response.groupName);
    });
  };

  const getUserDetailById = () => {
    UserService.getUserDetailById(id).then((response) => {
      setUser(response);
      response.avatar && setImage({ avatar: response.avatar });
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setMobileNo(response.mobileNo);
      setPhoneNo(response.phoneNo);
      setAccType(response.accType);
      setJobType(response.jobType);
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
      response.group && getGroupDetailById(response.group);
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

  var hideModal = (modalName) => {
    window.jQuery('#' + modalName).modal('hide');
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

    if (phoneNo && !utils.string.isValidMobile(phoneNo)) {
      errors = { ...errors, phoneNo: 'Please provide a valid phone number' };
      isValid = false;
    }

    if (mobileNo && !utils.string.isValidMobile(mobileNo)) {
      errors = { ...errors, mobileNo: 'Please provide a valid mobile number' };
      isValid = false;
    }

    if (!jobType) {
      errors = { ...errors, jobType: 'Please provide a job title' };
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

    if (newPassword != confirmNewPassword) {
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
    // setIsLoading(true);
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
        setCurrentPassword('');
        setModalStep(2);
      })
      .catch((response) => {
        if (
          response.response?.data?.error &&
          response.response?.data?.error.message
        ) {
          setAlertMessage('Password is incorrect');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (!isNewPasswordValid()) {
      setIsLoading(false);
      errorShake();
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
        hideModal('password_change_modal');
        setModalStep(1);
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage(error);
        setMessage();
        errorShake();
      })
      .finally(() => setIsLoading(false));
  };

  const changeEmail = (e) => {
    e.preventDefault();
    if (!isNewEmailValid()) {
      setIsLoading(false);
      errorShake();
      return;
    }

    const body = {
      email: newEmail,
    };

    UserService.updateUser(id, body)
      .then((response) => {
        getUserDetailById(id);
        setErrors();
        setModalStep(1);
        hideModal('email_change_modal');
        setEmail(newEmail);
        setNewEmail('');
        Toast('Email has been updated successfully!', 'success');
      })
      .catch((error) => {
        setAlertMessage(error);
        setMessage();
        errorShake();
      })
      .finally(() => setIsLoading(false));
  };

  const verifyCompany = (e) => {
    e.preventDefault();

    UserService.requestChange({
      userId: id,
      company: newCompany,
    })
      .then((response) => {
        console.log(response);
        setMessage(response.message);
        setAlertMessage();
        setNewCompany();
      })
      .catch((error) => {
        console.log(error);
        setAlertMessage(error);
        setMessage();
      });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setImage({ ...image, avatar: base64 });
  };

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isValid()) {
      setIsLoading(false);
      errorShake();
      return;
    }

    const body = {
      avatar: image.avatar,
      firstName: firstName,
      lastName: lastName,
      jobType: jobType,
      mobileNo: mobileNo,
      phoneNo: phoneNo,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      country: country,
      postcode: postcode,
    };

    UserService.updateUser(id, body)
      .then((response) => {
        Toast('User has been updated successfully!', 'success');
        getUserDetailById(id);
        navigate(`/profile/${id}`);
        setErrors();
      })
      .catch((error) => {
        console.log(error);
        Toast('Failed to update user!', 'danger');
        errorShake();
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
          { name: 'Profile', link: '/profile' },
          { name: 'Edit Profile', active: true },
        ]}
        options={
          <div className='col-12 d-flex mt-1 px-0'>
            <Link
              type='reset'
              className='btn waves-effect waves-light mr-75'
              to={`/profile/${id}`}>
              Cancel
            </Link>
            <Button
              type='submit'
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
                    src={
                      image.avatar ||
                      `${process.env.REACT_APP_PUBLIC_URL}/assets/images/avatar.jpg`
                    }
                    alt=''
                    height='90'
                    width='90'
                  />

                  <input
                    type='file'
                    label='image'
                    id='file-upload'
                    accept='image/*'
                    onChange={(e) => handleFileUpload(e)}
                  />
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
                    <Label for='email'>Email</Label>
                    <span
                      className='float-right'
                      name='email'
                      data-backdrop='true'
                      data-target='#email_change_modal'
                      data-toggle='modal'
                      onClick={() => {
                        setModalStep(1)
                        setAlertMessage()
                        setMessage()
                      }}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Change</u>
                      </i>
                    </span>
                    <div name='email'>{email}</div>
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <label htmlFor='password'>Password</label>
                    <span
                      className='float-right'
                      name='password'
                      data-backdrop='true'
                      data-target='#password_change_modal'
                      data-toggle='modal'
                      onClick={() => {
                        setModalStep(1)
                        setAlertMessage()
                        setMessage()
                      }}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Change</u>
                      </i>
                    </span>
                  </Group>
                </Col>
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
                      error={errors?.phoneNo}
                    />
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
        <Col
          sm={12}
          md={4}>
          <Card header='Occupation'>
            <CardBody>
              <Row>
                <Col>
                  <Group>
                    <Label htmlFor='role'>Role</Label>
                    <div name='role'>{accType}</div>
                  </Group>
                  <Group>
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
                        { value: 'assistant', label: 'Assistant Agent' },
                      ]}
                      name='job'
                      value={jobType}
                      onChange={(value) => setJobType(value)}
                      error={errors?.jobType}
                    />
                  </Group>
                  <Group>
                    <Label htmlFor='company'>
                      <Label htmlFor='company'>Company</Label>
                    </Label>
                    <div
                      name='company'
                      className='float-right'
                      data-backdrop='true'
                      data-target='#company_change_modal'
                      data-toggle='modal'
                      onClick={() => {
                        setModalStep(1)
                        setAlertMessage()
                        setMessage()
                      }}
                      style={{ cursor: 'pointer' }}>
                      <i>
                        <u>Request change</u>
                      </i>
                    </div>
                    <div name='company'>{company}</div>
                  </Group>
                  <Group>
                    <Label htmlFor='licence'>Licence Number</Label>
                    <div name='licence'>{licence}</div>
                  </Group>
                  <Group>
                    <Label htmlFor='licenceVerify'>
                      Licence Verification Status
                    </Label>
                    <div name='licenceVerify'>{verificationStatus}</div>
                  </Group>
                  <Group>
                    <Label htmlFor='group'>Group</Label>
                    <div name='group'>
                      {group ? (
                        <div>{group}</div>
                      ) : (
                        <div>You are not in any group</div>
                      )}
                    </div>
                  </Group>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        id='password_change_modal'
        title='Change Password'
        size='lg'
        isStatic>
        {modalStep === 1 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <p>Please enter your password to access this</p>
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
                  onClick={validatePassword}>
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
                  />
                )}
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
                  type='submit'
                  onClick={changePassword}>
                  Change Password
                </Button>
              </Group>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        id='email_change_modal'
        title='Change Email'
        size='lg'
        isStatic>
        {modalStep === 1 && (
          <Row>
            <Col
              sm={12}
              md={8}>
              <Group>
                <p>Please enter your password to access this</p>
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
                  onClick={validatePassword}>
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
                  />
                )}
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
                  onClick={changeEmail}>
                  Change Email
                </Button>
              </Group>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        id='company_change_modal'
        title='Change Your Company'
        size='lg'
        isStatic>
        <Row>
          <Col
            sm={12}
            md={8}>
            <Group>
              <p>Please enter your company</p>
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
                />
              )}
              <Label>
                Company Name:
                <Input
                  className='mr-75'
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  error={errors?.newCompany}
                />
              </Label>
              <Button
                className='btn btn-outline-primary btn-inline mr-75'
                type='submit'
                onClick={verifyCompany}>
                Request change
              </Button>
            </Group>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default EditProfile;
