import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, InputGroup, Row, Col } from 'react-bootstrap';

const FileWithCategoryBrowser = ({ options, onFilesChange, error }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(!!error);
  }, [error]);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    if (selectedOption !== '') {
      document.getElementById('fileInput').click();
    }
  };

  const handleFilesChange = (e) => {
    const file = e.target.files[0];
    const newFile = {
      file,
      category: selectedCategory === 'Other' ? '' : selectedCategory,
      isOther: selectedCategory === 'Other',
    };
    const newFiles = [...files, newFile];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleCustomLabelChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index].category = e.target.value;
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <Dropdown onSelect={handleCategoryChange}>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          {selectedCategory || 'Select a category'}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ margin: 0 }}>
          {options.map((option) => (
            <Dropdown.Item key={option} eventKey={option}>
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {files.map((fileObj, index) => (
        <Row className='mt-1 mb-1' key={index}>
          <InputGroup key={index} as={Col} md="6">
            <Form.Control
              type="text"
              value={fileObj.category}
              onChange={(e) => handleCustomLabelChange(e, index)}
              placeholder={fileObj.isOther ? 'Please type file category' : ''}
              readOnly={!fileObj.isOther}
              className={isInvalid && fileObj.isOther && !fileObj.category ? 'is-invalid mr-1' : 'mr-1'}
            />

            <Button className='mr-1' variant="outline-secondary" disabled>
              {fileObj.file.name}
            </Button>
            <Button variant="danger" onClick={() => removeFile(index)}>
              Remove
            </Button>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </InputGroup>
        </Row>
      ))}

      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFilesChange}
      />
    </div>
  );
};

export default FileWithCategoryBrowser;
