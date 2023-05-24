import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import Select from 'react-select';

const PriceRangeInput = ({ onChange, min, max, step, error, setErrors, isSubmitted, initialData, reset }) => {
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [initialDataSet, setInitialDataSet] = useState(false);
  const [localError, setLocalError] = useState(null);

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

  useEffect(() => {
    if (initialData && !initialDataSet) {
      const { minPrice, maxPrice } = initialData[0];
      setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setInitialDataSet(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (reset) {
      setMinPrice(null);
      setMaxPrice(null);
      setLocalError(null);
      setInitialDataSet(false);
    }
  }, [reset]);

  const handleMinPriceChange = (option) => {
    setMinPrice(option.value);
    if (!maxPrice || option.value > maxPrice) {
      setMaxPrice(option.value);
    }
  };

  const handleMaxPriceChange = (option) => {
    setMaxPrice(option.value);
    if (!minPrice || option.value < minPrice) {
      setMinPrice(option.value);
    }
  };

  useEffect(() => {
    onChange({
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
    });
  }, [onChange, minPrice, maxPrice]);

  useEffect(() => {
    if (isSubmitted && (minPrice === null && maxPrice === null)) {
      setLocalError('Please select a price range');
    }
    else {
      setLocalError(null);
    }
  }, [minPrice, maxPrice, isSubmitted]);

  useEffect(() => {
    if (localError) {
      setErrors((prevErrors) => ({ ...prevErrors, projectPriceRange: localError }));
    } else {
      setErrors((prevErrors) => {
        const errorsCopy = { ...prevErrors };
        delete errorsCopy.projectPriceRange;
        return errorsCopy;
      });
    }
  }, [localError, setErrors]);

  return (
    <Container className='m-0 p-0'>
      {localError && <div className="invalid-feedback d-block text-left">{localError}</div>}
      <Row className='align-items-center'>
        <Col>
          <Select
            value={priceOptions.find((option) => option.value === minPrice)}
            options={priceOptions}
            onChange={handleMinPriceChange}
            placeholder="Select Min Price"
          />
        </Col>
        <Col>
          <Select
            value={priceOptions.find((option) => option.value === maxPrice)}
            options={priceOptions.filter((option) => option.value >= minPrice)}
            onChange={handleMaxPriceChange}
            placeholder="Select Max Price"
          />
        </Col>
      </Row>
    </Container>
  );
};

const PriceRangeOutput = ({ minPrice, maxPrice }) => {
  const minValue = parseInt(minPrice);
  const maxValue = parseInt(maxPrice);
  const middlePoint = (minPrice + maxPrice) / 2;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <span>{`$${minPrice}.00`}</span>
        <span>{`$${maxPrice}.00`}</span>
      </div>
      <ProgressBar style={{ height: "20px" }}>
        <ProgressBar variant="success" now={minValue} key={1} style={{ borderRadius: "0px" }} />
        <ProgressBar variant="warning" now={maxValue} key={2} style={{ borderRadius: "0px" }} />
      </ProgressBar>
    </div>
  );
};

export { PriceRangeInput, PriceRangeOutput };
