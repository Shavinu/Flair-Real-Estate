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
import ProjectService from 'src/services/project-service';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProjectList = useCallback(
    async () => {
      try {
        const response = await ProjectService.searchProjects(currentPage, 6, {
          // projectName: searchResults.searchTerm,
          // projectType: searchResults.type !== 'All' && searchResults.type !== 'Projects' ? searchResults.type : '',
          // projectPriceRange: {
          //   minPrice: searchResults.minPrice !== 0 ? searchResults.minPrice : undefined,
          //   maxPrice: searchResults.maxPrice !== 0 ? searchResults.maxPrice : undefined,
          // }
        });

        const projects = response?.projects.map(async result => {
          const listingPromises = result?.projectListings.map(listingId => ListingService.getListing(listingId));
          const fetchedListings = await Promise.all(listingPromises);
          let availableListingsCount = 0;

          fetchedListings.forEach(listing => {
            if (listing.status === 'Available') {
              availableListingsCount++;
            }
          });

          return {
            _id: result._id,
            name: result.projectName,
            commission: result.projectCommission[0],
            address: result.projectLocation[0].locationName,
            owner: result.projectOwner,
            priceRange: result.projectPriceRange[0],
            status: result.projectStatus,
            type: result.projectType,
            images: getImageUrls(result.projectSlideImages),
            isProject: true,
            createdAt: result.createdAt,
            availableListingCount: availableListingsCount
          }
        })
        const fetchedProjects = await Promise.all(projects);

        console.log(fetchedProjects);

        setProjects(fetchedProjects);
        setTotalPages(response.totalPages);
      } catch (error) {

      }
    },
    [currentPage],
  )

  useEffect(() => {
    getProjectList();
  }, [getProjectList])

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

  return (<>
    <Helmet>
      <title>Project List - {PROJECT_NAME}</title>
    </Helmet>

    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Project', href: paths.dashboard.projects.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.projects.create}
            variant="contained"
            startIcon={<Add />}
          >
            New Project
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={4} alignItems="flex-start">
        {projects.map((project, key) => <Grid xs={12} md={4} key={`${project.name}-${project._id}`}>
          <ListingCard item={project} />
        </Grid>)}

        <Grid xs={12} sx={{ pt: 4 }}>
          <Stack direction="row" justifyContent="center" >
            <Pagination count={totalPages} onChange={handlePageChange} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </>)
}

export default ProjectList
