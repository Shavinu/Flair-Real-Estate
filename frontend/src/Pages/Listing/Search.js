import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination, Form, Accordion, InputGroup } from "react-bootstrap";
import { FaBed, FaExpandArrowsAlt, FaCar, FaBath } from 'react-icons/fa';
import Select, { components } from 'react-select';
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ListingService from "../../Services/ListingService";
import * as FileService from "../../Services/FileService";
import SearchLocations from "../../Components/Maps/SearchBased";
import "./Layout.css";

const SearchComponent = ({ onSearch, all = true }) => {
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

  const handleCommissionAmountChange = (e) => {
    let val = e.target.value;
    if (
      (val === '' || !isNaN(val)) &&
      val.match(/^\d{0,}(\.\d{0,2})?$/)
    ) {
      setSearch({
        ...search,
        listingCommission : {
          ...search.listingCommission,
          amount: val
        }
      });
    }
  };

  const handleCommissionPercentChange = (e) => {
    let val = e.target.value;
    if ((val === '' || !isNaN(val)) && val.match(/^\d{0,}(\.\d{0,2})?$/) && val <= 100) 
    {
      setSearch({
        ...search,
        listingCommission : {
          ...search.listingCommission,
          percent: val
        }
      });
    }
  };

  const displaySearchParameters = () => {
    let parameters = [];
    for (let key in search) {
      if (search[key] !== '' && search[key] !== null && typeof search[key] !== 'object') {
        if (key === 'devloper') {
          const selectedDeveloper = developers.find(developer => developer.value === search[key]);
          parameters.push(`${key}: ${selectedDeveloper ? selectedDeveloper.label : ''}`);
        } else {
          parameters.push(`${key}: ${search[key]}`);
        }
      }
      if (typeof search[key] === 'object') {
        if (key === 'listingCommission') {
          if (search[key].exists === true && search[key].exists !== '') {
            parameters.push(`${key}.exists: 'Yes'`);

            if (search[key].type !== '' && search[key].type !== null) {
              parameters.push(`${key}.type: ${search[key].type}`);
            }

            if (search[key].type === 'fixed' && search[key].amount !== '' && search[key].amount !== null) {
              parameters.push(`${key}.amount: ${search[key].amount}`);
            }

            if (search[key].type === 'percentage' && search[key].percent !== '' && search[key].percent !== null) {
              parameters.push(`${key}.percent: ${search[key].percent}`);
            }

          } else if (search[key].exists === false && search[key].exists !== '') {
            parameters.push(`${key}.exists: 'No'`);
          }
        } else {
          for (let subKey in search[key]) {
            if (search[key][subKey] !== '' && search[key][subKey] !== null) {
              parameters.push(`${subKey}: ${search[key][subKey]}`);
            }
          }
        }
      }
    }
    return parameters.join(', ');
  };

  const CustomControl = ({ Icon, ...props }) => (
    <components.Control {...props}>
      <Icon style={{ marginLeft: '10px' }} />
      {props.children}
    </components.Control>
  );

  return (
    <Accordion defaultActiveKey="0" activeKey={activeKey} className="w-100 m-1 p-0">
      <Card className="w-100 rounded">
        <Card.Header className="w-100 mb-1" onClick={() => setActiveKey(activeKey === '0' ? '' : '0')}>
          <h5 className="ml-1">{
            activeKey === '0' ? <i className="fa fa-chevron-up"></i> : <i className="fa fa-chevron-down"></i>
          }</h5>
          <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#333' }}>
            Current parameters: {displaySearchParameters()}</p>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form onSubmit={e => { e.preventDefault(); onSearch(search); }} className="w-100">
              <Row className="m-0 p-0">
                <Col xs={12} md={12}>
                  <Row className="mt-0 mb-2">
                    <Col xs={12} md={6}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Name</p>
                      <Form.Control placeholder="Listing Name" name="listingName" value={search.listingName} onChange={handleInputChange} />
                    </Col>
                    {all && <Col xs={12} md={6}>
                      <Row>
                        <Col xs={12}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Developer Based</p>
                        </Col>
                        <Col xs={12}>
                          <Select
                            options={developerOptions}
                            isClearable={true}
                            name="devloper"
                            onChange={handleSelectChange}
                            placeholder="Developer"
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 }),
                              control: base => ({ ...base, fontSize: 12 }),
                              option: base => ({ ...base, fontSize: 12 }),
                              singleValue: base => ({ ...base, fontSize: 12 })
                            }}
                            ref={developerRef}
                          />
                        </Col>
                      </Row>
                    </Col>
                    }
                  </Row>
                  <Row className="mb-0">
                    <Col xs={12} md={6}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Type</p>
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
                    <Col xs={12} md={6}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Status</p>
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
                    <p className="ml-1 mt-1" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Price Range</p>
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
                    <SearchLocations
                      onAddressChange={(address) => {
                        setStreetAddress(address);
                        setSearch((prevSearch) => ({ ...prevSearch, streetAddress: address }));
                      }}
                      onSuburbChange={(sub) => {
                        setSuburb(sub);
                        setSearch((prevSearch) => ({ ...prevSearch, suburb: sub }));
                      }}
                      onPostcodeChange={(code) => {
                        setPostcode(code);
                        setSearch((prevSearch) => ({ ...prevSearch, postcode: code }));
                      }}
                      onRegionChange={(reg) => {
                        setRegion(reg);
                        setSearch((prevSearch) => ({ ...prevSearch, region: reg }));
                      }}
                      reset={reset}
                    />
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Commission</p>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', margin: '0' }}>Exist?</p>
                      <Select
                        value={
                          search.listingCommission.exists !== (null || '')
                            ? {
                                value: search.listingCommission.exists,
                                label: search.listingCommission.exists === true ? 'Yes' : search.listingCommission.exists === false ? 'No' : 'Any'
                              }
                            : { value: '', label: 'Any' }
                        }
                        options={listingCommissionExist}
                        isClearable = {true}
                        name="listingCommission.exists"
                        onChange={handleSelectChange}
                        placeholder="Commission Exist?"
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
                    <Col xs={12} sm={6} md={3}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', margin: '0' }}>Commission Type</p>
                    <Select
                      value={
                        search.listingCommission.type !== (null || '') 
                          ? { 
                              value: search.listingCommission.type, 
                              label: search.listingCommission.type === 'fixed' ? 'Fixed' : 'Percentage'
                            }
                          : { 
                              value: '', label: 'Any' 
                            }
                      }
                      options={listingCommissionTypes}
                      isClearable
                      isDisabled={search.listingCommission.exists === '' || search.listingCommission.exists === false}
                      name="listingCommission.type"
                      onChange={handleSelectChange}
                      placeholder="Commission Type"
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
                    <Col xs={12} sm={6} md={3}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', margin: '0' }}>Amount (greater than or equal to)</p>
                      <InputGroup className="rounded">
                        <InputGroup.Text className="rounded-0">
                          <i className="fa fa-dollar"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          disabled={search.listingCommission.type === 'percentage' || search.listingCommission.exists === '' || search.listingCommission.exists === false || search.listingCommission.type === ''}
                          placeholder="Commission Amount"
                          name="listingCommission.amount"
                          value={search.listingCommission.amount}
                          onChange={handleCommissionAmountChange}
                          className="rounded-0"
                        />
                      </InputGroup>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', margin: '0' }}>Percent (greater than or equal to)</p>
                      <InputGroup className="rounded">
                        <InputGroup.Text className="rounded-0">
                          <i className="fa fa-percent"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          disabled={search.listingCommission.type === 'fixed' || search.listingCommission.exists === '' || search.listingCommission.exists === false || search.listingCommission.type === ''}
                          placeholder="Commission Percent"
                          name="listingCommission.percent"
                          value={search.listingCommission.percent}
                          onChange={handleCommissionPercentChange}
                          className="rounded-0"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Listing Attributes</p>
                    </Col>
                    <Col xs={12} md={3}>
                      <InputGroup className="rounded">
                        <InputGroup.Text className="rounded-0">
                          <i className="fa fa-arrows-alt"></i>
                        </InputGroup.Text>
                        <Form.Control placeholder="Land Size less than" name="landSize" value={search.landSize} onChange={handleInputChange} className="rounded-0" />
                        <InputGroup.Text className="rounded-0">m&sup2;</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={12} md={3}>
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
                    <Col xs={12} md={3}>
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
                    <Col xs={12} md={3}>
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
                  <Button variant="secondary" onClick={resetForm} className="mt-2 mb-0 mr-1">Reset</Button>
                  <Button type="submit" className="mt-2 mb-0">Search</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

const PriceRangeInput = ({ onChange, min, max, step, parentMinPrice, parentMaxPrice, reset }) => {
  const [minPrice, setMinPrice] = useState(parentMinPrice || null);
  const [maxPrice, setMaxPrice] = useState(parentMaxPrice || null);

  const priceOptions = useMemo(() => {
    let prices = [];
    let currentPrice = min;

    for (let i = 0; i < step.length; i++) {
      const { till, step: stepValue } = step[i];

      while (currentPrice <= till && currentPrice <= max) {
        prices.push({
          value: currentPrice,
          label: '$' + currentPrice.toLocaleString()
        });

        currentPrice += stepValue;
      }
    }

    return prices;
  }, [max, min, step]);

  const handleMinPriceChange = (option) => {
    if (option === null) {
      setMinPrice(null);
      return;
    }
    setMinPrice(option.value);
    if (!maxPrice || option.value > maxPrice) {
      setMaxPrice(option.value);
    }
  };

  const handleMaxPriceChange = (option) => {
    if (!option) {
      setMaxPrice(null);
      return;
    }
    setMaxPrice(option.value);
    if (!minPrice || option.value < minPrice) {
      setMinPrice(option.value);
    }
  };

  useEffect(() => {
    if (reset) {
      setMinPrice(null);
      setMaxPrice(null);
    } else {
      onChange({
        minPrice: minPrice !== null ? parseInt(minPrice) : null,
        maxPrice: maxPrice !== null ? parseInt(maxPrice) : null,
      });
    }
  }, [minPrice, maxPrice, reset]);

  return (
    <Container>
      <Row className='align-items-center'>
        <Col>
          <Select
            value={minPrice ? { value: minPrice, label: '$' + minPrice.toLocaleString() } : null}
            options={priceOptions}
            isClearable={true}
            onChange={handleMinPriceChange}
            placeholder="Select Min Price"
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
        <Col>
          <Select
            value={maxPrice ? { value: maxPrice, label: '$' + maxPrice.toLocaleString() } : null}
            options={priceOptions.filter((option) => option.value >= minPrice)}
            isClearable={true}
            onChange={handleMaxPriceChange}
            placeholder="Select Max Price"
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
    </Container>
  );
};

const Search = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const developer = user ? user.payload._id : null;
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageUrls, setImageUrls] = useState({});
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {

    fetchListings(searchParams);

  }, [currentPage, searchParams]);

  const fetchListings = async () => {
    try {
      const response = await ListingService.searchListings(currentPage, 6, searchParams);
      setListings(response.listings);
      setTotalPages(response.totalPages);

      response.listings.forEach((listing) => {
        getImageUrl(listing.titleImage);
      });

    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleSearch = (newSearchParams) => {
    let searchParams = { ...newSearchParams };
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getImageUrl = (imageId) => {
    if (!imageUrls[imageId]) {
      const url = FileService.getImageUrl(imageId);
      setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
    }
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="content-container">
      <ContentHeader headerTitle="Listings"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "All Listings", active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" to="/listings/create">Create Listing</Link>}
      />
      <Row>
        <SearchComponent onSearch={handleSearch} />
      </Row>
      <Row>
        {listings.map((listing) => (
          <Col key={listing._id} lg={4} md={6} className="mb-4">
            <Card className="listing-card h-100">
            {listing.listingCommission[0]?.exists && (
                <div className={`badge ${listing.listingCommission[0]?.exists && (listing.listingCommission[0]?.type === 'percentage' ? 'badge-warning' : 'badge-danger')}`} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                {listing.listingCommission[0]?.type === 'percentage'
                  ? `Commission: ${listing.listingCommission[0]?.percent}%`
                  : `Commission: $${listing.listingCommission[0]?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              )}
              <Card.Img variant="top" src={imageUrls[listing.titleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <Card.Body className="p-0">
                <Card.Title className="text-white bg-dark p-1 mb-0" style={{ background: 'linear-gradient(to right, rgba(19, 198, 137, 1) , rgba(19, 198, 150, 1))' }}>{listing.listingName}</Card.Title>
                <Card.Text className="text-right text-white bg-info pl-1 pr-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>
                  {listing.streetAddress}
                </Card.Text>
                <Card.Text className="pl-1 pr-1"><div className="truncate-text" dangerouslySetInnerHTML={{ __html: listing.description }} /></Card.Text>
              </Card.Body>
              <Card.Footer>
                <ButtonGroup>
                  <Link to={`/listings/${listing._id}`} className="btn btn-primary">
                    View
                  </Link>
                  {developer === listing.devloper._id &&
                    <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary">
                      Edit
                    </Link>
                  }
                </ButtonGroup>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">{renderPagination()}</Col>
      </Row>
    </Container>
  );
};

export { Search, SearchComponent, PriceRangeInput };