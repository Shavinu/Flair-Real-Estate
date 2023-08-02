import { Autocomplete, Box, Button, Card, CardContent, Checkbox, Container, FormControlLabel, InputAdornment, Stack, TextField, Typography, outlinedInputClasses } from "@mui/material";
import { alpha, useTheme } from '@mui/material/styles';
import { useContext, useMemo } from "react";
import { RouterLink } from "../../components";
import Iconify from "../../components/icons/iconify";
import { SearchContext } from "../../providers/search/search-context";
import { bgGradient } from "../../theme/css";
import * as Yup from 'yup';

const SEARCH_TYPES = [
  'All',
  'Projects',
  'Land or Multiple House',
  'House and Land Package',
  'Apartment & Unit',
  'Townhouse',
  'Duplex',
  'Villa',
  'Land',
  'Acreage',
  'Rural',
];

const PRICE_STEP = [
  { till: 500000, step: 25000 },
  { till: 1000000, step: 50000 },
  { till: 2000000, step: 100000 },
  { till: 10000000, step: 500000 }
]

const HomeHero = () => {
  const theme = useTheme();
  const { searchResults, onSearch } = useContext(SearchContext);
  const priceOptions = useMemo(() => {
    let min = 0, max = 2000000;
    let prices = [];
    let currentPrice = min;

    for (let i = 0; i < PRICE_STEP.length; i++) {
      const { till, step: stepValue } = PRICE_STEP[i];

      while (currentPrice <= till && currentPrice <= max) {
        prices.push({
          value: currentPrice,
          label: '$' + currentPrice.toLocaleString()
        });

        currentPrice += stepValue;
      }
    }

    return prices;
  }, []);

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
                  placeholder="Search"
                  value={searchResults.searchTerm}
                  onChange={(event) => onSearch('searchTerm', event.target.value)}
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

                <Button component={RouterLink} href="/properties" variant="contained" sx={{ width: 200 }}>Search</Button>
              </Stack>
              <Stack>
                <FormControlLabel label="Surrounding Suburbs" control={<Checkbox size="small" />} />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" align="left">Property Type</Typography>
                  <Autocomplete
                    onChange={(e, value) => onSearch('type', value)}
                    fullWidth options={SEARCH_TYPES}
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
                    fullWidth options={priceOptions.filter(priceOption => (!searchResults.maxPrice || priceOption.value <= searchResults.maxPrice))}
                    onChange={(e, value) => {
                      onSearch('minPrice', value?.value)
                      onSearch('maxPrice', value?.value)
                    }}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option) => option.value === searchResults.minPrice}
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
                    fullWidth options={priceOptions.filter(priceOption => !searchResults.minPrice || priceOption.value >= searchResults.minPrice)}
                    onChange={(e, value) => onSearch('maxPrice', value?.value)}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option) => option.value === searchResults.minPrice}
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
