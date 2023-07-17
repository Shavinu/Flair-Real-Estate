import { Bathtub, DirectionsCarFilled, OpenWithRounded } from "@mui/icons-material";
import Hotel from '@mui/icons-material/Hotel';
import { Avatar, Box, Card, CardContent, Chip, Divider, Link, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Image, RouterLink } from "../../components";
import Carousel, { CarouselArrows, useCarousel } from "../../components/carousel";
import { DEFAULT_AVATAR_URL, HOST_URL } from "../../config-global";
import utils from "../../utils";
import { priceFormat } from "../../utils/string";

const ListingCard = ({ item }) => {
  const { _id, name, owner, priceRange, status, type, address, options, commission, images = [], createdAt, isProject, availableListingCount } = item

  const theme = useTheme();

  const carousel = useCarousel({
    autoplay: true,
    autoplaySpeed: 5000,
  });

  const commissionValue = (commission?.amount ? `$${priceFormat(commission?.amount)}`: `${commission?.percent}%`)

  return <>
    <Card variant="outlined">
      <Box
        sx={{
          position: 'relative',
          '& .slick-list': {
            boxShadow: theme.customShadows.z16,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            zIndex: 9,
            right: 16
          }}
        >
          <Stack spacing={0.5} direction="row">
            <Chip label={type} color="primary" variant="filled" size="small" />
            <Chip label={isProject && availableListingCount > 0 ? `${availableListingCount} Available` : status} color="success" variant="filled" size="small" />
            {
              commission?.exists && <Chip label={`Commission: ${commissionValue}`} color="info" variant="filled" size="small" />
            }
          </Stack>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            zIndex: 9,
            right: 16,
            backgroundColor: theme.palette.grey[600],
            p: 0.5
          }}
        >
          <Typography variant="body2" color="common.white">
            From ${utils.string.priceFormat(priceRange?.minPrice || 0)}
          </Typography>
        </Box>

        <Box
          component="svg"
          width={144}
          height={62}
          fill="none"
          viewBox="0 0 144 62"
          xmlns="http://www.w3.org/2000/svg"
          sx={{
            color: 'background.neutral',
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
          }}
        >
          <path
            d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </Box>

        <Avatar
          alt={'default-user'}
          src={DEFAULT_AVATAR_URL}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
          }}
        />

        <CarouselArrows filled onNext={carousel.onNext} onPrev={carousel.onPrev}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {images.slice(0, 4).map((image, key) => (
              <Image key={`${name}-image-${key}`} alt={name + key} src={image || `${HOST_URL}/assets/images/placeholder-listings.png`} ratio="1/1" />
            ))}
          </Carousel>
        </CarouselArrows>
      </Box>
      <Link component={RouterLink} href={isProject ? `/projects/${_id}` : `/listings/${_id}`} sx={{ textDecoration: 'none', color: 'common.black' }}>
        <CardContent sx={{
          pt: 4,
          width: 1,
          backgroundColor: 'common.white'
        }}>
          <Typography
            variant="caption"
            component="div"
            sx={{
              mb: 1,
              color: 'text.disabled',
            }}
          >
            Posted by: {owner?.firstName} {owner?.lastName}
          </Typography>

          <Box sx={{ pb: 2 }}>
            <Typography variant="h6">
              {name}
            </Typography>

            <Typography variant="body1">
              {address}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
              {options?.bedrooms && <Stack direction="row" spacing={0.5}>
                <Hotel sx={{ pb: 0.5 }} />
                <Typography variant="body2">{options?.bedrooms}</Typography>
              </Stack>}

              {options?.bathrooms && <Stack direction="row" spacing={0.5}>
                <Bathtub sx={{ pb: 0.5 }} />
                <Typography variant="body2">{options?.bathrooms}</Typography>
              </Stack>}

              {options?.carSpaces && <Stack direction="row" spacing={0.5}>
                <DirectionsCarFilled sx={{ pb: 0.5 }} />
                <Typography variant="body2">{options?.carSpaces}</Typography>
              </Stack>}
              
              {options?.landSize && <Stack direction="row" spacing={0.5}>
                <OpenWithRounded sx={{ pb: 0.5 }} />
                <Typography variant="body2">{options?.landSize} <span>m<sup>2</sup></span></Typography>
              </Stack>}
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ pt: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="caption"
                component="div"
                sx={{
                  mb: 1,
                  color: 'text.disabled',
                }}
              >
                Property Type: {type}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  mb: 1,
                  color: 'text.disabled',
                }}
              >
                {utils.string.dateFormat(createdAt, 'DD MMM YYYY')}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Link>
    </Card>
  </>
}

export default ListingCard
