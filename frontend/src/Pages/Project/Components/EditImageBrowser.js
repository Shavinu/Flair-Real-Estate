import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Form, FormGroup, FormLabel, Row, Image } from 'react-bootstrap';
import * as FileService from '../../../Services/FileService';

const EditImageBrowser = ({ titleImage, setTitleImage, slideshowImages, setSlideshowImages, deletedTitleImage, setDeletedTitleImage, deletedSlideshowImages, setDeletedSlideshowImages, initialData, reset }) => {
  const titleImageRef = useRef();
  const slideshowImagesRef = useRef();

  const [initialDataSet, setInitialDataSet] = useState(false);

  // const dummyData = { "projectSlideImages": [{ "slideshowImage_0": "64655a75b095b3b886057203" }, { "slideshowImage_1": "64655a75b095b3b886057204" }, { "slideshowImage_2": "64655a75b095b3b886057205" }, { "slideshowImage_3": "64655a75b095b3b88605720a" }] }

  useEffect(() => {
    // Set initial data
    // const setInitialData = async () => {
    //     let initialImages = await Promise.all(initialData.projectSlideImages.map(async (item) => {
    //         let id = Object.values(item)[0];
    //         let url = await FileService.getImageUrl(id);
    //         return { id: id, url: url };
    //     }));

    //     setSlideshowImages(initialImages);
    // };
    if (initialData && !initialDataSet) {
      // console.log(initialData);
      const titleImageId = initialData.projectTitleImage;
      const titleImageUrl = FileService.getImageUrl(titleImageId);
      setTitleImage({ id: titleImageId, url: titleImageUrl, isNew: false });

      const initialImages = initialData.projectSlideImages.map((item) => {
        let id = Object.values(item)[0];
        let url = FileService.getImageUrl(id);
        let isNew = false;
        return { id: id, url: url, isNew: isNew };
      });
      setSlideshowImages(initialImages);
      setInitialDataSet(true);
    }

    // setInitialData();
  }, [initialData, initialDataSet]);

  // Reset handlers
  useEffect(() => {
    if (reset) {
      setTitleImage(null);
      setDeletedTitleImage(null);
      setSlideshowImages([]);
      setDeletedSlideshowImages([]);
      setInitialDataSet(false);
    }
  }, [reset]);

  // Image Handlers
  const handleTitleImageChange = (e) => {
    const newImage = { file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]), isNew: true };
    if (titleImage) {
      setDeletedTitleImage({ old: titleImage, new: newImage });
    }
    setTitleImage(newImage);
  };

  const handleSlideshowImagesChange = (e) => {
    const newImages = [...e.target.files].map(file => {
      return { file: file, url: URL.createObjectURL(file), isNew: true };
    });
    setSlideshowImages([...slideshowImages, ...newImages]);
  };

  // Remove handlers
  const removeTitleImage = () => {
    if (titleImage.isNew) {
      setTitleImage(null);
    } else {
      setDeletedTitleImage({ old: titleImage, new: null });
      setTitleImage(null);
    }
  };

  const removeSlideshowImage = (index) => {
    const imageToRemove = slideshowImages[index];
    if (imageToRemove.isNew) {
      setSlideshowImages(slideshowImages.filter((_, i) => i !== index));
    } else {
      setDeletedSlideshowImages([...deletedSlideshowImages, imageToRemove]);
      setSlideshowImages(slideshowImages.filter((_, i) => i !== index));
    }
  };

  // Restore handlers
  const restoreTitleImage = () => {
    if (deletedTitleImage.new) {
      setTitleImage(deletedTitleImage.old);
    } else {
      setTitleImage(deletedTitleImage.old);
    }
    setDeletedTitleImage(null);
  };

  const restoreSlideshowImage = (index) => {
    const imageToRestore = deletedSlideshowImages[index];
    setSlideshowImages([...slideshowImages, imageToRestore]);
    setDeletedSlideshowImages(deletedSlideshowImages.filter((_, i) => i !== index));
  };

  // Button Click Handlers
  const triggerTitleImageSelection = () => {
    titleImageRef.current.click();
  };

  const triggerSlideshowImageSelection = () => {
    slideshowImagesRef.current.click();
  };

  // Get Image Count Text
  const getImageCountText = () => {
    return slideshowImages.length > 0 ? `${slideshowImages.length} image(s) selected` : 'Select Slideshow Images';
  };

  return (
    <div>
      <FormGroup>
        <Row className='justify-content-evenly m-0'>
          <Col lg={12} className='p-0 mb-1'>
            <FormLabel>Title Image</FormLabel>
          </Col>
          <Row>
            <Col lg={12}>
              {titleImage
                ? <Button variant="outline-primary" onClick={triggerTitleImageSelection}>Change Title Image</Button>
                : <Button variant="outline-primary" onClick={triggerTitleImageSelection}>Select Title Image</Button>
              }
              <input type="file" ref={titleImageRef} onChange={handleTitleImageChange} style={{ display: 'none' }} accept="image/*" />
            </Col>
          </Row>
        </Row>
        <Row>
          <Col>
            {titleImage
              ?
              <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={titleImage.url} />
                </Card>
                <Button variant="btn btn-danger btn-sm border" style={{ position: 'absolute', top: '-10px', right: '-10px' }} onClick={removeTitleImage}>Delete</Button>
              </div>
              :
              <Card style={{ width: '18rem', height: '13rem', marginTop: '20px' }} className='border border-primary'>
                <div className="d-flex align-items-center justify-content-center bg-secondary rounded" style={{ width: '100%', height: '80%' }}>
                  <span role="img" aria-label="No Image Selected" style={{ fontSize: '5rem' }}>📷</span>
                </div>
                <Card.Body className="text-center p-0">
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <Card.Text className="m-0">No Image Selected</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            }
          </Col>
        </Row>
        <Row>
          <Col>
            {deletedTitleImage &&
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={deletedTitleImage.old.url} />
                <Button variant="btn btn-warning btn-sm border" style={{ position: 'absolute', top: '-10px', right: '-10px' }} onClick={restoreTitleImage}>Restore</Button>
              </Card>
              </div>
            }
          </Col>
        </Row>
      </FormGroup>
      <hr />
      <FormGroup>
        <Row className='justify-content-evenly m-0'>
          <Col lg={12} className='p-0 mb-1'>
            <FormLabel>Slideshow Images</FormLabel>
          </Col>
          <Row>
            <Col lg={12}>
              {slideshowImages.length > 0
                ? <Button variant="outline-primary" onClick={triggerSlideshowImageSelection}>Add More Slides</Button>
                : <Button variant="outline-primary" onClick={triggerSlideshowImageSelection}>Select Slideshow Images</Button>
              }
              <input type="file" ref={slideshowImagesRef} onChange={handleSlideshowImagesChange} style={{ display: 'none' }} multiple accept='image/*' />
            </Col>
          </Row>
        </Row>
        <Row>
          <Col>
            <p>{getImageCountText()}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            {slideshowImages.map((image, index) =>
              <Card key={index} style={{ display: 'inline-block', marginRight: '10px', objectFit: "cover" }}>
                <Card.Img variant="top" src={image.url} alt="Slideshow" style={{ height: '150px', width: '200px', objectFit: "cover" }} />
                <Button variant="btn btn-danger btn-sm border" style={{ position: 'absolute', top: '0', right: '0' }} onClick={() => removeSlideshowImage(index)}>Delete</Button>
              </Card>
            )}
          </Col>
        </Row>
        <Row>
          <Row className='justify-content-evenly m-0'>
            {deletedSlideshowImages.length > 0 &&
              <Col lg={12}>
                <FormLabel>Deleted Slideshow Images</FormLabel>
              </Col>
            }
            <Col lg={12}>
              {deletedSlideshowImages.map((image, index) =>
                <Card key={index} style={{ display: 'inline-block', objectFit: "cover" }}>
                  <Card.Img variant="top" src={image.url} alt="Slideshow" style={{ height: '150px', width: '200px', objectFit: "cover" }} />
                  <Button variant="btn btn-warning btn-sm border" style={{ position: 'absolute', top: '0', right: '0' }} onClick={() => restoreSlideshowImage(index)}>Restore</Button>
                </Card>
              )}
            </Col>
          </Row>
        </Row>
        <hr />
      </FormGroup>
    </div>);
};

const UploadTitle = async (titleImage, deletedTitleImage, user) => {
  // const titleImageData = new FormData();
  // titleImageData.append('file', titleImage);
  // titleImageData.append('userId', user);
  // titleImageData.append('label', 'titleImage');
  // const titleImageResponse = await FileService.uploadSingle(titleImageData);
  // return titleImageResponse.file._id;

  //if titleImage is null, and deletedTitleImage is not null, then we need to delete the titleImage
  if (!titleImage && deletedTitleImage) {
    // 'delete titleImage'
  }

  //if titleImage is not null, and deletedTitleImage is not null, then we need to delete the deletedTitleImage and upload the titleImage
  if (titleImage && deletedTitleImage) {
    // 'delete deletedTitleImage and upload titleImage'
  }

  //if titleImage is not null, and deletedTitleImage is null, then we don't need to do anything
  if (titleImage && !deletedTitleImage) {
    // 'keep titleImage'
  }

};

const UploadSlides = async (slideshowImages, deletedSlideshowImages, user) => {
  // try {
  //   const projectSlideImages = await Promise.all(
  //     slideshowImages.map(async (image, index) => {
  //       const formData = new FormData();
  //       formData.append('file', image);
  //       formData.append('userId', user);
  //       formData.append('label', `slideshowImage_${index}`);

  //       const response = await FileService.uploadSingle(formData);

  //       return { [response.file.metadata.label]: response.file._id };
  //     })
  //   );

  //   console.log(projectSlideImages);
  //   if (projectSlideImages.length === 0) {
  //     return;
  //   }
  //   return JSON.stringify(projectSlideImages);
  // } catch (e) {
  //   console.log(e);
  // }

  if(slideshowImages.length === 0){
    let projectSlideImages = [];
    //check if there are any deletedSlideshowImages
    if(deletedSlideshowImages.length > 0){
      //delete all deletedSlideshowImages
      deletedSlideshowImages.forEach(async (image) => {
        // await FileService.delete(image._id);
      }
      );
    }
    return JSON.stringify(projectSlideImages);
  }

  if(slideshowImages.length > 0){
    let projectSlideImages = [];

    //check if any slideshowImages have isNew = false, get their index inside slideshowImages
    let slideshowImagesToUpdate = slideshowImages.filter((image) => image.isNew === false);
    let slideshowImagesToUpdateIndexes = slideshowImagesToUpdate.map((image) => slideshowImages.indexOf(image));

    //check if there are any deletedSlideshowImages
    if(deletedSlideshowImages.length > 0){
      //delete all deletedSlideshowImages
      deletedSlideshowImages.forEach(async (image) => {
        // await FileService.delete(image._id);
      }
      );
    }

    //upload all slideshowImages that have isNew = true
    let slideshowImagesToUpload = slideshowImages.filter((image) => image.isNew === true);
    let slideshowImagesToUploadIndexes = slideshowImagesToUpload.map((image) => slideshowImages.indexOf(image));
    await Promise.all(
      slideshowImagesToUpload.map(async (image, index) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('userId', user);
        formData.append('label', `slideshowImage_${slideshowImagesToUploadIndexes[index]}`);

        // const response = await FileService.uploadSingle(formData);

        // projectSlideImages.push({ [response.file.metadata.label]: response.file._id });
      })
    );

    //push all slideshowImages that have isNew = false with their index inside slideshowImages to projectSlideImages
    slideshowImagesToUpdate.forEach((image, index) => {
      projectSlideImages.push({ [`slideshowImage_${slideshowImagesToUpdateIndexes[index]}`]: image._id });
    }
    );

    return JSON.stringify(projectSlideImages);

  } else {
    //check if there are any deletedSlideshowImages
    let projectSlideImages = [];
  }
};

export default EditImageBrowser;