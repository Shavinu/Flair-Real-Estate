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

const SearchPlace = ({ onAddressChange, onSuburbChange, onRegionChange, onPostcodeChange, reset }) => {
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [region, setRegion] = useState('');
  const [postcode, setPostcode] = useState('');
  const [options, setOptions] = useState([]);

  const [searchPlace, setSearchPlace] = useState({
    streetAddress: '',
    suburb: '',
    region: '',
    postcode: '',
  });

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


  const handleSearch = () => {
    const { streetAddress, suburb, postcode } = searchPlace;

    // Perform your search using the entered data (e.g., make an API call)
    console.log('Searching for:', streetAddress, suburb, postcode);
  };

  const handleReset = () => {
    setSearchPlace({
      streetAddress: '',
      suburb: '',
      postcode: '',
    });
  };

  return (
    <Row className="w-100 m-0 p-0">
      <SearchPlace
        onAddressChange={(address) => setSearchPlace((prevSearchPlace) => ({ ...prevSearchPlace, streetAddress: address }))}
        onSuburbChange={(sub) => setSearchPlace((prevSearchPlace) => ({ ...prevSearchPlace, suburb: sub }))}
        onPostcodeChange={(code) => setSearchPlace((prevSearchPlace) => ({ ...prevSearchPlace, postcode: code }))}
        reset={false} // Reset prop should be managed separately
      />
    </Row>
  );
};

export default SearchPlace;