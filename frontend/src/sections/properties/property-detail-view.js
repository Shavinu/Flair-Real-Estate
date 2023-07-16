import { Box, Card, CardContent, CardHeader, CardMedia, Chip, Container, Divider, Link, Stack, Typography } from "@mui/material";
import { CarouselThumbnail } from "../../components/carousel";
import utils from "../../utils";
import { Bathtub, DirectionsCarFilled, Hotel, OpenWithRounded, Room } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Markdown, RouterLink } from "../../components";
import { useCallback, useEffect, useState } from "react";
import FileService from "../../services/file-service";
import ListingService from "../../services/listing-service";

const PropertyDetailView = ({ property }) => {
  const { _id, name, description, owner, priceRange, status, type, address, options, commission, images = [], createdAt, isProject, availableListingCount } = property;

  const [latestListings, setLatestListings] = useState([]);

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

  const getImageUrl = (image) => {
    if (image) {
      return FileService.getImageUrl(image)
    }

    return null
  };

  useEffect(() => {
    getLatestListings();
  }, [getLatestListings]);

  return <>
    <Box sx={{ py: 5 }}>
      <Container>
        <Box sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1}>
            <Chip label={type} color="primary" variant="filled" size="small" />
            <Chip label={isProject && availableListingCount > 0 ? `${availableListingCount} Available` : status} color="success" variant="filled" size="small" />
          </Stack>
        </Box>
        <Box sx={{ pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h2">
                {name}
              </Typography>
              <Typography variant="subtitle1">
                <Room fontSize="small" /> {address}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  mb: 1,
                  color: 'text.disabled',
                }}
              >
                Posted By: {`${owner?.firstName} ${owner?.lastName}`}  -  {utils.string.dateFormat(createdAt, 'DD MMM YYYY')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4">
                From ${utils.string.priceFormat(priceRange?.minPrice || 0)}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack spacing={2}>
          <CarouselThumbnail data={images} />
        </Stack>
      </Container>
    </Box>

    <Box
      sx={{
        py: 5,
        bgcolor: 'background.neutral',
      }}
    >
      <Container>

        <Grid container rowSpacing={3} columnSpacing={2} alignItems="flex-start">
          <Grid xs={12} md={8}>
            <Typography variant="h4" sx={{ pb: 2 }}>Property Description</Typography>
            <Card>
              <CardContent>
                <Markdown children={description} />
              </CardContent>
            </Card>
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
    </Box>
  </>
}

export default PropertyDetailView
