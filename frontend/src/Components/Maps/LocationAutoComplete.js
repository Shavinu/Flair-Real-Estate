import React, { useState } from 'react';
import Select from 'react-select';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxApiKey = process.env.REACT_APP_MAP_BOX_API_KEY;

let geocodingClient;

if (mapboxApiKey) {
  const mapboxClient = mbxClient({ accessToken: mapboxApiKey });
  geocodingClient = mbxGeocoding(mapboxClient);
}

const LocationAutocomplete = ({ selectedLocation, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const handleInputChange = (value) => {
    setInputValue(value);

    if (!value || !geocodingClient) {
      setOptions([]);
      return;
    }

    geocodingClient
      .forwardGeocode({
        query: value,
        countries: ['au'],
        limit: 5,
      })
      .send()
      .then((response) => {
        const features = response.body.features;
        const newOptions = features.map((feature) => ({
          value: feature.place_name,
          label: feature.place_name,
        }));

        setOptions(newOptions);
      });
  };

  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption.value);
  };

  if (!mapboxApiKey) {
    return (
      <Select
        value={selectedLocation}
        onChange={(e) => onChange(e.target.value)}
        placeholder="No Mapbox API key found"
      />
    );
  }

  return (
    <Select
      value={options.find((option) => option.value === selectedLocation)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelectChange}
      options={options}
      placeholder="Search for a location"
    />
  );
};

export default LocationAutocomplete;
