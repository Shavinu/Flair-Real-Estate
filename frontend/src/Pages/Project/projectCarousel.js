import React, { useRef, useState } from "react";
import { Container, Row, Col, Carousel, Card, Button, Modal } from "react-bootstrap";
import "./projectCarousel.css";

const CardCarousel = ({ project, imageUrls }) => {
  const carouselRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handlePrevClick = () => {
    carouselRef.current.prev();
  };

  const handleNextClick = () => {
    carouselRef.current.next();
  };

  const handleImageClick = (imageSrc) => {
    setZoomedImage(imageSrc);
    setShowModal(true);
  };

  const handleThumbnailClick = (index) => {
    carouselRef.current.next(index);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        {project.projectSlideImages.map((slideImage, index) => {
          const fileId = slideImage[Object.keys(slideImage)[0]];
          return (
            <Col md={2} sm={3} xs={4} key={index}>
              <Card className="thumb-card mb-0" onClick={() => handleThumbnailClick(index)}>
                <Card.Img
                  variant="top"
                  src={imageUrls[fileId]}
                  alt={Object.keys(slideImage)[0]}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center">
            <Button variant="secondary" onClick={handlePrevClick}>
              <i className="feather icon-arrow-left"></i>
            </Button>
            <Carousel ref={carouselRef} controls={false} indicators={false}>
              {project.projectSlideImages.map((slideImage, index) => {
                const fileId = slideImage[Object.keys(slideImage)[0]];
                return (
                  <Carousel.Item key={index}>
                    <Row>
                      <Col md={12}>
                        <Card className="zoom-card m-1" onClick={() => handleImageClick(imageUrls[fileId])}>
                          <Card.Img
                            variant="top"
                            src={imageUrls[fileId]}
                            alt={Object.keys(slideImage)[0]}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Carousel.Item>
                );
              })}
            </Carousel>
            <Button variant="secondary" onClick={handleNextClick}>
              <i className="feather icon-arrow-right"></i>
            </Button>
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body>
          <img src={zoomedImage} alt="Zoomed" style={{ width: "100%" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CardCarousel;