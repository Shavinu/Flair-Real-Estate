import React, { useEffect, useState } from 'react';
import * as FileService from '../../Services/FileService';
import axios from 'axios';
import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { api } from '../../paths';

const FileUploadModal = () => {
  const [userId, setUserId] = useState();
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!userId) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserId(user.payload._id);
      }
      else {
        setUserId('');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      userId: userId,
      label: '',
      parentId: '',
      type: ''
    }));
    setFiles(selectedFiles);
  };

  const handleInputChange = (index, field, value) => {
    const updatedFiles = [...files];
    updatedFiles[index][field] = value;
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const formDataSingle = new FormData();
      const formDataMultiple = new FormData();

      files.forEach((file) => {
        if (files.length === 1) {
          formDataSingle.append('file', file.file);
          formDataSingle.append('userId', file.userId);
          formDataSingle.append('label', file.label);
          formDataSingle.append('parentId', file.parentId);
          formDataSingle.append('type', file.type);
        } else {
          formDataMultiple.append('files', file.file);
          formDataMultiple.append('userIds', file.userId);
          formDataMultiple.append('labels', file.label);
          formDataMultiple.append('parentIds', file.parentId);
          formDataMultiple.append('types', file.type);
        }
      });

      const endpoint =
        files.length > 1 ? FileService.uploadMultiple : FileService.uploadSingle;

      const formData = files.length > 1 ? formDataMultiple : formDataSingle;

      const response = await endpoint(formData);

      console.log('File upload response received:', response);

      setUploadSuccess(true);
      setUploadError('');
    } catch (error) {
      console.error('Error occurred while uploading the file:', error);
      setUploadError('Error occurred while uploading the file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Upload File(s)
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload File(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Select file(s) to upload</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                multiple
                className="form-control-file"
              />
            </Form.Group>
            {files.map((fileData, index) => (
              <div key={index}>
                <p className='text-muted small'>{fileData.file.name}</p>
                <Row>
                  <Col lg={12}>
                    <Form.Group controlId={`formUserId${index}`}>
                      <Form.Label>User ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter user ID"
                        value={fileData.userId}
                        onChange={(e) =>
                          handleInputChange(index, 'userId', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} className='my-1'>
                    <Form.Group controlId={`formLabel${index}`}>
                      <Form.Label>Label</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter label"
                        value={fileData.label}
                        onChange={(e) =>
                          handleInputChange(index, 'label', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} className='my-1'>
                    <Form.Group controlId={`formParentId${index}`}>
                      <Form.Label>Parent ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter parent ID"
                        value={fileData.parentId}
                        onChange={(e) =>
                          handleInputChange(index, 'parentId', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} className='my-1'>
                    <Form.Group controlId={`formType${index}`}>
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter type"
                        value={fileData.type}
                        onChange={(e) =>
                          handleInputChange(index, 'type', e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </Form>
          {uploadSuccess && (
            <Alert variant="success">File(s) uploaded successfully!</Alert>
          )}
          {uploadError && <Alert variant="danger">{uploadError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File(s)'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileUploadModal;
