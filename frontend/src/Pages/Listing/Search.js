import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination, Form, Accordion, InputGroup } from "react-bootstrap";
import Select from 'react-select';
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ListingService from "../../Services/ListingService";
import * as FileService from "../../Services/FileService";
import "./List.css";

const SearchComponent = ({ onSearch, all = true }) => {
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
    devloper: all ? '' : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : '0',
  });

  const [developers, setDevelopers] = useState([]);
  const [priceRange, setPriceRange] = useState({ minPrice: null, maxPrice: null });
  const [activeKey, setActiveKey] = useState('0');

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
  const bedroomsOptions = [{ value: 0, label: 'None' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: 'More than 5' }];
  const carSpacesOptions = [{ value: 0, label: 'None' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: 'More than 5' }];
  const bathroomsOptions = [{ value: 0, label: 'None' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: 'More than 5' }];
  const developerOptions = developers;

  const handleInputChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setSearch({
      ...search,
      [actionMeta.name]: selectedOption ? selectedOption.value : ''
    });
  };

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    setSearch({
      ...search,
      priceRange: newPriceRange
    });
  };

  return (
    <Accordion defaultActiveKey="0" activeKey={activeKey} className="w-100 m-1 p-0">
      <Card className="w-100 rounded">
        <Card.Header className="w-100 mb-1" onClick={() => setActiveKey(activeKey === '0' ? '' : '0')}>
          <h5 className="ml-1">{
            activeKey === '0' ? <i className="fa fa-chevron-up"></i> : <i className="fa fa-chevron-down"></i>
          }</h5>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form onSubmit={e => { e.preventDefault(); onSearch(search); }} className="w-100">
              <Row className="m-0 p-0">
                <Col xs={12} md={12}>
                  <Row className="mt-0 mb-1">
                    <Col xs={12} md={all ? 6 : 12}>
                      <Form.Control placeholder="Listing Name" name="listingName" value={search.listingName} onChange={handleInputChange} />
                    </Col>
                    {all && <Col xs={12} md={6}>
                      <Select
                        options={developerOptions}
                        isClearable
                        name="developer"
                        onChange={handleSelectChange}
                        placeholder="Developer"
                        styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          control: base => ({ ...base, fontSize: 12 }),
                          option: base => ({ ...base, fontSize: 12 }),
                          singleValue: base => ({ ...base, fontSize: 12 })
                        }}
                      />
                    </Col>
                    }
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={6}>
                      <Select
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
                      <Select
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
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={6}>
                      <Form.Control placeholder="Street Address" name="streetAddress" value={search.streetAddress} onChange={handleInputChange} />
                    </Col>
                    <Col xs={12} md={3}>
                      <Form.Control placeholder="Postcode" name="postcode" value={search.postcode} onChange={handleInputChange} />
                    </Col>
                    <Col xs={12} md={3}>
                      <Form.Control placeholder="Region" name="region" value={search.region} onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={3}>
                      <InputGroup className="rounded">
                        <InputGroup.Text className="rounded-0">
                          <i className="fa fa-arrows-alt"></i>
                        </InputGroup.Text>
                        <Form.Control placeholder="Land Size" name="landSize" value={search.landSize} onChange={handleInputChange} className="rounded-0" />
                        <InputGroup.Text className="rounded-0">m&sup2;</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={12} md={3}>
                      <Select
                        options={bedroomsOptions}
                        isClearable
                        name="bedrooms"
                        onChange={handleSelectChange}
                        placeholder="Bedrooms"
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
                    <Col xs={12} md={3}>
                      <Select
                        options={bathroomsOptions}
                        isClearable
                        name="bathrooms"
                        onChange={handleSelectChange}
                        placeholder="Bathrooms"
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
                    <Col xs={12} md={3}>
                      <Select
                        options={carSpacesOptions}
                        isClearable
                        name="carSpaces"
                        onChange={handleSelectChange}
                        placeholder="Car Spaces"
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
                  <Button type="submit" className="mt-1 mb-0">Search</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

const PriceRangeInput = ({ onChange, min, max, step, parentMinPrice, parentMaxPrice }) => {
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
    onChange({
      minPrice: minPrice !== null ? parseInt(minPrice) : null,
      maxPrice: maxPrice !== null ? parseInt(maxPrice) : null,
    });
  }, [minPrice, maxPrice]);

  return (
    <Container className='mx-1 p-0'>
      <Row className='align-items-center'>
        <Col>
          <Select
            value={priceOptions.find((option) => option.value === minPrice)}
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
            value={priceOptions.find((option) => option.value === maxPrice)}
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

  useEffect(() => {
    const getImageUrl = async (imageId) => {
      if (!imageUrls[imageId]) {
        const url = await FileService.getImageUrl(imageId);
        setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
      }
    };

    const fetchListings = async (searchParams = null) => {
      try {
        const response = await ListingService.searchListings(currentPage, 6, searchParams);
        setListings(response.listings);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);

        response.listings.forEach((listing) => {
          getImageUrl(listing.titleImage);
        });

      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, [developer, currentPage, imageUrls]);

  const fetchListings = async (searchParams = null) => {
    try {
      console.log(searchParams);
      const response = await ListingService.searchListings(currentPage, 6, searchParams);
      setListings(response.listings);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);

      console.log(response);
      response.listings.forEach((listing) => {
        getImageUrl(listing.titleImage);
      });

    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleSearch = (searchParams) => {
    setCurrentPage(1);
    fetchListings(searchParams);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getImageUrl = (imageId) => {
    return FileService.streamFile(imageId);
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
    <Container className="mt-0">
      <ContentHeader headerTitle="Listings"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Listings", active: true },
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