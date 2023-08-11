import * as ListingService from '../../../Services/ListingService';
import * as UserService from '../../../Services/UserService';
import * as ProjectService from '../../../Services/ProjectService';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Col, Card, Tab, Tabs } from "react-bootstrap";
import { Container, Row } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import "./Layout.css";
import RowModal from './RowModal';
import Toast from "../../../Components/Toast";
import { Button, ContentHeader, DatePicker, Dropdown } from "../../../Components";
import { Stack } from 'react-bootstrap';
import utils from "../../../Utils";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';


const Frontpage = () => {

  const [Users2, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedListing, setSelectedListing] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [approveUsers, setApproveUsers] = useState([]);

  const [projects, setProjects] = useState([])
  const [listings, setlistings] = useState([])
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmDeleteModalListing, setShowConfirmDeleteModalListing] = useState(false);
  const [showConfirmDeleteModalProject, setShowConfirmDeleteModalProject] = useState(false);
  const [tst, settst] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [activeTabUser, setActiveTabUser] = useState('unapproved');
  const [activeTabProject, setActiveTabProject] = useState('unapproved');
  const [activeTabListing, setActiveTabListing] = useState('unapproved');

  const handleTabChangeProject = (tab) => {
    setActiveTabProject(tab);
  };

  const handleTabChangeListing = (tab) => {
    setActiveTabListing(tab);
  };

  const handleTabChangeUser = (tab) => {
    setActiveTabUser(tab);
  };

  useEffect(() => {
    UserService.getUserList()
      .then((response) => {
        setUsers(response);
      })
    UserService.getUserList()
      .then((response) => {
        setApproveUsers(response);
      })
    ProjectService.getAllProjects()
      .then((response) => {
        setProjects(response);
      })
    ListingService.getAllListings()
      .then((response) => {
        setlistings(response);
      })
  }, []);

  //Extracting the project details
  const filteredProjects = projects.map(project => ({
    projectName: project.projectName,
    projectType: project.projectType,
    projectOwner: project.projectOwner.firstName,
    locationName: project.projectLocation[0].locationName,
    region: project.projectLocation[0].region,
    updatedAt: project.updatedAt,
    projectApproved: project.projectApproved
  }));


  const filteredunApprovedProjects = filteredProjects.filter(project => project.projectApproved === false);//For the Graph
  const countfilteredunApprovedProjects = filteredunApprovedProjects.length;
  const filteredApprovedProjects = filteredProjects.filter(project => project.projectApproved === true);//For the Graph


  // Extract listing details
  const filteredListings = listings.map((item) => {
    return {
      listingName: item.listingName,
      type: item.type,
      devloper: item.devloper,
      streetAddress: item.streetAddress,
      region: item.region,
      updatedAt: item.updatedAt,
      listingApproved: item.listingApproved
    };
  });
  //const filteredunApprovedListings = filteredListings.filter(item => item.listingApproved == false);
  //const countfilteredunApprovedListings = filteredunApprovedListings.length;
  //const filteredApprovedListings = filteredListings.filter(item => item.listingApproved === true);//For the Graph



  // const filteredProjects = unapproveProject.projects.map(project => ({
  //     projectName: project.projectName,
  //     projectType: project.projectType,
  //     projectOwner: project.projectOwner,
  //     locationName: project.projectLocation[0].locationName,
  //     region: project.projectLocation[0].region,
  //     updatedAt: project.updatedAt
  //   }));

  const userMap = {};
  Users2.forEach(user => {
    userMap[user._id] = user;
  });

  const listingsWithOwners = filteredListings.map(item => {
    const owner = userMap[item.devloper];
    if (owner) {
      return {
        ...item,
        devloper: owner
      };
    }
    return item;
  });

  const filteredunapprovedListingData = listingsWithOwners.map(item => ({
    listingName: item.listingName,
    type: item.type,
    devloper: item.devloper.firstName,
    streetAddress: item.streetAddress,
    region: item.region,
    updatedAt: item.updatedAt,
    listingApproved: item.listingApproved
  }));

  const filteredunApprovedListings = filteredunapprovedListingData.filter(item => item.listingApproved === false);
  const countfilteredunApprovedListings = filteredunApprovedListings.length;
  const filteredApprovedListings = filteredunapprovedListingData.filter(item => item.listingApproved === true);//For the Graph


  //Extracting the user details that are unapproved
  const filteredunapprovedUserData = approveUsers.map(item => ({
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    phoneNo: item.phoneNo,
    accType: item.accType,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    city: item.city,
    licence: item.licence,
    company: item.company,
    country: item.country,
    postcode: item.postcode,
    verified: item.verified,
    verifiedLicence: item.verifiedLicence
  }));

  const filteredunApprovedUser = filteredunapprovedUserData.filter(item => item.verified == false);
  const countfilteredunApprovedUsers = filteredunApprovedUser.length;
  const filteredApprovedUsers = filteredunapprovedUserData.filter(item => item.verified === true);

  const userunApprovedColumns = useMemo(() => [
    
    {
      name: 'First Name',
      selector: row => row.firstName || '--',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName || '--',
      sortable: true,
      hide: true,
    },
    {
      name: 'Email',
      selector: row => row.email || '--',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNo || '--',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => utils.string.capitalize(row.accType) || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.createdAt) : '--',
      sortable: true,
    },
    {
      name: 'City',
      selector: row => row.city,
      sortable: true,
    },
    {
      name: 'Country',
      selector: row => row.country,
      sortable: true,
    },
    {
      name: 'Postcode',
      selector: row => row.postcode,
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-user-check"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-user-x"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModal(row)}>
          <i className="feather icon-eye"></i>
        </Button>
      </>)
    }
  ], []);
  const usercolumnsToDisplay = userunApprovedColumns.filter(column => column.name !== '' 
  && column.name !== 'Postcode' && column.name !== 'Country' && column.name !== 'City' && column.name !== 'Last Modified At');

  //TESTING
  const onRowClicked = (row, event) => {
    console.log("row", row);
    //setActiveRow(row);
  };

  const userApprovedColumns = useMemo(() => [
    {
      name: 'First Name',
      selector: row => row.firstName || '--',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName || '--',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email || '--',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNo || '--',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => utils.string.capitalize(row.accType) || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: 'License Verified',
      selector: row => row.verifiedLicence,
      cell: row => row.verifiedLicence ? 'Verified' : 'Not verified',
      sortable: true,
    }
  ], []);

  const projectColumns = useMemo(() => [
    {
      name: 'Project Name',
      selector: row => row.projectName || '--',
      sortable: true,
    },
    {
      name: 'Property Type',
      selector: row => row.projectType || '--',
      sortable: true,
    },
    {
      name: 'Project Owner',
      selector: row => row.projectOwner || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.locationName || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-check-square"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-x-circle"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModal(row)}>
          <i className="feather icon-eye"></i>
        </Button>
      </>)
    }
  ], []);

  const projectApprovedColumns = useMemo(() => [
    {
      name: 'Project Name',
      selector: row => row.projectName || '--',
      sortable: true,
    },
    {
      name: 'Property Type',
      selector: row => row.projectType || '--',
      sortable: true,
    },
    {
      name: 'Project Owner',
      selector: row => row.projectOwner || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.locationName || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    }
  ], []);

  const listingColumns = useMemo(() => [
    {
      name: 'Listing Name',
      selector: row => row.listingName || '--',
      sortable: true,
    },
    {
      name: 'Listing Type',
      selector: row => row.type || '--',
      sortable: true,
    },
    {
      name: 'Developer',
      selector: row => row.devloper || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.streetAddress || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-check-square"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onRowClicked(row)}>
          <i className="feather icon-x-circle"></i>
        </Button>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1" onClick={(e) => handleOpenModal(row)}>
          <i className="feather icon-eye"></i>
        </Button>
      </>)
    }
  ], []);

  const listingApprovedColumns = useMemo(() => [
    {
      name: 'Listing Name',
      selector: row => row.listingName || '--',
      sortable: true,
    },
    {
      name: 'Listing Type',
      selector: row => row.type || '--',
      sortable: true,
    },
    {
      name: 'Developer',
      selector: row => row.devloper || '--',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.streetAddress || '--',
      sortable: true,
    },
    {
      name: 'Region',
      selector: row => row.region || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    }
  ], []);


  const handleOpenModal = (row) => {
    //console.log("row", row);
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const onSelectedRowsChangeListing = (selected) => {
    setSelectedListing(selected.selectedRows);
  }
  const onSelectedRowsChangeProject = (selected) => {
    setSelectedProject(selected.selectedRows);
  }



  //Get userID for the frontpage
  const SetFrontPagePart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user.payload._id;

    return userID;
  }
  const ID = SetFrontPagePart();

  //Extract username and listings/ projects
  const filteredLoginUser = Users2.map((item) => {
    const uID = item._id;

    if (uID === ID) {
      return {
        _id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        verified: item.verified,
        licence: item.licence
      };
    }
    else { return {} }
  })
  const filteredFirstNames = filteredLoginUser.map(item => item ? item.firstName : null).filter(firstName => firstName !== null);

  return (
    <Container className="content-container">
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <div>
              <h1>Flair Real Estate Moderator Dashboard</h1>
            </div>
          </Row>
        </Card>
      </Col>
      <br />
      <div class="container">
        <Col lg={12}>
          <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
            <Row>
              <h4>Quick summary 🔦</h4>
              <br /><br />
            </Row>
            <Row>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Welcome</h5>
                  <br />
                  <p><h1>{filteredFirstNames}</h1></p>

                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending user accounts</h5>
                  <br />
                  <p><h1>{countfilteredunApprovedUsers} </h1></p>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending listings</h5>
                  <br />
                  <p><h1>{countfilteredunApprovedListings} </h1></p>
                </Card>
              </Col>
              <Col lg={3}>
                <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                  <h5>Pending projects</h5>
                  <br />
                  <p><h2>{countfilteredunApprovedProjects} </h2></p>
                </Card>
              </Col>
            </Row>
            <Row>
              <br /><br />
              <p><br />Description</p>
              <p>
                Flair Real Estate agent dashboard lets you walk through your listings, projects including the total number of
                builders in our Flair Real Estate.
              </p>
            </Row>
          </Card>
        </Col>
      </div>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>User account approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabUser} onSelect={handleTabChangeUser}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          <DataTable
                            columns={usercolumnsToDisplay}
                            data={filteredunApprovedUser}
                            //selectableRows
                            //onSelectedRowsChange={onSelectedRowsChange}
                            //onRowClicked={(row) => handleOpenModal(row)}
                            pagination 
                            highlightOnHover/>
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={userApprovedColumns}
                            data={filteredApprovedUsers}
                            pagination
                            highlightOnHover />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
            <RowModal
              show={showModal}
              handleClose={handleCloseModal}
              rowData={selectedRow}
            />
          </Row>
          <br />
        </Card>
      </Col>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>Listing approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <br /><br />
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabListing} onSelect={handleTabChangeListing}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          {selectedListing.length > 0 && <Dropdown
                            className="btn btn-outline-success"
                            label={`${selectedListing.length} items selected`}
                            items={[
                              { name: "Delete selected items", onClick: () => setShowConfirmDeleteModalListing(true) },
                            ]} />}
                          <DataTable
                            columns={listingColumns}
                            data={filteredunApprovedListings}
                            selectableRows
                            onSelectedRowsChangeListing={onSelectedRowsChangeListing}
                            pagination />
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={listingApprovedColumns}
                            data={filteredApprovedListings}
                            pagination />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
          </Row><br />
        </Card>
      </Col>
      <br />
      <Col lg={12}>
        <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
          <Row>
            <h4>Project approvals</h4>
            <br /><br />
          </Row>
          <Row>
            <br /><br />
            <Col lg={12}>
              <ResponsiveContainer>
                <Row>
                  <Card className="rounded m-auto pb-0 pt-1 pl-1 pr-1">
                    <Tabs activeKey={activeTabProject} onSelect={handleTabChangeProject}>
                      <Tab eventKey="unapproved" title="Unapproved">
                        <CardBody>
                          {selectedProject.length > 0 && <Dropdown
                            className="btn btn-outline-success"
                            label={`${selectedProject.length} items selected`}
                            items={[
                              { name: "Delete selected items", onClick: () => setShowConfirmDeleteModalProject(true) },
                            ]} />}
                          <DataTable
                            columns={projectColumns}
                            data={filteredunApprovedProjects}
                            selectableRows
                            onSelectedRowsChangeProject={onSelectedRowsChangeProject}
                            pagination />
                        </CardBody>
                      </Tab>
                      <Tab eventKey="approved" title="Approved">
                        <CardBody>
                          <DataTable
                            columns={projectApprovedColumns}
                            data={filteredApprovedProjects}
                            pagination />
                        </CardBody>
                      </Tab>
                    </Tabs>
                  </Card>
                </Row>
              </ResponsiveContainer>
            </Col>
          </Row><br />
        </Card>
      </Col><br /><br />
      {/* <p>{JSON.stringify(filteredProjects)}</p> */}
      {/* <p>{JSON.stringify(filteredunapprovedProjectData)}</p> */}
      <p>{JSON.stringify(listingsWithOwners)}</p><br />
      <p>{JSON.stringify(filteredunapprovedListingData)}</p>

      <p>{JSON.stringify(approveUsers)}</p>
      <br />
    </Container>
  );
}

export default Frontpage;