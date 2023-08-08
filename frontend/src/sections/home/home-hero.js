import { Tune } from "@mui/icons-material";
import { Autocomplete, Box, Button, Card, CardContent, Chip, Container, Dialog, DialogContent, DialogTitle, InputAdornment, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography, outlinedInputClasses } from "@mui/material";
import { alpha, useTheme } from '@mui/material/styles';
import { useContext, useMemo } from "react";
import { RouterLink } from "../../components";
import Iconify from "../../components/icons/iconify";
import { useBoolean } from "../../hooks/use-boolean";
import { SearchContext } from "../../providers/search/search-context";
import { bgGradient } from "../../theme/css";
import Scrollbar from "../../components/scrollbar/scrollbar";

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

const TABS = [
  { value: "projects", label: 'Projects' },
  { value: "listings", label: 'Listings' },
  { value: "sold", label: 'Sold Listings' },
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
  const onOpenFilterModal = useBoolean();

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
              <Stack spacing={2}>
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

                  <Button variant="outlined" color="inherit" sx={{ width: 200 }} onClick={onOpenFilterModal.onTrue}>
                    <Tune sx={{ mr: 1 }} /> Filters
                  </Button>

                  <Button component={RouterLink} href="/properties" variant="contained" sx={{ width: 200 }}>Search</Button>
                </Stack>
                {/* <Stack> */}
                {/* <FormControlLabel label="Surrounding Suburbs" control={<Checkbox size="small" />} /> */}
                {/* </Stack> */}
                <Stack direction="row" spacing={2}>
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
                    <Select fullWidth value={searchResults.minPrice} onChange={(event) => onSearch('minPrice', event.target.value)}>
                      {priceOptions
                        .filter(priceOption => (!searchResults.maxPrice || priceOption.value <= searchResults.maxPrice))
                        .map((option, index) => <MenuItem key={`min-price-option-${index}`} value={option.value}>
                          {option.label}
                        </MenuItem>)}
                    </Select>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" align="left">Maximum Price</Typography>
                    <Select fullWidth value={searchResults.maxPrice} onChange={(event) => onSearch('maxPrice', event.target.value)}>
                      {priceOptions
                        .filter(priceOption => !searchResults.minPrice || priceOption.value >= searchResults.minPrice)
                        .map((option, index) => <MenuItem key={`max-price-option-${index}`} value={option.value}>
                          {option.label}
                        </MenuItem>)}
                    </Select>
                  </Box>
                </Stack>

                <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
                  {searchResults.searchTerm && <Block label="Location:">
                    <Chip size="small" label={searchResults.searchTerm} onDelete={() => onSearch('searchTerm', '')}></Chip>
                  </Block>}

                  {(searchResults.type && searchResults.type !== 'All') && <Block label="Property Type:">
                    <Chip size="small" label={searchResults.type} onDelete={() => onSearch('type', '')}></Chip>
                  </Block>}

                  {(!!searchResults.minPrice && searchResults.minPrice !== 0) && <Block label="Min Price:">
                    <Chip size="small" label={searchResults.minPrice} onDelete={() => onSearch('minPrice', 0)}></Chip>
                  </Block>}

                  {(!!searchResults.maxPrice && searchResults.maxPrice !== 0) && <Block label="Max Price:">
                    <Chip size="small" label={searchResults.maxPrice} onDelete={() => onSearch('maxPrice', 0)}></Chip>
                  </Block>}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container >
    </Box >

    <Dialog
      maxWidth="md"
      fullWidth
      open={onOpenFilterModal.value}
      onClose={onOpenFilterModal.onFalse}
    >
      <DialogTitle>Filters</DialogTitle>
      <DialogContent>
        <Scrollbar>
          <Tabs
            value={searchResults.status}
            onChange={(event, value) => onSearch('status', value)}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Scrollbar>
      </DialogContent >
    </Dialog >
  </>
}

export default HomeHero

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
