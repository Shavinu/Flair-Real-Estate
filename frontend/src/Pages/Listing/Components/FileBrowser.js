import React, { useState, useEffect } from 'react';
import * as FileService from '../../../Services/FileService';
import { Button, ButtonGroup, Dropdown, InputGroup, Form, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';

const FileBrowser = ({ options, onFilesChange, error, setErrors }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const userTypes = ['All', 'Agent', 'Builder', 'User']

  useEffect(() => {
    setIsInvalid(!!error);
  }, [error]);

  useEffect(() => {
    const hasInvalidFile = files.some(fileObj => fileObj.isOther && !fileObj.category);
    if (hasInvalidFile) {
      setIsInvalid(true);
      setErrors({ listingFiles: 'Please provide a category for each file' });
    } else {
      setIsInvalid(false);
      const errorsCopy = { ...error };
      delete errorsCopy.listingFiles;
      setErrors(errorsCopy);
    }
  }, [error, files, setErrors]);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
    if (selectedOption && selectedOption.value !== '') {
      document.getElementById('fileInput').click();
    }
  };

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      category: selectedCategory === 'Other' ? '' : selectedCategory,
      isOther: selectedCategory === 'Other',
      displayTop: false,
      visibleTo: ['All']
    }));

    if (replaceIndex !== null) {
      setFiles(prevFiles => {
        const filesCopy = [...prevFiles];
        filesCopy[replaceIndex] = newFiles[0];
        return filesCopy;
      });
      setReplaceIndex(null);
    } else {
      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    }
    e.target.value = '';
  };

  const handleCategoryChangePerFile = (selectedOption, index) => {
    const newFiles = [...files];
    newFiles[index].category = selectedOption.value === 'Other' ? '' : selectedOption.value;
    newFiles[index].isOther = selectedOption.value === 'Other';
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleCustomLabelChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index].category = e.target.value;
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDisplayTopChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index].displayTop = e.target.checked;
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleVisibleToChange = (selectedOptions, index) => {
    if (!selectedOptions.length) {
      const newFiles = [...files];
      newFiles[index].visibleTo = ['All'];
      setFiles(newFiles);
      onFilesChange(newFiles);
      return;
    }

    const newVisibleTo = selectedOptions.map(option => option.value);
    console.log(newVisibleTo);

    // If 'All' is already selected, and user selects another option, remove 'All'
    if (files[index].visibleTo.includes('All') && newVisibleTo.length > 1) {
      newVisibleTo.splice(newVisibleTo.indexOf('All'), 1);
    }

    // If 'All' is not selected, and user selects 'All', remove all other options
    if (!files[index].visibleTo.includes('All') && newVisibleTo.includes('All')) {
      newVisibleTo.splice(0, newVisibleTo.length, 'All');
    }

    const newFiles = [...files];
    newFiles[index].visibleTo = newVisibleTo;
    setFiles(newFiles);
    onFilesChange(newFiles);
    console.log(files);
  };

  const replaceFile = (index) => {
    setReplaceIndex(index);
    document.getElementById('fileInput').click();
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className='align-self-center m-auto'
        options={options}
        isClearable
        placeholder="Please select a category"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), }}
      />

      <div className='table-responsive'>
        <Table striped bordered hover width={'auto'}>
          <thead>
            <tr>
              <th>Display on top</th>
              <th>Category</th>
              <th>Visible to</th>
              <th>File name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((fileObj, index) => (
              <tr key={index}>
                <td>
                  <style>
                    {`
                  .form-check-input {
                    position: relative;
                `}
                  </style>
                  <Form.Check
                    id="displayTop"
                    checked={fileObj.displayTop}
                    onChange={(e) => handleDisplayTopChange(e, index)}
                  />
                </td>
                <td>
                  <Select
                    value={{ value: fileObj.category, label: fileObj.category || 'Other' }}
                    onChange={(selectedOption) => handleCategoryChangePerFile(selectedOption, index)}
                    options={options}
                    placeholder="Please select a category"
                    menuPortalTarget={document.body}
                  />
                  {fileObj.isOther && (
                    <Form.Control
                      type="text"
                      value={fileObj.category}
                      onChange={(e) => handleCustomLabelChange(e, index)}
                      placeholder='Please type file category'
                      className={isInvalid && !fileObj.category ? 'is-invalid mt-1' : ''}
                    />
                  )}
                </td>
                <td>
                  <Form.Control className='p-0 w-100 h-100 border-0 shadow-none bg-transparent text-left text-secondary'
                    as={Select}
                    key={fileObj.visibleTo}
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    overflowX="scroll"
                    isMulti
                    options={userTypes.map(userType => ({ value: userType, label: userType }))}
                    value={fileObj.visibleTo ? fileObj.visibleTo.map(userType => ({ value: userType, label: userType })) : [{ value: 'All', label: 'All' }]}
                    onChange={(e) => handleVisibleToChange(e, index)}
                    placeholder="Visible to"
                  />
                </td>
                <td>
                  {fileObj.file.name}
                </td>
                <td>
                  <ButtonGroup>
                    <Button variant="primary" onClick={() => replaceFile(index)}>
                      Replace
                    </Button>
                    <Button variant="danger" onClick={() => removeFile(index)}>
                      Remove
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFilesChange}
        multiple
      />
    </div>
  );
};

const getCategoryIndex = (fileObj, categoryCounts, currentCategoryIndex) => {
  if (!currentCategoryIndex[fileObj.category]) {
    currentCategoryIndex[fileObj.category] = 1;
  } else if (categoryCounts[fileObj.category] > 1) {
    currentCategoryIndex[fileObj.category]++;
  }
  return currentCategoryIndex[fileObj.category];
};

const getLabel = (fileObj, categoryCounts, currentCategoryIndex) => {
  let label = fileObj.category;
  if (categoryCounts[fileObj.category] > 1) {
    label += ` (${currentCategoryIndex[fileObj.category]})`;
  }
  return label;
};

const createFileUploadFormData = (fileObj, categoryCounts, currentCategoryIndex, user) => {
  const formData = new FormData();
  formData.append('file', fileObj.file);
  formData.append('userId', user);
  formData.append('label', getLabel(fileObj, categoryCounts, currentCategoryIndex));
  return formData;
};

const UploadFiles = async (fileUploadFiles, user) => {
  try {
    let categoryCounts = {};
    let currentCategoryIndex = {};

    fileUploadFiles.forEach((fileObj) => {
      categoryCounts[fileObj.category] = (categoryCounts[fileObj.category] || 0) + 1;
    });

    const listingFiles = await Promise.all(
      fileUploadFiles.map(async (fileObj) => {
        const category_index = getCategoryIndex(fileObj, categoryCounts, currentCategoryIndex);
        const formData = createFileUploadFormData(fileObj, categoryCounts, currentCategoryIndex, user);
        const response = await FileService.uploadSingle(formData);
        return { file_id: response.file._id, category: fileObj.category, category_index: category_index, fileName: fileObj.file.name, displayTop: fileObj.displayTop, visibleTo: fileObj.visibleTo };
      })
    );

    console.log(listingFiles);
    if (listingFiles.length === 0) {
      return;
    }
    return JSON.stringify(listingFiles);
  } catch (e) {
    console.log(e);
  }
};

export { FileBrowser, UploadFiles };
