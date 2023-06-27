import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Carousel, Badge, Button, ButtonGroup, Table } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown, FaBed, FaExpandArrowsAlt, FaCar, FaBath } from 'react-icons/fa';
import _, { set } from 'lodash';
import { ContentHeader, CardBody } from "../../Components";
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import { getCoordinates, renderMapboxMap } from "../../Components/Maps/getCordinates";
import NearbyPOIs from "../../Components/Maps/getNearbyPOIs";
import * as ProjectService from "../../Services/ProjectService";
import * as ListingService from "../../Services/ListingService";
import * as GroupService from "../../Services/GroupService";
import * as UserService from "../../Services/UserService";
import * as FileService from "../../Services/FileService";
import { PriceRangeOutput } from "../../Components/Form/PriceRange";
import CardCarousel from "./Components/ImageCarousel";
import { useState, useEffect } from "react";
import FileManager from "../../Components/Files/FileManager";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [editor, setEditor] = useState(null);
  const [editorGroup, setEditorGroup] = useState(null);
  const [editableByWithSubgroups, setEditableByWithSubgroups] = useState([]);
  const [fetchedEditableByWithSubgroups, setFetchedEditableByWithSubgroups] = useState(false);
  const [editorAllowed, setEditorAllowed] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [locationName, setLocationName] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [listings, setListings] = useState([]);
  const [sortKey, setSortKey] = useState('type');
  const [sortOrder, setSortOrder] = useState('asc');
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

        if (fetchedProject.projectListings.length > 0) {
          const listingPromises = fetchedProject.projectListings.map(listingId => ListingService.getListing(listingId));
          const fetchedListings = await Promise.all(listingPromises);
          setListings(fetchedListings);
        }

        const editor = JSON.parse(localStorage.getItem('user'));
        if (!editor) return;

        const editorDetails = await UserService.getUserDetailById(editor.payload._id);
        setEditor(editorDetails);
        if (!editorDetails.group) return;
        setEditorGroup(editorDetails.group);

        const editableByWithSubgroups = await Promise.all(fetchedProject.editableBy.map(async (editableGroup) => {
          if (!editableGroup.includeSubGroups || editableGroup.subgroups.length !== 0) return editableGroup;

          const subgroups = await GroupService.getSubGroupsByParentGroupId(editableGroup.group);
          return {
            ...editableGroup,
            subgroups: subgroups.map(subgroup => ({
              includeAllSubgroupMembers: true,
              subgroupMembers: [],
              subgroup: subgroup._id
            }))
          };
        }));

        setEditableByWithSubgroups(editableByWithSubgroups);
        setFetchedEditableByWithSubgroups(true);

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
    if (fetchedEditableByWithSubgroups) {
      let editorAllowed = false;

      if (project.projectOwner._id === editor._id) {
        editorAllowed = true;
      } else {
        editorAllowed = editableByWithSubgroups.some(group => {
          if (group.includeAllGroupMembers && editorGroup === group.group) return true;
          if (group.groupMembers.includes(editor._id)) return true;
          return group.subgroups.some(subgroup =>
            (subgroup.includeAllSubgroupMembers && editorGroup === subgroup.subgroup) || subgroup.subgroupMembers.includes(editor._id)
          );
        });
      }
      setEditorAllowed(editorAllowed);
    }
  }, [fetchedEditableByWithSubgroups, editorGroup, editor, project]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (key) => {
    if (key === sortKey) {
      return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const sortedListings = _.orderBy(listings, [item => {
    if (sortKey === 'priceRange[0].minPrice') {
      return item.priceRange[0]?.minPrice || 0;
    } else if (sortKey === 'priceRange[0].maxPrice') {
      return item.priceRange[0]?.maxPrice || 0;
    } else {
      return item[sortKey];
    }
  }], [sortOrder]);

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
              {editorAllowed &&
                <Link to={`/projects/${project._id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
              }
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
                          {`${projectFile.category}${projectFile.category_index > 1 ? ` ${projectFile.category_index}` : ''}:`}
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

          {project.projectSlideImages.length >= 1 && (
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
      {listings.length >= 1 && (
        <Row>
          <Col>
            <Card className="rounded mt-1 p-0">
              {/* Create styled table using bootstrap to hold listings data */}
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-1" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Listings: </Card.Subtitle>
              <style>{
                `.sortable {
                    cursor: pointer !important;
                  }`
              }</style>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('type')}>
                      Listing Type {getSortIcon('type')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('status')}>
                      Listing Status {getSortIcon('status')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('priceRange[0].minPrice')}>
                      Listing Price Min {getSortIcon('priceRange[0].minPrice')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('priceRange[0].maxPrice')}>
                      Listing Price Max {getSortIcon('priceRange[0].maxPrice')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('landSize')}>
                      Land Size {getSortIcon('landSize')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('bedrooms')}>
                      <FaBed /> {getSortIcon('bedrooms')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('bathrooms')}>
                      <FaBath /> {getSortIcon('bathrooms')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('carSpaces')}>
                      <FaCar /> {getSortIcon('carSpaces')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedListings.map((listing, index) => (
                    <tr key={index}>
                      <td><Link to={`/listings/${listing._id}`} target="_blank">{listing.type}</Link></td>
                      <td>{listing.status}</td>
                      <td>{listing.priceRange[0]?.minPrice?.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) || ''}</td>
                      <td>{listing.priceRange[0]?.maxPrice?.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) || ''}</td>
                      <td>{listing.landSize ? `${listing.landSize} m\u00B2` : null}</td>
                      <td>{listing.bedrooms}</td>
                      <td>{listing.bathrooms}</td>
                      <td>{listing.carSpaces}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      )}
      {project.projectFiles.length > 0 && (
        <Row>
          <Col>
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Project Files: </Card.Subtitle>
              <ListGroup>
                {project.projectFiles.map((projectFile, index) => (
                  <ListGroup.Item key={index}>
                    {`${projectFile.category}${projectFile.category_index > 1 ? ` ${projectFile.category_index}` : ''}:`}
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
      {project.projectFiles.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="rounded mt-1 p-0">
              <Card.Subtitle className="text-white bg-dark p-1 mt-0 mb-0" style={{ background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' }}> Project Files: </Card.Subtitle>

              <CardBody>
                <FileManager files={project.projectFiles} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {coordinates && (
        <Row>
          <Col><Card className="rounded mt-1 p-0">
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
