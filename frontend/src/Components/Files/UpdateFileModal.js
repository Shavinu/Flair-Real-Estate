import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { api } from '../../paths';
import axios from 'axios';

const FileUpdate = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState({ fileId: '', createdBy: '', label: '' });

    axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    const handleSearch = async () => {
        try {
            const results = await axios({ method: 'GET', url: api.files.search, params: searchParams });
            setSearchResults(results.data.files);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateSingleFile = async (index) => {
        try {
          const fileData = searchResults[index];
          const formData = new FormData();
      
          formData.append('userId', fileData.metadata.createdBy);
          formData.append('label', fileData.metadata.label);
          formData.append('filename', fileData.filename);
      
          if (fileInputs[index]) {
            formData.append('file', fileInputs[index]);
          }
      
          const updatedFile = await axios({
            method: 'PATCH',
            url: `${api.files.updateSingle}/${fileData._id}`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log('updatedFile:', updatedFile); // Log the updatedFile to see its structure
      
          setSearchResults((prevResults) => {
            const updatedResults = [...prevResults];
            updatedResults[index] = updatedFile.data.file;
            return updatedResults;
          });
        } catch (err) {
          console.error(err);
        }
    };      

    const handleUpdateAllFiles = async () => {
        try {
            const formData = new FormData();
            formData.append('updates', JSON.stringify(searchResults));

            Object.entries(fileInputs).forEach(([index, file]) => {
                formData.append(`files[${index}]`, file);
            });

            const updatedFiles = await axios.patch(api.files.updateMultiple, formData);
            setSearchResults(updatedFiles.data.files);
        } catch (err) {
            console.error(err);
        }
    };

    const [fileInputs, setFileInputs] = useState({});

    const handleFileChange = (index, file) => {
        setFileInputs((prevFileInputs) => {
            const updatedFileInputs = { ...prevFileInputs };
            updatedFileInputs[index] = file;
            return updatedFileInputs;
        });
    };

    return (
        <div>
            <h2>Search Files</h2>
            <Row>
                <Col>
                    <Form.Group controlId="fileId">
                        <Form.Label>File ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchParams.fileId}
                            onChange={(e) => setSearchParams({ ...searchParams, fileId: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="createdBy">
                        <Form.Label>Created By</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchParams.createdBy}
                            onChange={(e) => setSearchParams({ ...searchParams, createdBy: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="label">
                        <Form.Label>Label</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchParams.label}
                            onChange={(e) => setSearchParams({ ...searchParams, label: e.target.value })}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>

            {searchResults.length > 0 && (
                <div>
                    <h2>Update Files</h2>
                    <Button variant="success" onClick={handleUpdateAllFiles}>
                        Update All Files
                    </Button>
                    <ul>
                        {searchResults.map((file, index) => (
                            <li key={file._id}>
                                <h5>Filename</h5>
                                <input
                                    type="text"
                                    value={file.filename}
                                    onChange={(e) => {
                                        const updatedFile = { ...file, filename: e.target.value };
                                        setSearchResults((prevResults) => {
                                            const updatedResults = [...prevResults];
                                            updatedResults[index] = updatedFile;
                                            return updatedResults;
                                        });
                                    }}
                                />
                                <h5>Created By</h5>
                                <input
                                    type="text"
                                    value={file.metadata.createdBy}
                                    onChange={(e) => {
                                        const updatedFile = { ...file, metadata: { ...file.metadata, createdBy: e.target.value } };
                                        setSearchResults((prevResults) => {
                                            const updatedResults = [...prevResults];
                                            updatedResults[index] = updatedFile;
                                            return updatedResults;
                                        });
                                    }}
                                />
                                <h5>Label</h5>
                                <input
                                    type="text"
                                    value={file.metadata.label}
                                    onChange={(e) => {
                                        const updatedFile = { ...file, metadata: { ...file.metadata, label: e.target.value } };
                                        setSearchResults((prevResults) => {
                                            const updatedResults = [...prevResults];
                                            updatedResults[index] = updatedFile;
                                            return updatedResults;
                                        });
                                    }}
                                />
                                <h5>Replace File</h5>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                                />
                                <Button variant="success" onClick={() => handleUpdateSingleFile(index)}>
                                    Update
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpdate;
