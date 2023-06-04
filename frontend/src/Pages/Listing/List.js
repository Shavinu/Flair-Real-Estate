import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ListingService from "../../Services/ListingService";
import * as FileService from "../../Services/FileService";
import "./List.css";

const Listings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const developer = user.payload._id;
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const getImageUrl = async (imageId) => {
      if (!imageUrls[imageId]) {
        const url = await FileService.getImageUrl(imageId);
        setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
      }
    };

    const fetchListings = async () => {
      try {
        const response = await ListingService.getListingsByDeveloper(developer, currentPage, 6);
        setListings(response.listings);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);

        console.log(response);
        response.listings.forEach((listing) => {
          getImageUrl(listing.titleImage);
        });

      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, [developer, currentPage, imageUrls]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getImageUrl = (imageId) => {
    return FileService.streamFile(imageId);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="mt-0">
      <ContentHeader headerTitle="Listings"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Listings", active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" to="/listings/create">Create Listing</Link>}
      />
      <Row>
        {listings.map((listing) => (
          <Col key={listing._id} lg={4} md={6} className="mb-4">
            <Card className="listing-card h-100">
              <Card.Img variant="top" src={imageUrls[listing.titleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <Card.Body className="p-0">
                <Card.Title className="text-white bg-dark p-1 mb-0" style={{ background: 'linear-gradient(to right, rgba(19, 198, 137, 1) , rgba(19, 198, 150, 1))' }}>{listing.listingName}</Card.Title>
                <Card.Text className="text-right text-white bg-info pl-1 pr-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>
                  {listing.streetAddress}
                </Card.Text>
                <Card.Text className="pl-1 pr-1"><div className="truncate-text" dangerouslySetInnerHTML={{ __html: listing.description }} /></Card.Text>
              </Card.Body>
              <Card.Footer>
                <ButtonGroup>
                  <Link to={`/listings/${listing._id}`} className="btn btn-primary">
                    View
                  </Link>
                  <Link to={`/listings/${listing._id}/edit`} className="btn btn-secondary">
                    Edit
                  </Link>
                </ButtonGroup>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">{renderPagination()}</Col>
      </Row>
    </Container>
  );
};

export default Listings;

