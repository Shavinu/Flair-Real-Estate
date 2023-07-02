import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import utils from "../../Utils";

const File = ({ file = {}, selectedFile, onSelectFile }) => {
  const [open, setOpen] = useState(false);

  
  return <>
    <ListGroup.Item onDoubleClick={() => {
      onSelectFile(file)
    }}
      style={{ backgroundColor: selectedFile?._id === file?._id ? '#F8F8F8' : '#FFF' }}
    >
      {file.type === 'folder' && <i className={`feather icon-chevron-${open ? 'down' : 'right'} mr-1`}
        style={{ marginLeft: '-30px' }}
        onClick={() => {
          setOpen(!open)
        }}
      />}
      <i className={`feather icon-${file.type} mr-1`} />
      <span>{file.name}</span>
    </ListGroup.Item>
    {open && <div className="ml-2">
      {file.children && file.children.length > 0
        && file.children.map((childrenFile, key) => <File file={childrenFile} selectedFile={selectedFile} key={childrenFile._id + '-' + key} onSelectFile={onSelectFile} />)}
    </div>}
  </>
}

export default File;
