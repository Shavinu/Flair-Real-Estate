import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import { getCoordinates, renderMapboxMap } from "../../Components/Maps/getCordinates";
import NearbyPOIs from "../../Components/Maps/getNearbyPOIs";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import { PriceRangeOutput } from "../../Components/Form/PriceRange";
import CardCarousel from "./Components/ImageCarousel";
import { useState, useEffect } from "react";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [locationName, setLocationName] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  // const [coordinates, setCoordinates] = useState(null);
  // const [coordinates2, setCoordinates2] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch project details
    const getLastSegment = () => {
      const urlPath = window.location.pathname;
      const pathSegments = urlPath.split('/').filter(segment => segment !== '');
      return pathSegments.pop();
    };

    const fetchProject = async () => {
      const projectId = getLastSegment();
      try {
        const fetchedProject = await ProjectService.getProject(projectId);
        setProject(fetchedProject);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject();
  }, []);

  useEffect(() => {
    if (project) {
      setLocationName(project.projectLocation[0].locationName);
      setLongitude(project.projectLocation[0].longitude.toString());
      setLatitude(project.projectLocation[0].latitude.toString());
      setCoordinates([project.projectLocation[0].latitude.toString(), project.projectLocation[0].longitude.toString()]);
    }
  }, [project]);

  useEffect(() => {
    // Fetch image URLs for title and slide images
    const getImageUrl = async (imageId) => {
      if (!imageUrls[imageId]) {
        const url = await FileService.getImageUrl(imageId);
        setImageUrls((prevState) => ({ ...prevState, [imageId]: url }));
      }
    };

    if (project) {
      getImageUrl(project.projectTitleImage);

      project.projectSlideImages.forEach((slideImage) => {
        const fileId = slideImage[Object.keys(slideImage)[0]];
        getImageUrl(fileId);
      });
    }
  }, [project]);

  // useEffect(() => {
  //   // Fetch coordinates for the project location
  //   const fetchCoordinates = async () => {
  //     const coords = await getCoordinates(project.projectLocation);
  //     if (coords) {
  //       setCoordinates([coords.latitude, coords.longitude]);
  //       setCoordinates2([coords.longitude, coords.latitude]);
  //     }
  //   };

  //   if (project) {
  //     fetchCoordinates();
  //   }
  // }, [project]);

  if (!project) {
    return <ContentHeader headerTitle="View Project"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Projects", link: "/projects" },
        { name: "View", active: true },
      ]}
      options={
        <div>

          <ButtonGroup>
            <Link to={`/projects/`} className="btn btn-primary">
              Back
            </Link>
          </ButtonGroup>
        </div>}
    />;
  }
  const [minPrice, maxPrice] = project.projectPriceRange;
  return (
    <Container>
      <ContentHeader headerTitle="View Project"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Projects", link: "/projects" },
          { name: "View", active: true },
        ]}
        options={
          <div>

            <ButtonGroup>
              <Link to={`/projects/`} className="btn btn-primary">
                Back
              </Link>
              <Link to={`/projects/${project._id}/edit`} className="btn btn-secondary">
                Edit
              </Link>
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
                {/* <Card.Subtitle className="text-white lead bg-dark mb-1 p-1 font-weight-bold rounded" style={{ background: 'linear-gradient(to right, rgba(266, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>{project.projectName}</Card.Subtitle> */}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card.Img
                  variant="top"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  src={imageUrls[project.projectTitleImage]}
                />
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col lg={6}>
                <div className="d-inline-flex mt-1 mb-1 px-1 font-weight-bold text-secondary border border-secondary border-opacity-10 rounded">Posted By: {project.projectOwner.firstName} {project.projectOwner.lastName}</div>
              </Col>
              <Col lg={6} className="align-self-end text-right pb-1">
                {project.projectFiles.filter(file => file.displayTop).map((projectFile, index) => (
                  <Card key={index} className="m-0 p-0 text-right mt-1">
                    <Card.Body className="m-0 p-0 mb-0 text-right">
                      <ListGroup className="border-0 text-right">
                        <ListGroup.Item key={index} className="ml-auto mt-auto mb-0 mr-0 pl-1 p-0 border-secondary">
                          {projectFile.category}:
                          <ButtonGroup>
                            <Link to={FileService.getImageUrl(projectFile.file_id)} className="ml-1 btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" >
                              View
                            </Link>
                            <Link to={FileService.getFileUrl(projectFile.file_id)} className="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer" >
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
                <Card.Subtitle className="text-white bg-dark p-1 m-0 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Description: </Card.Subtitle>
                <div className="text-dark p-1 m-0 mt-0 mb-0" dangerouslySetInnerHTML={{ __html: project.projectDescription }} />
              </Col>
            </Row>
          </Card>

          {project.projectSlideImages.length > 1 && (
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Slides: </Card.Subtitle>
              <CardCarousel project={project} imageUrls={imageUrls} />
            </Card>
          )}
        </Col>
        <Col lg={4}>
          <Card className="rounded m-auto p-2">
            <Card.Subtitle className="text-white lead bg-dark p-1 mt-0 mb-1 rounded" style={{ background: 'linear-gradient(to right, rgba(266, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>{project.projectName}</Card.Subtitle>
            <p>
              <Badge bg="primary">{project.projectType}</Badge>{" "}
              <Badge bg="secondary">{project.projectStatus}</Badge>
            </p>
            <PriceRangeOutput minPrice={project.projectPriceRange[0]['minPrice']} maxPrice={project.projectPriceRange[0]['maxPrice']} />
            <Row>
              <Col>
                <p>Location: {project.projectLocation[0]['locationName']}</p>
                {renderMapboxMap(project.projectLocation)}
              </Col>
            </Row>
          </Card>
          {project.projectCommission && project.projectCommission[0].exists && (
            <Row className="mt-0">
              <Col>
                <Card className="rounded mt-1 p-0">
                  <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Commission Details: </Card.Subtitle>
                  <ListGroup>
                    <ListGroup.Item>
                      Type: {(project.projectCommission[0].type).toUpperCase()}
                    </ListGroup.Item>
                    {project.projectCommission[0].type === 'percentage' && (
                      <ListGroup.Item>
                        Percentage: {project.projectCommission[0].percent}%
                      </ListGroup.Item>
                    )}
                    {project.projectCommission[0].type === 'fixed' && (
                      <ListGroup.Item>
                        Amount: {(project.projectCommission[0].amount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      {project.projectFiles.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Project Files: </Card.Subtitle>
              <ListGroup>
                {project.projectFiles.map((projectFile, index) => (
                  <ListGroup.Item key={index}>
                    {projectFile.category}:
                    <ButtonGroup>
                      <Link to={FileService.getImageUrl(projectFile.file_id)} className="ml-1 btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" >
                        View
                      </Link>
                      <Link to={FileService.getFileUrl(projectFile.file_id)} className="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer" >
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
          <Col className="mt-5"><Card className="rounded mt-1 p-0">
            <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>Points of Interest Nearby: {locationName}: </Card.Subtitle>
            <NearbyPOIs coordinates={coordinates} />
          </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProjectDetails;