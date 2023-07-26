import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination, Form, Accordion, InputGroup } from "react-bootstrap";
import { FaBed, FaExpandArrowsAlt, FaCar, FaBath } from 'react-icons/fa';
import Select, { components } from 'react-select';
import { ContentHeader } from "../../../Components";
import { Link } from "react-router-dom";
import * as ListingService from "../../../Services/ListingService";
import * as FileService from "../../../Services/FileService";
import SearchLocations from "../../../Components/Maps/SearchBased";
import { PriceRangeInput } from "../../Listing/Search";
import { CheckBox, Label } from "../../../Components/Form";
import CardBody from "../../../Components/Card/CardBody";

const SearchFunction = ({ onSearch, all = true }) => {
  const initialState = {
    listingName: '',
    type: '',
    status: '',
    priceRange: {
      minPrice: '',
      maxPrice: ''
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
  const developerOptions = developers;
  const listingCommissionExist = [{ value: '', label: 'Any' }, { value: true, label: 'Yes' }, { value: false, label: 'No' }];
  const listingCommissionTypes = [{ value: '', label: 'Any' }, { value: 'fixed', label: 'Fixed' }, { value: 'percentage', label: 'Percentage' }];

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


  return (
    <>
           <Container>
            <Card className="p-4">
              <CardBody>
              <Form onSubmit={e => { e.preventDefault(); onSearch(search); }} className="w-100"> 
                <InputGroup className="rounded">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    name="listingName"
                    value={search.listingName}
                    onChange={handleInputChange}
                    className="rounded-0"
                  />
                
                  <Button variant="secondary" type="submit">
                  Search</Button>
                
                </InputGroup>

                <Form.Group className="mt-2">
                  <CheckBox label="Surrounding Suburbs" />
                </Form.Group>

                <Form.Group>
                  <Row>
                  </Row>
                </Form.Group>

                <Form.Group>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Label>Project Type</Label>
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
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Label>Project Price Range</Label>
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
                      />
                    </Col>
                  </Row>
                </Form.Group>
                </Form>
              </CardBody>
            </Card>
          </Container>
    </>
  );
};

export default SearchFunction;