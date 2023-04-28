//import necessary modules
import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, ContentHeader, DatePicker, Row } from "../../Components";
import CardBody from "../../Components/Card/CardBody";
import { Group, Input, Label, Select } from "../../Components/Form";
import utils from "../../Utils";
import Toast from "../../Components/Toast";

//create component
const Create = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    
    //To do; add project files, members, images
    const [projectStatus, setProjectStatus] = useState("");
    const [projectType, setProjectType] = useState("");
    const [projectPriceRange, setProjectPriceRange] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectLocation, setProjectLocation] = useState("");
    const [projectOwner, setProjectOwner] = useState("");

    const [titleImage, setTitleImage] = useState(null);
    const [slideshowImages, setSlideshowImages] = useState([]);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileCategories, setFileCategories] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleProjectStatusChange = (e) => {
        setProjectStatus(e.target.value);
    };

    const handleProjectTypeChange = (e) => {
        setProjectType(e.target.value);
    };

    const handleProjectPriceRangeChange = (e) => {
        setProjectPriceRange(e.target.value);
    };

    const handleProjectNameChange = (e) => {
        setProjectName(e.target.value);
    }

    const handleProjectDescriptionChange = (e) => {
        setProjectDescription(e.target.value);
    }

    const handleProjectLocationChange = (e) => {
        setProjectLocation(e.target.value);
    }

    const handleProjectOwnerChange = (e) => {
        setProjectOwner(e.target.value);
    }

    const handleTitleImageChange = (e) => {
        setTitleImage(e.target.files[0]);
    };
    
    const handleSlideshowImagesChange = (e) => {
        setSlideshowImages([...slideshowImages, ...Array.from(e.target.files)]);
    };

    const removeTitleImage = () => {
        setTitleImage(null);
    };
    
    const removeSlideshowImage = (index) => {
        setSlideshowImages((prevImages) =>
          prevImages.filter((_, i) => i !== index)
        );
    };

    const handleFilesChange = (e, category) => {
        const newFiles = Array.from(e.target.files).map((file) => ({
          file,
          category,
        }));
    
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleFileCategoryChange = (selectedItem, index) => {
        const newFileCategories = [...fileCategories];
        newFileCategories[index] = selectedItem;
        setFileCategories(newFileCategories);
      };      

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
        if (!projectDescription) {
            errors.projectDescription = "Project description is required";
        }
        if (!projectLocation) {
            errors.projectLocation = "Project location is required";
        }
        if (!projectOwner) {
            errors.projectOwner = "Project owner is required";
        }
        if (!projectStatus) {
            errors.projectStatus = "Project status is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateInput();
        if (!isValid) return;
        setLoading(true);
      
        try {
          // Upload title image and get its ID
          let titleImageId = null;
          if (titleImage) {
            const titleImageData = new FormData();
            titleImageData.append('file', titleImage);
            titleImageData.append('category', 'titleImage');
            const titleImageResponse = await utils.uploadFile(titleImageData);
            titleImageId = titleImageResponse.data._id;
          }
      
          // Upload slideshow images and get their IDs
          const slideshowImagePromises = slideshowImages.map((image) => {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('category', 'slideshowImage');
            return utils.uploadFile(formData);
          });
          const slideshowImageResponses = await Promise.all(slideshowImagePromises);
          const slideshowImageIds = slideshowImageResponses.map((response) => response.data._id);
      
          // Upload other files and get their IDs
          const filePromises = uploadedFiles.map((file, index) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', fileCategories[index]);
            return utils.uploadFile(formData);
          });
          const fileResponses = await Promise.all(filePromises);
          const fileIds = fileResponses.map((response) => response.data._id);
      
          // Create project with image and file IDs
          const projectData = {
            projectName,
            projectType,
            projectPriceRange,
            projectDescription,
            projectLocation,
            projectOwner,
            projectStatus,
            titleImage: titleImageId,
            slideshowImages: slideshowImageIds,
            files: fileIds,
          };
          const { data } = await utils.createProject(projectData);
      
          if (data.errors) {
            setErrors(data.errors);
            setLoading(false);
          } else {
            Toast.fire({
              icon: "success",
              title: "Project created successfully",
            });
            navigate("/app/projects");
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
    };           

    return (
        <>
            
    <ContentHeader headerTitle="Create Project"/>
    <Row>
            <Col md={12}>
                <Card>
                    <CardBody>
                    <form onSubmit={handleProjectSubmit}>
                        <Group>
                            <Label>Project Name</Label>
                            <Input type="text" value={projectName} onChange={handleProjectNameChange} placeholder="Please Input a project name" error={errors.projectName} />
                        </Group>
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
                        </Group>
                        <Group>
                            <Label>Project Price Range</Label>
                            <Input type="text" value={projectPriceRange} onChange={handleProjectPriceRangeChange} error={errors.projectPriceRange} />
                        </Group>
                        <Group>
                            <Label>Project Description</Label>
                            <Input type="text" value={projectDescription} onChange={handleProjectDescriptionChange} error = {errors.projectDescription} />
                        </Group>
                        <Group>
                            <Label>Project Location</Label>
                            <Input type="text" value={projectLocation} onChange={handleProjectLocationChange} error = {errors.projectLocation} />
                        </Group>
                        <Group>
                            <Label>Title Image</Label>
                            {titleImage && (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={URL.createObjectURL(titleImage)}
                                    alt="Title"
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                                <span
                                    style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 5px',
                                    cursor: 'pointer',
                                    }}
                                    onClick={removeTitleImage}
                                >
                                    X
                                </span>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleTitleImageChange}
                            />
                        </Group>
                        <Group>
                        <Label>Slideshow Images</Label>
                        <div>
                            {slideshowImages.map((image, index) => (
                            <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                                <img
                                src={URL.createObjectURL(image)}
                                alt={`Slideshow ${index + 1}`}
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                                <span
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '2px 5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => removeSlideshowImage(index)}
                                >
                                X
                                </span>
                            </div>
                            ))}
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleSlideshowImagesChange}
                        />
                        </Group>
                        <Group>
                            <Label>Files</Label>
                            <div>
                                {uploadedFiles.map((file, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>{file.name}</div>
                                    <Select
                                    style={{ marginLeft: '8px', width: 'auto' }}
                                    value={fileCategories[index]}
                                    onChange={(e) => handleFileCategoryChange(e, index)}
                                    options={[
                                        { value: 'Floor Plan', label: 'Floor Plan' },
                                        { value: 'Site Plan', label: 'Site Plan' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                    />
                                </div>
                                ))}
                                <Input type="file" multiple onChange={handleFilesChange} />
                            </div>
                        </Group>
                        <Group>
                            <Label>Project Owner</Label>
                            <Input type="text" value={projectOwner} onChange={handleProjectOwnerChange} error = {errors.projectOwner} />
                        </Group>
                        <Group>
                            <Label>Project Status</Label>
                            <Select
                                name="projectStatus"
                                value={projectStatus}
                                onChange={(value) => setProjectStatus(value) && handleProjectStatusChange()}
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Completed", label: "Completed" },
                                    { value: "Pending", label: "Pending" },
                                ]}
                                error={errors.projectStatus}
                            />
                        </Group>
                        <Group>
                            <Button className="btn btn-primary" type="submit" disabled={loading} block>
                                {loading ? "Creating Project..." : "Create Project"}
                            </Button>
                        </Group>
                    </form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export default Create