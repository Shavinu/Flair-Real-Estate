import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, InputGroup, FormControl, Form, Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ContentHeader } from "../../Components";
import { Group, Input, Label } from "../../Components/Form";
import Toast from "../../Components/Toast";
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as UserService from "../../Services/UserService";
import * as ListingService from "../../Services/ListingService";

import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
import { PriceRangeInput } from "../../Components/Form/PriceRange";
import { FileBrowser, UploadFiles } from "./Components/FileBrowser";
import { ImageBrowser, UploadTitle, UploadSlides } from './Components/ImageBrowser';
import ChooseProject from './Components/ChooseProject';
import SelectListingMembers from "./Components/MembersSelector";
import ListingCommission from './Components/CommissionSelector';
import "./Layout.css";

const Create = () => {

  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const developer = user ? user.payload._id : null;
  const [listingName, setListingName] = useState("");
  const [listingType, setListingType] = useState("");
  const [listingStatus, setListingStatus] = useState("");
  const [listingPriceRange, setListingPriceRange] = useState({});
  const [listingDescription, setListingDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [listingLocation, setListingLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [postcode, setPostcode] = useState(null);
  const [region, setRegion] = useState(null);
  const [suburb, setSuburb] = useState(null);
  const [titleImage, setTitleImage] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [fileUploadFiles, setFileUploadFiles] = useState([]);
  const [editableBy, setEditableBy] = useState([]);
  const [commissionData, setCommissionData] = useState({});

  //attributes
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [carSpaces, setCarSpaces] = useState("");
  const [landSize, setLandSize] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleListingStatusChange = (e) => {
    setListingStatus(e.target.value);
  };

  const handleListingTypeChange = (e) => {
    setListingType(e.target.value);
  };

  const handleListingNameChange = (e) => {
    setListingName(e.target.value);
  }

  const handleListingDescriptionChange = (value) => {
    setListingDescription(value);
  };

  const handleListingLocationChange = (newLocation) => {
    setListingLocation(newLocation);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  const handlePostcodeRegionChange = (newPostcodeRegion) => {
    setPostcode(newPostcodeRegion.postcode);
    setRegion(newPostcodeRegion.region);
    setSuburb(newPostcodeRegion.suburb);
  };

  const handleBedroomsChange = (e) => {
    setBedrooms(e.target.value);
  };

  const handleBathroomsChange = (e) => {
    setBathrooms(e.target.value);
  };

  const handleCarSpacesChange = (e) => {
    setCarSpaces(e.target.value);
  };

  const handleLandSizeChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setLandSize(value);
    }

    if (
      (value !== "" || value !== null) &&
      value.match(/^\d+$/)
    ) {
      setLandSize(value);
    }
  };

  const validateInputs = () => {
    console.log(selectedProject);
    let newErrors = { ...errors };
    if (!listingName) {
      newErrors.listingName = "listing name is required";
    } else {
      delete newErrors.listingName;
    }
    if (!listingType) {
      newErrors.listingType = "listing type is required";
    } else {
      delete newErrors.listingType;
    }
    if (listingDescription.trim() === '' || listingDescription === '<p><br></p>') {
      newErrors.listingDescription = "listing description is required";
    } else {
      delete newErrors.listingDescription;
    }
    if (listingLocation === null || listingLocation.trim() === "") {
      newErrors.listingLocation = "listing location is required";
    } else {
      delete newErrors.listingLocation;
    }
    if (!developer) {
      newErrors.developer = "listing owner is required";
    } else {
      delete newErrors.developer;
    }
    if (!listingStatus) {
      newErrors.listingStatus = "listing status is required";
    } else {
      delete newErrors.listingStatus;
    }

    setErrors(newErrors);
    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = validateInputs();
    console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        let titleImageId = null;
        if (titleImage) {
          titleImageId = await UploadTitle(titleImage, user);
        }

        let slideshowImageIds = null;
        if (slideshowImages.length > 0) {
          slideshowImageIds = await UploadSlides(slideshowImages, user);
          slideshowImageIds = JSON.parse(slideshowImageIds);
        }

        let fileData = null;
        if (fileUploadFiles.length > 0) {
          fileData = await UploadFiles(fileUploadFiles, user);
          console.log(fileData);
          fileData = JSON.parse(fileData);
        }

        const listingData = {
          listingName: listingName,
          type: listingType.value,
          status: listingStatus.value,
          priceRange: [listingPriceRange],
          description: listingDescription,
          streetAddress: listingLocation,
          region: region,
          postcode: postcode,
          suburb: suburb,
          coordinates: [{ longitude: coordinates.longitude, latitude: coordinates.latitude }],
          project: selectedProject,
          landSize: landSize,
          bedrooms: bedrooms.value,
          bathrooms: bathrooms.value,
          carSpaces: carSpaces.value,
          devloper: developer,
          editableBy,
          listingCommission: [commissionData]
        };

        if (titleImageId) listingData.titleImage = titleImageId;
        if (slideshowImageIds) listingData.slideImages = slideshowImageIds;
        if (fileData) listingData.files = fileData;

        console.log(listingData);

        const response = await ListingService.createListing(listingData);
        Toast('Listing created successfully!', 'success');
        setErrors({});
        setTimeout(() => {
          navigate(`/listings/${response._id}`);
        }, 500);
      } catch (error) {
        Toast('Failed to create listing!', 'danger');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <Container>
      <ContentHeader headerTitle="Create Listing"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Listings", link: "/listings" },
          { name: "Create", active: true },
        ]}
        options={[
          <ButtonGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!user || loading}>Save</Button>
          </ButtonGroup>
        ]}
      />
      <Row>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Name</p>
            </Col>
          </Row>

          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px 10px 0px 10px',
            marginTop: '3px'
          }}>
            <Row>
              <Col>
                {errors.listingName && (
                  <div className="text-danger small">
                    {errors.listingName}
                  </div>
                )}
                <input
                  className={`form-control ${errors.listingName && isSubmitted ? "is-invalid" : ""}`}
                  type="text"
                  placeholder="Enter Listing Name"
                  style={{ fontSize: '12px', borderRadius: '4px', marginTop: '2px', marginBottom: '20px', borderWidth: '0.01px', borderStyle: 'solid', padding: '10px 10px', maxWidth: '100%', width: '100%', height: '40px' }}
                  value={listingName}
                  onChange={handleListingNameChange}
                  error={errors.listingName}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row style={{ marginTop: '5px' }}>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '0px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Description</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            border: `${errors.listingDescription ? '1px solid red' : ''}`,
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px',
            marginTop: '3px'
          }}>
            {errors.listingDescription && (
              <div className="text-danger small">
                {errors.listingDescription}
              </div>
            )}
            <Row style={{ marginTop: '2px' }}>
              <Col>
                <style>
                  {`
                  .ql-toolbar
                  {
                    border : none !important;
                  }

                  .ql-container.ql-snow{
                    border-top: 1px solid #ced4da !important;
                    border-radius: 4px;
                  }

                  .ql-editor {
                    min-height: 100px;
                    resize: vertical;
                    overflow-y: scroll;
                    border: none !important;
                    }

                    .ql-container {
                      resize: vertical;
                      overflow-y: scroll;
                    }

                    .ql-editor.ql-blank::before {
                      font-style: normal;
                      font-family: 'Montserrat';
                      font-size: 12px;
                      opacity: 0.5;
                      position: absolute;
                      content: attr(data-placeholder);
                    }

                  .ql-error {
                    border: 1px solid red !important;
                    border-radius: 1px !important;
                  }
                `}
                </style>
                <ReactQuill
                  value={listingDescription}
                  onChange={handleListingDescriptionChange}
                  placeholder="Enter Listing Description"
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '10px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Status</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '15px',
            marginTop: '3px'
          }}>
            <Row style={{ marginTop: '2px' }}>
              <Col>
                {errors.listingStatus && (
                  <div className="text-danger small">
                    {errors.listingStatus}
                  </div>
                )}
                <Select
                  className="shadow"
                  value={listingStatus}
                  onChange={(value) => setListingStatus(value) && handleListingStatusChange()}
                  options={[
                    { value: 'Available', label: 'Available' },
                    { value: 'Sold', label: 'Sold' },
                    { value: 'Under Offer', label: 'Under Offer' },
                    { value: 'Withdrawn', label: 'Withdrawn' },
                  ]}
                  isSearchable={true}
                  placeholder='Select Listing Status' styles={{
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: 12,
                      color: state.isSelected ? 'white' : 'black',
                      backgroundColor: state.isSelected ? '#5cb85c' : 'white',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#5cb85c' : 'gray',
                        color: 'white'
                      }
                    }),
                    control: (provided) => ({
                      ...provided,
                      fontSize: 12,
                      border: errors.listingStatus && isSubmitted ? '1px solid red' : '1px solid #ced4da',
                      borderRadius: '4px',
                      boxShadow: 'none',
                      '&:hover': {
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        boxShadow: 'none',
                      }
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: '9999'
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      zIndex: '9999'
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'black',
                      fontSize: '12px'
                    }),
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '10px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Price Range</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            border: `${errors.listingPriceRange ? '1px solid red' : ''}`,
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '15px'
          }}>
            <Row style={{ marginTop: '2px' }}>
              <Col>
                <PriceRangeInput
                  min={0}
                  max={2000000}
                  step={[
                    { till: 500000, step: 25000 },
                    { till: 1000000, step: 50000 },
                    { till: 2000000, step: 100000 },
                    { till: 10000000, step: 500000 }
                  ]}
                  onChange={setListingPriceRange}
                  isSubmitted={isSubmitted}
                  setErrors={setErrors}
                  error={errors.listingPriceRange}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '10px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '30px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Type</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '15px',
            marginTop: '3px'
          }}>
            <Row style={{ marginTop: '2px' }}>
              <Col>
                {errors.listingType && (
                  <div className="text-danger small">
                    {errors.listingType}
                  </div>
                )}
                <Select
                  className="shadow"
                  value={listingType}
                  onChange={(value) => setListingType(value) && handleListingTypeChange()}
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
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: 12,
                      color: state.isSelected ? 'white' : 'black',
                      backgroundColor: state.isSelected ? '#5cb85c' : 'white',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#5cb85c' : 'gray',
                        color: 'white'
                      }
                    }),
                    control: (provided) => ({
                      ...provided,
                      fontSize: 12,
                      border: errors.listingType && isSubmitted ? '1px solid red' : '1px solid #ced4da',
                      borderRadius: '4px',
                      boxShadow: 'none',
                      '&:hover': {
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        boxShadow: 'none',
                      }
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: '9999'
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      zIndex: '9999'
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'black',
                      fontSize: '12px'
                    }),
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col>
          <Row>
            <Col style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '4px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Attributes</p>
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
                    <div className="input-group col-auto col-sm-auto col-md-auto">
                      <input className="form-control" type="text" value={landSize} onChange={handleLandSizeChange} error={errors.landSize} pattern="[0-9]*\.?[0-9]*" name="landSize" placeholder="Enter Land Size" />
                      <div className="input-group-append"><span className="input-group-text">m&sup2;</span></div>
                    </div>
                    {/* <div className="input-group input-group-sm">
                      <div className="input-group-prepend d-inline-block"><span className="input-group-text" style={{ width: '80px' }}>Width</span></div><input className="form-control" type="text" value={landSize.width} onChange={handleLandSizeChange} error={errors.landSizeWidth} pattern="[0-9]*\.?[0-9]*" name="landSizeWidth" />
                      <div className="input-group-append"><span className="input-group-text">m</span></div>
                    </div> */}

                  </Col>
                </Row>
              </Col>
              <Col className='col-auto col-sm-auto col-md-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center' style={{ borderRadius: '5px', boxShadow: '2px 2px 7px rgb(132,144,156)', background: 'linear-gradient(90deg, #d0c7f7, #e4dffa)', margin: '15px', width: '450px', height: '80px' }}>
                <Row className='col-auto col-sm-auto col-md-auto' style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Col className='col-auto col-xl-auto d-sm-flex d-xl-flex align-items-sm-center align-items-xl-center'><strong style={{ fontFamily: "'Roboto', sans-serif" }}><i className="fa fa-bed" style={{ fontSize: '25px', marginRight: '5px', color: 'rgb(255,255,255)' }}></i>Bed rooms</strong></Col>
                  <Col>
                    <Select
                      value={bedrooms}
                      onChange={(value) => setBedrooms(value) && handleBedroomsChange()}
                      options={[
                        { value: '0', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                        { value: '5', label: '5' },
                        { value: '6', label: '6' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Bed Rooms' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12, width: '170px' }),
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
                      value={carSpaces}
                      onChange={(value) => setCarSpaces(value) && handleCarSpacesChange()}
                      options={[
                        { value: '0', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                        { value: '5', label: '5' },
                        { value: '6', label: '6' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Car Spaces' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12, width: '170px' }),
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
                      value={bathrooms}
                      onChange={(value) => setBathrooms(value) && handleBathroomsChange()}
                      options={[
                        { value: '0', label: 'None' },
                        { value: '1', label: '1' },
                        { value: '2', label: '2' },
                        { value: '3', label: '3' },
                        { value: '4', label: '4' },
                        { value: '5', label: '5' },
                        { value: '6', label: '6' }
                      ]}
                      isSearchable={false}
                      placeholder='Select Available Bathrooms' styles={{
                        option: provided => ({ ...provided, fontSize: 12 }),
                        singleValue: provided => ({ ...provided, fontSize: 12, width: '170px' }),
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
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Editable By</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            border: `${errors.editableBy ? '1px solid #f44336' : '1px solid #e0e0e0'}`,
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '15px'
          }}>
            <Row>
              <Col>
                <SelectListingMembers
                  user={developer}
                  onSubmitEditableBy={setEditableBy}
                  setErrors={setErrors}
                  error={errors.editableBy}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Commission</p>
            </Col>
          </Row>

          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            border: `${errors.listingCommission ? '1px solid #f44336' : '1px solid #e0e0e0'}`,
            borderRadius: '15px',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '15px'
          }}>
            <Row>
              <Col>
                <ListingCommission
                  onCommissionChange={setCommissionData}
                  setErrors={setErrors}
                  error={errors.listingCommission}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Include Listing in Project</p>
            </Col>
          </Row>
          <Row style={{ marginTop: '2px' }}>
            <Col>
              <ChooseProject
                onProjectChange={setSelectedProject}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Location</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            border: `${errors.listingLocation ? '1px solid red' : ''}`,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px',
            marginTop: '3px'
          }}>
            {errors.listingLocation && (
              <div className="text-danger small mb-1">
                {errors.listingLocation}
              </div>
            )}
            <Row>
              <Col>
                <LocationAutocomplete
                  selectedLocation={listingLocation}
                  onChange={handleListingLocationChange}
                  onCoordinatesChange={handleCoordinatesChange}
                  set_postcode_region={handlePostcodeRegionChange}
                  error={errors.listingLocation}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="d-xl-flex justify-content-xl-center" style={{ marginTop: '15px' }}>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Images</p>
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
                    <div className="d-xl-flex" style={{ margin: '15px' }}>
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
      <Row>
        <Col>
          <Row>
            <Col className="d-xl-flex align-items-xl-center" style={{ background: 'linear-gradient(90deg, #c5e6e0, white)', borderRadius: '13px', margin: '15px 15px 0px 15px', borderBottomLeftRadius: '3px' }}>
              <p className="text-uppercase mt-2" style={{ fontWeight: 'bold', fontFamily: "'Roboto', sans-serif" }}>Listing Files</p>
            </Col>
          </Row>
          <div style={{
            background: '#fff',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '15px',
            border: `${errors.listingFiles ? '1px solid #dc3545' : ''}`,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            padding: '10px',
            marginTop: '3px'
          }}>
            <Row>
              <Col>
                <Row className="d-xl-flex text-center" style={{ marginTop: '15px' }}>
                  <Col>
                    <FileBrowser
                      options={[
                        { value: "Site Plan", label: "Site Plan" },
                        { value: "Floor Plan", label: "Floor Plan" },
                        { value: "Elevation Plan", label: "Elevation Plan" },
                        { value: "Other", label: "Other" }
                      ]}
                      onFilesChange={setFileUploadFiles}
                      setErrors={setErrors}
                      error={errors.listingFiles}
                    />
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

export default Create;
