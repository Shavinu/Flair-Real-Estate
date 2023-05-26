import React, { useCallback, useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import * as FileService from "../../Services/FileService";

function FileBrowser() {
  const [initialFiles, setInitialFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [userId, setUserId] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [filename, setFilename] = useState('');
  const [label, setLabel] = useState('');
  const [parentId, setParentId] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, [userId]);

  // Search Logic
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const response = await FileService.searchFiles(searchParams);
    console.log(response);
    setFiles(response.files);
    setInitialFiles(response.files);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    fetchFiles();
  }, [searchParams, fetchFiles]);

  const handleSearch = () => {
    setSearchParams({ createdBy, filename, label, parentId, type });
    console.log(searchParams);
    fetchFiles();
  };

  // Update Logic
  const handleClose = () => setShow(false);
  const handleShow = (file) => {
    setSelectedFile(file);
    setShow(true);
  };

  const handleSave = (file) => {
    const updatedFiles = files.map((f) => (f._id === file._id ? file : f));
    setFiles(updatedFiles);
    handleClose();
  };

  const handleUpdateSingle = async (file) => {
    console.log(file);
    const fileId = file._id;
    const formData = new FormData();
    if (
      file.metadata.createdBy !== initialFiles.find((f) => f._id === file._id).metadata.createdBy ||
      file.filename !== initialFiles.find((f) => f._id === file._id).filename ||
      file.metadata.label !== initialFiles.find((f) => f._id === file._id).metadata.label ||
      file.metadata.displayOnTop !== initialFiles.find((f) => f._id === file._id).metadata.displayOnTop ||
      file.metadata.parentId !== initialFiles.find((f) => f._id === file._id).metadata.parentId ||
      file.metadata.type !== initialFiles.find((f) => f._id === file._id).metadata.type
    ) {
      formData.append('_id', file._id);
      formData.append('userId', file.metadata.createdBy);
      formData.append('filename', file.filename);
      formData.append('label', file.metadata.label);
      formData.append('displayOnTop', file.metadata.displayOnTop);
      formData.append('parentId', file.metadata.parentId);
      formData.append('type', file.metadata.type);
    }

    if (formData.has('_id')) {
      try {
        await FileService.updateSingleFile(fileId, formData);
        window.toastr.success('File Updated Successfully', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
        fetchFiles();
      } catch (error) {
        window.toastr.error(error.message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-times', "closeButton": true });
      }
    } else {
      window.toastr.warning('Nothing to Update', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
    }
  };

  const handleUpdateMultiple = async () => {
    const updates = files.filter((file) => {
      return (
        file.metadata.createdBy !== initialFiles.find((f) => f._id === file._id).metadata.createdBy ||
        file.filename !== initialFiles.find((f) => f._id === file._id).filename ||
        file.metadata.label !== initialFiles.find((f) => f._id === file._id).metadata.label ||
        JSON.stringify(file.metadata.displayOnTop) !== JSON.stringify(initialFiles.find((f) => f._id === file._id).metadata.displayOnTop) ||
        file.metadata.parentId !== initialFiles.find((f) => f._id === file._id).metadata.parentId ||
        file.metadata.type !== initialFiles.find((f) => f._id === file._id).metadata.type
      );
    }).map((update) => {
      return {
        ...update,
        metadata: {
          ...update.metadata,
          userId: update.metadata.createdBy,
          label: update.metadata.label,
          displayOnTop: update.metadata.displayOnTop,
          parentId: update.metadata.parentId,
          type: update.metadata.type,
        },
      };
    });

    const formData = new FormData();
    if (updates.length > 0) {
      formData.append('updates', JSON.stringify(updates));
      updates.forEach((update) => {
        if (update.file) {
          formData.append('files', update.file);
        }
      });

      try {
        await FileService.updateMultipleFiles(formData);
        window.toastr.success('Files Updated Successfully', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
        fetchFiles();
      }
      catch (error) {
        window.toastr.error(error.message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-times', "closeButton": true });
      }
    } else {
      window.toastr.warning('Nothing to Update', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
    }
  };

  // Delete Logic
  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete ${file.filename}?`)) {
      try {
        await FileService.deleteFile(file._id);
        window.toastr.success('File Deleted Successfully', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
        fetchFiles();
      } catch (error) {
        window.toastr.error(error.message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-times', "closeButton": true });
      }
    } else {
      return;
    }
  };

  // Upload Logic
  const handleFileChange = (e) => {
    const selectedUploadFiles = Array.from(e.target.files).map((file) => ({
      file,
      userId: userId,
      label: '',
      displayOnTop: false,
      parentId: '',
      type: ''
    }));
    setNewFiles(selectedUploadFiles);
  };

  const handleInputChange = (index, field, value) => {
    const updatedFiles = [...newFiles];
    updatedFiles[index][field] = value;
    setNewFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (newFiles.length === 0) return;
    setUploading(true);

    try {
      const formDataSingle = new FormData();
      const formDataMultiple = new FormData();

      newFiles.forEach((file) => {
        if (newFiles.length === 1) {
          formDataSingle.append('file', file.file);
          formDataSingle.append('userId', file.userId);
          formDataSingle.append('label', file.label);
          formDataSingle.append('displayOnTop', file.displayOnTop);
          formDataSingle.append('parentId', file.parentId);
          formDataSingle.append('type', file.type);
        } else {
          formDataMultiple.append('files', file.file);
          formDataMultiple.append('userIds', file.userId);
          formDataMultiple.append('labels', file.label);
          formDataMultiple.append('displayOnTops', file.displayOnTop);
          formDataMultiple.append('parentIds', file.parentId);
          formDataMultiple.append('types', file.type);
        }
      });

      const endpoint =
        newFiles.length > 1 ? FileService.uploadMultiple : FileService.uploadSingle;

      const formData = newFiles.length > 1 ? formDataMultiple : formDataSingle;

      const response = await endpoint(formData);

      console.log('File upload response received:', response);

      setUploadSuccess(true);
      window.toastr.success('File(s) Uploaded Successfully', { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
      fetchFiles();
      setUploadError('');
      handleUploadModalClose();
    } catch (error) {
      console.error('Error occurred while uploading the file:', error);
      setUploadError('Error occurred while uploading the file');
      window.toastr.error(error.message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-times', "closeButton": true });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadModalClose = () => {
    setShowUpload(false);
    setNewFiles([]);
    setUploadSuccess(false);
    setUploadError('');
  }
  const handleUploadModalShow = () => {
    setShowUpload(true);
  }

  return (
    <>
      <div>
        <p className="h4 m-auto">Search Files</p>
        <Form className="mt-1 mb-1 p-1 rounded shadow">
          <Form.Group controlId="formUserId">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="text" placeholder="Enter User ID" defaultValue={userId} onChange={(e) => setCreatedBy(e.target.value)} />
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

        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={handleUploadModalShow}
            className="mr-2"
            style={{ height: "40px", width: "110px", padding: "0px" }}
          >
            Upload New File(s)
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateMultiple()}
            style={{ height: "40px", width: "90px", padding: "0px" }}
          >
            Update All
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        files && files.length > 0 ? (
          <div>
            <style>{
              `.table-bordered td,
                .table-bordered th {
                border: 1px solid #dee2e6;
                }

                .form-check-input {
                  width: 20px;
                  height: 20px;
                  margin-top: 0.3rem;
                  margin-left: 0.3rem;
                  position: relative;
                  flex-direction: column;
              }`
            }</style>
            <Table striped bordered hover className="mt-1 table-bordered" responsive size="sm" style={{ textAlign: "center", verticalAlign: "middle" }}>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Label</th>
                  <th>Type</th>
                  <th style={{ textAlign: "start", width: "40%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id}>
                    <td>{file.filename}</td>
                    <td>{file.metadata.label}</td>
                    <td>{file.metadata.type}</td>
                    <td style={{ textAlign: "start" }}>
                      <Button variant="primary" onClick={() => handleShow(file)} className="mr-1" style={{ height: "30px", width: "70px", padding: "0px" }}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(file)} className="mr-1" style={{ height: "30px", width: "70px", padding: "0px" }}>
                        Delete
                      </Button>
                      <Button variant="success" onClick={() => handleUpdateSingle(file)} className="mr-1" style={{ height: "30px", width: "70px", padding: "0px" }}>
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Edit File</Modal.Title>
                <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
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
                  <Form.Group controlId="formDisplayOnTop">
                    <Form.Label>Display On Top</Form.Label>
                    <Form.Control className="form-check-input" type="checkbox" checked={selectedFile?.metadata.displayOnTop} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, displayOnTop: e.target.checked } })} />
                  </Form.Group>
                  <Form.Group controlId="formParentId">
                    <Form.Label>Parent ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Parent ID" value={selectedFile?.metadata.parentId} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, parentId: e.target.value } })} />
                  </Form.Group>
                  <Form.Group controlId="formType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Enter Type" value={selectedFile?.metadata.type} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, type: e.target.value } })} />
                  </Form.Group>
                  <Form.Group controlId="formType">
                    <Form.Label>Created By</Form.Label>
                    <Form.Control type="text" placeholder="Enter User ID" value={selectedFile?.metadata.createdBy} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, createdBy: e.target.value } })} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave.bind(this, selectedFile)}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showUpload} onHide={handleUploadModalClose} centered>
              <Modal.Header>
                <Modal.Title>Upload File(s)</Modal.Title>
                <button type="button" className="close" aria-label="Close" onClick={handleUploadModalClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
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
                  {newFiles.map((fileData, index) => (
                    <div key={index}>
                      <p className='text-muted small'>{fileData.file.name}</p>
                      <Row>
                        <Col lg={12}>
                          <Form.Group controlId={`formUserId${index}`}>
                            <Form.Label>User ID</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter user ID"
                              defaultValue={userId}
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
                          <Form.Group controlId={`formDisplayOnTop${index}`}>
                            <Form.Label>Display On Top</Form.Label>
                            <Form.Control
                              className="form-check-input"
                              type="checkbox"
                              checked={fileData.displayOnTop}
                              onChange={(e) =>
                                handleInputChange(index, 'displayOnTop', e.target.checked)
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
                <Button variant="secondary" onClick={handleUploadModalClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={newFiles.length === 0 || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File(s)'}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <style>{
              `.table-bordered td,
              .table-bordered th {
              border: 1px solid #dee2e6;
              }

              .form-check-input {
                width: 20px;
                height: 20px;
                margin-top: 0.3rem;
                margin-left: 0.3rem;
                position: relative;
                flex-direction: column;
            }`
            }</style>
            <p className="h5">No files found</p>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header>
                <Modal.Title>Edit File</Modal.Title>
                <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
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
                  <Form.Group controlId="formDisplayOnTop">
                    <Form.Label>Display On Top</Form.Label>
                    <Form.Control className="form-check-input" type="checkbox" checked={selectedFile?.metadata.displayOnTop} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, displayOnTop: e.target.checked } })} />
                  </Form.Group>
                  <Form.Group controlId="formParentId">
                    <Form.Label>Parent ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Parent ID" value={selectedFile?.metadata.parentId} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, parentId: e.target.value } })} />
                  </Form.Group>
                  <Form.Group controlId="formType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Enter Type" value={selectedFile?.metadata.type} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, type: e.target.value } })} />
                  </Form.Group>
                  <Form.Group controlId="formType">
                    <Form.Label>Created By</Form.Label>
                    <Form.Control type="text" placeholder="Enter User ID" value={selectedFile?.metadata.createdBy} onChange={(e) => setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, createdBy: e.target.value } })} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave.bind(this, selectedFile)}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showUpload} onHide={handleUploadModalClose} centered>
              <Modal.Header>
                <Modal.Title>Upload File(s)</Modal.Title>
                <button type="button" className="close" aria-label="Close" onClick={handleUploadModalClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
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
                  {newFiles.map((fileData, index) => (
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
                          <Form.Group controlId={`formDisplayOnTop${index}`}>
                            <Form.Label>Display On Top</Form.Label>
                            <Form.Control
                              className="form-check-input"
                              type="checkbox"
                              checked={fileData.displayOnTop}
                              onChange={(e) =>
                                handleInputChange(index, 'displayOnTop', e.target.checked)
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
                <Button variant="secondary" onClick={handleUploadModalClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={newFiles.length === 0 || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File(s)'}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )
      )}
    </>
  );
};
export default FileBrowser;