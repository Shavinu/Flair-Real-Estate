import { Box } from "@mui/material"
import { memo } from "react";
import { ASSETS_URL } from "../../config-global";

const MenuIcon = ({ ...other }) => {
  return <>
    <Box
      component="svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 96 97"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <img src={`${ASSETS_URL}/assets/icons/navbar/ic_menu_item.svg`} alt="Menu Icon" />
    </Box>
  </>
}

export default memo(MenuIcon);
