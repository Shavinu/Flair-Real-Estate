import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, ContentHeader, Row } from "../../Components";
import CardBody from "../../Components/Card/CardBody";
import { Group, Input, Label } from "../../Components/Form";
import Select from "react-select";
import ReactQuill from 'react-quill';
import utils from "../../Utils";
import Toast from "../../Components/Toast";

import * as UserService from "../../Services/UserService";
import * as ProjectService from "../../Services/ProjectService";

import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
import { PriceRangeInput } from "../../Components/Form/PriceRange";

import { FileBrowser, UploadFiles } from "./Components/FileBrowser";
import { ImageBrowser, UploadTitle, UploadSlides } from './Components/ImageBrowser';
import SelectProjectMembers from "./Components/MembersSelector";
import ProjectCommission from './Components/CommissionSelector';

import './Create.css';
import 'react-quill/dist/quill.snow.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import FileManager from "../../Components/Files/FileManager";

const Create = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userGroup, setUserGroup] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user.payload._id);
      setProjectOwner(user.payload.email)
    }

    const fetchUserGroup = async () => {
      const userDetails = await UserService.getUserDetailById(user.payload._id);
      if (!userDetails.group) return;
      setUserGroup(userDetails.group);
    }

    fetchUserGroup();
  }, []);

  const [projectStatus, setProjectStatus] = useState({ value: "Active", label: "Active" });
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [postcode, setPostcode] = useState(null);
  const [region, setRegion] = useState(null);
  const [suburb, setSuburb] = useState(null);

  const [projectOwner, setProjectOwner] = useState("");
  const [projectPriceRange, setProjectPriceRange] = useState({});
  const [titleImage, setTitleImage] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);

  const [fileUploadFiles, setFileUploadFiles] = useState([]);

  const [editableBy, setEditableBy] = useState([]);
  const [commissionData, setCommissionData] = useState({});

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProjectStatusChange = (e) => {
    setProjectStatus(e.target.value);
  };

  const handleProjectTypeChange = (e) => {
    setProjectType(e.target.value);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  }

  const handleProjectDescriptionChange = (value) => {
    setProjectDescription(value);
  };

  const handleProjectLocationChange = (newLocation) => {
    setProjectLocation(newLocation);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    console.log(newCoordinates);
    setCoordinates(newCoordinates);
  };

  const handlePostcodeRegionChange = (newPostcodeRegion) => {
    setPostcode(newPostcodeRegion.postcode);
    setRegion(newPostcodeRegion.region);
    setSuburb(newPostcodeRegion.suburb);
  };

  const handleProjectOwnerChange = (e) => {
    setProjectOwner(e.target.value);
  }

  const validateInput = () => {
    let newErrors = { ...errors };
    if (!projectName) {
      newErrors.projectName = "Project name is required";
    } else {
      delete newErrors.projectName;
    }
    if (!projectType) {
      newErrors.projectType = "Project type is required";
    } else {
      delete newErrors.projectType;
    }
    if (projectDescription.trim() === '' || projectDescription === '<p><br></p>') {
      newErrors.projectDescription = "Project description is required";
    } else {
      delete newErrors.projectDescription;
    }
    if (projectLocation === null || projectLocation.trim() === "") {
      newErrors.projectLocation = "Project location is required";
    } else {
      delete newErrors.projectLocation;
    }
    if (!projectOwner) {
      newErrors.projectOwner = "Project owner is required";
    } else {
      delete newErrors.projectOwner;
    }
    if (projectStatus.value === "") {
      newErrors.projectStatus = "Project status is required";
    } else {
      delete newErrors.projectStatus;
    }
    // if (editableBy.length === 0) {
    //   newErrors.editableBy = "Please select at least one user group";
    // } else {
    //   delete newErrors.editableBy;
    // }

    setErrors(newErrors);
    return newErrors;
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // console.log(editableBy);
    console.log(coordinates);
    // console.log(projectLocation);
    // console.log(projectPriceRange)
    // console.log(commissionData);

    const newErrors = validateInput();
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // setLoading(true);
    const logFormData = (formData) => {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    };

    try {

      // Upload title image and get its ID
      let titleImageId = null;
      if (titleImage) {
        titleImageId = await UploadTitle(titleImage, user);
      }
      console.log(titleImageId);

      // Upload slideshow images and get their IDs
      let slideshowImageIds = null;
      if (slideshowImages.length > 0) {
        slideshowImageIds = await UploadSlides(slideshowImages, user);
        //convert to array
        slideshowImageIds = JSON.parse(slideshowImageIds);
      }
      console.log(slideshowImageIds);

      // Upload other files and get their IDs and data
      let fileData = null;
      if (fileUploadFiles.length > 0) {
        fileData = await UploadFiles(fileUploadFiles, user);
        console.log(fileData);
        fileData = JSON.parse(fileData);
      }

      // Create project with image and file IDs
      setProjectOwner(user);
      const projectData = {
        projectName,
        projectType: projectType.value,
        projectPriceRange: [projectPriceRange],
        projectDescription,
        projectLocation: [{ locationName: projectLocation, longitude: coordinates.longitude, latitude: coordinates.latitude, postcode: postcode, region: region, suburb: suburb }],
        projectListings: [],
        projectOwner: user,
        editableBy,
        projectStatus: projectStatus.value,
        projectCommission: [commissionData]
      };

      if (titleImageId) projectData.projectTitleImage = titleImageId;
      if (slideshowImageIds) projectData.projectSlideImages = slideshowImageIds;
      if (fileData) projectData.projectFiles = fileData;

      console.log(projectData);
      // return;
      const response = await ProjectService.createProject(projectData);
      Toast('Project created successfully!', 'success');
      setErrors({});
      setTimeout(() => {
        navigate(`/projects/${response._id}`);
      }, 500);
    } catch (error) {
      Toast('Failed to create project!', 'danger');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ContentHeader headerTitle="Create Project"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Projects", link: "/projects" },
          { name: "Create", active: true },
        ]}
        options={<Button className="btn btn-primary waves-effect waves-light"
          onClick={handleProjectSubmit}
          isLoading={loading}
          disabled={!user || loading}
        >
          Submit
        </Button>}
      />
      <Row>
        <style>{
          `.border-2 {
            border-color: rgba(115, 103, 240, 0.3) !important;
          }`
        }</style>
        <Col sm={12} lg={8}>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <Group>
                <Label>Project Name</Label>
                <Input type="text" value={projectName} onChange={handleProjectNameChange} placeholder="Please Input a project name" error={errors.projectName} />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Price Range</Label>
                <PriceRangeInput
                  min={0}
                  max={2000000}
                  step={[
                    { till: 500000, step: 25000 },
                    { till: 1000000, step: 50000 },
                    { till: 2000000, step: 100000 },
                    { till: 10000000, step: 500000 }
                  ]}
                  onChange={setProjectPriceRange}
                  isSubmitted={isSubmitted}
                  setErrors={setErrors}
                  error={errors.projectPriceRange}
                />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Location</Label>
                {errors.projectLocation && (
                  <div className="invalid-feedback d-block">
                    {errors.projectLocation}
                  </div>
                )}
                <LocationAutocomplete
                  selectedLocation={projectLocation}
                  onChange={handleProjectLocationChange}
                  onCoordinatesChange={handleCoordinatesChange}
                  set_postcode_region={handlePostcodeRegionChange}
                  error={errors.projectLocation}
                />
              </Group>
            </CardBody>
          </Card>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <Group>
                <Label>Project Description</Label>
                {errors.projectDescription && (
                  <div className="invalid-feedback d-block">
                    {errors.projectDescription}
                  </div>
                )}
                <style>
                  {`
                  .ql-editor {
                    min-height: 100px;
                    resize: vertical;
                    overflow-y: scroll;
                    }

                    .ql-container {
                      resize: vertical;
                      overflow-y: scroll;
                    }
                `}
                </style>
                <ReactQuill
                  value={projectDescription}
                  onChange={handleProjectDescriptionChange}
                />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <ImageBrowser
                  titleImage={titleImage}
                  slideshowImages={slideshowImages}
                  setTitleImage={setTitleImage}
                  setSlideshowImages={setSlideshowImages}
                />
              </Group>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} lg={4}>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <Group>
                <Label>Project Type</Label>
                <Select
                  name="projectType"
                  value={projectType}
                  onChange={(value) => setProjectType(value) && handleProjectTypeChange()}
                  options={[
                    { value: "Land", label: "Land" },
                    { value: "Multiple", label: "Multiple" }
                  ]}
                  error={errors.projectType}
                />
                {errors.projectType && (
                  <div className="invalid-feedback d-block">
                    {errors.projectType}
                  </div>
                )}
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Owner</Label>
                <Input type="text" value={projectOwner} onChange={handleProjectOwnerChange} error={errors.projectOwner} disabled />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Status</Label>
                <Select
                  name="projectStatus"
                  // isDisabled={true}
                  defaultValue={{ value: "Active", label: "Active" }}
                  onChange={(value) => setProjectStatus(value) && handleProjectStatusChange()}
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                    { value: "Coming Soon", label: "Coming Soon"},
                    { value: "Reserved", label: "Reserved"},
                  ]}
                  error={errors.projectStatus}
                />
                {errors.projectStatus && (
                  <div className="invalid-feedback d-block">
                    {errors.projectStatus}
                  </div>
                )}
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Editable By</Label>
                <SelectProjectMembers
                  user={user}
                  onSubmitEditableBy={setEditableBy}
                  setErrors={setErrors}
                  error={errors.editableBy}
                />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Commission</Label>
                <ProjectCommission
                  onCommissionChange={setCommissionData}
                  setErrors={setErrors}
                  error={errors.projectCommission}
                />
              </Group>
            </CardBody>
          </Card>
        </Col >
        {/* <Col sm={12} lg={12}>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <Group className="text-center">
                <p className="small text-left">Project Files</p>
                <hr />
                <p className='small text-left'>Please select files to display in your project</p>
                <FileBrowser
                  options={[
                    { value: "Site Plan", label: "Site Plan" },
                    { value: "Floor Plan", label: "Floor Plan" },
                    { value: "Elevation Plan", label: "Elevation Plan" },
                    { value: "Other", label: "Other" }
                  ]}
                  onFilesChange={setFileUploadFiles}
                  setErrors={setErrors}
                  error={errors.projectFiles}
                />
              </Group>
            </CardBody>
          </Card>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <p className="small text-left">Project Files</p>
              <FileManager files={[]} />
            </CardBody>
          </Card>
        </Col> */}
      </Row >
    </>
  )
}

export default Create
