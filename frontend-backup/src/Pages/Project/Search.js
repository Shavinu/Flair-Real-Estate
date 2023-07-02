import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination, Form, Accordion, InputGroup } from "react-bootstrap";
import { FaBed, FaExpandArrowsAlt, FaCar, FaBath } from 'react-icons/fa';
import Select, { components } from 'react-select';
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import SearchLocations from "../../Components/Maps/SearchBased";
import "./List.css";

const SearchComponent = ({ onSearch, all = true }) => {
  const initialState = {
    projectName: '',
    projectType: '',
    projectStatus: '',
    projectPriceRange: {
      minPrice: '',
      maxPrice: ''
    },
    projectLocation: {
        locationName: '',
        suburb: '',
        postcode: '',
        region: '',
    },
    projectCommission: {
      exists: '',
      type: '',
      amount: '',
      percent: '',
    },
    projectOwner: all ? '' : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : 0,
  };

  const [search, setSearch] = useState({
    projectName: '',
    projectType: '',
    projectStatus: '',
    projectPriceRange: {
      minPrice: '',
      maxPrice: ''
    },
    projectLocation: {
        locationName: '',
        suburb: '',
        postcode: '',
        region: '',
    },
    projectCommission: {
      exists: '',
      type: '',
      amount: '',
      percent: '',
    },
    projectOwner: all ? '' : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : 0,
  });

  const [projectOwners, setProjectOwners] = useState([]);
  const [projectPriceRange, setProjectPriceRange] = useState({ minPrice: null, maxPrice: null });
  const [activeKey, setActiveKey] = useState('0');
  const [locationName, setLocationName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [region, setRegion] = useState('');
  const [reset, setReset] = useState(false);

  const projectOwnerRef = useRef();

  useEffect(() => {
    const fetchProjectOwners = async () => {
      try {
        const response = await ProjectService.getProjectOwners();
        return response;
      } catch (error) {
        console.error("Error fetching project owners:", error);
      }
    };
    fetchProjectOwners().then((data) => {
      const formattedProjectOwners = data.map((item) => ({
        value: item.projectOwner._id,
        label: `${item.projectOwner.firstName} ${item.projectOwner.lastName}`,
      }));
      formattedProjectOwners.unshift({ value: '', label: 'All' });
      setProjectOwners(formattedProjectOwners);
    });
  }, []);

  const typeOptions = [
    { value: 'Land', label: 'Land' },
    { value: 'Multiple', label: 'Multiple' },];

  const statusOptions = [
    { value: '', label: 'Any' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Coming Soon', label: 'Coming Soon' },
    { value: 'Reserved', label: 'Reserved' },];
  const projectOwnersOptions = projectOwners;
  const projectCommissionExist = [{ value: '', label: 'Any' }, { value: true, label: 'Yes' }, { value: false, label: 'No' }];
  const projectCommissionTypes = [{ value: '', label: 'Any' }, { value: 'fixed', label: 'Fixed' }, { value: 'percentage', label: 'Percentage' }];

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const resetForm = () => {
    setReset(true);
    if (projectOwnerRef && projectOwnerRef.current) {
        projectOwnerRef.current.clearValue();
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
    setProjectPriceRange(newPriceRange);
    setSearch({
      ...search,
      projectPriceRange: newPriceRange
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
        projectCommission : {
          ...search.projectCommission,
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
        projectCommission : {
          ...search.projectCommission,
          percent: val
        }
      });
    }
  };

  const displaySearchParameters = () => {
    let parameters = [];
    for (let key in search) {
      if (search[key] !== '' && search[key] !== null && typeof search[key] !== 'object') {
        if (key === 'projectOwner') {
          const selectedProjectOwner = projectOwners.find(projectOwner => projectOwner.value === search[key]);
          parameters.push(`${key}: ${selectedProjectOwner ? selectedProjectOwner.label : ''}`);
        } else {
          parameters.push(`${key}: ${search[key]}`);
        }
      }
      if (typeof search[key] === 'object') {
        if (key === 'projectCommission') {
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
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Name</p>
                      <Form.Control placeholder="Project Name" name="projectName" value={search.projectName} onChange={handleInputChange} />
                    </Col>
                    {all && <Col xs={12} md={6}>
                      <Row>
                        <Col xs={12}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Owner Based</p>
                        </Col>
                        <Col xs={12}>
                          <Select
                            options={projectOwnersOptions}
                            isClearable={true}
                            name="projectOwner"
                            onChange={handleSelectChange}
                            placeholder="Project Owner"
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 }),
                              control: base => ({ ...base, fontSize: 12 }),
                              option: base => ({ ...base, fontSize: 12 }),
                              singleValue: base => ({ ...base, fontSize: 12 })
                            }}
                            ref={projectOwnerRef}
                          />
                        </Col>
                      </Row>
                    </Col>
                    }
                  </Row>
                  <Row className="mb-0">
                    <Col xs={12} md={6}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Type</p>
                      <Select
                        value={search.type ? { value: search.projectType, label: search.projectType } : null }
                        options={typeOptions}
                        isClearable
                        name="projectType"
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
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Status</p>
                      <Select
                        value={search.projectStatus ? { value: search.projectStatus, label: search.projectStatus } : null }
                        options={statusOptions}
                        isClearable
                        name="projectStatus"
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
                    <p className="ml-1 mt-1" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Price Range</p>
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
                      parentMinPrice={projectPriceRange.minPrice}
                      parentMaxPrice={projectPriceRange.maxPrice}
                      reset={reset}
                    />
                  </Row>
                  <Row className="my-1">
                    <SearchLocations
                      onAddressChange={(address) => {
                        setLocationName(address);
                        setSearch((prevSearch) => (
                            {   ...prevSearch, 
                                projectLocation: {
                                    ...prevSearch.projectLocation,
                                    locationName: address
                                }
                            }
                        ));
                      }}
                      onSuburbChange={(sub) => {
                        setSuburb(sub);
                        setSearch((prevSearch) => (
                            { ...prevSearch, 
                                projectLocation: {
                                    ...prevSearch.projectLocation,
                                    suburb: sub
                                }
                            }
                        ));
                      }}
                      onPostcodeChange={(code) => {
                        setPostcode(code);
                        setSearch((prevSearch) => (
                            { ...prevSearch, 
                                projectLocation: {
                                    ...prevSearch.projectLocation,
                                    postcode: code
                                }
                            }
                        ));
                      }}
                      onRegionChange={(reg) => {
                        setRegion(reg);
                        setSearch((prevSearch) => (
                            { ...prevSearch, 
                                projectLocation: {
                                    ...prevSearch.projectLocation,
                                    region: reg
                                }
                            }
                        ));
                      }}
                      reset={reset}
                    />
                  </Row>
                  <Row className="my-1">
                    <Col xs={12} md={12}> 
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>Project Commission</p>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', margin: '0' }}>Exist?</p>
                      <Select
                        value={
                          search.projectCommission.exists !== (null || '')
                            ? {
                                value: search.projectCommission.exists,
                                label: search.projectCommission.exists === true ? 'Yes' : search.projectCommission.exists === false ? 'No' : 'Any'
                              }
                            : { value: '', label: 'Any' }
                        }
                        options={projectCommissionExist}
                        isClearable = {true}
                        name="projectCommission.exists"
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
                        search.projectCommission.type !== (null || '') 
                          ? { 
                              value: search.projectCommission.type, 
                              label: search.projectCommission.type === 'fixed' ? 'Fixed' : 'Percentage'
                            }
                          : { 
                              value: '', label: 'Any' 
                            }
                      }
                      options={projectCommissionTypes}
                      isClearable
                      isDisabled={search.projectCommission.exists === '' || search.projectCommission.exists === false}
                      name="projectCommission.type"
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
                          disabled={search.projectCommission.type === 'percentage' || search.projectCommission.exists === '' || search.projectCommission.exists === false || search.projectCommission.type === ''}
                          placeholder="Commission Amount"
                          name="projectCommission.amount"
                          value={search.projectCommission.amount}
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
                          disabled={search.projectCommission.type === 'fixed' || search.projectCommission.exists === '' || search.projectCommission.exists === false || search.projectCommission.type === ''}
                          placeholder="Commission Percent"
                          name="projectCommission.percent"
                          value={search.projectCommission.percent}
                          onChange={handleCommissionPercentChange}
                          className="rounded-0"
                        />
                      </InputGroup>
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
    <Container className='mx-1 p-0'>
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
  const projectOwner = user ? user.payload._id : null;
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageUrls, setImageUrls] = useState({});
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {

    fetchProjects(searchParams);

  }, [currentPage, searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await ProjectService.searchProjects(currentPage, 6, searchParams);
      setProjects(response.projects);
      setTotalPages(response.totalPages);

      response.projects.forEach((project) => {
        getImageUrl(project.projectTitleImage);
      });

    } catch (error) {
      console.error("Error fetching projects:", error);
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
    <Container className="mt-0">
      <ContentHeader headerTitle="Projects"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Projects", active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" to="/projects/create">Create Project</Link>}
      />
      <Row>
        <SearchComponent onSearch={handleSearch} />
      </Row>
      <Row>
        {projects.map((project) => (
          <Col key={project._id} lg={4} md={6} className="mb-4">
            <Card className="project-card h-100">
            {project.projectCommission[0]?.exists && (
                <div className={`badge ${project.projectCommission[0]?.exists && (project.projectCommission[0]?.type === 'percentage' ? 'badge-warning' : 'badge-danger')}`} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                {project.projectCommission[0]?.type === 'percentage'
                  ? `Commission: ${project.projectCommission[0]?.percent}%`
                  : `Commission: $${project.projectCommission[0]?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              )}
              <Card.Img variant="top" src={imageUrls[project.projectTitleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <Card.Body className="p-0">
                <Card.Title className="text-white bg-dark p-1 mb-0" style={{ background: 'linear-gradient(to right, rgba(19, 198, 137, 1) , rgba(19, 198, 150, 1))' }}>{project.projectName}</Card.Title>
                <Card.Text className="text-right text-white bg-info pl-1 pr-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>
                  {project.projectLocation[0]?.locationName}
                </Card.Text>
                <Card.Text className="pl-1 pr-1"><div className="truncate-text" dangerouslySetInnerHTML={{ __html: project.projectDescription }} /></Card.Text>
              </Card.Body>
              <Card.Footer>
                <ButtonGroup>
                  <Link to={`/projects/${project._id}`} className="btn btn-primary">
                    View
                  </Link>
                  {projectOwner === project.projectOwner._id &&
                    <Link to={`/projects/${project._id}/edit`} className="btn btn-secondary">
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