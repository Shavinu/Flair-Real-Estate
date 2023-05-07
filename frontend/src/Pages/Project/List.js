import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ButtonGroup, Button, Pagination } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import { Link } from "react-router-dom";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import "./List.css";

// the ownerId should be the person browsing, but if builder uses a group, the ownerId should be the group owner
const ProjectsListing = () => {
    const ownerId = '644c6415ad75b1d119eed7eb';
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
                    <Col key={project._id} md={4} className="mb-4">
                        <Card className="project-card">
                            <Card.Img variant="top" src={imageUrls[project.projectTitleImage]} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                            <Card.Body>
                                <Card.Title>{project.projectName}</Card.Title>
                                <Card.Text>{project.projectLocation}</Card.Text>
                                <Card.Text><div className="truncate-text" dangerouslySetInnerHTML={{ __html: project.projectDescription }} /></Card.Text>
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

