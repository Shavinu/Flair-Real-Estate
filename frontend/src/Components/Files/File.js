import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import utils from "../../Utils";

const File = ({ file = {}, onChangeSelectedSingleFile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSelectFile = () => {
    onChangeSelectedSingleFile(file);
    setIsOpen(true);
  }

  return <>
    {file.type === 'folder' && <i className={`feather icon-chevron-${isOpen ? 'down' : 'right'} mr-1`}
      style={{ marginLeft: '-30px' }}
      onClick={() => setIsOpen(true)}
    />}
    <i className={`feather icon-${file.type} mr-1`} onClick={onSelectFile} />
    <span onClick={onSelectFile}>{file.name}</span>
    {isOpen && file.children && <ListGroup variant="flush pt-1">
      {file.children?.map(childrenFile => <ListGroup.Item key={utils.newGuid()}>
        <File file={childrenFile} onChangeSelectedSingleFile={onChangeSelectedSingleFile} />
      </ListGroup.Item>)}
    </ListGroup>}
  </>
}

export default File;
