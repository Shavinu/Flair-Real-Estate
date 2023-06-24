import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import { getCoordinates, renderMapboxMap } from "../../Components/Maps/getCordinates";
import NearbyPOIs from "../../Components/Maps/getNearbyPOIs";
import * as GroupService from "../../Services/GroupService";
import * as ListingService from "../../Services/ListingService";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import * as UserService from "../../Services/UserService";
import { PriceRangeOutput } from "../../Components/Form/PriceRange";
import CardCarousel from "./Components/ImageCarousel";
import { useState, useEffect } from "react";

const ListingDetails = () => {
  const [listing, setListing] = useState(null);
  const [project, setProject] = useState(null);
  const [editor, setEditor] = useState(null);
  const [editorGroup, setEditorGroup] = useState(null);
  const [editableByWithSubgroups, setEditableByWithSubgroups] = useState([]);
  const [fetchedEditableByWithSubgroups, setFetchedEditableByWithSubgroups] = useState(false);
  const [editorAllowed, setEditorAllowed] = useState(false);
  const [developer, setDeveloper] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [locationName, setLocationName] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLastSegment = () => {
      const urlPath = window.location.pathname;
      const pathSegments = urlPath.split('/').filter(segment => segment !== '');
      return pathSegments.pop();
    };

    const fetchListing = async () => {
      const listingId = getLastSegment();
      try {
        const fetchedListing = await ListingService.getListing(listingId);
        setListing(fetchedListing);
        if (fetchedListing.project) {
          const fetchedProject = await ProjectService.getProject(fetchedListing.project);
          setProject(fetchedProject);
        }
        const fetchedUser = await UserService.getUserDetailById(fetchedListing.devloper);
        setDeveloper(fetchedUser);

        const editor = JSON.parse(localStorage.getItem('user'));
        if (!editor) return;

        const editorDetails = await UserService.getUserDetailById(editor.payload._id);
        setEditor(editorDetails);
        if (!editorDetails.group) return;
        setEditorGroup(editorDetails.group);

        const editableByWithSubgroups = await Promise.all(fetchedListing.editableBy.map(async (editableGroup) => {
          if (!editableGroup.includeSubGroups || editableGroup.subgroups.length !== 0) return editableGroup;

          const subgroups = await GroupService.getSubGroupsByParentGroupId(editableGroup.group);
          return {
            ...editableGroup,
            subgroups: subgroups.map(subgroup => ({
              includeAllSubgroupMembers: true,
              subgroupMembers: [],
              subgroup: subgroup._id
            }))
          };
        }));

        setEditableByWithSubgroups(editableByWithSubgroups);
        setFetchedEditableByWithSubgroups(true);

      } catch (error) {
        console.error(error);
      }
    };

    fetchListing();
  }, []);

  useEffect(() => {
    if (listing) {
      setLocationName(listing.streetAddress);
      setLongitude(listing.coordinates[0].longitude.toString());
      setLatitude(listing.coordinates[0].latitude.toString());
      setCoordinates([listing.coordinates[0].latitude.toString(), listing.coordinates[0].longitude.toString()]);
    }
  }, [listing]);

  useEffect(() => {
    const getImageUrl = async (imageId) => {
      if (!imageUrls[imageId]) {
        const url = await FileService.getImageUrl(imageId);
        setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
      }
    };

    if (listing) {
      getImageUrl(listing.titleImage);

      listing.slideImages.forEach((slideImage) => {
        const fileId = slideImage[Object.keys(slideImage)[0]];
        getImageUrl(fileId);
      });
    }
  }, [listing]);

  useEffect(() => {
    if (fetchedEditableByWithSubgroups) {
      let editorAllowed = false;

      if (listing.devloper === editor._id) {
        editorAllowed = true;
      } else {
        editorAllowed = editableByWithSubgroups.some(group => {
          if (group.includeAllGroupMembers && editorGroup === group.group) return true;
          if (group.groupMembers.includes(editor._id)) return true;
          return group.subgroups.some(subgroup =>
            (subgroup.includeAllSubgroupMembers && editorGroup === subgroup.subgroup) || subgroup.subgroupMembers.includes(editor._id)
          );
        });
      }
      setEditorAllowed(editorAllowed);
    }
  }, [fetchedEditableByWithSubgroups, editorGroup, editor, listing]);

  if (!listing) {
    return <ContentHeader headerTitle="View Listing"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Listings", link: "/listings" },
        { name: "View", active: true },
      ]}
      options={
        <div>
          <ButtonGroup>
            <Link to={`/listings/`} className="btn btn-primary">
              Back
            </Link>
          </ButtonGroup>
        </div>}
    />;
  }

  return (
    <Container>
      <ContentHeader headerTitle="View Listing"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Listings", link: "/listings" },
          { name: "View", active: true },
        ]}
        options={
          <div>

            <ButtonGroup>
              <Link to={`/listings/`} className="btn btn-secondary">
                Back
              </Link>
              {editorAllowed &&
                <Link to={`/listings/${listing._id}/edit`} className="btn btn-primary">
                  Edit
                </Link>
              }
            </ButtonGroup>
          </div>}
      />
      <style>{
        `.border-2 {
                border-color: rgba(115, 103, 240, 0.3) !important;
            }`
      }</style>
      <Row>
        <Col lg={8}>
          <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
            <Row>
              <Col lg={12}>
                {/* <Card.Subtitle className="text-white lead bg-dark mb-1 p-1 font-weight-bold rounded" style={{ background: 'linear-gradient(to right, rgba(266, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>{listing.listingName}</Card.Subtitle> */}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card.Img
                  variant="top"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  src={imageUrls[listing.titleImage]}
                />
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col lg={6}>
                {developer && (
                  <div className="d-inline-flex mt-1 mb-1 px-1 font-weight-bold text-secondary border border-secondary border-opacity-10 rounded">Posted By: {developer.firstName} {developer.lastName}</div>
                )}
              </Col>
              <Col lg={6} className="align-self-end text-right pb-1">
                {listing.files.filter(file => file.displayTop).map((listingFile, index) => (
                  <Card key={index} className="m-0 p-0 text-right mt-1">
                    <Card.Body className="m-0 p-0 mb-0 text-right">
                      <ListGroup className="border-0 text-right">
                        <ListGroup.Item key={index} className="ml-auto mt-auto mb-0 mr-0 pl-1 p-0 border-secondary">
                          {`${listingFile.category}${listingFile.category_index > 1 ? ` ${listingFile.category_index}` : ''}:`}
                          <ButtonGroup>
                            <Link to={FileService.getImageUrl(listingFile.file_id)} className="ml-1 btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" >
                              View
                            </Link>
                            <Link to={FileService.getFileUrl(listingFile.file_id)} className="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer" >
                              Download
                            </Link>
                          </ButtonGroup>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
            <Row>
              <Col lg={12} className="m-0 p-0">
                <Card.Subtitle className="text-white bg-dark p-1 m-0 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(29, 198, 167, 1) , rgba(197, 200, 255, 1))' }}> Description: </Card.Subtitle>
                <div className="text-dark p-1 m-0 mt-0 mb-0" dangerouslySetInnerHTML={{ __html: listing.description }} />
              </Col>
            </Row>
          </Card>

          {listing.slideImages.length > 0 && (
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-1" style={{ background: 'linear-gradient(to right, rgba(29, 198, 167, 1) , rgba(197, 200, 255, 1))' }}> Slides: </Card.Subtitle>
              <CardCarousel listing={listing} imageUrls={imageUrls} />
            </Card>
          )}
        </Col>
        <Col lg={4}>
          <Card className="rounded m-auto p-2">
            <Card.Subtitle className="text-white lead bg-dark p-1 mt-0 mb-1 rounded" style={{ background: 'linear-gradient(to right, rgba(167, 169, 239, 1), rgba(178, 156, 226, 0.8))' }}>{listing.listingName}</Card.Subtitle>
            <p className="mb-1">
              <Badge bg="primary">{listing.type}</Badge>{" "}
              <Badge bg="secondary">{listing.status}</Badge>
            </p>
            <PriceRangeOutput minPrice={listing.priceRange[0]['minPrice']} maxPrice={listing.priceRange[0]['maxPrice']} />
            <Row className="mt-1">
              <Col>
                <p>Location: {listing.streetAddress}</p>
                {/* {renderMapboxMap(listing.coordinates)} */}
              </Col>
            </Row>
            <Row>
              <hr />
              {listing.bedrooms >= 0 && listing.bedrooms !== null && (
                <Col>
                  <p><i className="fa fa-bed"></i> {listing.bedrooms} Bedrooms</p>
                </Col>
              )}
              {listing.bathrooms >= 0 && listing.bathrooms !== null && (
                <Col>
                  <p><i className="fa fa-bath"></i> {listing.bathrooms} Bathrooms</p>
                </Col>
              )}
              {listing.carSpaces >= 0 && listing.carSpaces !== null && (
                <Col>
                  <p><i className="fa fa-car"></i> {listing.carSpaces} Car Spaces</p>
                </Col>
              )}
              {listing.landSize >= 0 && listing.landSize !== null && (
                <Col>
                  <p><i className="fa fa-arrows-alt"></i> {listing.landSize} sqm Land Size</p>
                </Col>
              )}
            </Row>
          </Card>
          {listing.listingCommission && listing.listingCommission.length > 0 && listing.listingCommission[0].exists && (
            <Row className="mt-0">
              <Col>
                <Card className="rounded mt-1 p-0">
                  <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Commission Details: </Card.Subtitle>
                  <ListGroup>
                    <ListGroup.Item>
                      Type: {(listing.listingCommission[0].type).toUpperCase()}
                    </ListGroup.Item>
                    {listing.listingCommission[0].type === 'percentage' && (
                      <ListGroup.Item>
                        Percentage: {listing.listingCommission[0].percent}%
                      </ListGroup.Item>
                    )}
                    {listing.listingCommission[0].type === 'fixed' && (
                      <ListGroup.Item>
                        Amount: {(listing.listingCommission[0].amount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}
          {project && (
            <Row className="mt-1">
              <Col>
                <Card className="border-0 shadow">
                  <Card.Img
                    variant="top"
                    style={{ height: "200px", objectFit: "cover" }}
                    src={FileService.getImageUrl(project.projectTitleImage)}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">{project.projectName}</Card.Title>
                    <Card.Text className="text-center">
                      <Link
                        to={`/projects/${project._id}`}
                        className="btn btn-primary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </Link>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      {listing.files.length > 0 && (
        <Row>
          <Col>
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(29, 198, 167, 1) , rgba(197, 200, 255, 1))' }}> Listing Files: </Card.Subtitle>
              <ListGroup>
                {listing.files.map((listingFile, index) => (
                  <ListGroup.Item key={index}>
                    {`${listingFile.category}${listingFile.category_index > 1 ? ` ${listingFile.category_index}` : ''}:`}
                    <ButtonGroup>
                      <Link to={FileService.getImageUrl(listingFile.file_id)} className="ml-1 btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" >
                        View
                      </Link>
                      <Link to={FileService.getFileUrl(listingFile.file_id)} className="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer" >
                        Download
                      </Link>
                    </ButtonGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
      {coordinates && (
        <Row>
          <Col><Card className="rounded mt-1 p-0">
            <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(29, 198, 167, 1) , rgba(197, 200, 255, 1))' }}>Points of Interest Nearby: {locationName}: </Card.Subtitle>
            <NearbyPOIs coordinates={coordinates} />
          </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ListingDetails;