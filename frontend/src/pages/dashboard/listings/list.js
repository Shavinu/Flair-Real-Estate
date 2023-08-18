import { Add } from '@mui/icons-material';
import { Button, Container, Pagination, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs, RouterLink } from 'src/components';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import ListingCard from 'src/sections/listings/listing-card';
import FileService from 'src/services/file-service';
import ListingService from 'src/services/listing-service';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getListings = useCallback(
    async () => {
      try {
        const listingResponse = await ListingService.searchListings(currentPage, 6, {
          // listingName: searchResults.searchTerm,
          // type: searchResults.type !== 'All' && searchResults.type !== 'Projects' ? searchResults.type : '',
          // priceRange: {
          //   minPrice: searchResults.minPrice !== 0 ? searchResults.minPrice : undefined,
          //   maxPrice: searchResults.maxPrice !== 0 ? searchResults.maxPrice : undefined,
          // }
        });
        const listings = listingResponse?.listings.map(result => ({
          _id: result._id,
          name: result.listingName,
          commission: result.listingCommission[0],
          address: result.streetAddress,
          owner: result.devloper,
          priceRange: result.priceRange[0],
          status: result.status,
          type: result.type,
          images: getImageUrls(result.slideImages),
          options: {
            bedrooms: result.bedrooms,
            bathrooms: result.bathrooms,
            carSpace: result.carSpace,
            landSize: result.landSize,
          },
          createdAt: result.createdAt,
        }))

        setTotalPages(listingResponse.totalPages);
        setListings(listings)
      } catch (error) {

      }
    },
    [currentPage],
  )

  useEffect(() => {
    getListings();
  }, [getListings])

  const getImageUrls = (images) => {
    const imgs = images.map(image => {
      const value = Object.values(image);

      if (value && value[0]) {
        return FileService.getImageUrl(value[0])
      }

      return false;
    })

    return imgs
  };

  const handlePageChange = (e, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Helmet>
        <title>Listing - {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Listing', href: paths.dashboard.listings.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.listings.create}
              variant="contained"
              startIcon={<Add />}
            >
              New Listing
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Grid container spacing={4} alignItems="flex-start">
          {listings.map((project, key) => <Grid xs={12} md={4} key={`${project.name}-${project._id}`}>
            <ListingCard item={project} />
          </Grid>)}

          <Grid xs={12} sx={{ pt: 4 }}>
            <Stack direction="row" justifyContent="center" >
              <Pagination count={totalPages} onChange={handlePageChange} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Listings
