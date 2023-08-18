import { DeleteForeverRounded } from '@mui/icons-material';
import { Box, Button, Chip, Paper, Stack } from '@mui/material';
import PropTypes from 'prop-types';

const UserDataTableFilters = ({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) => {
  const handleRemoveRole = (inputValue) => {
    const newValue = filters.role.filter((item) => item !== inputValue);
    onFilters('role', newValue);
  };

  return <>
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.role.length && (
          <Block label="Role:">
            {filters.role.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveRole(item)} />
            ))}
          </Block>
        )}

        {filters.name && (
          <Block label="Search:">
            <Chip label={filters.name} size="small" onDelete={() => onFilters('name', '')} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<DeleteForeverRounded />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  </>
}

UserDataTableFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};


function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};

export default UserDataTableFilters
