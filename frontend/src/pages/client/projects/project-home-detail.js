import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "../../../config-global";
import { useParams } from "../../../hooks/routes";
import HomeHero from "../../../sections/home/home-hero";
import PropertyDetailView from "../../../sections/properties/property-detail-view";
import FileService from "../../../services/file-service";
import ListingService from "../../../services/listing-service";
import ProjectService from "../../../services/project-service";
import utils from "../../../utils";

const ProjectHomeDetail = () => {
  const [property, setProperty] = useState({});
  const { id } = useParams();

  const getProjectDetail = useCallback(
    async () => {
      const result = await ProjectService.getProjectDetail(id);

      const listingPromises = result?.projectListings.map(listingId => ListingService.getListing(listingId));
      const fetchedListings = await Promise.all(listingPromises);
      let availableListingsCount = 0;

      fetchedListings.forEach(listing => {
        if (listing.status === 'Available') {
          availableListingsCount++;
        }
      });

      const project = {
        _id: result._id,
        name: result.projectName,
        description: result.projectDescription,
        commission: result.projectCommission[0],
        address: result.projectLocation[0].locationName,
        owner: result.projectOwner,
        priceRange: result.projectPriceRange[0],
        status: result.projectStatus,
        type: result.projectType,
        images: getImageUrls(result.projectSlideImages),
        isProject: true,
        createdAt: result.createdAt,
        availableListingCount: availableListingsCount,
        attachments: utils.array.groupBy(result.projectFiles.map(file => ({ ...file, url: FileService.getImageUrl(file.file_id) })) || [], 'category'),
        coordinates: {
          longitude: result.projectLocation[0]?.longitude,
          latitude: result.projectLocation[0]?.latitude,
        },
        listings: fetchedListings,
      }

      console.log(project);
      setProperty(project);
    },
    [id],
  )

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
    getProjectDetail();
  }, [getProjectDetail])

  return <>
    <Helmet>
      <title>Properties | {PROJECT_NAME}</title>
    </Helmet>

    <HomeHero />

    <PropertyDetailView property={property} />
  </>
}

export default ProjectHomeDetail;
