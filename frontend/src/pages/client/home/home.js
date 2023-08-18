import { useTheme } from "@emotion/react";
import { ChevronRight } from "@mui/icons-material";
import { Container, Typography, alpha, Button, Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Image, RouterLink } from "src/components";
import { useResponsive } from "src/hooks/use-responsive";
import { paths } from "src/paths";
import HomeHero from "src/sections/home/home-hero";
import { bgGradient } from "src/theme/css";
import LatestProperties from "./components/latest-properties";
import {m} from 'framer-motion';

const Home = () => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  return <>
    <Helmet>
      <title> Flair Real Estate</title>
    </Helmet>

    <HomeHero />

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
          <Typography variant="h3" sx={{ mb: 3 }}>
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
        <Typography variant="h3" sx={{ mb: 3 }}>
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
      <Box sx={{
        textAlign: { xs: 'center' },
      }}>
        <Button LinkComponent={RouterLink} href={paths.client.properties.list} variant="text">
          <Typography variant="h4" color="common.white">
            Search Properties
          </Typography>
          <ChevronRight fontSize="large" sx={{pt:0.5, color: "common.white"}} />
        </Button>
      </Box>
    </Box>
  </>
}

export default Home;
