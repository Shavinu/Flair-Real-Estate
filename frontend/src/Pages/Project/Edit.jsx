import SelectListingMembers from './Components/MembersSelector'
import ProjectCommission from './Components/CommissionSelector';
import { EditImageBrowser, UploadTitle, UploadSlides } from './Components/EditImageBrowser';
import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
import { PriceRangeInput } from '../../Components/Form/PriceRange';
import * as UserService from "../../Services/UserService";
import * as ProjectService from "../../Services/ProjectService";
import * as GroupService from "../../Services/GroupService";
import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Container, Spinner } from 'react-bootstrap';
import { ContentHeader } from "../../Components";
import { Group, Input, Label } from "../../Components/Form";
import Toast from "../../Components/Toast";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditProject = () => {

  const navigate = useNavigate();
  const [initialData, setInitialData] = useState();
  const [initialDataSet, setInitialDataSet] = useState(false);
  const [user, setUser] = useState();
  const [editor, setEditor] = useState("");
  const [editorGroup, setEditorGroup] = useState();
  const [editableByWithSubgroups, setEditableByWithSubgroups] = useState([]);
  const [fetchedEditableByWithSubgroups, setFetchedEditableByWithSubgroups] = useState(false);
  const [editorAllowed, setEditorAllowed] = useState(false);
  const [reset, setReset] = useState(false);
  const [key, setKey] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState();
  const [projectType, setProjectType] = useState();
  const [projectStatus, setProjectStatus] = useState();
  const [projectPriceRange, setProjectPriceRange] = useState();
  const [projectDescription, setProjectDescription] = useState();
  const [editableBy, setEditableBy] = useState();
  const [commissionData, setCommissionData] = useState();
  const [projectLocation, setProjectLocation] = useState();
  const [coordinates, setCoordinates] = useState();
  const [postcode, setPostcode] = useState();
  const [region, setRegion] = useState();
  const [suburb, setSuburb] = useState();
  const [titleImage, setTitleImage] = useState(null);
  const [deletedTitleImage, setDeletedTitleImage] = useState(null);
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [deletedSlideshowImages, setDeletedSlideshowImages] = useState([]);

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
    if (projectStatus.value === "") {
      newErrors.projectStatus = "Project status is required";
    } else {
      delete newErrors.projectStatus;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = validateInput();
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    try {

      // Upload title image and get its ID
      let titleImageId = null;
      titleImageId = await UploadTitle(titleImage, deletedTitleImage, user);

      // Upload slideshow images and get their IDs
      let slideshowImageIds = null;
      slideshowImageIds = await UploadSlides(slideshowImages, deletedSlideshowImages, user);
      slideshowImageIds = JSON.parse(slideshowImageIds);

      // Upload other files and get their IDs and data
      // let fileData = null;
      // if (fileUploadFiles.length > 0) {
      //   fileData = await UploadFiles(fileUploadFiles, user);
      //   console.log(fileData);
      //   fileData = JSON.parse(fileData);
      // }

      // Create project with image and file IDs
      // setProjectOwner(user);
      const projectData = {
        projectName,
        projectType: projectType,
        projectPriceRange: [projectPriceRange],
        projectDescription,
        projectLocation: [{ locationName: projectLocation, longitude: coordinates.longitude, latitude: coordinates.latitude, postcode: postcode, region: region, suburb: suburb }],
        editableBy,
        projectStatus: projectStatus,
        projectCommission: [commissionData]
      };

      projectData.projectTitleImage = titleImageId;
      projectData.projectSlideImages = slideshowImageIds;
      // if (fileData) projectData.projectFiles = fileData;
      const response = await ProjectService.updateProject(initialData._id, projectData);
      Toast('Project edited successfully!', 'success');
      setErrors({});
      setTimeout(() => {
        navigate(`/projects/${response._id}`);
      }, 500);
    } catch (error) {
      Toast('Failed to update project!', 'danger');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIdSegment = () => {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 2];
  };

  useEffect(() => {
    const fetchUserAndProject = async () => {
      const editor = JSON.parse(localStorage.getItem('user'));
      if (editor) {
        const editorDetails = await UserService.getUserDetailById(editor.payload._id);
        setEditor(editorDetails);
        if (editorDetails.group) {
          setEditorGroup(editorDetails.group);
        }
      }

      const projectId = getIdSegment();
      const fetchedProject = await ProjectService.getProject(projectId);
      setInitialData(fetchedProject);

      const userDetails = await UserService.getUserDetailById(fetchedProject.projectOwner._id);
      setUser(userDetails);

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
    };

    fetchUserAndProject();
  }, []);

  useEffect(() => {
    if (initialData && !initialDataSet && fetchedEditableByWithSubgroups) {
      let editorAllowed = false;

      if (editor._id === initialData.projectOwner._id) {
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

      if (editorAllowed) {
        setProjectName(initialData.projectName);
        setProjectType(initialData.projectType);
        setProjectStatus(initialData.projectStatus);
        setProjectPriceRange({ minPrice: initialData.projectPriceRange[0].minPrice, maxPrice: initialData.projectPriceRange[0].maxPrice });
        setProjectDescription(initialData.projectDescription);
        setEditableBy(initialData.editableBy);
        setProjectLocation(initialData.projectLocation);
        setCoordinates({ longitude: initialData.projectLocation[0].longitude, latitude: initialData.projectLocation[0].latitude });
        setPostcode(initialData.projectLocation[0].postcode);
        setRegion(initialData.projectLocation[0].region);
        setSuburb(initialData.projectLocation[0].suburb);
        setInitialDataSet(true);
      } else {
        setInitialDataSet(true);
      }
    }
  }, [initialData, initialDataSet, user, editor, editableByWithSubgroups, editorGroup]);

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const handleProjectNameChange = (newName) => {
    setProjectName(newName.target.value);
  };

  const handleProjectTypeChange = (newType) => {
    setProjectType(newType.target.value);
  };

  const handleProjectStatusChange = (newStatus) => {
    setProjectStatus(newStatus.target.value);
  };

  const handleProjectDescriptionChange = (newDescription) => {
    setProjectDescription(newDescription);
  };

  const handleProjectLocationChange = (newLocation) => {
    setProjectLocation(newLocation);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  const handlePostcodeRegionChange = (newPostcodeRegion) => {
    setPostcode(newPostcodeRegion.postcode);
    setRegion(newPostcodeRegion.region);
    setSuburb(newPostcodeRegion.suburb);
  };

  const resetForm = () => {
    setReset(true);
    setProjectName(initialData.projectName);
    setProjectType(initialData.projectType);
    setProjectStatus(initialData.projectStatus);
    setProjectPriceRange({ minPrice: initialData.projectPriceRange[0].minPrice, maxPrice: initialData.projectPriceRange[0].maxPrice });
    setProjectDescription(initialData.projectDescription);
    setEditableBy(initialData.editableBy);
    setCommissionData(initialData.projectCommission);
    setProjectLocation(initialData.projectLocation);
    setCoordinates({ longitude: initialData.projectLocation[0].longitude, latitude: initialData.projectLocation[0].latitude });
    setPostcode(initialData.projectLocation[0].postcode);
    setRegion(initialData.projectLocation[0].region);
    setSuburb(initialData.projectLocation[0].suburb);
    setTitleImage(null);
    setDeletedTitleImage(null);
    setSlideshowImages([]);
    setDeletedSlideshowImages([]);
  };

  if (!initialDataSet) {
    return (
      <Spinner animation="border" role="status" />
    );
  } else if (initialDataSet && !editorAllowed) {
    return (
      <Container>
        <ContentHeader headerTitle="Edit Project"
          breadcrumb={[
            { name: "Home", link: "/" },
            { name: "Projects", link: "/projects" },
            { name: "Edit", active: true },
          ]}
          options={[<ButtonGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          </ButtonGroup>]}
        />
        <div>
          <h4>Sorry, you are not allowed to edit this project</h4>
        </div>
      </Container>
    );
  } else if (initialDataSet && editorAllowed) {
    return (<Container>
      <ContentHeader headerTitle="Edit Project"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Projects", link: "/projects" },
          { name: "Edit", active: true },
        ]}
        options={[
          <ButtonGroup>
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="primary" onClick={resetForm}>Reset</Button>
            <Button variant="dark" onClick={handleEditProjectSubmit} disabled={loading}>Save</Button>
          </ButtonGroup>
        ]}
      />
      <div>
        <Group>
          <Label>Project Name</Label>
          <Input
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            placeholder="Please Input a project name"
            error={errors.projectName} />
        </Group>
        <hr className="mt-1 border border-mute rounded" />
        <Group>
          <Group>
            <Label>Project Status</Label>
            <Select
              name="projectStatus"
              isDisabled={false}
              defaultValue={{ value: "Active", label: "Active" }}
              value={{ value: projectStatus, label: projectStatus }}
              onChange={(selectedOption) => setProjectStatus(selectedOption.value) && handleProjectStatusChange()}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              overflowX="scroll"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "Coming Soon", label: "Coming Soon" },
                { value: "Reserved", label: "Reserved" },
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
            <Label>Project Type</Label>
            <Select
              name="projectType"
              isDisabled={false}
              defaultValue={{ value: "Land", label: "Land" }}
              value={{ value: projectType, label: projectType }}
              onChange={(selectedOption) => setProjectType(selectedOption.value) && handleProjectTypeChange()}
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
            value={projectPriceRange}
            isSubmitted={isSubmitted}
            initialData={initialData.projectPriceRange}
            setErrors={setErrors}
            reset={reset}
            error={errors.projectPriceRange}
          />
        </Group>
        <hr className="mt-1 border border-mute rounded" />
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
          <EditImageBrowser
            titleImage={titleImage}
            setTitleImage={setTitleImage}
            deletedTitleImage={deletedTitleImage}
            setDeletedTitleImage={setDeletedTitleImage}
            slideshowImages={slideshowImages}
            setSlideshowImages={setSlideshowImages}
            deletedSlideshowImages={deletedSlideshowImages}
            setDeletedSlideshowImages={setDeletedSlideshowImages}
            initialData={initialData}
            reset={reset}
          />
        </Group>
        <Group>
          <Label>Project Location</Label>
          <LocationAutocomplete
            selectedLocation={projectLocation}
            onChange={handleProjectLocationChange}
            onCoordinatesChange={handleCoordinatesChange}
            set_postcode_region={handlePostcodeRegionChange}
            initialData={initialData.projectLocation}
            error={errors.projectLocation}
            reset={reset}
          />
        </Group>
        {user && (
          <SelectListingMembers
            user={user._id}
            onSubmitEditableBy={setEditableBy}
            setErrors={setErrors}
            error={errors.editableBy}
            initialData={initialData.editableBy}
            reset={reset}
          />
        )}
        <ProjectCommission
          onCommissionChange={setCommissionData}
          setErrors={setErrors}
          error={errors.projectCommission}
          initialData={initialData.projectCommission}
          reset={reset}
        />
      </div>
    </Container>
    )
  }
}

export default EditProject