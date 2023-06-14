import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, ContentHeader, Row } from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Input, Label, Select } from '../../Components/Form';
import utils from '../../Utils';
import Toast from '../../Components/Toast';
import moment from 'moment';
import EditProfile from './EditProfile';
import * as GroupService from '../../Services/GroupService';

const ViewProfile = () => {
  const [page, setPage] = useState(1);
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [accType, setAccType] = useState();
  const [jobType, setJobType] = useState();
  const [licence, setLicence] = useState();
  const [verificationStatus, setVerificationStatus] = useState();
  const [company, setCompany] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [postcode, setPostcode] = useState();
  const [group, setGroup] = useState('');
  const { id } = useParams();

  const getGroupDetailById = (id) => {
    GroupService.getGroupDetailById(id).then((response) => {
      setGroup(response.groupName);
    });
  };

  const getUserDetailById = (id) => {
    UserService.getUserDetailById(id).then((response) => {
      setUser(response);
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
      getGroupDetailById(response.group);
    });
  };

  useEffect(() => {
    getUserDetailById(id);
  }, [id]);

  return (
    <>
      {page === 2 ? (
        <EditProfile page={setPage} />
      ) : (
        <>
          <ContentHeader
            headerTitle='My Profile'
            breadcrumb={[
              { name: 'User', link: '' },
              { name: 'Profile', link: `/profile/view/${id}`, active: true },
            ]}
            options={
              <Link
                className='btn btn-primary waves-effect waves-light'
                onClick={() => {
                  setPage(2);
                }}>
                Edit Profile
              </Link>
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
                      <h4 className='media-heading'>
                        {firstName} {lastName}
                      </h4>
                      <Row className='col-12 d-flex mt-1 px-0'>
                        <Col
                          sm={12}
                          md={6}>
                          <Group>
                            <Label htmlFor='email'>Email</Label>
                            <span name='email'>{email}</span>
                          </Group>
                        </Col>
                        <Col
                          sm={12}
                          md={6}>
                          <Group>
                            <Label htmlFor='mobile'>Mobile</Label>
                            <span name='mobile'>{mobileNo}</span>
                          </Group>
                        </Col>
                        <Col
                          sm={12}
                          md={6}>
                          <Group>
                            <Label htmlFor='phone'>Phone</Label>
                            <span name='phone'>{phoneNo}</span>
                          </Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <Row></Row>
                </CardBody>
              </Card>
              <Card header='Office Address'>
                <CardBody>
                  <Row>
                    <Col
                      sm={12}
                      md={6}>
                      <Group>
                        <Label htmlFor='address1'>Address line 1</Label>
                        <span name='address1'>{addressLine1}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='address2'>Address line 2</Label>
                        <span name='address2'>{addressLine2}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='city'>City</Label>
                        <span name='city'>{city}</span>
                      </Group>
                    </Col>
                    <Col
                      sm={12}
                      md={6}>
                      <Group>
                        <Label htmlFor='code'>Post Code</Label>
                        <span name='code'>{postcode}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='country'>Country</Label>
                        <span name='country'>{country}</span>
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
                        <Label htmlFor=''>Role</Label>
                        <span name=''>{accType}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='job'>Job Title</Label>
                        <span name='job'>{jobType}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='comapny'>Company</Label>
                        <span name='comapny'>{company}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='licence'>Licence Number</Label>
                        <span name='licence'>{licence}</span>
                      </Group>
                      <Group>
                        <Label htmlFor='licenceVerify'>
                          Licence Verification Status
                        </Label>
                        <span name='licenceVerify'>{verificationStatus}</span>
                      </Group>
                      <Group>
                        <Label htmlFor=''>Group</Label>
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
        </>
      )}
    </>
  );
};

export default ViewProfile;
