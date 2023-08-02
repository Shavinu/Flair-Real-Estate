import { Apartment, List } from "@mui/icons-material"
import { Container, Pagination, Stack, Tab, Tabs } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import { useCallback, useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { PROJECT_NAME } from "../../../config-global"
import HomeHero from "../../../sections/home/home-hero"
import ListingCard from "../../../sections/listings/listing-card"
import HotOpportunitiesList from "../../../sections/properties/hot-opportunities-list"
import FileService from "../../../services/file-service"
import ListingService from "../../../services/listing-service"
import ProjectService from "../../../services/project-service"
import { SearchContext } from "../../../providers/search/search-context"

const TABS = {
  projects: 'projects',
  listings: 'listings'
}

const PropertyHomeList = () => {
  const [currentTab, setCurrentTab] = useState(TABS.projects);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchResults, onSearch } = useContext(SearchContext);

  const getProperties = useCallback(

    async () => {
      try {
        if (currentTab === TABS.projects) {
          const response = await ProjectService.searchProjects(currentPage, 6, {
            projectName: searchResults.searchTerm,
            projectType: searchResults.type !== 'All' && searchResults.type !== 'Projects' ? searchResults.type : '',
            projectPriceRange: {
              minPrice: searchResults.minPrice !== 0 ? searchResults.minPrice : undefined,
              maxPrice: searchResults.maxPrice !== 0 ? searchResults.maxPrice : undefined,
            }
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

          setProperties(fetchedProjects);
          setTotalPages(response.totalPages);
        } else {
          const listingResponse = await ListingService.searchListings(currentPage, 6, {
            listingName: searchResults.searchTerm,
            type: searchResults.type !== 'All' && searchResults.type !== 'Projects' ? searchResults.type : '',
            priceRange: {
              minPrice: searchResults.minPrice !== 0 ? searchResults.minPrice : undefined,
              maxPrice: searchResults.maxPrice !== 0 ? searchResults.maxPrice : undefined,
            }
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
          setProperties(listings)
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [currentPage, currentTab, searchResults],
  );

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

  const handleChangeTab = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  useEffect(() => {
    getProperties()
  }, [getProperties]);

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
          <HotOpportunitiesList />
        </Grid>
      </Grid>

    </Container>
  </>
}

export default PropertyHomeList
