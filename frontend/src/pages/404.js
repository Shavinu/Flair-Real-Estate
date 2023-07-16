import { Helmet } from 'react-helmet-async';
import { MotionContainer, varBounce } from '../components/animate';
import { m } from 'framer-motion';
import { Button, Container, Stack, Typography } from '@mui/material';
import { PageNotFound } from '../components/image';
import { RouterLink } from '../components';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <Container component="main">
        <Stack
          sx={{
            py: 10,
            m: 'auto',
            maxWidth: 400,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <MotionContainer>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Sorry, Page Not Found!
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <Typography sx={{ color: 'text.secondary' }}>
                Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
                sure to check your spelling.
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <PageNotFound
                sx={{
                  height: 260,
                  my: { xs: 5, sm: 10 },
                }}
              />
            </m.div>

            <Button component={RouterLink} href="/" size="large" variant="contained">
              Go to Home
            </Button>
          </MotionContainer>
        </Stack>
      </Container>
    </>
  );
}
