//import necessary modules
import React, { Component, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, ContentHeader, Row } from "../../Components";
import CardBody from "../../Components/Card/CardBody";
import { Group, Input, Label, Select } from "../../Components/Form";
import utils from "../../Utils";
import Toast from "../../Components/Toast";

import FileWithCategoryBrowser from "../../Components/Files/FileWithCategoryBrowser";
import TitleSlideImageBrowser from "../../Components/Images/TitleSlideImageBrowser";
import PriceRangeInput from "../../Components/Form/PriceRangeInput";

//create component
const Create = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user.payload._id);
        }
      }, []);

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

    const handleProjectDescriptionChange = (e) => {
        setProjectDescription(e.target.value);
    }

    const handleProjectLocationChange = (e) => {
        setProjectLocation(e.target.value);
    }

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

        try {
            const logFormData = (formData) => {
                for (const [key, value] of formData.entries()) {
                  console.log(`${key}: ${value}`);
                }
              };              
            // Upload title image and get its ID
            let titleImageId = null;
            if (titleImage) {
                const titleImageData = new FormData();
                titleImageData.append('file', titleImage);
                titleImageData.append('label', 'titleImage');
                // const titleImageResponse = await utils.uploadFile(titleImageData);
                // titleImageId = titleImageResponse.data._id;
                logFormData(titleImageData);
            }

            // Upload slideshow images and get their IDs
            const slideshowImagePromises = slideshowImages.map((image, index) => {
                const formData = new FormData();
                formData.append('file', image);
                formData.append('label', `slideshowImage_${index}`);
                // return utils.uploadFile(formData);
                logFormData(formData);
            });
            // const slideshowImageResponses = await Promise.all(slideshowImagePromises);
            // const slideshowImageIds = slideshowImageResponses.map((response) => response.data._id);

            // Upload other files and get their IDs

            // Count files in each category
            const categoryCounts = {};
            fileUploadFiles.forEach((fileObj) => {
            if (categoryCounts[fileObj.category]) {
                categoryCounts[fileObj.category]++;
            } else {
                categoryCounts[fileObj.category] = 1;
            }
            });

            const currentCategoryIndex = {};
            const filePromises = fileUploadFiles.map((fileObj) => {
            const formData = new FormData();
            formData.append('file', fileObj.file);

            //if file category has more than one file, append index to label, if not don't append index
            let labelWithIndex = fileObj.category;
            if (categoryCounts[fileObj.category] > 1) {
                if (currentCategoryIndex[fileObj.category]) {
                currentCategoryIndex[fileObj.category]++;
                } else {
                currentCategoryIndex[fileObj.category] = 1;
                }
                labelWithIndex += `_${currentCategoryIndex[fileObj.category]}`;
            }

            formData.append('label', labelWithIndex);
            // return utils.uploadFile(formData);
            logFormData(formData);
            });        
            // const fileResponses = await Promise.all(filePromises);
            // const fileIds = fileResponses.map((response) => response.data._id);

            // Create project with image and file IDs
            setProjectOwner(user);
            console.log(user);
            const projectData = {
                projectName,
                projectType,
                projectPriceRange,
                projectDescription,
                projectLocation,
                projectOwner: user,
                projectStatus,
                titleImage: titleImageId,
                // slideshowImages: slideshowImageIds,
                // files: fileIds,
            };
            console.log(projectData);
            // const { data } = await utils.createProject(projectData);

            // if (data.errors) {
            //     setErrors(data.errors);
            //     setLoading(false);
            // } else {
            //     Toast.fire({
            //         icon: "success",
            //         title: "Project created successfully",
            //     });
            //     navigate("/app/projects");
            // }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <>
            <ContentHeader headerTitle="Create Project" />
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
                                    <PriceRangeInput
                                        value={projectPriceRange}
                                        onChange={(value) => setProjectPriceRange(value)}
                                        error={errors.projectPriceRange}
                                        min={0}
                                        max={10000000}
                                        step={100}
                                        />
                                </Group>
                                <Group>
                                    <Label>Project Description</Label>
                                    <Input type="text" value={projectDescription} onChange={handleProjectDescriptionChange} error={errors.projectDescription} />
                                </Group>
                                <Group>
                                    <Label>Project Location</Label>
                                    <Input type="text" value={projectLocation} onChange={handleProjectLocationChange} error={errors.projectLocation} />
                                </Group>
                                <Group>
                                    <TitleSlideImageBrowser
                                        titleImage={titleImage}
                                        slideshowImages={slideshowImages}
                                        setTitleImage={setTitleImage}
                                        setSlideshowImages={setSlideshowImages}
                                    />
                                </Group>
                                <Group>
                                    <Label>Files</Label>
                                    <FileWithCategoryBrowser
                                        options={['Floor Plan', 'Site Plan', 'Other']}
                                        onFilesChange={setFileUploadFiles}
                                        error={errors.otherFileCategories}
                                    />
                                </Group>
                                <Group>
                                    <Label>Project Owner</Label>
                                    <Input type="text" value={projectOwner} onChange={handleProjectOwnerChange} error={errors.projectOwner} />
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
                                    <Button className="btn btn-primary" type="submit" 
                                    // disabled={loading}
                                    block>
                                        Submit
                                        {/* {loading ? "Creating Project..." : "Create Project"} */}
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