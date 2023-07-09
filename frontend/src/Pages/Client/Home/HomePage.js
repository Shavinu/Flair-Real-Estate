import { ButtonGroup, Card, Col, Container, Row, Stack } from "react-bootstrap";
import HomeHeroWithSearch from "../../../Components/HomeHeroWithSearch";
import "./HomePage.css";
import { useCallback, useEffect, useState } from "react";
import * as ProjectService from "../../../Services/ProjectService";
import * as FileService from "../../../Services/FileService";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const getProjectList = useCallback(
    async () => {
      try {
        const response = await ProjectService.getAllProjects();
        setFeaturedProperties(response.slice(0, 6));

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
      {/* <!-- BEGIN Navigation--> */}
      <HomeHeroWithSearch
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />
      {/* <!-- END Navigation--> */}

      <Container className="p-5">
        <h1 className="text-center">What we do?</h1>
        ...

        <h1 className="text-center py-5">Featured properties</h1>

        <Row>
          {featuredProperties.map((project) => (
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

        <Stack gap={2} className="col-1 mx-auto">
          <Link className="btn btn-primary" to="/ListingPage">More</Link>
        </Stack>

        <h1 className="text-center py-5">What We Offer</h1>
      </Container>
    </>
  );
}

export default HomePage;
