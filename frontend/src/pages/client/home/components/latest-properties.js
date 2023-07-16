import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Carousel, { CarouselArrows, useCarousel } from "../../../../components/carousel";
import ListingCard from "../../../../sections/listings/listing-card";
import FileService from "../../../../services/file-service";
import ProjectService from "../../../../services/project-service";
import ListingService from "../../../../services/listing-service";

const LatestProperties = () => {
  const [properties, setProperties] = useState([]);

  const carousel = useCarousel({
    slidesToShow: 3,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerPadding: '0' },
      },
    ],
  });

  const getLatestProperties = useCallback(
    async () => {
      try {
        let properties = [];
        const response = await ProjectService.searchProjects(1, 3, {});
        const projects = response.projects.map(result => ({
          _id: result._id,
          name: result.projectName,
          commission: result.projectCommission,
          address: result.projectLocation[0].locationName,
          owner: result.projectOwner,
          priceRange: result.projectPriceRange[0],
          status: result.projectStatus,
          type: result.projectType,
          images: getImageUrls(result.projectSlideImages),
          isProject: true,
          createdAt: result.createdAt,
        }))

        const listingResponse = await ListingService.searchListings(1, 3, {});
        const listings = listingResponse.listings.map(result => ({
          _id: result._id,
          name: result.listingName,
          commission: result.listingCommission,
          address: result.streetAddress,
          owner: result.devloper,
          priceRange: result.priceRange[0],
          status: result.status,
          type: result.type,
          images: getImageUrls(result.slideImages),
          options: {
            bedrooms: result.bedrooms,
            bathrooms: result.bathrooms,
            carSpace: result.carSpace,
            landSize: result.landSize,
          },
          createdAt: result.createdAt,
        }))

        properties = [...projects, ...listings];
        setProperties(properties);

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [],
  );

  const getImageUrls = (images) => {
    const imgs = images.map(image => {
      const value = Object.values(image);

      if (value && value[0]) {
        return FileService.getImageUrl(value[0])
      }

      return false;
    })

    return imgs
  };

  useEffect(() => {
    getLatestProperties()
  }, [getLatestProperties]);

  return <>
    <Typography variant="h2" sx={{ mb: 3 }}>
      Latest Properties
    </Typography>

    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CarouselArrows
        filled
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {properties.map((project, key) => <ListingCard key={project.name + key} item={project} />)}
        </Carousel>
      </CarouselArrows>
    </Box>
  </>
}

export default LatestProperties
