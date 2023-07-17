import { useCallback, useEffect, useState } from "react";
import FileService from "../../services/file-service";
import ListingService from "../../services/listing-service";
import { Box, Card, CardContent, CardMedia, Link, Stack, Typography } from "@mui/material";
import { RouterLink } from "../../components";
import { Bathtub, DirectionsCarFilled, Hotel, OpenWithRounded } from "@mui/icons-material";

const HotOpportunitiesList = () => {
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
  </>
}
export default HotOpportunitiesList
