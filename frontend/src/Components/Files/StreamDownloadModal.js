import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Card } from 'react-bootstrap';
import { api } from '../../paths';

const FileStreamDownload = () => {
  const [show, setShow] = useState(false);
  const [fileId, setFileId] = useState('');
  const [streamError, setStreamError] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [fileURL, setFileURL] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileIdChange = (e) => {
    setFileId(e.target.value);
  };

  const handleStream = async () => {
    if (!fileId) return;
    setStreaming(true);
    setStreamError('');
    setFileURL('');

    axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(`${api.files.stream}/${fileId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = URL.createObjectURL(blob);
      setFileURL(url);
    } catch (error) {
      console.error('Error occurred while streaming the file:', error);
      setStreamError('Error occurred while streaming the file');
    } finally {
      setStreaming(false);
    }
  };

  const handleDownload = async () => {
    if (!fileId) return;

    axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(`${api.files.download}/${fileId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error occurred while downloading the file:', error);
      setStreamError('Error occurred while downloading the file');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Stream / Download File
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Stream / Download File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileId">
              <Form.Label>Enter File ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="File ID"
                value={fileId}
                onChange={handleFileIdChange}
              />
            </Form.Group>
          </Form>
          {streamError && <Alert variant="danger">{streamError}</Alert>}
          {fileURL && (
            <iframe
              src={fileURL}
              style={{ width: '100%', height: '400px', border: 'none' }}
              title="Inline File Stream"
            ></iframe>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="info"
            onClick={handleStream}
            disabled={!fileId || streaming}
          >
            {streaming ? 'Streaming...' : 'Stream File'}
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={!fileId}
          >
            Download File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileStreamDownload;