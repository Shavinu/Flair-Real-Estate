import { Apartment, Bathtub, CalendarMonth, ChevronLeft, DirectionsCarFilled, Discount, Hotel, Room, ZoomOutMap } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Slider, Stack, Typography, styled } from "@mui/material";
import { FileThumbnail, Markdown, RouterLink } from "../../components";
import { CarouselThumbnail } from "../../components/carousel";
import utils from "../../utils";
import { dateFormat, priceFormat } from "../../utils/string";
import ListingCard from "../listings/listing-card";

import Map from 'react-map-gl';
import { MapControl, MapMarker } from "../../components/map";
import { MAPBOX_API } from "../../config-global";
import HotOpportunitiesList from "./hot-opportunities-list";
import NearByPOIs from "./near-by-pois";
import PropertyListingTable from "./property-listing-table";

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 350,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));


const PropertyDetailView = ({ property }) => {
  const { _id, name, description, owner, priceRange, status, type, address, options, commission, images = [], createdAt, isProject, availableListingCount, attachments = [], project, coordinates, listings = [] } = property;
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
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ pb: 1 }}>Property Description</Typography>
                <Markdown children={description} />
              </CardContent>
            </Card>

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ pb: 2 }}>Property Data</Typography>

                <Container>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} md={6} lg={4}>
                      <Stack spacing={1.5} direction="row">
                        <Apartment />
                        <ListItemText
                          primary="Property Type"
                          secondary={type}
                          primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                          secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                      <Stack spacing={1.5} direction="row">
                        <CalendarMonth />
                        <ListItemText
                          primary="Date Listed"
                          secondary={dateFormat(createdAt, 'DD MMM YYYY')}
                          primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                          secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                          }}
                        />
                      </Stack>
                    </Grid>

                    {commission?.exists && <Grid item xs={12} md={6} lg={4}>
                      <Stack spacing={1.5} direction="row">
                        <Discount size="small" />
                        <ListItemText
                          primary="Commission"
                          secondary={(commission?.amount ? `$${priceFormat(commission?.amount)}` : `${commission?.percent}%`)}
                          primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                          secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                          }}
                        />
                      </Stack>
                    </Grid>}

                    {options?.landSize && <Grid item xs={12} md={6} lg={4}>
                      <Stack spacing={1.5} direction="row">
                        <ZoomOutMap />
                        <ListItemText
                          primary="Land Area"
                          secondary={<>{options?.landSize} <span>m<sup>2</sup></span></>}
                          primaryTypographyProps={{
                            typography: 'body2',
                            color: 'text.secondary',
                            mb: 0.5,
                          }}
                          secondaryTypographyProps={{
                            typography: 'subtitle2',
                            color: 'text.primary',
                            component: 'span',
                          }}
                        />
                      </Stack>
                    </Grid>}
                  </Grid>
                </Container>
              </CardContent>
            </Card>

            {attachments.length > 0 && <>
              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

              <Card>
                <CardContent>
                  <Typography variant="h4" sx={{ pb: 2 }}>Property Attachments</Typography>

                  <Container>
                    <Grid container spacing={2} alignItems="flex-start">
                      {
                        attachments.map((attachment, index) => {
                          if (!attachment[1]) {
                            return <></>
                          }
                          return <Grid item xs={12} md={6} key={`category-${attachment[0]}-${index}}`}>
                            <Typography sx={{ mb: 2 }} variant="h6" component="div">
                              {attachment[0]}
                            </Typography>
                            {attachment[1].map((file, key) => <List key={`file-${file.fileName}-${key}`}>
                              <ListItem sx={{ pl: 0, py: 0 }} component={Link} target="_blank" href={file.url}>
                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                  <Avatar sx={{ width: 32, height: 32, backgroundColor: 'common.white' }}>
                                    <FileThumbnail file={file.fileName} sx={{ width: 20, height: 20 }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText secondary={file.fileName} />
                              </ListItem>
                            </List>)}
                          </Grid>
                        })
                      }
                    </Grid >
                  </Container>
                </CardContent>
              </Card>
            </>}

            {listings?.length > 0 && <>
              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
              <Card>
                <CardContent>
                  <Typography variant="h4" sx={{ pb: 1 }}>Listings</Typography>
                  <PropertyListingTable listings={listings} />
                </CardContent>
              </Card>
            </>}

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

            {coordinates && coordinates.longitude && coordinates.latitude && <Card>
              <CardContent>
                <NearByPOIs coordinates={coordinates} />
              </CardContent>
            </Card>}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                {(options?.bedrooms || options?.bathrooms || options?.landSize || options?.carSpace) && <Box>
                  <Grid container spacing={1} alignItems="center">
                    {options?.bedrooms && <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={1}>
                        <Hotel sx={{ pb: 0.5 }} />
                        <Typography variant="body2">{options?.bedrooms}</Typography>
                      </Stack>
                    </Grid>}
                    {options?.bathrooms && <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={1}>
                        <Bathtub sx={{ pb: 0.5 }} />
                        <Typography variant="body2">{options?.bathrooms}</Typography>
                      </Stack>
                    </Grid>}
                    {options?.carSpaces && <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={1}>
                        <DirectionsCarFilled sx={{ pb: 0.5 }} />
                        <Typography variant="body2">{options?.carSpaces}</Typography>
                      </Stack>
                    </Grid>}
                    {options?.landSize && <Grid item xs={12} md={3}>
                      <Stack>
                        <Typography variant="subtitle1">Land Area</Typography>
                        <Typography variant="body2">{options?.landSize} <span>m<sup>2</sup></span></Typography>
                      </Stack>
                    </Grid>}
                  </Grid>
                  <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
                </Box>}
                {priceRange && <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2">Price Range</Typography>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                      <Typography variant="caption">${priceFormat(priceRange?.minPrice)}</Typography>
                      <Slider min={priceRange?.minPrice} max={priceRange?.maxPrice} sx={{ width: 100 }} value={(priceRange?.minPrice + priceRange?.maxPrice) / 2} disabled />
                      <Typography variant="caption">${priceFormat(priceRange?.maxPrice)}</Typography>
                    </Stack>
                  </Stack>
                </Box>}
                {coordinates && coordinates.longitude && coordinates.latitude && <Box>
                  <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
                  <StyledMapContainer>
                    <Map
                      initialViewState={{
                        longitude: coordinates?.longitude,
                        latitude: coordinates?.latitude,
                        zoom: 5,
                      }}

                      mapboxAccessToken={MAPBOX_API}
                      mapStyle={"mapbox://styles/mapbox/outdoors-v11"}
                    >
                      <MapControl />
                      <MapMarker
                        latitude={coordinates.latitude}
                        longitude={coordinates.longitude}
                      />
                    </Map>
                  </StyledMapContainer>
                </Box>}
              </CardContent>
            </Card>

            {project && <>
              <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
              <Box sx={{ pb: 5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: 2 }}>
                  <Typography variant="h4">About Project</Typography>
                  <Button variant="text" size="small" component={RouterLink} href={`/projects/${project._id}`}>
                    <ChevronLeft />
                    <Typography variant="body2">
                      Go Back To Project
                    </Typography>
                  </Button>
                </Stack>
                <ListingCard item={project} />
              </Box>
            </>}

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

            <Box sx={{ pb: 5 }}>
              <HotOpportunitiesList />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box >
  </>
}

export default PropertyDetailView
