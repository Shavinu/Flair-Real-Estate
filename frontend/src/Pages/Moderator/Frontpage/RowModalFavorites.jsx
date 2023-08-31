import { useState, useEffect } from "react";
import utils from "../../../Utils";
import { Link, useParams } from "react-router-dom";
import { Modal, Button, Card } from 'react-bootstrap';

const FavoriteListingRowModal = ({ show, handleCloseFavoriteListing, rowData}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleCloseFavoriteListing}>
                <Modal.Header closeButton>
                    <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No data available.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseFavoriteListing}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleCloseFavoriteListing}>
            <Modal.Header closeButton>
                <Modal.Title>Listing Favorite Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <div>
                    {JSON.stringify(rowData)}
                </div> */}
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.firstName)+" "+utils.string.capitalize(rowData.firstName)}
                </div><br/>
                <div>
                    <strong>Contact details:</strong><br/><br/>
                    <ul>
                        <li>
                            Email : {rowData.email  || 'Not available'} 
                        </li>
                        <li>
                            Phone : {rowData.phoneNo || 'Not available'}    
                        </li>    
                    </ul> 
                </div><br/>
                <div>
                    <strong>Interests in listings</strong><br/><br/>
                    <ol>
            {rowData.listingsFavo.map((listing, index) => (
                <li key={index}>
                    <strong>Listing Name:</strong> {listing.listingName}
                    <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/listings/${listing._id}`} target="_blank">
                        <i className="feather icon-corner-up-right"></i>
                    </Link><br /><br />
                    <strong>Status:</strong> {listing.status}<br />
                    <strong>Address:</strong>{listing.streetAddress}<br/>
                    <strong>Price Range:</strong> AUD ${listing.priceRange[0].minPrice} - {listing.priceRange[0].maxPrice}<br/><br/>
                </li>
            ))}
        </ol>
                </div><br />
            
                
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCloseFavoriteListing}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const FavoriteProjectRowModal = ({ show, handleCloseModalFavoriteProject, rowData}) => {
    if (!rowData) {
        // Return a message or placeholder if rowData is not available
        return (
            <Modal show={show} onHide={handleCloseModalFavoriteProject}>
                <Modal.Header closeButton>
                    <Modal.Title>Row Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No data available.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModalFavoriteProject}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    return (
        <Modal show={show} onHide={handleCloseModalFavoriteProject}>
            <Modal.Header closeButton>
                <Modal.Title>Favorite Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display row properties here */}
                {/* For example: */}
                {/* <br></br> */}
                {/* <div>
                    <strong>ID:</strong> {JSON.stringify(rowData)}
                </div><br/> */}
                {/* <div>
                    <strong>ID:</strong> {rowData._id}
                </div><br/> */}
                <div>
                    <strong>Name:</strong> {utils.string.capitalize(rowData.firstName) + " " + utils.string.capitalize(rowData.firstName)}
                </div><br />
                <div>
                    <strong>Contact details:</strong>
                    <ul>
                        <li>
                            Email : {rowData.email || 'Not available'}
                        </li>
                        <li>
                            Phone : {rowData.phoneNo || 'Not available'}
                        </li>
                    </ul>
                </div><br />
                <div>
                    <strong>Interests in projects</strong>
                    <ol> {/* Use <ol> for ordered/numbered list */}
                        {rowData.projects.map((project, index) => (
                            <li key={index}>
                                <strong>Project Name:</strong> {utils.string.capitalize(project.projectName)} &nbsp;                               
                                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/projects/${project._id}`} target="_blank">
                                    <i className="feather icon-corner-up-right"></i>
                                </Link><br />
                                <strong>Status:</strong> {project.status}<br />
                                <strong>Created At:</strong> {utils.dateFormat(project.createdA)}<br />
                                <strong>Address:</strong>{utils.string.capitalize(project.locationName)}<br /><br />

                            </li>
                        ))}
                    </ol>
                </div><br />
                <div>

                </div>
                {/* Add other properties */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleCloseModalFavoriteProject}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export {FavoriteListingRowModal, FavoriteProjectRowModal};
