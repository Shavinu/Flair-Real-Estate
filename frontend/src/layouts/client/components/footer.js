import { Box, Container, Divider, IconButton, Link, Stack, Typography, alpha } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { Logo, RouterLink } from "../../../components";
import Iconify from "../../../components/icons/iconify";
import { paths } from "../../../paths";

const Footer = () => {
  const _socials = [
    {
      value: 'facebook',
      name: 'FaceBook',
      icon: 'eva:facebook-fill',
      color: '#1877F2',
      path: 'https://www.facebook.com/caitlyn.kerluke',
    },
    {
      value: 'instagram',
      name: 'Instagram',
      icon: 'ant-design:instagram-filled',
      color: '#E02D69',
      path: 'https://www.instagram.com/caitlyn.kerluke',
    },
    {
      value: 'linkedin',
      name: 'Linkedin',
      icon: 'eva:linkedin-fill',
      color: '#007EBB',
      path: 'https://www.linkedin.com/caitlyn.kerluke',
    },
    {
      value: 'twitter',
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      color: '#00AAEC',
      path: 'https://www.twitter.com/caitlyn.kerluke',
    },
  ];

  const LINKS = [
    {
      headline: 'Quick Links',
      children: [
        { name: 'Home', href: paths.client.home },
        { name: 'About us', href: paths.client.about },
        { name: 'Contact us', href: paths.client.contact },
      ],
    },
  ];

  return <>
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Logo sx={{ mb: 3, width: 200 }} link="/" />

        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          <Grid xs={8} md={3}>
            <Stack spacing={1} direction="column" alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 270,
                }}
              >
                <Iconify icon="mdi:map-marker-outline" width={15} sx={{ mr: 1 }} />
                123 ABC, Central NSW 251
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 270,
                }}
              >
                <Iconify icon="solar:phone-outline" width={15} sx={{ mr: 1 }} />
                0421345656
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 270,
                }}
              >
                <Iconify icon="material-symbols:mail-outline" width={15} sx={{ mr: 1 }} />
                admin@example.com
              </Typography>
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                      sx={{ textDecoration: 'None' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}

              <Stack
                key="social-footer"
                spacing={2}
                alignItems={{ xs: 'center', md: 'flex-start' }}
                sx={{ width: 1 }}
              >
                <Typography component="div" variant="overline">
                  Follow Us On
                </Typography>
                <Stack
                  direction="row"
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                  sx={{
                    mt: 3,
                    mb: { xs: 5, md: 0 },
                  }}
                >
                  {_socials.map((social) => (
                    <IconButton
                      key={social.name}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(social.color, 0.08),
                        },
                      }}
                    >
                      <Iconify color={social.color} icon={social.icon} />
                    </IconButton>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © 2021. All rights reserved
        </Typography>
      </Container>
    </Box>
  </>
}

export default Footer;
