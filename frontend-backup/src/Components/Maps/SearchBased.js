import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxApiKey = process.env.REACT_APP_MAP_BOX_API_KEY;

let geocodingClient;

if (mapboxApiKey) {
  const mapboxClient = mbxClient({ accessToken: mapboxApiKey });
  geocodingClient = mbxGeocoding(mapboxClient);
}

const SearchLocations = ({ onAddressChange, onSuburbChange, onRegionChange, onPostcodeChange, reset }) => {
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [region, setRegion] = useState('');
  const [postcode, setPostcode] = useState('');
  const [options, setOptions] = useState([]);

  const addressRef = useRef();
  const suburbRef = useRef();
  const regionRef = useRef();
  const postcodeRef = useRef();

  const handleInputChange = (value, type) => {
    let types = [];
    if (type === "address") {
    types = ['address'];
    } else if (type === "suburb") {
    types = ['locality', 'place'];
    } else if (type === "region") {
    types = ['region'];
    } else if (type === "postcode") {
    types = ['postcode'];
    }

    geocodingClient
      .forwardGeocode({
        query: value,
        countries: ['au'],
        types,
        limit: 5,
      })
      .send()
      .then((response) => {
        const features = response.body.features;
        const newOptions = features.map((feature) => ({
          value: type === "address" ? feature.place_name : feature.text,
          label: feature.place_name,
        }));
        setOptions(newOptions);
        if (type === "address") {
          setAddress(value);
          // onAddressChange(value);
        } else if (type === "suburb") {
          setSuburb(value);
          // onSuburbChange(value);
        } else if (type === "region") {
          setRegion(value);
          // onRegionChange(value);
        } else if (type === "postcode") {
          setPostcode(value);
          // onPostcodeChange(value);
        }
      });
  };

  const handleSelectChange = (selectedOption, type) => {
    if (selectedOption) {
      if (type === "address") {
        setAddress(selectedOption.value);
        onAddressChange(selectedOption.value);
      } else if (type === "suburb") {
        setSuburb(selectedOption.value);
        onSuburbChange(selectedOption.value);
      } else if (type === "region") {
        setRegion(selectedOption.value);
        onRegionChange(selectedOption.value);
      } else if (type === "postcode") {
        setPostcode(selectedOption.value);
        onPostcodeChange(selectedOption.value);
      }
    } else {
      if (type === "address") {
        setAddress('');
        onAddressChange('');
      } else if (type === "suburb") {
        setSuburb('');
        onSuburbChange('');
      } else if (type === "region") {
        setRegion('');
        onRegionChange('');
      } else if (type === "postcode") {
        setPostcode('');
        onPostcodeChange('');
      }
    }
  };

  useEffect(() => {
    if (reset) {
      setAddress('');
      onAddressChange('');
      setSuburb('');
      onSuburbChange('');
      setRegion('');
      onRegionChange('');
      setPostcode('');
      onPostcodeChange('');

      addressRef.current.clearValue();
      suburbRef.current.clearValue();
      regionRef.current.clearValue();
      postcodeRef.current.clearValue();
    }
  }, [reset]);

  return (
    <Row className="w-100 m-0 p-0">
      <Col xs={12}>
      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333', marginTop: '5px' }}>Location Based</p>
      </Col>
      <Col xs={12} md={6} className='mb-1'>
      <Select
        name="streetAddress"
        value={options.find((option) => option.value === address)}
        onInputChange={(value) => handleInputChange(value, "address")}
        onChange={(selectedOption) => handleSelectChange(selectedOption, "address")}
        options={options}
        placeholder="Search for a street address"
        isClearable={true}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: base => ({ ...base, fontSize: 12 }),
          option: base => ({ ...base, fontSize: 12 }),
          singleValue: base => ({ ...base, fontSize: 12 })
        }}
        ref={addressRef}
      />
      </Col>
      <Col xs={12} md={6} className='mb-1'>
      <Select
        name="suburb"
        value={options.find((option) => option.value === suburb)}
        onInputChange={(value) => handleInputChange(value, "suburb")}
        onChange={(selectedOption) => handleSelectChange(selectedOption, "suburb")}
        options={options}
        placeholder="Search for a suburb"
        isClearable={true}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: base => ({ ...base, fontSize: 12 }),
          option: base => ({ ...base, fontSize: 12 }),
          singleValue: base => ({ ...base, fontSize: 12 })
        }}
        ref={suburbRef}
      />
      </Col>
      <Col xs={12} md={6} className='mb-1'>
      <Select
        name="postcode"
        value={options.find((option) => option.value === postcode)}
        onInputChange={(value) => handleInputChange(value, "postcode")}
        onChange={(selectedOption) => handleSelectChange(selectedOption, "postcode")}
        options={options}
        placeholder="Search for a postcode"
        isClearable={true}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: base => ({ ...base, fontSize: 12 }),
          option: base => ({ ...base, fontSize: 12 }),
          singleValue: base => ({ ...base, fontSize: 12 })
        }}
        ref={postcodeRef}
      />
      </Col>
      <Col xs={12} md={6} className='mb-1'>
      <Select
        name="region"
        value={options.find((option) => option.value === region)}
        onInputChange={(value) => handleInputChange(value, "region")}
        onChange={(selectedOption) => handleSelectChange(selectedOption, "region")}
        options={options}
        placeholder="Search for a region"
        isClearable={true}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: base => ({ ...base, fontSize: 12 }),
          option: base => ({ ...base, fontSize: 12 }),
          singleValue: base => ({ ...base, fontSize: 12 })
        }}
        ref={regionRef}
      />
      </Col>
    </Row>
  );
};

export default SearchLocations;