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

  const [files, setFiles] = useState([
    {
      _id: utils.newGuid(),
      name: 'Plans',
      type: 'folder',
      children: [
        {
          _id: utils.newGuid(),
          name: 'More plans',
          type: 'folder',
          children: [
            {
              _id: utils.newGuid(),
              name: 'Siteplan.txt',
              type: 'file',
            },
            {
              _id: utils.newGuid(),
              name: 'Floorplan.txt',
              type: 'file',
            },
          ]
        },
        {
          name: 'Floorplan.txt',
          type: 'file',
        },
      ]
    },
    {
      _id: utils.newGuid(),
      name: 'Plans',
      type: 'folder',
      children: [
        {
          _id: utils.newGuid(),
          name: 'Siteplan.txt',
          type: 'file',
        },
        {
          _id: utils.newGuid(),
          name: 'Floorplan.txt',
          type: 'file',
        },
      ]
    },
    {
      _id: utils.newGuid(),
      name: 'Plans',
      type: 'folder',
      children: [
        {
          _id: utils.newGuid(),
          name: 'More plans',
          type: 'folder',
          children: [
            {
              _id: utils.newGuid(),
              name: 'Siteplan.txt',
              type: 'file',
            },
            {
              _id: utils.newGuid(),
              name: 'Floorplan.txt',
              type: 'file',
            },
            {
              _id: utils.newGuid(),
              name: 'abc.txt',
              type: 'file',
            },
          ]
        },
        {
          _id: utils.newGuid(),
          name: 'Floorplan.txt',
          type: 'file',
        },
      ]
    },
  ]);

  const validateInput = () => {
    let isValid = true;

    if (!folderName) {
      setErrors({ folderName: 'The folder name cannot be empty' });
      isValid = false;
    }

    return isValid;
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
          updatingFile.children.push({ _id: utils.newGuid, name: folderName, type: "folder" });
        }
      }
    } else {
      newFiles.push({ _id: utils.newGuid(), name: folderName, type: 'folder', children: [] });
    }

    console.log(newFiles);

    setFiles(newFiles);

    setOpenCreateFolderModal(false);
    setFolderName('');
    setErrors({});
  }

  // useEffect(() => {
  //   let temp = [...files];
  //   temp.map(file => ({ ...file, open: false }));
  //   setFiles(temp);
  // }, [files])

  useEffect(() => {
    const f = [...files];
    const filteredFiles = f.filter(file => file.name.includes(searchTerm) || (file.name.includes(searchTerm) && file.children.filter(childFile => childFile.name.includes(searchTerm))).length > 0);
    setSearchFiles(searchTerm ? filteredFiles : files);
    console.log(searchTerm ? filteredFiles : files);
  }, [searchTerm, files]);

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
      <CardBody className="file-manager-sidebar border-top pt-0">
        <ListGroup variant="flush">
          {searchFiles.length > 0
            ? searchFiles.map(file => <ListGroup.Item key={utils.newGuid()}>
              <File file={file} onChangeSelectedSingleFile={setSelectedFile} />
            </ListGroup.Item>)
            : files.map(file => <ListGroup.Item key={utils.newGuid()}>
              <File file={file} onChangeSelectedSingleFile={setSelectedFile} />
            </ListGroup.Item>)}
        </ListGroup>
      </CardBody>
      <CardBody className="border-top pt-0">
        <Row gap="no">
          <Col sx={12}>
            <div className="d-flex align-items-center border-bottom">
              <div className="mr-auto"><h5>{selectedFile?.name}</h5></div>
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
