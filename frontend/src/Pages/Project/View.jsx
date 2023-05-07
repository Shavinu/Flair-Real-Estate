import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup } from "react-bootstrap";
import { ContentHeader } from "../../Components";
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import { getCoordinates, renderMapboxMap } from "../../Components/Maps/getCordinates";
import * as ProjectService from "../../Services/ProjectService";
import * as FileService from "../../Services/FileService";
import { PriceRangeOutput } from "../../Components/Form/PriceRange";
import CardCarousel from "./projectCarousel";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ProjectDetails = () => {
    const [project, setProject] = useState(null);
    const [imageUrls, setImageUrls] = useState({});
    const [coordinates, setCoordinates] = useState(null);
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

    useEffect(() => {
        // Fetch coordinates for the project location
        const fetchCoordinates = async () => {
            const coords = await getCoordinates(project.projectLocation);
            if (coords) {
                setCoordinates([coords.latitude, coords.longitude]);
            }
        };

        if (project) {
            fetchCoordinates();
        }
    }, [project]);

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
    const [minPrice, maxPrice] = project.projectPriceRange.split("-");
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
                    <Link to={`/projects/`} className="btn btn-secondary">
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
                    <Card className="rounded m-auto p-2">
                        <Row>
                            <Col lg={12}>
                                <Card.Img
                                    variant="top"
                                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                    src={imageUrls[project.projectTitleImage]}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="d-inline-flex mt-1 mb-1 px-1 font-weight-bold text-secondary border border-secondary border-opacity-10 rounded">Posted By: {project.projectOwner.firstName} {project.projectOwner.lastName}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>

                                <Card.Subtitle className="text-muted"> Description: </Card.Subtitle>
                                <div dangerouslySetInnerHTML={{ __html: project.projectDescription }} />
                            </Col>
                        </Row>
                    </Card>

                    <Card className="rounded mt-1 p-2">
                        <Card.Subtitle className="text-muted"> Slides: </Card.Subtitle>
                        <CardCarousel project={project} imageUrls={imageUrls} />
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="rounded m-auto p-2">
                        <h1>{project.projectName}</h1>
                        <p>
                            <Badge bg="primary">{project.projectType}</Badge>{" "}
                            <Badge bg="secondary">{project.projectStatus}</Badge>
                        </p>
                        <PriceRangeOutput minPrice={minPrice} maxPrice={maxPrice} />
                        <Row>
                            <Col>
                                <p>Location: {project.projectLocation}</p>
                                {renderMapboxMap(project.projectLocation, coordinates)}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col>
                    <h2>Project Files</h2>
                    <ListGroup>
                        {project.projectFiles.map((projectFile, index) => (
                            <ListGroup.Item key={index}>
                                {Object.keys(projectFile)[0]}: {projectFile[Object.keys(projectFile)[0]]}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectDetails;