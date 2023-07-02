import { KeyboardArrowDownRounded, KeyboardArrowRightRounded } from "@mui/icons-material";
import { Box, Collapse, Link, ListItemText, Tooltip } from "@mui/material";
import { RouterLink } from "../../../../components";
import SidebarConfig from "./sidebar-config";
import { StyledDotIcon, StyledIcon, StyledItem } from "./styles";

const SidebarItem = ({ item, depth, active, config, open, ...other }) => {
  const { name, action, icon, info, children, disabled, caption } = item;
  const subItem = depth !== 1;

  if (item.isRoute) {
    return null
  }

  return <>
    <Link
      component={RouterLink}
      href={!!children?.length ? "#" : action}
      underline="none"
      color="inherit"
      sx={{
        ...(item.disabled && {
          cursor: 'default',
        }),
      }}
    >
      <StyledItem
        disableGutters
        disabled={disabled}
        active={active}
        depth={depth}
        config={config}
        {...other}
      >
        <>
          {icon && <StyledIcon size={config?.iconSize}>{icon}</StyledIcon>}

          {subItem && (
            <StyledIcon size={config?.iconSize}>
              <StyledDotIcon active={active} />
            </StyledIcon>
          )}
        </>

        {!(config?.hiddenLabel && !subItem) && (
          <ListItemText
            primary={name}
            secondary={
              caption ? (
                <Tooltip title={caption} placement="top-start">
                  <span>{caption}</span>
                </Tooltip>
              ) : null
            }
            primaryTypographyProps={{
              noWrap: true,
              typography: 'body2',
              textTransform: 'capitalize',
              fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
            }}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />
        )}

        {info && (
          <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
            {info}
          </Box>
        )}

        {!!children && (
          open ? <KeyboardArrowDownRounded /> : <KeyboardArrowRightRounded />
          // <Iconify
          //   width={16}
          //   icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          //   sx={{ ml: 1, flexShrink: 0 }}
          // />
        )}
      </StyledItem>
    </Link>
  </>
}

export default SidebarItem
