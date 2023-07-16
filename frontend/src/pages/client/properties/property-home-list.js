import { Helmet } from "react-helmet-async"
import { PROJECT_NAME } from "../../../config-global"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import HomeHero from "../../../sections/home/home-hero"
import { useCallback, useEffect, useState } from "react"
import FileService from "../../../services/file-service"
import ListingService from "../../../services/listing-service"
import ProjectService from "../../../services/project-service"
import ListingCard from "../../../sections/listings/listing-card"
import { Box, Card, CardContent, CardMedia, Container, IconButton, Link, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material"
import { Apartment, Bathtub, DirectionsCarFilled, Hotel, List, OpenWithRounded } from "@mui/icons-material"
import { RouterLink } from "../../../components"

const TABS = {
  projects: 'projects',
  listings: 'listings'
}

const PropertyHomeList = () => {
  const [currentTab, setCurrentTab] = useState(TABS.projects);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestListings, setLatestListings] = useState([]);

  const getProperties = useCallback(
    async () => {
      try {
        if (currentTab === TABS.projects) {
          const response = await ProjectService.searchProjects(currentPage, 6, {});

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
              commission: result.projectCommission,
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

          setProperties(fetchedProjects);
          setTotalPages(response.totalPages);
        } else {
          const listingResponse = await ListingService.searchListings(currentPage, 6, {});
          const listings = listingResponse?.listings.map(result => ({
            _id: result._id,
            name: result.listingName,
            commission: result.listingCommission,
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
          setProperties(listings)
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [currentPage, currentTab],
  );

  const getLatestListings = useCallback(
    async () => {
      const listingResponse = await ListingService.searchListings(1, 5, {});
      const listings = listingResponse?.listings.map(result => ({
        _id: result._id,
        name: result.listingName,
        commission: result.listingCommission,
        address: result.streetAddress,
        owner: result.devloper,
        priceRange: result.priceRange[0],
        status: result.status,
        type: result.type,
        image: getImageUrl(result.titleImage),
        options: {
          bedrooms: result.bedrooms,
          bathrooms: result.bathrooms,
          carSpace: result.carSpace,
          landSize: result.landSize,
        },
        createdAt: result.createdAt,
      }))

      console.log(listings);

      setLatestListings(listings);
    },
    [],
  )

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

  const getImageUrl = (image) => {
    if (image) {
      return FileService.getImageUrl(image)
    }

    return null
  };

  const handlePageChange = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeTab = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  useEffect(() => {
    getProperties()
  }, [getProperties]);

  useEffect(() => {
    getLatestListings();
  }, [getLatestListings])

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab])


  return <>
    <Helmet>
      <title>Properties | {PROJECT_NAME}</title>
    </Helmet>

    <HomeHero />

    <Container sx={{ py: 10 }}>
      <Grid container rowSpacing={3} columnSpacing={2} alignItems="flex-start">
        <Grid container xs={12} md={8}>
          <Stack spacing={2} sx={{ width: 1 }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              <Tab key="projects" icon={<Apartment />}
                iconPosition="start" value={TABS.projects} label="Projects" />
              <Tab key="listings" icon={<List />} iconPosition="start"
                value={TABS.listings} label="Listings" />
            </Tabs>
          </Stack>
          {properties.map((project, key) => <Grid xs={12} md={6} key={`${project.name}-${project._id}`}>
            <ListingCard item={project} />
          </Grid>)}

          <Grid xs={12} sx={{ pt: 4 }}>
            <Stack direction="row" justifyContent="center" >
              <Pagination count={totalPages} onChange={handlePageChange} />
            </Stack>
          </Grid>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4">Hot Opportunities</Typography>
          <Stack direction="column" spacing={2} sx={{ pt: 2 }}>
            {latestListings.map((listing, index) => <Link key={`${listing.name}-${index}`} component={RouterLink} href={`/listings/${listing._id}`} sx={{ textDecoration: 'none' }}>
              <Card sx={{ display: 'flex' }} variant="outlined">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Stack direction="row" spacing={2}>
                      <CardMedia
                        component="img"
                        sx={{ width: 151, borderRadius: 1 }}
                        image={listing.image}
                        alt="Live from space album cover"
                      />
                      <Box>
                        <Typography component="div" variant="body1" fontWeight="bold">
                          {listing.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {listing.address}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                          {listing.options?.bedrooms && <Stack direction="row" spacing={0.5}>
                            <Hotel sx={{ pb: 0.5 }} />
                            <Typography variant="body2">{listing.options?.bedrooms}</Typography>
                          </Stack>}

                          {listing.options?.bathrooms && <Stack direction="row" spacing={0.5}>
                            <Bathtub sx={{ pb: 0.5 }} />
                            <Typography variant="body2">{listing.options?.bathrooms}</Typography>
                          </Stack>}

                          {listing.options?.carSpaces && <Stack direction="row" spacing={0.5}>
                            <DirectionsCarFilled sx={{ pb: 0.5 }} />
                            <Typography variant="body2">{listing.options?.carSpaces}</Typography>
                          </Stack>}
                          {listing.options?.landSize && <Stack direction="row" spacing={0.5}>
                            <OpenWithRounded sx={{ pb: 0.5 }} />
                            <Typography variant="body2">{listing.options?.landSize} <span>m<sup>2</sup></span></Typography>
                          </Stack>}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Box>
              </Card>
            </Link>)}
          </Stack>

        </Grid>
      </Grid>

    </Container>
  </>
}

export default PropertyHomeList
