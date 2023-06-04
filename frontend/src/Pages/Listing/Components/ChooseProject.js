import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as ProjectService from '../../../Services/ProjectService';
import * as FileService from '../../../Services/FileService';
import '../List.css';
import './ChooseProject.css';

const ChooseProject = ({ onProjectChange }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const ownerId = user.payload._id;
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState([]);
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
        const response = await ProjectService.getProjectByOwner(ownerId, currentPage, 6, search);
        setProjects(response.projects);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);

        response.projects.forEach((project) => {
          getImageUrl(project.projectTitleImage);
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchListings();
  }
    , [ownerId, currentPage, imageUrls, search]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const getImageUrl = (imageId) => {
    return FileService.streamFile(imageId);
  }

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
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setSelectedProject(null);
    setSelectedProjectId(null);
    onProjectChange(null);
  }

  const handleSelectProject = (projectId) => {
    if (selectedProjectId === projectId) {
      handleUnselectProject();
    } else {
      setSelectedProjectId(projectId);
      onProjectChange(projectId);
      const selectedProject = projects.find(project => project._id === projectId);
      setSelectedProject(selectedProject);
    }
  }

  const handleUnselectProject = () => {
    setSelectedProject(null);
    setSelectedProjectId(null);
    onProjectChange(null);
  }

  const renderSelectedProject = () => {
    return (
      <div className="choose-project-body-content-body">
        {projects.filter((project) => {
          if (search === '') {
            return project;
          } else if (project.projectName.toLowerCase().includes(search.toLowerCase())) {
            return project;
          }
        }).map((project) => {
          return (
            <div key={project._id}
              className={`choose-project-body-content-body-card ${selectedProjectId === project._id ? 'selected-project' : ''}`}
              onClick={() => handleSelectProject(project._id)}
            >
              <img src={imageUrls[project.projectTitleImage]} alt="project" />
              <p>{project.projectName}</p>
              {selectedProjectId === project._id &&
                <div>
                  <Button variant="primary" className="unselect-button btn-sm mb-1" onClick={(e) => { e.stopPropagation(); handleUnselectProject(); }}>Unselect</Button>
                </div>
              }
            </div>
          )
        })}
      </div>
    )
  }

  const renderContent = () => {
    return renderSelectedProject();
  }

  return (
    <Container fluid className='m-0'>
      <Row>
        <Col className='p-0 m-0'>
          <Card className='p-0 m-0'>
            <Card.Body className='p-0 m-0'>
              <div className="choose-project">
                <div className="choose-project-header">
                  <input type="text" placeholder="Search" onChange={handleSearch} className="form-control" />
                </div>
                <div className="choose-project-body card-body mb-0 pb-0">
                  <div className="choose-project-body-content card">
                    <div className="choose-project-body-content-body">
                      {renderContent()}
                    </div>
                  </div>
                </div>
              </div>
              <Row>
                <Col>
                  {renderPagination()}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ChooseProject;
