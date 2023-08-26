import { useState, useEffect } from "react";
import utils from "../../../Utils";
import { Modal, Button, Card } from 'react-bootstrap';
import * as FileService from "../../../Services/FileService";

const RowModal = ({ show, handleClose, rowData}) => {
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
                {/* <div>
                    <strong>ID:</strong> {rowData._id}
                </div><br/> */}
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.firstName)+" "+utils.string.capitalize(rowData.lastName)}
                </div><br/>
                <div>
                    <strong>Account type:</strong> {utils.string.capitalize(rowData.accType)}
                </div><br/>
                <div>
                    <strong>Contact number:</strong> {rowData.phoneNo || 'Not available'}
                </div><br/>
                <div>
                    <strong>Email:</strong> {rowData.email || 'Not available'}
                </div><br/>
                <div>
                    <strong>Account created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Last modified at:</strong> {utils.dateFormat(rowData.updatedAt)}
                </div><br/>
                <div>
                    <strong>License number:</strong> {rowData.licence || 'Not available'} 
                </div><br/>
                <div>
                    <strong>License verified:</strong> {rowData.verifiedLicence ? 'Verified' : 'Not verified'}
                </div><br/>
                <div>
                    <strong>City:</strong> {utils.string.capitalize(rowData.city) || 'Not available'}
                </div><br/>
                <div>
                    <strong>Company:</strong> {utils.string.capitalize(rowData.company) || 'Not available'}
                </div><br/>
                <div>
                    <strong>Postcode:</strong> {rowData.postcode || 'Not available'}
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


const ListingRowModal = ({ show, handleCloseListing, rowData, onApprove}) => {


    const [titleImage, setTitleImage] = useState('');

    useEffect(() => {
        getImgURL(rowData?.titleImage);
      }, [rowData]);

    const getImgURL = async (img) => {
        try {
          const fetchedImageURL = await FileService.getImageUrl(img);
          setTitleImage(fetchedImageURL);
        } catch (error) {
          console.error(error);
        }
      };



    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleCloseListing}>
                <Modal.Header closeButton>
                    <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No data available.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseListing}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleCloseListing}>
            <Modal.Header closeButton>
                <Modal.Title>Listing Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    {JSON.stringify(rowData)}
                </div> */}
                <div>
                    <Card.Img
                        variant="top"
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        src={titleImage}
                    />
                </div><br/>
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.listingName)}
                </div><br/>
                <div>
                    <strong>Listing type:</strong> {utils.string.capitalize(rowData.type)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.streetAddress}
                </div><br/>
                <div>
                    <strong>Region:</strong> {rowData.region}
                </div><br/>
                <div>
                    <strong>Last modified at:</strong> {utils.dateFormat(rowData.updatedAt)}
                </div><br/>
                <div>
                    <strong>Suburb:</strong> {utils.string.capitalize(rowData.suburb)}
                </div><br/>
                <div>
                    <strong>Project:</strong> {utils.string.capitalize(rowData.project) || 'No project assigned'}
                </div><br/>
                <div>
                    <strong>Developer details:</strong> 
                    <ul>
                        <li>
                            Name: {rowData.devloper} {rowData.devLastname}
                        </li>
                        <li>
                            Mobile: {rowData.devMobile} and {rowData.devMobile2}
                        </li>
                        <li>
                            Email: {rowData.email}
                        </li>
                        <li>
                            Licence verified: {rowData.verified ? 'Verified' : 'Not verified'}
                        </li>
                    </ul>
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseListing}>
                    Close
                </Button>
                <Button variant="primary" onClick={onApprove}>
                    Approve listing
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ProjectRowModal = ({ show, handleCloseProject, rowData, onApprove}) => {

    const [titleImage, setTitleImage] = useState('');

    useEffect(() => {
        getImgURL(rowData?.projectTitleImage);
      }, [rowData]);

    const getImgURL = async (img) => {
        try {
          const fetchedImageURL = await FileService.getImageUrl(img);
          setTitleImage(fetchedImageURL);
        } catch (error) {
          console.error(error);
        }
      };



    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleCloseProject}>
                <Modal.Header closeButton>
                    <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No data available.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProject}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleCloseProject}>
            <Modal.Header closeButton>
                <Modal.Title>Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                <div>
                    <Card.Img
                    variant="top"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    src={titleImage}
                  />
                </div>
                <br></br>
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                {/* <div>
                    <strong>ID:</strong> {rowData._id}
                </div><br/> */}
                <div>
                    <strong>Project Name:</strong> {utils.string.capitalize(rowData.projectName)}
                </div><br/>
                <div>
                    <strong>Project type:</strong> {utils.string.capitalize(rowData.projectType)}
                </div><br/>
                <div>
                    <strong>Address:</strong> {rowData.locationName  || 'Not available'} 
                </div><br/>
                <div>
                    <strong>Region:</strong> {rowData.region || 'Not available'} 
                </div><br/>
                <div>
                    <strong>Price range:</strong> AUD {rowData.projectPriceRange[0].minPrice || '--'} - {rowData.projectPriceRange[0].maxPrice || '--'}
                </div><br/>
                <div>
                    <strong>Last modified at:</strong> {utils.dateFormat(rowData.updatedAt)}
                </div><br/>
                <div>
                    <strong>Created at:</strong> {utils.dateFormat(rowData.createdAt)}
                </div><br/>
                <div>
                    <strong>Project Details:</strong> 
                    <ul>
                        <li>
                        Project Owner: {utils.string.capitalize(rowData.projectOwner)}
                        </li>
                        <li>
                        Phone number: {rowData.phoneNumber || 'Not available'}
                        </li>
                        <li>
                            Email: {rowData.email || 'Not available'} 
                        </li>
                        <li>
                            License: {rowData.licence || 'Not available'} 
                        </li>
                    </ul>
                </div><br/>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseProject}>
                    Close
                </Button>
                <Button variant="primary" onClick={onApprove}>
                    Approve project
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export {RowModal, ListingRowModal, ProjectRowModal};
