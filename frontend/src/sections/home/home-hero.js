import { Autocomplete, Box, Button, Card, CardContent, Checkbox, Container, FormControlLabel, FormGroup, InputAdornment, Stack, TextField, Typography, outlinedInputClasses } from "@mui/material"
import Iconify from "../../components/icons/iconify"
import { bgGradient } from "../../theme/css"
import { alpha, useTheme } from '@mui/material/styles';

const HomeHero = () => {
  const theme = useTheme();

  return <>
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
            <Typography variant="h2" sx={{ color: 'primary.main' }}>
              Flair Real Estate
            </Typography>

            <Stack spacing={2} display="inline-flex" direction="row" sx={{ color: 'common.white' }}>
              <Typography variant="h3">Choose Your New Estate with Flair Real Estate.</Typography>
            </Stack>
          </div>

          <Card sx={{ my: 5 }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
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

                <Button variant="contained" sx={{ width: 200 }}>Search</Button>
              </Stack>
              <Stack>
                <FormControlLabel label="Surrounding Suburbs" control={<Checkbox size="small" />} />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" align="left">Project Type</Typography>
                  <Autocomplete
                    fullWidth options={[
                    ]}
                    renderInput={(params) => <TextField {...params}
                      type="text"
                      fullWidth
                      placeholder="Project Type"
                    />}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" align="left">Minimum Price</Typography>
                  <Autocomplete
                    fullWidth options={[
                    ]}
                    renderInput={(params) => <TextField {...params}
                      type="text"
                      fullWidth
                      placeholder="Minimum Price"
                    />}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" align="left">Maximum Price</Typography>
                  <Autocomplete
                    fullWidth options={[
                    ]}
                    renderInput={(params) => <TextField {...params}
                      type="text"
                      fullWidth
                      placeholder="Maximum Price"
                    />}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container >
    </Box >
  </>
}

export default HomeHero
