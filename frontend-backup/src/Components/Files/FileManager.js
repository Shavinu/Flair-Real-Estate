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
import { Group, Input, Label, CheckBox } from "../Form";

const FileManager = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [folderName, setFolderName] = useState('');
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([
    {
      _id: utils.newGuid(),
      name: 'Files',
      type: 'folder'
    },
    {
      _id: utils.newGuid(),
      name: 'Files',
      type: 'folder',
      children: [
        {
          _id: utils.newGuid(),
          name: 'Files',
          type: 'folder'
        },
      ]
    },
  ]);

  const onSelectFile = (file) => {
    setSelectedFile(file);
  }

  // useEffect(() => {
  //   console.log(utils.flatten(files));
  // }, [files])

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
      <CardBody className="file-manager-sidebar border-top pt-0" style={{ minWidth: '200px', minHeight: '200px' }}>
        <ListGroup variant="flush">
          {files.map((file, key) => <File file={file} selectedFile={selectedFile} key={file._id + '-' + key} onSelectFile={onSelectFile} />)}
        </ListGroup>
      </CardBody>
      <CardBody className="border-top pt-0">
        <Row>
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
              <div className="file-manager-item">
                <CheckBox/>
                <Card className="waves-effect waves-light">
                  <CardBody className="text-center">
                    <i className={`feather icon-${f.type} font-medium-5`} />
                    <p className="card-text pt-1">{f.name}</p>
                  </CardBody>
                </Card>
              </div>
            </Col>)
            : <div></div>
          }
        </Row>
      </CardBody>
    </Card>
  </>
}

export default FileManager;
