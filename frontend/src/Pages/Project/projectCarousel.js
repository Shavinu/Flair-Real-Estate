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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center">
            <Button variant="secondary" onClick={handlePrevClick}>
            <i className="feather icon-arrow-left"></i>
            </Button>
            <Carousel ref={carouselRef} controls={false} indicators={false}>
              <Carousel.Item>
                <Row>
                  {project.projectSlideImages.map((slideImage, index) => {
                    const fileId = slideImage[Object.keys(slideImage)[0]];
                    return (
                      <Col md={4} key={index}>
                        <Card className="zoom-card m-1" onClick={() => handleImageClick(imageUrls[fileId])}>
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
              </Carousel.Item>
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
