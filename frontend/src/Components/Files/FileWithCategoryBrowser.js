import React, { useState, useEffect } from 'react';
import * as FileService from '../../Services/FileService';
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

const getFileLabelWithIndex = (fileObj, categoryCounts, currentCategoryIndex) => {
  let labelWithIndex = fileObj.category;
  if (categoryCounts[fileObj.category] > 1) {
    if (currentCategoryIndex[fileObj.category]) {
      currentCategoryIndex[fileObj.category]++;
    } else {
      currentCategoryIndex[fileObj.category] = 1;
    }
    labelWithIndex += `_${currentCategoryIndex[fileObj.category]}`;
  }
  return labelWithIndex;
};

const createFileUploadFormData = (fileObj, categoryCounts, currentCategoryIndex, user) => {
  const formData = new FormData();
  formData.append('file', fileObj.file);
  formData.append('createdBy', user);
  formData.append('label', getFileLabelWithIndex(fileObj, categoryCounts, currentCategoryIndex));
  return formData;
};

const uploadFilesAndGetFileIds = async (fileUploadFiles, user) => {
  const categoryCounts = {};
  const currentCategoryIndex = {};

  fileUploadFiles.forEach((fileObj) => {
    if (categoryCounts[fileObj.category]) {
      categoryCounts[fileObj.category]++;
    } else {
      categoryCounts[fileObj.category] = 1;
    }
  });

  const filePromises = fileUploadFiles.map((fileObj) => {
    const formData = createFileUploadFormData(fileObj, categoryCounts, currentCategoryIndex, user);

    return FileService.uploadSingle(formData)
      .then((response) => {
        return response.file._id;
      })
      .catch((e) => {
        console.log(e);
      });
  });

  const fileIds = await Promise.all(filePromises);
  return fileIds;
};

export { FileWithCategoryBrowser, uploadFilesAndGetFileIds };
