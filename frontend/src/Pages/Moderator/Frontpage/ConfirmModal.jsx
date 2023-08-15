import React from 'react';
import utils from "../../../Utils";
import { Modal, Button, Card } from 'react-bootstrap';

const RowModalUserDelete = ({ show, handleClose, rowData}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User Details</Modal.Title>
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {rowData._id}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to remove this user?</strong>
                </div><br/>
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.firstName)+" "+utils.string.capitalize(rowData.lastName)}
                </div><br/>
                <div>
                    <strong>Account type:</strong> {utils.string.capitalize(rowData.accType)}
                </div><br/>
                <div>
                    <strong>Account created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger">
                    Remove user
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const RowModalUserApprove = ({ show, handleClose, rowData}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve User Details</Modal.Title>
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Approve User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {rowData._id}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to approve this user?</strong>
                </div><br/>
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.firstName)+" "+utils.string.capitalize(rowData.lastName)}
                </div><br/>
                <div>
                    <strong>Account type:</strong> {utils.string.capitalize(rowData.accType)}
                </div><br/>
                <div>
                    <strong>Account created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary">
                    Approve user
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const RowModalListingApprove = ({ show, handleClose, rowData, onApprove}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve Listing Details</Modal.Title>
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
                <Modal.Title>Approve Listing Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to approve this listing?</strong>
                </div><br/>
                <div>
                    <strong>Listing name:</strong> {utils.string.capitalize(rowData.listingName)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.streetAddress}
                </div><br/>
                <div>
                    <strong>Listing created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Listing by:</strong> {utils.string.capitalize(rowData.devloper)+" "+utils.string.capitalize(rowData.devLastname) }
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button ariant="primary" onClick={onApprove}>
                    Approve listing
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const RowModalListingDelete = ({ show, handleClose, rowData, onDelete}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Listing Details</Modal.Title>
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
                <Modal.Title>Delete Listing Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to approve this listing?</strong>
                </div><br/>
                <div>
                    <strong>Listing name:</strong> {utils.string.capitalize(rowData.listingName)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.streetAddress}
                </div><br/>
                <div>
                    <strong>Listing created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Listing by:</strong> {utils.string.capitalize(rowData.devloper)+" "+utils.string.capitalize(rowData.devLastname) }
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete listing
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const RowModalProjectApprove = ({ show, handleClose, rowData, onApprove}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve Project Details</Modal.Title>
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
                <Modal.Title>Approve Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to approve this project?</strong>
                </div><br/>
                <div>
                    <strong>Listing name:</strong> {utils.string.capitalize(rowData.projectName)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.locationName}
                </div><br/>
                <div>
                    <strong>Listing created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Listing by:</strong> {utils.string.capitalize(rowData.projectOwner)}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button ariant="primary" onClick={onApprove}>
                    Approve project
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
                    <Modal.Title>Delete Project Details</Modal.Title>
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
                <Modal.Title>Delete Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                <div>
                    <strong>Are you sure you want to approve this project?</strong>
                </div><br/>
                <div>
                    <strong>Listing name:</strong> {utils.string.capitalize(rowData.projectName)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.locationName}
                </div><br/>
                <div>
                    <strong>Listing created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Listing by:</strong> {utils.string.capitalize(rowData.projectOwner)}
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete project
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export {
    RowModalUserDelete, 
    RowModalUserApprove, 
    RowModalListingApprove, 
    RowModalListingDelete,
    RowModalProjectApprove,
    RowModalProjectDelete
};