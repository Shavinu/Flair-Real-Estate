import PropTypes from "prop-types";
import SidebarItem from "./sidebar-item";
import { useActiveLink, usePathname } from "../../../../hooks/routes";
import { useCallback, useEffect, useState } from "react";
import { Collapse } from "@mui/material";

const SidebarList = ({ item, depth, config }) => {
  const pathname = usePathname();
  const active = useActiveLink(item.action, item.children?.length > 0);
  const [open, setOpen] = useState(active);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  return <>
    <SidebarItem
      item={item}
      depth={depth}
      open={open}
      active={active}
      onClick={handleToggle}
      config={config}
    />
    {item.children?.length > 0 && (
      <Collapse in={open} unmountOnExit>
        {item.children.map((child, childIndex) => (
          <SidebarList key={'child' + child.name + child.action + childIndex} item={child} depth={depth + 1} config={config} />
        ))}
      </Collapse>
    )}
  </>
}

SidebarList.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
};

export default SidebarList
