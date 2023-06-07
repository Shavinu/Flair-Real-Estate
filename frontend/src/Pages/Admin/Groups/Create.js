import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardBody, Col, ContentHeader, Row } from "../../../Components";
import { useState } from "react";
import { Group, Input, Label, Select } from "../../../Components/Form";
import utils from "../../../Utils";
import * as GroupService from '../../../Services/GroupService';
import Toast from "../../../Components/Toast";

const Create = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [license, setLicense] = useState('');

  const [alert, setAlert] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const errorShake = () => {
    window.jQuery('button[type=submit]').addClass('animated headShake bg-red');

    window
      .jQuery('button[type=submit]')
      .on(
        'webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
          window.jQuery('button[type=submit]').delay(200).removeClass('animated headShake bg-red');
        }
      );
  };


  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!name) {
      errors = { ...errors, name: 'Please enter group name!' }
      isValid = false
    }

    if (!email) {
      errors = { ...errors, email: 'Please provide email address!' }
      isValid = false
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!area) {
      errors = { ...errors, area: 'Please enter group area!' }
      isValid = false
    }

    if (!type) {
      errors = { ...errors, type: 'Please select group type!' }
      isValid = false
    }

    if (!license) {
      errors = { ...errors, license: 'Please enter license!' }
      isValid = false
    }

    setErrors(errors);
    return isValid;
  }

  const onSubmit = () => {
    setIsLoading(true);

    if (!isValid()) {
      setIsLoading(false);
      errorShake();
      return
    }

    const body = {
      groupName: name,
      groupContact: contact,
      groupEmail: email,
      groupArea: area,
      groupType: type,
      groupLicence: license,
    }

    GroupService.createGroup(body)
      .then(response => {
        Toast('Group has been created successfully!', 'success');
        setErrors();
        setAlert();
        setTimeout(() => {
          navigate(`/groups/${response._id}`);
        }, 500);
      })
      .catch(({response}) => {
        // Toast('Failed to create group!', 'danger');
        errorShake();
        setAlert(response?.data?.error);
      })
      .finally(() =>
        setIsLoading(false)
      )
  }

  return <>
    <ContentHeader headerTitle="Create Group"
      breadcrumb={[
        { name: "Home", link: '/' },
        { name: "Groups", link: '/groups' },
        { name: 'Create', active: true }
      ]}
      options={<Button className="btn btn-primary waves-effect waves-light"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Save
      </Button>}
    />
    <Row>
      <Col sm={12} md={3}>
        <h4>Group Information</h4>
        <hr />
        <p>Please fill out the following information to create a new group. Fields marked with an asterisk (*) are required.</p>
      </Col>
      <Col sm={12} md={9}>
        <Card>
          <CardBody>
            {alert &&
              <Alert type="danger" message={alert} icon={<i className="feather icon-info mr-1 align-middle"></i>} />
            }
            <Row>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Name (*)</Label>
                  <Input name="name"
                    value={name}
                    placeholder="Group Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    error={errors?.name}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Email (*)</Label>
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
              <Col sm={12} md={6}>
                <Group>
                  <Label>Contact</Label>
                  <Input name="contact"
                    value={contact}
                    placeholder="Contact"
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                    error={errors?.contact}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Area (*)</Label>
                  <Input name="area"
                    value={area}
                    placeholder="Area"
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                    error={errors?.area}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>License (*)</Label>
                  <Input name="license"
                    value={license}
                    placeholder="License"
                    onChange={(e) => {
                      setLicense(e.target.value);
                    }}
                    error={errors?.license}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Type (*)</Label>
                  <Select
                    options={[
                      { value: 'builder', label: 'Builder' },
                      { value: 'agency', label: 'Agency' },
                    ]}
                    value={type}
                    onChange={(value) => setType(value)}
                    error={errors?.type}
                  />
                </Group>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>

  </>
}

export default Create;
