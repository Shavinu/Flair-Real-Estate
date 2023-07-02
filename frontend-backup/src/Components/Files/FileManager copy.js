import { ListGroup } from "react-bootstrap";
import utils from "../../Utils";
import Card from "../Card";
import CardBody from "../Card/CardBody";
import File from "./File";
import './FileManager.css';
import { Col, Row } from "../Grid";
import { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { Group, Input, Label } from "../Form";

const FileManager = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [folderName, setFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFiles, setSearchFiles] = useState([]);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [files, setFiles] = useState([]
    // {
    //   _id: utils.newGuid(),
    //   name: 'Files',
    //   type: 'folder'
    // }]
    // [
    // {
    //   _id: utils.newGuid(),
    //   name: 'Plans',
    //   type: 'folder',
    //   children: [
    //     {
    //       _id: utils.newGuid(),
    //       name: 'More plans',
    //       type: 'folder',
    //       children: [
    //         {
    //           _id: utils.newGuid(),
    //           name: 'Siteplan.txt',
    //           type: 'file',
    //         },
    //         {
    //           _id: utils.newGuid(),
    //           name: 'Floorplan.txt',
    //           type: 'file',
    //         },
    //       ]
    //     },
    //     {
    //       name: 'Floorplan.txt',
    //       type: 'file',
    //     },
    //   ]
    // },
    // {
    //   _id: utils.newGuid(),
    //   name: 'Plans',
    //   type: 'folder',
    //   children: [
    //     {
    //       _id: utils.newGuid(),
    //       name: 'Siteplan.txt',
    //       type: 'file',
    //     },
    //     {
    //       _id: utils.newGuid(),
    //       name: 'Floorplan.txt',
    //       type: 'file',
    //     },
    //   ]
    // },
    // {
    //   _id: utils.newGuid(),
    //   name: 'Plans',
    //   type: 'folder',
    //   children: [
    //     {
    //       _id: utils.newGuid(),
    //       name: 'More plans',
    //       type: 'folder',
    //       children: [
    //         {
    //           _id: utils.newGuid(),
    //           name: 'Siteplan.txt',
    //           type: 'file',
    //         },
    //         {
    //           _id: utils.newGuid(),
    //           name: 'Floorplan.txt',
    //           type: 'file',
    //         },
    //         {
    //           _id: utils.newGuid(),
    //           name: 'abc.txt',
    //           type: 'file',
    //         },
    //       ]
    //     },
    //     {
    //       _id: utils.newGuid(),
    //       name: 'Floorplan.txt',
    //       type: 'file',
    //     },
    //   ]
    // },
    // ]
  );

  const validateInput = () => {
    let isValid = true;

    if (!folderName) {
      setErrors({ folderName: 'The folder name cannot be empty' });
      isValid = false;
    }

    return isValid;
  }

  const onChangeSelectedSingleFile = (file) => {
    const newFiles = [...files];
    const f = newFiles.find(f => f._id === file._id);

    const index = newFiles.indexOf(f);
    if (index > -1) {
      newFiles[index] = { ...file, isOpen: !file.isOpen }
    }

    if (selectedFile && selectedFile?._id === file._id) {
      setSelectedFile();
    } else {
      setSelectedFile(file);
    }

    if (file.type === 'folder') {
      setBreadcrumbs([...breadcrumbs, { _id: file._id, name: file.name }]);
    }

    setFiles(newFiles)
  }

  const onCreateNewFolder = () => {
    if (!validateInput()) {
      return;
    }

    const newFiles = [...files];
    if (selectedFile && selectedFile.type !== 'file') {
      const f = files.find(file => file._id === selectedFile._id);
      const index = newFiles.indexOf(f);
      if (index > -1) {
        const updatingFile = newFiles[index];
        if (updatingFile) {
          updatingFile.children.push({ _id: utils.newGuid, name: folderName, type: "folder", isOpen: false });
        }
      }
    } else {
      newFiles.push({ _id: utils.newGuid(), name: folderName, type: 'folder', children: [], isOpen: false });
    }

    setFiles(newFiles);

    setOpenCreateFolderModal(false);
    setFolderName('');
    setErrors({});
  }

  // useEffect(() => {
  //   const f = [...files];
  //   const filteredFiles = f.filter(file => file.name.includes(searchTerm) || (!file.name.includes(searchTerm) && file.children.filter(childFile => childFile.name.includes(searchTerm))).length > 0);
  //   setSearchFiles(searchTerm ? filteredFiles : files);
  // }, [searchTerm, files]);

  return <>
    <ul className="nav border-top">
      <li className="nav-item">
        <Button className="btn btn-flat-dark btn-md" icon="feather icon-folder"
          onClick={() => setOpenCreateFolderModal(true)}
          dataToggle="modal" dataTarget="#create-new-folder-modal">
          New folder
        </Button>
        <Button className="btn btn-flat-dark btn-md mr-2" icon="feather icon-upload">
          Upload
        </Button>
      </li>
    </ul>
    <Card className="file-manager">
      {searchFiles.length <= 0 && files.length <= 0
        ? <CardBody>
          <p className="text-center w-100">No file to display</p>
        </CardBody>
        : <>
          <CardBody className="file-manager-sidebar border-top pt-0" style={{ minWidth: '200px', minHeight: '200px' }}>
            <ListGroup variant="flush">
              {searchFiles.length > 0
                ? searchFiles.map(file => <ListGroup.Item key={utils.newGuid()}>
                  <File file={file} onChangeSelectedSingleFile={onChangeSelectedSingleFile} />
                </ListGroup.Item>)
                : files.map(file => <ListGroup.Item key={utils.newGuid()}>
                  <File file={file} onChangeSelectedSingleFile={onChangeSelectedSingleFile} />
                </ListGroup.Item>)}
            </ListGroup>
          </CardBody>
          <CardBody className="border-top pt-0">
            <Row gap="no">
              <Col sx={12}>
                <div className="d-flex align-items-center border-bottom">
                  <div className="mr-auto">
                    <h5>{selectedFile?.name}</h5>
                    {/* <ol className="breadcrumb border-left-0">
                      {breadcrumbs && breadcrumbs.map(item => {
                        // if (!item.active) {
                        //   return <li className="breadcrumb-item" key={utils.newGuid()}>
                        //     <Link to={item.link ?? '/'}>{item.name}</Link>
                        //   </li>
                        // }

                        return <li className="breadcrumb-item active" key={utils.newGuid()}>
                          {item.name}
                        </li>
                      })}
                    </ol> */}
                  </div>
                  <div>
                    <Group hasIconLeft style={{ margin: '5px 0px' }}>
                      <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
                      <div class="form-control-position">
                        <i class="feather icon-search"></i>
                      </div>
                    </Group>
                  </div>
                </div>
              </Col>
              {selectedFile
                ? selectedFile.children?.length > 0 && selectedFile.children.map(f => <Col auto key={utils.newGuid()}>
                  <Card className="file-manager-item waves-effect waves-light">
                    <CardBody className="text-center">
                      <i className={`feather icon-${f.type} font-medium-5`} />
                      <p className="card-text pt-1">{f.name}</p>
                    </CardBody>
                  </Card>
                </Col>)
                : <div></div>
              }
            </Row>
          </CardBody>
        </>
      }
    </Card >

    <Modal id="create-new-folder-modal"
      title="Folder"
      show={openCreateFolderModal}
      setShow={setOpenCreateFolderModal}
      onSubmit={onCreateNewFolder}
    >
      <Group>
        <Label>Folder Name</Label>
        <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} error={errors?.folderName} />
      </Group>
    </Modal>
  </>
}

export default FileManager;
