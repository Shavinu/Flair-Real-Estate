import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import * as FileService from "../../Services/FileService";

function FileTable() {
  const [files, setFiles] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const [userId, setUserId] = useState('');
  const [filename, setFilename] = useState('');
  const [label, setLabel] = useState('');
  const [parentId, setParentId] = useState('');
  const [type, setType] = useState('');

  const fetchFiles = async () => {
    const response = await FileService.searchFiles(searchParams);
    setFiles(response.files);
  };

  useEffect(() => {
    fetchFiles();
  }, [searchParams]);

  const handleClose = () => setShow(false);
  const handleShow = (file) => {
    setSelectedFile(file);
    setShow(true);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('_id', selectedFile._id);
    formData.append('filename', selectedFile.filename);
    formData.append('label', selectedFile.metadata.label);
    formData.append('parentId', selectedFile.metadata.parentId);
    formData.append('type', selectedFile.metadata.type);
    await FileService.updateSingleFile(selectedFile._id, formData);
    handleClose();
    fetchFiles();
  };

  const handleSearch = () => {
    setSearchParams({ createdBy: userId, filename, label, parentId, type });
    console.log(searchParams);
    fetchFiles();
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="formUserId">
          <Form.Label>User ID</Form.Label>
          <Form.Control type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formLabel">
          <Form.Label>File Name</Form.Label>
          <Form.Control type="text" placeholder="Enter File Name" value={filename} onChange={(e) => setFilename(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formLabel">
          <Form.Label>Label</Form.Label>
          <Form.Control type="text" placeholder="Enter Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formParentId">
          <Form.Label>Parent ID</Form.Label>
          <Form.Control type="text" placeholder="Enter Parent ID" value={parentId} onChange={(e) => setParentId(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formType">
          <Form.Label>Type</Form.Label>
          <Form.Control type="text" placeholder="Enter Type" value={type} onChange={(e) => setType(e.target.value)} />
        </Form.Group>
        <Button className="my-1" variant="primary" onClick={handleSearch}>Search</Button>
      </Form>
      <Table striped bordered hover mt-1>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Label</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>{file.filename}</td>
              <td>{file.metadata.label}</td>
              <td>{file.metadata.type}</td>
              <td>
                <Button variant="primary" onClick={() => handleShow(file)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Filename</Form.Label>
              <Form.Control type="text" placeholder="Enter Filename" value={selectedFile?.filename} onChange={(e) => setSelectedFile({ ...selectedFile, filename: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control type="text" placeholder="Enter Label" value={selectedFile?.metadata.label} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, label: e.target.value } })} />
            </Form.Group>
            <Form.Group controlId="formParentId">
              <Form.Label>Parent ID</Form.Label>
              <Form.Control type="text" placeholder="Enter Parent ID" value={selectedFile?.metadata.parentId} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, parentId: e.target.value } })} />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Enter Type" value={selectedFile?.metadata.type} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, type: e.target.value } })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileTable;

