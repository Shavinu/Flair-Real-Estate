import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Form, Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import ContentHeader from '../../Components/ContentHeader';
import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
import { ImageBrowser, UploadTitle, UploadSlides } from './Components/ImageBrowser';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./Layout.css";

const Listing = () => {

  const [listingLocation, setListingLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [titleImage, setTitleImage] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const navigate = useNavigate();

  const handleProjectLocationChange = (newLocation) => {
    setListingLocation(newLocation);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  return (
    <Container className = "content-container">
      <ContentHeader headerTitle="Create Listing"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Listings", link: "/listings" },
          { name: "Create", active: true },
        ]}
        options={[
          <ButtonGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="primary">Reset</Button>
            <Button variant="dark">Save</Button>
          </ButtonGroup>
        ]}
      />
      <Row>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #9cdbff, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Name</p>
            </Col>
          </Row>
          <Row>
            <Col><input className="shadow" type="text" placeholder="Enter Listing Name" style={{ fontSize: '12px', borderRadius: '4px', marginTop: '2px', marginBottom: '20px', borderWidth: '0.01px', borderStyle: 'solid', padding: '10px 10px', maxWidth: '100%', width: '100%' }} /></Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #9cdbff, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Type</p>
            </Col>
          </Row>
          <Row style={{ marginTop: '2px' }}>
            <Col>
              <Select
                options={[
                  { value: 'Land or Multiple House', label: 'Land or Multiple House' },
                  { value: 'House and Land Package', label: 'House and Land Package' },
                  { value: 'Apartment & Unit', label: 'Apartment & Unit' },
                  { value: 'Townhouse', label: 'Townhouse' },
                  { value: 'Duplex', label: 'Duplex' },
                  { value: 'Villa', label: 'Villa' },
                  { value: 'Land', label: 'Land' },
                  { value: 'Acreage', label: 'Acreage' },
                  { value: 'Rural', label: 'Rural' },
                ]}
                isSearchable={true}
                placeholder='Select Listing Type' styles={{
                  option: provided => ({ ...provided, fontSize: 12 }),
                  singleValue: provided => ({ ...provided, fontSize: 12 }),
                  placeholder: provided => ({ ...provided, fontSize: 12 }),
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col>
          <Row>
            <Col style={{ background: 'linear-gradient(90deg, #c1c1c1, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '4px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif;" }}>Attributes</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '20px',
            marginTop: '3px'
          }}>
            <Row className="d-xl-flex justify-content-xl-center">
              <Col className='col-auto col-sm-auto col-md-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center' style={{ borderRadius: '5px', boxShadow: '2px 2px 7px rgb(132,144,156)', background: 'linear-gradient(105deg, #e6af8e 70%, #e8cf8e 100%)', margin: '15px', width: '450px', height: '80px' }}>
                <Row className='col-auto col-sm-auto col-md-auto' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='col-auto col-xl-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center'><i className="fa fa-arrows-alt" style={{ color: 'rgb(255,255,255)', fontSize: '20px', marginRight: '5px' }}></i><strong style={{ fontFamily: "'Roboto', sans-serif" }}>Land Size</strong></Col>
                  <Col>
                    <div class="input-group input-group-sm">
                      <div class="input-group-prepend d-inline-block"><span class="input-group-text" style={{ width: "80px" }}>Length</span></div><input class="form-control" type="text" />
                      <div class="input-group-append"><span class="input-group-text">m</span></div>
                    </div>
                    <div class="input-group input-group-sm">
                      <div class="input-group-prepend d-inline-block"><span class="input-group-text" style={{ width: '80px' }}>Width</span></div><input class="form-control" type="text" />
                      <div class="input-group-append"><span class="input-group-text">m</span></div>
                    </div>

                  </Col>
                </Row>
              </Col>
              <Col className='col-auto col-sm-auto col-md-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center' style={{ borderRadius: '5px', boxShadow: '2px 2px 7px rgb(132,144,156)', background: 'linear-gradient(90deg, #d0c7f7, #e4dffa)', margin: '15px', width: '450px', height: '80px' }}>
                <Row className='col-auto col-sm-auto col-md-auto' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='col-auto col-xl-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center'><strong style={{ fontFamily: "'Roboto', sans-serif" }}><i className="fa fa-bed" style={{ fontSize: '25px', marginRight: '5px', color: 'rgb(255,255,255)' }}></i>Bed rooms</strong></Col>
                  <Col>
                    <Select
                      options={[
                        { value: 'none', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Bed Rooms' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12 }),
                        placeholder: provided => ({ ...provided, fontSize: 12 }),
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="d-xl-flex justify-content-xl-center">
              <Col className='col-auto col-sm-auto col-md-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center' style={{ borderRadius: '4px', boxShadow: '2px 2px 5px rgb(132,144,156)', background: 'linear-gradient(90deg, #68cad9, #8bd5ff)', margin: '15px', width: '450px', height: '80px' }}>
                <Row className='col-auto col-sm-auto col-md-auto' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='col-auto col-xl-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center'><i className="fa fa-car" style={{ marginRight: '5px', color: 'rgb(255,255,255)', fontSize: '20px' }}></i><strong style={{ fontFamily: "'Roboto', sans-serif" }}>Car Spaces</strong></Col>
                  <Col>
                    <Select
                      options={[
                        { value: 'none', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Car Spaces' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12 }),
                        placeholder: provided => ({ ...provided, fontSize: 12 }),
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col className='col-auto col-sm-auto col-md-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center' style={{ borderRadius: '5px', boxShadow: '2px 2px 7px rgb(132,144,156)', background: 'linear-gradient(90deg, #ffaa97, #ffd6cc)', margin: '15px', width: '450px', height: '80px' }}>
                <Row className='col-auto col-sm-auto col-md-auto' >
                  <Col className='col-auto col-xl-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center'><strong style={{ fontFamily: "'Roboto', sans-serif" }}><i className="fa fa-bath" style={{ fontSize: '25px', marginRight: '5px', color: 'rgb(255,255,255)' }}></i>Bathrooms</strong></Col>
                  <Col>
                    <Select
                      options={[
                        { value: 'none', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Bathrooms' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12 }),
                        placeholder: provided => ({ ...provided, fontSize: 12 }),
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c1c1c1, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Location</p>
            </Col>
          </Row>
          <Row style={{ marginTop: '2px' }}>
            <Col>
              <LocationAutocomplete
                selectedLocation={listingLocation}
                onChange={handleProjectLocationChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row style={{ marginTop: '15px' }}>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c1c1c1, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Description</p>
            </Col>
          </Row>
          <Row style={{ marginTop: '2px' }}>
            <Col>
              <style>
                {`
                  .ql-editor {
                    min-height: 100px;
                    resize: vertical;
                    overflow-y: scroll;
                    }
                    
                    .ql-container {
                      resize: vertical;
                      overflow-y: scroll;
                    }
                `}
              </style>
              <ReactQuill
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c1c1c1, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Title Image</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px',
            marginTop: '3px'
          }}>
          <Row>
            <Col>
              <Row>
                <Col>
                  <div className="d-xl-flex justify-content-xl-center align-items-xl-center" style={{ margin: '15px' }}>
                    <ImageBrowser
                      titleImage={titleImage}
                      slideshowImages={slideshowImages}
                      setTitleImage={setTitleImage}
                      setSlideshowImages={setSlideshowImages}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
              </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Listing;