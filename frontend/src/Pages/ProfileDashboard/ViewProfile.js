import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import EditProfile from './EditProfile';

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
  // const [errors, setErrors] = useState();
  // const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

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
      response.verifiedLicence ? setVerificationStatus("Verified") : setVerificationStatus("Unverified")
      setCompany(response.company);
      setAddressLine1(response.addressLine1);
      setAddressLine2(response.addressLine2);
      setCity(response.city);
      setCountry(response.country);
      setPostcode(response.postcode);
    });
  };

  useEffect(() => {
    getUserDetailById(id);
  }, [id]);

  return ( <>
    {
      page === 2 ? (<EditProfile page={setPage}/>) : (

      <>
      <ContentHeader
        headerTitle='My Profile'
        breadcrumb={[
          { name: 'Home', link: '/' },
          { name: 'Profile', link: `/profile/view/${id}`, active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" onClick={() => {setPage(2)}}/*to={`/profile/edit/${id}`}*/>Edit Profile</Link>}
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
                        <h6>Email</h6>
                        <span>{email}</span>
                      </Group>
                    </Col>
                    <Col
                     sm={12}
                     md={6}>
                      <Group>
                        <h6>Mobile</h6>
                        <span>{mobileNo}</span>
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

                  </Row>
                </div>
              </div>

              <Row>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <h6>Role</h6>
                    <span>{accType}</span>
                  </Group>
                  <Group>
                    <h6>Job Title</h6>
                    <span>{jobType}</span>
                  </Group>
                  <Group>
                    <h6>Company</h6>
                    <span>{company}</span>
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <h6>Licence Number</h6>
                    <span>{licence}</span>
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
                    <h6>Address line 1</h6>
                    <span>{addressLine1}</span>
                  </Group>
                  <Group>
                  <h6>Address line 2</h6>
                    <span>{addressLine2}</span>
                  </Group>
                  <Group>
                    <h6>City</h6>
                    <span>{city}</span>
                  </Group>
                </Col>
                <Col
                  sm={12}
                  md={6}>
                  <Group>
                    <h6>Post Code</h6>
                    <span>{postcode}</span>
                  </Group>
                  <Group>
                    <h6>Country</h6>
                    <span>{country}</span>
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
