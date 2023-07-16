import { useCallback, useEffect, useState } from "react";
import { useParams } from "../../../hooks/routes";
import ListingService from "../../../services/listing-service";
import FileService from "../../../services/file-service";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "../../../config-global";
import HomeHero from "../../../sections/home/home-hero";
import PropertyDetailView from "../../../sections/properties/property-detail-view";

const ListingHomeDetail = () => {
  const [property, setProperty] = useState({});
  const { id } = useParams();

  const getListtingDetail = useCallback(async () => {

    const result = await ListingService.getListingDetail(id);

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
        carSpace: result.carSpace,
        landSize: result.landSize,
      },
      createdAt: result.createdAt,
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
