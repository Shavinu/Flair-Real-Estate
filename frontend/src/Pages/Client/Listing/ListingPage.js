import { ButtonGroup, Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import HomeHero from "../../../Components/HomeHero";
import "./ListingPage.css";
import * as ProjectService from "../../../Services/ProjectService";
import * as FileService from "../../../Services/FileService";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Group, Label, Select } from "../../../Components/Form";

const ListingPage = () => {
  const [properties, setProperties] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const getProjectList = useCallback(
    async () => {
      try {
        const response = await ProjectService.getAllProjects();
        setProperties(response);

        response.forEach((project) => {
          getImageUrl(project.projectTitleImage);
        });

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [],
  );

  const getImageUrl = (imageId) => {
    if (!imageUrls[imageId]) {
      const url = FileService.getImageUrl(imageId);
      setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
    }
  };

  useEffect(() => {
    getProjectList();
  }, [getProjectList]);

  return (
    <>
      <HomeHero
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />

      <div className="listing-container">
        <Container className="p-5">
          <Form.Group as={Row} className="mb-3 col-5" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Sort By:
            </Form.Label>
            <Col sm="10">
              <Select options={[
                { value: '1', label: 'Default Order' },
                { value: '1', label: 'Price Low to Hight' },
                { value: '1', label: 'Price High to Low' },
                { value: '1', label: 'Newest Properties' },
                { value: '1', label: 'Oldest Properties' },
              ]} />
            </Col>
          </Form.Group>
          <Row>
            {properties.map((project) => (
              <Col key={project._id} lg={4} md={6} className="mb-4">
                <Card className="project-card h-100">
                  {project.projectCommission[0]?.exists && (
                    <div className={`badge ${project.projectCommission[0]?.exists && (project.projectCommission[0]?.type === 'percentage' ? 'badge-warning' : 'badge-danger')}`} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                      {project.projectCommission[0]?.type === 'percentage'
                        ? `Commission: ${project.projectCommission[0]?.percent}%`
                        : `Commission: $${project.projectCommission[0]?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                  )}
                  <Card.Img variant="top" src={imageUrls[project.projectTitleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <Card.Body className="p-0">
                    <Card.Title className="text-white bg-dark p-1 mb-0" style={{ background: 'linear-gradient(to right, rgba(19, 198, 137, 1) , rgba(19, 198, 150, 1))' }}>{project.projectName}</Card.Title>
                    <Card.Text className="text-right text-white bg-info pl-1 pr-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>
                      {project.projectLocation[0]?.locationName}
                    </Card.Text>
                    <Card.Text className="pl-1 pr-1"><div className="truncate-text" dangerouslySetInnerHTML={{ __html: project.projectDescription }} /></Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <ButtonGroup>
                      <Link to={`/ProjectDetail/${project._id}`} className="btn btn-primary">
                        View
                      </Link>
                    </ButtonGroup>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

        </Container>
      </div>
    </>
  );
}

export default ListingPage;
