import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Button, Card, Col, ContentHeader, Row } from '../../Components';
import CardBody from '../../Components/Card/CardBody';
import * as UserService from '../../Services/UserService';
import { Group, Label, Select } from '../../Components/Form';
import * as GroupService from '../../Services/GroupService';

const ViewProfile = () => {
  const [user, setUser] = useState();
  const [image, setImage] = useState({avatar: ""});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [accType, setAccType] = useState('');
  const [jobType, setJobType] = useState('');
  const [licence, setLicence] = useState();
  const [verificationStatus, setVerificationStatus] = useState('');
  const [company, setCompany] = useState('');
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
      response.avatar && setImage({avatar: response.avatar});
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setMobileNo(response.mobileNo);
      setPhoneNo(response.phoneNo);
      setAccType(response.accType);
      if(response.jobType === 'incharge'){
        setJobType('Licence Incharge (Class 1 only)');
      } else if (response.jobType === 'agent'){
        setJobType('Licence Real Estate Agent (Class 1 or Class 2)')
      } else if (response.jobType === 'assistant'){
        setJobType('Assistant Agent')
      }
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

  useEffect(() => {
    getUserDetailById(id);
  }, [id]);

  return (
        <>
        <Container className="content-container">
          <ContentHeader
            headerTitle='My Profile'
            breadcrumb={[
              { name: 'Home', link: '/' },
              { name: 'Profile', active: true },
            ]}
            options={
              <Link
                className='btn btn-primary waves-effect waves-light'
                to={`/profile/edit/${id}`}>
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
                      src={
                        image.avatar || `${process.env.REACT_APP_PUBLIC_URL}/assets/images/avatar.jpg`
                      }
                      alt=''
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
                            <p name='email'>{email}</p>
                          </Group>
                        </Col>
                        <Col
                          sm={12}
                          md={6}>
                          <Group>
                            <Label htmlFor='mobile'>Mobile</Label>
                            <p name='mobile'>{mobileNo}</p>
                          </Group>
                        </Col>
                        <Col
                          sm={12}
                          md={6}>
                          <Group>
                            <Label htmlFor='phone'>Phone</Label>
                            <p name='phone'>{phoneNo}</p>
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
                        <p name='address1'>{addressLine1}</p>
                      </Group>
                      <Group>
                        <Label htmlFor='address2'>Address line 2</Label>
                        <p name='address2'>{addressLine2}</p>
                      </Group>
                      <Group>
                        <Label htmlFor='city'>City</Label>
                        <p name='city'>{city}</p>
                      </Group>
                    </Col>
                    <Col
                      sm={12}
                      md={6}>
                      <Group>
                        <Label htmlFor='code'>Post Code</Label>
                        <p name='code'>{postcode}</p>
                      </Group>
                      <Group>
                        <Label htmlFor='country'>Country</Label>
                        <p name='country'>{country}</p>
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
                        <Label for='acc'>Role</Label>
                        <p name='acc'>{accType}</p>
                      </Group>
                      <Group>
                        <Label for='job'>Job Title</Label>
                        <p name='job'>{jobType}</p>
                      </Group>
                      <Group>
                        <Label for='company'>Company</Label>
                        <p name='company'>{company}</p>
                      </Group>
                      <Group>
                        <Label for='licence'>Licence Number</Label>
                        <p name='licence'>{licence}</p>
                      </Group>
                      <Group>
                        <Label for='licenceVerify'>
                          Licence Verification Status
                        </Label>
                        <p name='licenceVerify'>{verificationStatus}</p>
                      </Group>
                      <Group>
                        <Label for=''>Group</Label>
                        <p name='group'>
                          {group ? (
                            <p>{group}</p>
                          ) : (
                            <p>You are not in any group</p>
                          )}
                        </p>
                      </Group>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          </Container>
        </>
  );
};

export default ViewProfile;
