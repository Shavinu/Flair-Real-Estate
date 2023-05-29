// import SelectProjectMembers from './Components/MembersSelector'
// import ProjectCommission from './Components/CommissionSelector';
// import { ImageBrowser, UploadTitle, UploadSlides } from './Components/ImageBrowser';
// import {EditImageBrowser} from './Components/EditImageBrowser';
// import LocationAutocomplete from '../../Components/Maps/LocationAutoComplete';
// import { PriceRangeInput } from '../../Components/Form/PriceRange';
// import * as UserService from "../../Services/UserService";
// import * as ProjectService from "../../Services/ProjectService";
// import React, { useState, useEffect } from "react";
// import { Button, ButtonGroup, Container, Spinner } from 'react-bootstrap';
// import { ContentHeader } from "../../Components";
// import { Group, Input, Label } from "../../Components/Form";
// import Select from 'react-select';
// import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { set } from 'mongoose';

// const Test = () => {

//   // Dummy data
//   // const initialData = { "_id": "64655a75b095b3b886057213", "projectName": "Redgum Rise Estate - Oakville", "projectType": "Land", 
//   // "projectPriceRange": [{ "minPrice": 150000, "maxPrice": 300000 }], "projectDescription": "<ul><li>Fixed price, single contract and no progress payments</li><li>4-5 bedroom house and land package with a double car garage coming soon</li><li>All inclusive, Turnkey Homes</li><li>Over 30 years of Building experience</li><li>15mins from Rouse Hill Town Centre</li><li>Easy access to the M2 and M7 motorways</li><li>Location and convenience at your doorstep</li><li>Minutes away from the Box Hill region</li></ul>", 
//   // "projectLocation": [{ "locationName": "9 Redgum Place, Byron Bay New South Wales 2481, Australia", "longitude": 153.6067790537178, "latitude": -28.676947955289727 }], 
//   // "projectTitleImage": "64655a75b095b3b886057201", 
//   // "projectSlideImages": [{ "slideshowImage_0": "64655a75b095b3b886057203" }, { "slideshowImage_1": "64655a75b095b3b886057204" }, { "slideshowImage_2": "64655a75b095b3b886057205" }, { "slideshowImage_3": "64655a75b095b3b88605720a" }], 
//   // "projectFiles": [{ "file_id": "64655a75b095b3b88605720e", "category": "Site Plan", "category_index": 1, "fileName": "dummy-2.pdf", "displayTop": true, "visibleTo": ["All"], "_id": "64655a75b095b3b886057214" }, { "file_id": "64655a75b095b3b88605720f", "category": "Brochure", "category_index": 1, "fileName": "33.jpg", "displayTop": true, "visibleTo": ["All"], "_id": "64655a75b095b3b886057215" }], 
//   // "projectListings": [], 
//   // "projectOwner": { "_id": "644c6415ad75b1d119eed7eb", "firstName": "test22", "lastName": "test2", "email": "asd@fma.org" }, 
//   // "editableBy": [{ "group": "645dde090d70f7a310a6df6d", "includeAllGroupMembers": false, "groupMembers": [], "includeSubGroups": true, "subgroups": [{ "subgroup": "645eea2c0d70f7a310a6e14d", "includeAllSubgroupMembers": false, "subgroupMembers": ["64363f5e8f2d5ce56ab7d769"], "_id": "64655a75b095b3b886057216" }] }], 
//   // "projectStatus": "Active", 
//   // "projectCommission": [{ "exists": true, "type": "fixed", "amount": 67667, "percent": 0 }], 
//   // "createdAt": "2023-05-17T22:51:33.962Z", 
//   // "updatedAt": "2023-05-17T22:51:33.962Z", 
//   // "__v": 0 };

//   const navigate = useNavigate();
//   const [initialData, setInitialData] = useState();
//   const [user, setUser] = useState();
//   const [editor, setEditor] = useState("");
//   const [reset, setReset] = useState(false);
//   const [key, setKey] = useState(0);
//   const [errors, setErrors] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [projectName, setProjectName] = useState();
//   const [projectType, setProjectType] = useState();
//   const [projectStatus, setProjectStatus] = useState();
//   const [projectPriceRange, setProjectPriceRange] = useState();
//   const [projectDescription, setProjectDescription] = useState();
//   const [userGroup, setUserGroup] = useState();
//   const [editableBy, setEditableBy] = useState();
//   const [commissionData, setCommissionData] = useState();
//   const [projectLocation, setProjectLocation] = useState();
//   const [coordinates, setCoordinates] = useState();
//   const [titleImage, setTitleImage] = useState(null);
//   const [deletedTitleImage, setDeletedTitleImage] = useState(null);
//   const [slideshowImages, setSlideshowImages] = useState([]);
//   const [deletedSlideshowImages, setDeletedSlideshowImages] = useState([]);

//   useEffect(() => {
//     // Fetch project details
//     const getIdSegment = () => {
//       const url = window.location.href;
//       const urlSegments = url.split("/");
//       const projectId = urlSegments[urlSegments.length - 2];
//       return projectId;
//     };

//     const fetchProject = async () => {
//       const projectId = getIdSegment();
//       try {
//         const fetchedProject = await ProjectService.getProject(projectId);
//         setInitialData(fetchedProject);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProject();
//   }, []);

//   useEffect(() => {
//     if (initialData) {
//       setProjectName(initialData.projectName);
//       setProjectType(initialData.projectType);
//       setProjectStatus(initialData.projectStatus);
//       setProjectPriceRange({ minPrice: initialData.projectPriceRange[0].minPrice, maxPrice: initialData.projectPriceRange[0].maxPrice });
//       setProjectDescription(initialData.projectDescription);
//       setEditableBy(initialData.editableBy);
//       setCommissionData(initialData.projectCommission);
//       setProjectLocation(initialData.projectLocation);
//       setCoordinates({ lat: initialData.projectLocation[0].latitude, lng: initialData.projectLocation[0].longitude });
//     }
//   }, [initialData]);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) {
//       setUser(user.payload._id);
//       setEditor(user.payload.email)
//     }

//     const fetchUserGroup = async () => {
//       const userDetails = await UserService.getUserDetailById(user.payload._id);
//       if (!userDetails.group) return;
//       setUserGroup(userDetails.group);
//     }

//     fetchUserGroup();
//   }, []);

//   useEffect(() => {
//     if (reset) {
//       setReset(false);
//     }
//   }, [reset]);

//   const handleProjectNameChange = (newName) => {
//     setProjectName(newName.target.value);
//   };

//   const handleProjectTypeChange = (newType) => {
//     setProjectType(newType.target.value);
//   };

//   const handleProjectStatusChange = (newStatus) => {
//     setProjectStatus(newStatus.target.value);
//   };

//   const handleProjectDescriptionChange = (newDescription) => {
//     setProjectDescription(newDescription);
//   };

//   const handleProjectLocationChange = (newLocation) => {
//     setProjectLocation(newLocation);
//   };

//   const handleCoordinatesChange = (newCoordinates) => {
//     setCoordinates(newCoordinates);
//   };

//   const resetForm = () => {
//     setProjectName(initialData.projectName);
//     setProjectType(initialData.projectType);
//     setProjectStatus(initialData.projectStatus);
//     setProjectDescription(initialData.projectDescription);
//     setTitleImage(null);
//     setSlideshowImages([]);
//     setProjectLocation(initialData.projectLocation);
//     // setKey(key + 1);
//     setErrors({});
//     setReset(true);
//   };

//   const logFormOutputs = () => {
//     // console.log(`Editable By: ${JSON.stringify(editableBy)}`);
//     // console.log(`Commission Data: ${JSON.stringify(commissionData)}`);
//     // console.log(`Project Name: ${projectName}`);
//     // console.log(`Project Type: ${projectType}`);
//     // console.log(`Project Status: ${projectStatus}`);
//     // console.log(`Project Price Range: ${projectPriceRange}`);
//     // console.log(`Project Description: ${projectDescription}`);
//     // console.log(`Editable By: ${editableBy}`);
//     // console.log(`Project Location: ${projectLocation}`);
//     // console.log(`Coordinates: ${coordinates}`);
//     // console.log(`Initial Project Location: ${projectLocation}`);
//     console.log(`Title Image: ${JSON.stringify(titleImage)}`);
//     console.log(`Deleted Title Image: ${JSON.stringify(deletedTitleImage)}`);
//     console.log(`Slideshow Images: ${JSON.stringify(slideshowImages)}`);
//     console.log(`Deleted Slideshow Images: ${JSON.stringify(deletedSlideshowImages)}`);
//   }

//   //if initialData is not null, then render the form, else render a loading page
//   if (!initialData) {
//     return (
//       <Spinner animation="border" role="status" />
//     );
//   } else {
//     return (<Container>
//       <ContentHeader headerTitle="Edit Project"
//         breadcrumb={[
//           { name: "Home", link: "/" },
//           { name: "Projects", link: "/projects" },
//           { name: "Edit", active: true },
//         ]}
//         options={[
//           <ButtonGroup>
//             <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
//             <Button variant="primary" onClick={resetForm}>Reset</Button>
//             <Button variant="dark" onClick={() => setIsSubmitted(true)}>Save</Button>
//           </ButtonGroup>
//         ]}
//       />
//       <div>
//         <Button variant="dark" onClick={logFormOutputs}>Log</Button>
//         <Group>
//           <Label>Project Name</Label>
//           <Input
//             type="text"
//             value={projectName}
//             onChange={handleProjectNameChange}
//             placeholder="Please Input a project name"
//             error={errors.projectName} />
//         </Group>
//         <hr className="mt-1 border border-mute rounded" />
//         <Group>

//           <Group>
//             <Label>Project Type</Label>
//             <Select
//               name="projectType"
//               isDisabled={false}
//               defaultValue={{ value: "Land", label: "Land" }}
//               value={{ value: projectType, label: projectType }}
//               onChange={(selectedOption) => setProjectType(selectedOption.value)}
//               options={[
//                 { value: "Land", label: "Land" },
//                 { value: "Multiple", label: "Multiple" }
//               ]}
//               error={errors.projectType}
//             />
//             {errors.projectType && (
//               <div className="invalid-feedback d-block">
//                 {errors.projectType}
//               </div>
//             )}
//           </Group>
//           <Label>Project Price Range</Label>
//           <PriceRangeInput
//             min={0}
//             max={2000000}
//             step={[
//               { till: 500000, step: 25000 },
//               { till: 1000000, step: 50000 },
//               { till: 2000000, step: 100000 },
//               { till: 10000000, step: 500000 }
//             ]}
//             onChange={setProjectPriceRange}
//             value={projectPriceRange}
//             isSubmitted={isSubmitted}
//             initialData={initialData.projectPriceRange}
//             setErrors={setErrors}
//             reset={reset}
//             error={errors.projectPriceRange}
//           />
//         </Group>
//         <Group>
//           <Label>Project Description</Label>
//           {errors.projectDescription && (
//             <div className="invalid-feedback d-block">
//               {errors.projectDescription}
//             </div>
//           )}
//           <style>
//             {`
//                   .ql-editor {
//                     min-height: 100px;
//                     resize: vertical;
//                     overflow-y: scroll;
//                     }
                    
//                     .ql-container {
//                       resize: vertical;
//                       overflow-y: scroll;
//                     }
//                 `}
//           </style>
//           <ReactQuill
//             value={projectDescription}
//             onChange={handleProjectDescriptionChange}
//           />
//         </Group>
//         <Group>
//           {/* <ImageBrowser
//           titleImage={titleImage}
//           slideshowImages={slideshowImages}
//           setTitleImage={setTitleImage}
//           setSlideshowImages={setSlideshowImages}
//           initialData={initialData}
//         /> */}
//           <EditImageBrowser
//             titleImage={titleImage}
//             setTitleImage={setTitleImage}
//             deletedTitleImage={deletedTitleImage}
//             setDeletedTitleImage={setDeletedTitleImage}
//             slideshowImages={slideshowImages}
//             setSlideshowImages={setSlideshowImages}
//             deletedSlideshowImages={deletedSlideshowImages}
//             setDeletedSlideshowImages={setDeletedSlideshowImages}
//             initialData={initialData}
//             reset={reset}
//           />
//         </Group>
//         <Group>
//           <Label>Project Location</Label>
//           <LocationAutocomplete
//             // key={key}
//             selectedLocation={projectLocation}
//             onChange={handleProjectLocationChange}
//             onCoordinatesChange={handleCoordinatesChange}
//             initialData={initialData.projectLocation}
//             error={errors.projectLocation}
//             reset={reset}
//           />
//         </Group>
//         <SelectProjectMembers
//           user={user}
//           onSubmitEditableBy={setEditableBy}
//           setErrors={setErrors}
//           error={errors.editableBy}
//           initialData={initialData.editableBy}
//           reset={reset}
//         />
//         <ProjectCommission
//           onCommissionChange={setCommissionData}
//           setErrors={setErrors}
//           error={errors.projectCommission}
//           initialData={initialData.projectCommission}
//           reset={reset}
//         />
//       </div>
//       <Group>
//         <Label>Project Status</Label>
//         <Select
//           name="projectStatus"
//           isDisabled={false}
//           defaultValue={{ value: "Active", label: "Active" }}
//           value={{ value: projectStatus, label: projectStatus }}
//           onChange={(selectedOption) => setProjectStatus(selectedOption.value)}
//           menuPlacement="auto"
//           menuPortalTarget={document.body}
//           overflowX="scroll"
//           options={[
//             { value: "Active", label: "Active" },
//             { value: "Inactive", label: "Inactive" }
//           ]}
//           error={errors.projectStatus}
//         />
//         {errors.projectStatus && (
//           <div className="invalid-feedback d-block">
//             {errors.projectStatus}
//           </div>
//         )}
//       </Group>
//     </Container>
//     )
//   }
// }

// export default Test