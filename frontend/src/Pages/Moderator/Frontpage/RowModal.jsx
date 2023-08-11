import React from 'react';
import utils from "../../../Utils";
import { Modal, Button } from 'react-bootstrap';

const RowModal = ({ show, handleClose, rowData }) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No data available.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                <div>
                    <strong>First name:</strong> {utils.string.capitalize(rowData.firstName)+" "+utils.string.capitalize(rowData.lastName)}
                </div><br/>
                <div>
                    <strong>Account type:</strong> {utils.string.capitalize(rowData.accType)}
                </div><br/>
                <div>
                    <strong>Contact number:</strong> {rowData.phoneNo}
                </div><br/>
                <div>
                    <strong>Email:</strong> {rowData.email}
                </div><br/>
                <div>
                    <strong>Account created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Last modified at:</strong> {utils.dateFormat(rowData.updatedAt)}
                </div><br/>
                <div>
                    <strong>License number:</strong> {rowData.licence}
                </div><br/>
                <div>
                    <strong>City:</strong> {utils.string.capitalize(rowData.city)}
                </div><br/>
                <div>
                    <strong>Company:</strong> {utils.string.capitalize(rowData.company)}
                </div><br/>
                <div>
                    <strong>Country:</strong> {utils.string.capitalize(rowData.country)}
                </div><br/>
                <div>
                    <strong>Postcode:</strong> {rowData.postcode}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RowModal;
