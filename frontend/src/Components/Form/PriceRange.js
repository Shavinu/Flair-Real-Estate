import React, { useState } from 'react';
import Slider from 'rc-slider';
import { ProgressBar } from "react-bootstrap";
import 'rc-slider/assets/index.css';

const PriceRangeInput = ({ value, onChange, error, min, max, step }) => {
  const [state, setState] = useState({
    lowerBound: min,
    upperBound: max,
    value: [min, max],
  });

  const onLowerBoundChange = (e) => {
    const newValue = { ...state, lowerBound: +e.target.value };
    setState(newValue);
    onChange(newValue.value);
    handleApply(newValue);
  };

  const onUpperBoundChange = (e) => {
    const newValue = { ...state, upperBound: +e.target.value };
    setState(newValue);
    onChange(newValue.value);
    handleApply(newValue);
  };

  const onSliderChange = (value) => {
    const newValue = { ...state, value, lowerBound: value[0], upperBound: value[1] };
    setState(newValue);
    onChange(newValue.value);
  };

  const handleApply = (newState) => {
    const { lowerBound, upperBound } = newState;
    setState({ ...newState, value: [lowerBound, upperBound] });
  };

  return (
    <div className='row align-items-center'>
      <div className='col-md-3 col-12'>
        <label>LowerBound: </label>
        <input className="form-control" type="number" value={state.lowerBound} onChange={onLowerBoundChange} />
      </div>
      <div className='col-md-6 col-12 align-items-center mt-1'>
        <Slider
          range
          allowCross={false}
          value={state.value}
          onChange={onSliderChange}
          min={min}
          max={max}
          step={step}
        />
      </div>
      <div className='col-md-3 col-12'>
        <label>UpperBound: </label>
        <input className="form-control" type="number" value={state.upperBound} onChange={onUpperBoundChange} />
      </div>
      {error && <div className="invalid-feedback d-block text-center">{error}</div>}
    </div>
  );
};

const PriceRangeOutput = ({ minPrice, maxPrice }) => {
  const minValue = parseInt(minPrice);
  const maxValue = parseInt(maxPrice);
  const middlePoint = (minPrice + maxPrice) / 2;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <span>{`$${minPrice}`}</span>
        <span>{`$${maxPrice}`}</span>
      </div>
      <ProgressBar style={{ height: "30px" }}>
        <ProgressBar
          now={middlePoint}
          min={minValue}
          max={middlePoint}
          key={1}
          className="bg-success"
        />
        <ProgressBar
          now={middlePoint}
          min={middlePoint}
          max={maxValue}
          key={2}
          className="bg-warning"
        />
      </ProgressBar>
    </div>
  );
};

export { PriceRangeInput, PriceRangeOutput };
