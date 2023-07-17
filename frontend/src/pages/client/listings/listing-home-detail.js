import { useCallback, useEffect, useState } from "react";
import { useParams } from "../../../hooks/routes";
import ListingService from "../../../services/listing-service";
import FileService from "../../../services/file-service";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "../../../config-global";
import HomeHero from "../../../sections/home/home-hero";
import PropertyDetailView from "../../../sections/properties/property-detail-view";
import utils from "../../../utils";
import ProjectService from "../../../services/project-service";

const ListingHomeDetail = () => {
  const [property, setProperty] = useState({});
  const { id } = useParams();

  const getListtingDetail = useCallback(async () => {

    const result = await ListingService.getListingDetail(id);
    let project = null

    if (result.project) {
      const projectResponse = await ProjectService.getProjectDetail(result.project);
      const listingPromises = projectResponse?.projectListings.map(listingId => ListingService.getListing(listingId));
      const fetchedListings = await Promise.all(listingPromises);
      let availableListingsCount = 0;

      fetchedListings.forEach(listing => {
        if (listing.status === 'Available') {
          availableListingsCount++;
        }
      });

      project = {
        _id: projectResponse._id,
        name: projectResponse.projectName,
        commission: projectResponse.projectCommission[0],
        address: projectResponse.projectLocation[0].locationName,
        owner: projectResponse.projectOwner,
        priceRange: projectResponse.projectPriceRange[0],
        status: projectResponse.projectStatus,
        type: projectResponse.projectType,
        images: getImageUrls(projectResponse.projectSlideImages),
        isProject: true,
        createdAt: projectResponse.createdAt,
        availableListingCount: availableListingsCount
      }
    }

    const listing = {
      _id: result._id,
      name: result.listingName,
      description: result.description,
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
        carSpaces: result.carSpaces,
        landSize: result.landSize,
      },
      createdAt: result.createdAt,
      attachments: utils.array.groupBy(result.files.map(file => ({ ...file, url: FileService.getImageUrl(file.file_id) })) || [], 'category'),
      project: project,
      coordinates: result.coordinates[0]
    }

    setProperty(listing);
  }, [id])

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
    getListtingDetail();
  }, [getListtingDetail]);

  return <>
    <Helmet>
      <title>Listing | {PROJECT_NAME}</title>
    </Helmet>

    <HomeHero />

    <PropertyDetailView property={property} />
  </>
}

export default ListingHomeDetail;
