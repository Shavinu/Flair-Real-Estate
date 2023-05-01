import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, ContentHeader, DatePicker, Row } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";
import * as UserService from '../../../Services/UserService';
import * as GroupService from '../../../Services/GroupService';
import { Group, Input, Label, Select } from "../../../Components/Form";
import utils from "../../../Utils";
import Toast from "../../../Components/Toast";
import moment from "moment";

const Edit = () => {
  const [user, setUser] = useState();
  const [groups, setGroups] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [accType, setAccType] = useState('');
  const [birthday, setBirthday] = useState('');
  const [company, setCompany] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postcode, setPostcode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [group, setGroup] = useState('');

  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams();

  const getUserDetailById = (id) => {
    UserService.getUserDetailById(id)
      .then((response) => {
        setUser(response);
        setFirstName(response.firstName);
        setLastName(response.lastName);
        setEmail(response.email);
        setPhoneNo(response.phoneNo);
        setAccType(response.accType);
        setBirthday(response.birthday);
        setCompany(response.company);
        setAddressLine1(response.addressLine1);
        setAddressLine2(response.addressLine2);
        setCity(response.city);
        setCountry(response.country);
        setPostcode(response.postcode);
        setGroup(response.group);
      })
  }

  const getGroupList = () => {
    GroupService.getGroupList()
      .then(response => {
        setGroups(response);
      })
  }

  const onChangeBirthday = (value: any) => {
    setBirthday(moment(value).toISOString());
  }

  const isValid = () => {
    let isValid = true;
    let errors = {}

    if (!email) {
      errors = { ...errors, email: 'Please provide email address!' }
      isValid = false
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!firstName) {
      errors = { ...errors, firstName: 'Please provide your first name!' }
      isValid = false
    }

    if (!lastName) {
      errors = { ...errors, lastName: 'Please provide your last name!' }
      isValid = false
    }

    if (!phoneNo) {
      errors = { ...errors, phoneNo: 'Please provide your phone number!' }
      isValid = false
    }

    if (!accType) {
      errors = { ...errors, lastName: 'Please select role!' }
      isValid = false
    }

    if (password && confirmationPassword !== password) {
      errors = { ...errors, confirmationPassword: 'Password not match!' }
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

    const body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo,
      accType: accType,
      company: company,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      country: country,
      postcode: postcode,
    }

    if (birthday) {
      body.birthday = birthday
    }

    if (group) {
      body.group = group
    }

    if (password) {
      body.password = password;
    }

    UserService.updateUser(id, body)
      .then(response => {
        Toast('User has been updated successfully!', 'success');
        getUserDetailById(id);
        setErrors();
      })
      .catch(() => {
        Toast('Failed to update user!', 'danger');
      })
      .finally(() =>
        setIsLoading(false)
      )
  }

  useEffect(() => {
    getGroupList();
  }, []);

  useEffect(() => {
    id && getUserDetailById(id);
  }, [id]);

  return <>
    <ContentHeader headerTitle="Edit User"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Users", link: "/users" },
        { name: "Edit", active: true },
      ]}
      options={<Button className="btn btn-primary waves-effect waves-light"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Save
      </Button>}
    />
    <Row>
      <Col sm={12} lg={8}>
        <Card header="Account">
          <CardBody>
            <div className="media mb-2">
              <div className="mr-2 my-25">
                <img src={`${process.env.REACT_APP_PUBLIC_URL}/assets/images/default/avatar.jpg`}
                  alt="users avatar"
                  className="users-avatar-shadow rounded"
                  height="90"
                  width="90"
                />
              </div>
              <div className="media-body mt-50">
                <h4 className="media-heading">{user?.firstName} {user?.lastName}</h4>
                <div className="col-12 d-flex mt-1 px-0">
                  <Button className="btn btn-primary mr-75">Change</Button>
                  <Button className="btn btn-outline-danger mr-75">Remove</Button>
                </div>
              </div>
            </div>

            <Row>
              <Col sm={12} md={6}>
                <Group>
                  <Label for="firstname">First Name (*)</Label>
                  <Input name="firstName"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    error={errors?.firstName}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label for="lastName">Last Name (*)</Label>
                  <Input name="lastName"
                    value={lastName}
                    placeholder="Last Name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    error={errors?.lastName}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label for="email">Email (*)</Label>
                  <Input name="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    error={errors?.email}
                  />
                </Group>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card header="More Information">
          <CardBody>
            <Row>
              <Col sm={12} md={6}>
                <h5>Personal Information</h5>
                <Group>
                  <Label for="phoneNo">Phone Number (*)</Label>
                  <Input name="phoneNo"
                    value={phoneNo}
                    placeholder="Phone Number"
                    onChange={(e) => {
                      setPhoneNo(e.target.value);
                    }}
                    error={errors?.phoneNo}
                  />
                </Group>

                <Group>
                  <Label for="company">Company</Label>
                  <Input name="company"
                    value={company}
                    placeholder="Company"
                    onChange={(e) => {
                      setCompany(e.target.value);
                    }}
                    error={errors?.company}
                  />
                </Group>

                <Group>
                  <Label for="birthday">Birthday</Label>
                  <DatePicker onChange={onChangeBirthday}
                    value={birthday}
                    options={{
                      dateFormat: "d-m-Y",
                    }}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <h5>Address</h5>
                <Group>
                  <Label for="address_line_1">Address line 1</Label>
                  <Input name="address_line_1"
                    value={addressLine1}
                    placeholder="Address Line 1"
                    onChange={(e) => {
                      setAddressLine1(e.target.value);
                    }}
                    error={errors?.addressLine1}
                  />
                </Group>
                <Group>
                  <Label for="address_line_1">Address line 2</Label>
                  <Input name="address_line_1"
                    value={addressLine2}
                    placeholder="Address Line 2"
                    onChange={(e) => {
                      setAddressLine2(e.target.value);
                    }}
                    error={errors?.addressLine2}
                  />
                </Group>
                <Group>
                  <Label for="city">City</Label>
                  <Input name="city"
                    value={city}
                    placeholder="City"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                    error={errors?.city}
                  />
                </Group>
                <Group>
                  <Label for="country">Country</Label>
                  <Input name="country"
                    value={country}
                    placeholder="Country"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                    error={errors?.country}
                  />
                </Group>
                <Group>
                  <Label for="postcode">Post Code</Label>
                  <Input name="Postcode"
                    value={postcode}
                    placeholder="Postcode"
                    onChange={(e) => {
                      setPostcode(e.target.value);
                    }}
                    error={errors?.postcode}
                  />
                </Group>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm={12} lg={4}>
        <Card header="Settings">
          <CardBody>
            <Group>
              <Label for="role">Role</Label>
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
              <Label for="group">Group</Label>
              <Select
                options={groups.map(group => ({ value: group._id, label: group.groupName }))}
                value={group}
                onChange={(value) => setGroup(value)}
                error={errors?.group}
              />
            </Group>
          </CardBody>
        </Card>

        <Card header="Password">
          <CardBody>
            <Group>
              <Label for="password">Password</Label>
              <Input name="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                error={errors?.password}
                autoComplete={'new-password'}
              />
            </Group>
            <Group>
              <Label for="password_confirmation">Confirm Password</Label>
              <Input name="password_confirmation"
                type="password"
                value={confirmationPassword}
                onChange={(e) => {
                  setConfirmationPassword(e.target.value);
                }}
                error={errors?.confirmationPassword}
              />
            </Group>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
}

export default Edit;
