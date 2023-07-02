import { Box } from "@mui/material"
import { memo } from "react";

const CrossIcon = ({ ...other }) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="3 3 16 16"><defs><linearGradient gradientUnits="userSpaceOnUse" y2="-2.623" x2="0" y1="986.67"><stop stopColor="#ffce3b" /><stop offset="1" stopColor="#ffd762" /></linearGradient><linearGradient id="0" gradientUnits="userSpaceOnUse" y1="986.67" x2="0" y2="-2.623"><stop stopColor="#ffce3b" /><stop offset="1" stopColor="#fef4ab" /></linearGradient><linearGradient gradientUnits="userSpaceOnUse" x2="1" x1="0" xlinkHref="#0" /></defs><g transform="matrix(2 0 0 2-11-2071.72)"><path transform="translate(7 1037.36)" d="m4 0c-2.216 0-4 1.784-4 4 0 2.216 1.784 4 4 4 2.216 0 4-1.784 4-4 0-2.216-1.784-4-4-4" fill="#da4453" /><path d="m11.906 1041.46l.99-.99c.063-.062.094-.139.094-.229 0-.09-.031-.166-.094-.229l-.458-.458c-.063-.062-.139-.094-.229-.094-.09 0-.166.031-.229.094l-.99.99-.99-.99c-.063-.062-.139-.094-.229-.094-.09 0-.166.031-.229.094l-.458.458c-.063.063-.094.139-.094.229 0 .09.031.166.094.229l.99.99-.99.99c-.063.062-.094.139-.094.229 0 .09.031.166.094.229l.458.458c.063.063.139.094.229.094.09 0 .166-.031.229-.094l.99-.99.99.99c.063.063.139.094.229.094.09 0 .166-.031.229-.094l.458-.458c.063-.062.094-.139.094-.229 0-.09-.031-.166-.094-.229l-.99-.99" fill="#fff"/></g></svg>
    </Box>
  </>
}

export default memo(CrossIcon);
