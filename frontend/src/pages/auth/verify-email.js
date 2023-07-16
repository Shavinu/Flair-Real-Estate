import { Helmet } from "react-helmet-async"
import { PROJECT_NAME } from "../../config-global"
import { TickIcon } from "../../components/icons"
import { Box, Button, CircularProgress, Link, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthService from "../../services/auth-service"
import CrossIcon from "../../components/icons/cross-icon"
import { RouterLink } from "../../components"
import { paths } from "../../paths"
import { KeyboardArrowLeftRounded } from "@mui/icons-material"

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const params = useParams();

  const verifyEmailUrl = async (params) => {
    setIsLoading(true);
    try {
      await AuthService.verifyEmail(params.userId, params.token)
    } catch (error) {
      // setAlertMessage('Failed to verify your account. Please try again!')
    }
    setIsLoading(false);
    setIsVerified(true);
  }

  useEffect(() => {
    verifyEmailUrl(params);
  }, [params]);

  return <>
    <Helmet>
      <title>Verify Email - {PROJECT_NAME}</title>
    </Helmet>

    <Box sx={{ my: 'auto' }}>
      <Stack spacing={3} alignItems="center">
        {isLoading
          ? <>
            <CircularProgress size={50} sx={{ mb: 5 }} />
            <Button fullWidth component={RouterLink} href={paths.auth.login} color="primary" variant="contained">Return to sign in</Button>
          </>
          : <>
            {isVerified ? <TickIcon sx={{ height: 96 }} /> : <CrossIcon sx={{ height: 96 }} />}

            <Typography variant="h4">
              {isVerified ? 'Welcome' : 'An error has occurred!'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isVerified ? 'You have successfully verified your account. Use the link below to sign in' : alertMessage}
            </Typography>

            {!isVerified
              && <Button fullWidth component={RouterLink} href={paths.auth.login} color="primary" variant="contained">Resend Email</Button>
            }

            <Link
              component={RouterLink}
              href={paths.auth.login}
              color="inherit"
              variant="subtitle2"
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
              }}
            >
              <KeyboardArrowLeftRounded />
              Return to sign in
            </Link>
          </>
        }

      </Stack>
    </Box>
  </>
}

export default VerifyEmail
