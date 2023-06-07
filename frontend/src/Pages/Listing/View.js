import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import { getCoordinates, renderMapboxMap } from "../../Components/Maps/getCordinates";
import NearbyPOIs from "../../Components/Maps/getNearbyPOIs";
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
        console.log(fetchedListing);
        if (fetchedListing.project) {
          const fetchedProject = await ProjectService.getProject(fetchedListing.project);
          console.log(fetchedProject);
          setProject(fetchedProject);
        }
        const fetchedUser = await UserService.getUserDetailById(fetchedListing.devloper);
        setDeveloper(fetchedUser);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListing();
  }, []);

  useEffect(() => {
    if (listing) {
      console.log(listing);
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
              {developer && localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).payload._id === developer._id &&
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
            <hr />
            <Row>
              <Col>
                <p><i className="fa fa-bed"></i> {listing.bedrooms} Bedrooms</p>
              </Col>
              <Col>
                <p><i className="fa fa-bath"></i> {listing.bathrooms} Bathrooms</p>
              </Col>
              <Col>
                <p><i className="fa fa-car"></i> {listing.carSpaces} Car Spaces</p>
              </Col>
              <Col>
                <p><i className="fa fa-arrows-alt"></i> {listing.landSize} sqm Land Size</p>
              </Col>
            </Row>
          </Card>

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