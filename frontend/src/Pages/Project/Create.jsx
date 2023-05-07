//import necessary modules
import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, ContentHeader, Row } from "../../Components";
import CardBody from "../../Components/Card/CardBody";
import { Group, Input, Label } from "../../Components/Form";
import Select from "react-select";
import ReactQuill from 'react-quill';
import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
import 'react-quill/dist/quill.snow.css';
import utils from "../../Utils";
import Toast from "../../Components/Toast";
import * as ProjectService from "../../Services/ProjectService";
import {
  FileWithCategoryBrowser,
  uploadFilesAndGetFileIds
} from "../../Components/Files/FileWithCategoryBrowser";
import {
  TitleSlideImageBrowser,
  uploadTitleImageAndGetId,
  uploadSlideshowImagesAndGetIds
} from '../../Components/Images/TitleSlideImageBrowser';

import { PriceRangeInput } from "../../Components/Form/PriceRange";

//create component
const Create = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user.payload._id);
      setProjectOwner(user.payload.email)
    }
  }, []);

  //To do; add project files, members, images
  const [projectStatus, setProjectStatus] = useState({ value: "Active", label: "Active" });
  const [projectType, setProjectType] = useState("");
  const [projectPriceRange, setProjectPriceRange] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectOwner, setProjectOwner] = useState("");

  const [titleImage, setTitleImage] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);

  const [fileUploadFiles, setFileUploadFiles] = useState([]);

  const [errors, setErrors] = useState({});
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

  const handleProjectOwnerChange = (e) => {
    setProjectOwner(e.target.value);
  }

  const validateInput = () => {
    const errors = {};
    if (!projectName) {
      errors.projectName = "Project name is required";
    }
    if (!projectType) {
      errors.projectType = "Project type is required";
    }
    if (!projectPriceRange) {
      errors.projectPriceRange = "Project price range is required";
    }
    if (projectPriceRange[1] <= projectPriceRange[0]) {
      errors.projectPriceRange = 'Upper bound must be greater than lower bound';
    }
    if (projectDescription.trim() === '' || projectDescription === '<p><br></p>') {
      errors.projectDescription = "Project description is required";
    }
    if (projectLocation.trim() === "") {
      errors.projectLocation = "Project location is required";
    }
    if (!projectOwner) {
      errors.projectOwner = "Project owner is required";
    }
    if (!projectStatus) {
      errors.projectStatus = "Project status is required";
    }

    const otherFilesWithoutCategory = fileUploadFiles.filter(file => file.isOther && !file.category);
    if (otherFilesWithoutCategory.length > 0) {
      errors.otherFileCategories = "Please provide a category for this 'Other' file";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateInput();
    if (!isValid) return;
    setLoading(true);
    const logFormData = (formData) => {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    };

    // Upload title image and get its ID
    let titleImageId = null;
    if (titleImage) {
      titleImageId = await uploadTitleImageAndGetId(titleImage, user);
    }

    // Upload slideshow images and get their IDs
    let slideshowImageIds = null;
    if (slideshowImages) {
      slideshowImageIds = await uploadSlideshowImagesAndGetIds(slideshowImages, user);
    }

    // Upload other files and get their IDs
    let fileIds = null;
    if (fileUploadFiles) {
      fileIds = await uploadFilesAndGetFileIds(fileUploadFiles, user);
    }

    // Create project with image and file IDs
    setProjectOwner(user);
    const projectData = {
      projectName,
      projectType: projectType.value,
      projectPriceRange: projectPriceRange.join('-'),
      projectDescription,
      projectLocation,
      projectOwner: user,
      projectStatus: projectStatus.value,
      projectTitleImage: titleImageId,
      projectSlideImages: JSON.parse(slideshowImageIds),
      projectFiles: JSON.parse(fileIds)
    };
    console.log(projectData);
    ProjectService.createProject(projectData)
      .then(response => {
        Toast('Project created successfully!', 'success');
        setErrors({});
        setTimeout(() => {
        navigate(`/projects/${response._id}`);
        }, 500);
      })
      .catch(() => {
        Toast('Failed to create project!', 'danger');
      })
      .finally(() =>
        setLoading(false)
      )
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
                  value={projectPriceRange}
                  onChange={(value) => setProjectPriceRange(value)}
                  error={errors.projectPriceRange}
                  min={0.00}
                  max={10000000.00}
                  step={1000.00}
                />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <Label>Project Location</Label>
                <LocationAutocomplete
                  selectedLocation={projectLocation}
                  onChange={handleProjectLocationChange}
                  error={errors.projectLocation}
                />
                {errors.projectLocation && (
                  <div className="invalid-feedback d-block">
                    {errors.projectLocation}
                  </div>
                )}
              </Group>
            </CardBody>
          </Card>
          <Card className="border-2 border-primary rounded">
            <CardBody>
              <Group>
                <Label>Project Description</Label>
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
                {errors.projectDescription && (
                  <div className="invalid-feedback d-block">
                    {errors.projectDescription}
                  </div>
                )}
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group>
                <TitleSlideImageBrowser
                  titleImage={titleImage}
                  slideshowImages={slideshowImages}
                  setTitleImage={setTitleImage}
                  setSlideshowImages={setSlideshowImages}
                />
              </Group>
              <hr className="mt-1 border border-mute rounded" />
              <Group className="text-center">
                <Label>Files</Label>
                <FileWithCategoryBrowser
                  options={['Floor Plan', 'Site Plan', 'Other']}
                  onFilesChange={setFileUploadFiles}
                  error={errors.otherFileCategories}
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
                  isDisabled={true}
                  defaultValue={{ value: "Active", label: "Active" }}
                  onChange={(value) => setProjectStatus(value) && handleProjectStatusChange()}
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" }
                  ]}
                  error={errors.projectStatus}
                />
                {errors.projectStatus && (
                  <div className="invalid-feedback d-block">
                    {errors.projectStatus}
                  </div>
                )}
              </Group>
            </CardBody>
          </Card>
        </Col >
      </Row >
    </>
  )
}

export default Create