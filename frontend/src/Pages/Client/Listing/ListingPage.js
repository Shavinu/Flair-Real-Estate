import { ButtonGroup, Card, Col, Container, Form, Row, Stack, Pagination } from "react-bootstrap";

import "./ListingPage.css";
import * as ProjectService from "../../../Services/ProjectService";
import * as FileService from "../../../Services/FileService";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Group, Label, Select } from "../../../Components/Form";
import HomeHeroWithSearch from "../../../Components/HomeHeroWithSearch";
import { SearchComponent, PriceRangeInput } from "../../Listing/Search";
import * as ListingService from "../../../Services/ListingService";
import SearchFunction from "./SearchFunction.js";

const ListingPage = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const developer = user ? user.payload._id : null;
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageUrls, setImageUrls] = useState({});
  const [searchParams, setSearchParams] = useState({devloper: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).payload._id : '0'});

  useEffect(() => {

    fetchListings(searchParams);

  }, [currentPage, searchParams]);

  const fetchListings = async () => {
    try {
      const response = await ListingService.searchListings(currentPage, 6, searchParams);
      setListings(response.listings);
      setTotalPages(response.totalPages);
  
      response.listings.forEach((listing) => {
        getImageUrl(listing.titleImage);
      });
  
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleSearch = (newSearchParams) => {
    let searchParams = { ...newSearchParams };
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getImageUrl = (imageId) => {
    if (!imageUrls[imageId]) {
      const url = FileService.getImageUrl(imageId);
      setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
    }
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
    <>

      <div className="hero">
        <img src="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
         alt="heroImg" />
        <div className="hero-text">
          <Container>
            <h1>Real Estate</h1>
            <p>Choose Your New Estate with Real Estate.</p>
            
          </Container>
        </div>
      </div>
      

        <Container className="listing-container">
          <SearchFunction onSearch={handleSearch}/>
          <Form.Group as={Row} className="mb-3 col-5" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Sort By:
            </Form.Label>
            <Col sm="10">
              <Select options={[
                { value: '1', label: 'Default Order' },
                { value: '2', label: 'Price Low to Hight' },
                { value: '3', label: 'Price High to Low' },
                { value: '4', label: 'Newest Properties' },
                { value: '5', label: 'Oldest Properties' },
              ]} 
              
            />
            </Col>
          </Form.Group>
          <Row>
            {listings.map((listing) => (
          <Col key={listing._id} lg={4} md={6} className="mb-4">
            <Card className="listing-card h-100">
            {listing.listingCommission[0]?.exists && (
                <div className={`badge ${listing.listingCommission[0]?.exists && (listing.listingCommission[0]?.type === 'percentage' ? 'badge-warning' : 'badge-danger')}`} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                {listing.listingCommission[0]?.type === 'percentage'
                  ? `Commission: ${listing.listingCommission[0]?.percent}%`
                  : `Commission: $${listing.listingCommission[0]?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              )}
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
    </>
  );
};


export default ListingPage;
