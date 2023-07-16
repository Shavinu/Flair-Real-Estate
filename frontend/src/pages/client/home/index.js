import { Box, Card, CardContent, Container, InputAdornment, Link, Stack, TextField, Typography, outlinedInputClasses } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { alpha, useTheme } from '@mui/material/styles';
import { Helmet } from "react-helmet-async";
import { RouterLink } from "../../../components";
import Iconify from "../../../components/icons/iconify";
import Image from "../../../components/image";
import { useResponsive } from "../../../hooks/use-responsive";
import { bgGradient } from "../../../theme/css";
import LatestProperties from "./components/latest-properties";

const Home = () => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  return <>
    <Helmet>
      <title> Flair Real Estate</title>
    </Helmet>

    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/images/home/hero.jpg',
        }),
        py: 20,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: { xs: 'center' },
          }}
        >
          <div>
            <Typography variant="h1" sx={{ color: 'primary.main' }}>
              Flair Real Estate
            </Typography>

            <Stack spacing={2} display="inline-flex" direction="row" sx={{ color: 'common.white' }}>
              <Typography variant="h2">Choose Your New Estate with Flair Real Estate.</Typography>
            </Stack>
          </div>

          <Card sx={{ my: 5 }}>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search "
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  [`& .${outlinedInputClasses.root}`]: {
                    bgcolor: 'common.white',
                  },
                  [`& .${outlinedInputClasses.input}`]: {
                    typography: 'subtitle1',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>

    <Container
      sx={{
        py: { xs: 10, md: 15 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
        {mdUp && (
          <Grid container xs={12} md={6} lg={7} alignItems="center" sx={{ pr: { md: 7 } }}>
            <Grid xs={6}>
              <Image
                alt="what_we_do_1"
                src="/assets/images/home/what_we_do_1.jpg"
                ratio="1/1"
                sx={{ borderRadius: 3 }}
              />
            </Grid>

            <Grid xs={6}>
              <Image
                alt="what_we_do_2"
                src="/assets/images/home/what_we_do_2.jpg"
                ratio="3/4"
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          </Grid>
        )}

        <Grid xs={12} md={6} lg={5}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            What We Do
          </Typography>
          <Typography>
            Flair Real Estate is loaded with useful, functional options which allow clients to quickly and easily sell properties. Flair Real Estate is Australia’s leading aggregation group, we are the innovators in strategizing the right properties, thru research, advice and long-term relationships with our builders & development networks. We are not just another portal but a one-stop-shop for all property services and stock across Australia.
          </Typography>
        </Grid>
      </Grid>
    </Container>

    <Box
      sx={{
        py: { xs: 10, md: 15 },
        textAlign: { xs: 'center', md: 'unset' },
        bgcolor: 'background.neutral',
      }}
    >
      <Container>
        <Typography variant="h2" sx={{ mb: 3 }}>
          What We Offer
        </Typography>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid xs={12} md={6} lg={4}>
            <Link component={RouterLink} href={"/"} sx={{ width: 1, textDecoration: 'none' }}>
              <Box
                sx={{
                  ...bgGradient({
                    color: alpha(theme.palette.grey[900], 0.4),
                    imgUrl: '/assets/images/home/what_we_offer_projects.jpg',
                  }),
                  py: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 3,
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale3d(1.01, 1.01, 1)" },
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography variant="h3" color={theme.palette.common.white}>Projects</Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
          <Grid xs={12} md={6} lg={8}>
            <Link component={RouterLink} href={"/"} sx={{ width: 1, textDecoration: 'none' }}>
              <Box
                sx={{
                  ...bgGradient({
                    color: alpha(theme.palette.grey[900], 0.4),
                    imgUrl: '/assets/images/home/what_we_offer_lands.jpg',
                  }),
                  py: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 3,
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale3d(1.01, 1.01, 1)" },
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography variant="h3" color={theme.palette.common.white}>Lands</Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
          <Grid xs={12} md={6} lg={8}>
            <Link component={RouterLink} href={"/"} sx={{ width: 1, textDecoration: 'none' }}>
              <Box
                sx={{
                  ...bgGradient({
                    color: alpha(theme.palette.grey[900], 0.4),
                    imgUrl: '/assets/images/home/what_we_do_2.jpg',
                  }),
                  py: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 3,
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale3d(1.01, 1.01, 1)" },
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography variant="h3" color={theme.palette.common.white}>House & Land
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <Link component={RouterLink} href={"/"} sx={{ width: 1, textDecoration: 'none' }}>
              <Box
                sx={{
                  ...bgGradient({
                    color: alpha(theme.palette.grey[900], 0.4),
                    imgUrl: '/assets/images/home/what_we_offer_build_design.jpeg',
                  }),
                  py: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 3,
                  transition: "transform 0.15s ease-in-out",
                  "&:hover": { transform: "scale3d(1.01, 1.01, 1)" },
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}>
                  <Typography variant="h3" color={theme.palette.common.white}>
                    Build Design
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Box
      sx={{
        py: { xs: 10, md: 15 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <Container>
        <LatestProperties />
      </Container>
    </Box>
  </>
}

export default Home;
