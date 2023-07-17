import { useMemo } from "react";
import { TableHeadCustom, useTable } from "../../components/table";
import { Link, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { RouterLink } from "../../components";
import { priceFormat } from "../../utils/string";

const PropertyListingTable = ({ listings = [] }) => {
  const table = useTable();
  const columns = useMemo(() => [
    { id: 'name', label: 'Name', width: 200 },
    { id: 'status', label: 'Status', width: 100 },
    { id: 'min', label: 'Minimum Price', width: 100 },
    { id: 'min', label: 'Maximum Price', width: 100 },
    { id: 'land_size', label: 'Land Size' },
    { id: 'bedrooms', label: 'Bedrooms' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'car_spaces', label: 'Car Spaces' },
  ], []);
  return <>
    <TableContainer sx={{ position: 'relative', overflow: 'auto' }}>
      <Table>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headLabel={columns}
          rowCount={listings.length}
          numSelected={table.selected.length}
        />

        <TableBody>
          {listings.slice(
            table.page * table.rowsPerPage,
            table.page * table.rowsPerPage + table.rowsPerPage
          ).map((row, key) => (<TableRow hover key={`nearby-pois-${key}`}>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              <Link component={RouterLink} href={`/listings/${row._id}`} sx={{textDecoration: 'none'}}>
                {row.listingName}
              </Link>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.status}
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              ${priceFormat(row.priceRange[0].minPrice)}
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              ${priceFormat(row.priceRange[0].maxPrice)}
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.landSize} <span>m<sup>2</sup></span>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.bedrooms}
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.bathrooms}
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {row.carSpaces}
            </TableCell>
          </TableRow>))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
}

export default PropertyListingTable
