import React from 'react';
import utils from "../../../Utils";
import { Modal, Button, Card } from 'react-bootstrap';


const RowModalListingDelete = ({ show, handleClose, rowData, onDelete}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Listing Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No user data available.</p>
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
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Remove Listing</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to remove this listing from favorites?</strong>
                </div><br/>
                <div>
                    <strong>Listing name:</strong> {utils.string.capitalize(rowData.listingName)}
                </div><br/>
                <div>
                    <strong>Available:</strong> {rowData.status}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.streetAddress}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Remove favorite
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const RowModalProjectDelete = ({ show, handleClose, rowData, onDelete}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Project</Modal.Title>
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
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Remove Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to remove this project from favorites?</strong>
                </div><br/>
                <div>
                    <strong>Project name:</strong> {utils.string.capitalize(rowData.projectName)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.projectLocation}
                </div><br/>
                <div>
                    <strong>Project status:</strong> {utils.string.capitalize(rowData.projectStatus)}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Remove favorite
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export {
    RowModalListingDelete,
    RowModalProjectDelete
};