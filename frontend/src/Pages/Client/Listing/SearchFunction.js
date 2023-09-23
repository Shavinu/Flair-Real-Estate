import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination, Form, Accordion, InputGroup } from "react-bootstrap";
import { FaBed, FaExpandArrowsAlt, FaCar, FaBath } from 'react-icons/fa';
import Select, { components } from 'react-select';
import { ContentHeader } from "../../../Components";
import { Link } from "react-router-dom";
import * as ListingService from "../../../Services/ListingService";
import * as FileService from "../../../Services/FileService";
import SearchLocations from "../../../Components/Maps/SearchBased";
import SearchPlaces from "../../../Components/Maps/SearchPlace";
import { PriceRangeInput } from "../../Listing/Search";
import { CheckBox, Label } from "../../../Components/Form";
import CardBody from "../../../Components/Card/CardBody";
import Popup from "./Popup";

const SearchFunction = ({ onSearch, all = true }) => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const initialState = {
    listingName: '',
    type: '',
    status: '',
    priceRange: {
      minPrice: '',
      maxPrice: ''
    },
    address: {
      streetAddress: '',
      postcode: '',
      suburb: '',
      region: '',
    },
    streetAddress: '',
    postcode: '',
    region: '',
    landSize: '',
    bedrooms: '',
    bathrooms: '',
    carSpaces: '',
    project: '',
    listingCommission: {
      exists: '',
      type: '',
      amount: '',
      percent: '',
    },
    devloper: all ? '' : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : '0',
  };

  const [search, setSearch] = useState({
    listingName: '',
    type: '',
    status: '',
    priceRange: {
      minPrice: '',
      maxPrice: ''
    },
    address: {
      streetAddress: '',
      postcode: '',
      suburb: '',
      region: '',
    },
    streetAddress: '',
    postcode: '',
    region: '',
    landSize: '',
    bedrooms: '',
    bathrooms: '',
    carSpaces: '',
    project: '',
    listingCommission: {
      exists: '',
      type: '',
      amount: '',
      percent: '',
    },
    devloper: all ? '' : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : '0',
  });

  const [developers, setDevelopers] = useState([]);
  const [priceRange, setPriceRange] = useState({ minPrice: null, maxPrice: null });
  const [activeKey, setActiveKey] = useState('0');
  const [streetAddress, setStreetAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [region, setRegion] = useState('');
  const [reset, setReset] = useState(false);

  const developerRef = useRef();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await ListingService.getDevelopers();
        return response;
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };
    fetchDevelopers().then((data) => {
      const formattedDevelopers = data.map((item) => ({
        value: item.developer._id,
        label: `${item.developer.firstName} ${item.developer.lastName}`,
      }));
      formattedDevelopers.unshift({ value: '', label: 'All' });
      setDevelopers(formattedDevelopers);
    });
  }, []);

  const typeOptions = [
    { value: '', label: 'Any' },
    { value: 'Land or Multiple House', label: 'Land or Multiple House' },
    { value: 'House and Land Package', label: 'House and Land Package' },
    { value: 'Apartment & Unit', label: 'Apartment & Unit' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Land', label: 'Land' },
    { value: 'Acreage', label: 'Acreage' },
    { value: 'Rural', label: 'Rural' },];

  const statusOptions = [
    { value: '', label: 'Any' },
    { value: 'Available', label: 'Available' },
    { value: 'Sold', label: 'Sold' },
    { value: 'Under Offer', label: 'Under Offer' },
    { value: 'Withdrawn', label: 'Withdrawn' },];
  const bedroomsOptions = [{ value: '', label: 'Any' }, { value: 1, label: 'Less than 1' }, { value: 2, label: 'Less than 2' }, { value: 3, label: 'Less than 3' }, { value: 4, label: 'Less than 4' }, { value: 5, label: 'Less than 5' }];
  const carSpacesOptions = [{ value: '', label: 'Any' }, { value: 1, label: 'Less than 1' }, { value: 2, label: 'Less than 2' }, { value: 3, label: 'Less than 3' }, { value: 4, label: 'Less than 4' }, { value: 5, label: 'Less than 5' }];
  const bathroomsOptions = [{ value: '', label: 'Any' }, { value: 1, label: 'Less than 1' }, { value: 2, label: 'Less than 2' }, { value: 3, label: 'Less than 3' }, { value: 4, label: 'Less than 4' }, { value: 5, label: 'Less than 5' }];
  
  
  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const resetForm = () => {
    setReset(true);
    if (developerRef && developerRef.current) {
      developerRef.current.clearValue();
    }
    setSearch(initialState);
  };

  const handleInputChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    if (actionMeta.name.includes(".")) {
      const [mainKey, subKey] = actionMeta.name.split(".");
      setSearch(prevState => ({
        ...prevState,
        [mainKey]: {
          ...prevState[mainKey],
          [subKey]: selectedOption ? selectedOption.value : ''
        }
      }));
    } else {
      setSearch(prevState => ({
        ...prevState,
        [actionMeta.name]: selectedOption ? selectedOption.value : ''
      }));
    }
  };

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    setSearch({
      ...search,
      priceRange: newPriceRange
    });
  };

  
  

  const CustomControl = ({ Icon, ...props }) => (
    <components.Control {...props}>
      <Icon style={{ marginLeft: '10px' }} />
      {props.children}
    </components.Control>
  );

  


  return (
    <>
           <Container>
           <Accordion defaultActiveKey="1" activeKey={activeKey} className="w-100 m-1 p-0">
            <Card className="p-4">
              
              <CardBody>
              <Form onSubmit={e => { e.preventDefault(); onSearch(search); }} className="w-100"> 

              
                
                <InputGroup className="rounded">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    name="streetAddress"
                    value={search.streetAddress}
                    onChange={handleInputChange}
                    className="rounded-0"
                  />
                
                  <Button variant="secondary" type="submit">
                  Search</Button>
                  <Button variant="secondary" type="submit" onClick={() => setButtonPopup(true)}>
                  Filter</Button>
                
                </InputGroup>

                </Form>
              </CardBody>
              
            
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            
        
            <Form onSubmit={e => { e.preventDefault(); onSearch(search); }} className="w-100">
              <Row className="m-0 p-0">
                <Col xs={12} md={12}>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Type</p>
                    </Col>
                    <Col xs={12} md={12}> 
                      <Select
                        value={search.type ? { value: search.type, label: search.type } : null }
                        options={typeOptions}
                        isClearable
                        name="type"
                        onChange={handleSelectChange}
                        placeholder="Type"
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Status</p>
                    </Col>
                    <Col xs={12} md={12}> 
                      <Select
                        value={search.status ? { value: search.status, label: search.status } : null }
                        options={statusOptions}
                        isClearable
                        name="status"
                        onChange={handleSelectChange}
                        placeholder="Status"
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Price Range</p>
                    <PriceRangeInput
                        min={0}
                        max={2000000}
                        step={[
                          { till: 500000, step: 25000 },
                          { till: 1000000, step: 50000 },
                          { till: 2000000, step: 100000 },
                          { till: 10000000, step: 500000 }
                        ]}
                        onChange={handlePriceRangeChange}
                        parentMinPrice={priceRange.minPrice}
                        parentMaxPrice={priceRange.maxPrice}
                        reset={reset}
                      />
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Land Size</p>
                    </Col>
                    <Col xs={12} md={12}> 
                    <InputGroup className="rounded">
                        <InputGroup.Text className="rounded-0">
                          <i className="fa fa-arrows-alt"></i>
                        </InputGroup.Text>
                        <Form.Control placeholder="Land Size less than" name="landSize" value={search.landSize} onChange={handleInputChange} className="rounded-0" />
                        <InputGroup.Text className="rounded-0">m&sup2;</InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Bedrooms</p>
                    </Col>
                    <Col xs={12} md={12}> 
                      <Select
                        value={search.bedrooms !== (null || '') ? { value: search.bedrooms, label: `Less than ${search.bedrooms}` } : { value: '', label: 'Any' }}
                        options={bedroomsOptions}
                        isClearable
                        name="bedrooms"
                        onChange={handleSelectChange}
                        placeholder="Bedrooms"
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        components={{ Control: (props) => <CustomControl {...props} Icon={FaBed} /> }}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Bathrooms</p>
                    </Col>
                    <Col xs={12} md={12}> 
                      <Select
                        value={search.bathrooms !== (null || '') ? { value: search.bathrooms, label: `Less than ${search.bathrooms}` } : { value: '', label: 'Any' }}
                        options={bathroomsOptions}
                        isClearable
                        name="bathrooms"
                        onChange={handleSelectChange}
                        placeholder="Bathrooms"
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        components={{ Control: (props) => <CustomControl {...props} Icon={FaBath} /> }}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Parking slot</p>
                    </Col>
                    <Col xs={12} md={12}> 
                      <Select
                        value={search.carSpaces !== (null || '') ? { value: search.carSpaces, label: `Less than ${search.carSpaces}` } : { value: '', label: 'Any' }}
                        options={carSpacesOptions}
                        isClearable
                        name="carSpaces"
                        onChange={handleSelectChange}
                        placeholder="Car Spaces"
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'}
                        components={{ Control: (props) => <CustomControl {...props} Icon={FaCar} /> }}
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                  </Row>
                 
                </Col>
              </Row>
                <Button variant="secondary" className="mt-2 mb-0 mr-1" type="submit">
                  Search
                </Button>
              
                <Button variant="secondary" onClick={resetForm} className="mt-2 mb-0 mr-1">
                  Reset
                </Button>
              

            </Form>
            
            </Popup>

       

            </Card>
            
            </Accordion>
          </Container>
    </>
  );
};

export default SearchFunction;