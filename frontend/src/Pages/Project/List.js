import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import "./List.css";

const ProjectsListing = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const ownerId = user ? user.payload._id : null;
  const [projects, setProjects] = useState([]);
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

    const fetchProjects = async () => {
      try {
        const response = await ProjectService.getProjectByOwner(ownerId, currentPage, 6);
        setProjects(response.projects);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);

        response.projects.forEach((project) => {
          getImageUrl(project.projectTitleImage);
        });

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [ownerId, currentPage, imageUrls]);

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
      <ContentHeader headerTitle="Project List"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Projects", active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" to="/projects/create">Create Project</Link>}
      />
      <Row>
        {projects.map((project) => (
          <Col key={project._id} lg={4} md={6} className="mb-4">
            {/* make card height all the same size */}
            <Card className="project-card h-100">
              <Card.Img variant="top" src={imageUrls[project.projectTitleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <Card.Body className="p-0">
                <Card.Title className="text-white bg-dark p-1 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>{project.projectName}</Card.Title>
                <Card.Text className="text-right text-white bg-info pl-1 pr-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}>
                  {project.projectLocation['locationName']}
                </Card.Text>
                <Card.Text className="pl-1 pr-1"><div className="truncate-text" dangerouslySetInnerHTML={{ __html: project.projectDescription }} /></Card.Text>
              </Card.Body>
              <Card.Footer>
                <ButtonGroup>
                  <Link to={`/projects/${project._id}`} className="btn btn-primary">
                    View
                  </Link>
                  <Link to={`/projects/${project._id}/edit`} className="btn btn-secondary">
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

export default ProjectsListing;

