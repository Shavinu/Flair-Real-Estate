import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Form, FormGroup, FormLabel, Row, Image } from 'react-bootstrap';
import * as FileService from '../../../Services/FileService';

const EditImageBrowser = ({ titleImage, setTitleImage, deletedTitleImage, setDeletedTitleImage, initialData, reset }) => {
  const titleImageRef = useRef();
  const slideshowImagesRef = useRef();

  const [initialDataSet, setInitialDataSet] = useState(false);

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
      if (initialData.projectTitleImage) {
        const titleImageId = initialData.projectTitleImage;
        const titleImageUrl = FileService.getImageUrl(titleImageId);
        setTitleImage({ id: titleImageId, url: titleImageUrl, isNew: false });
      } else {
        setTitleImage(null);
      }
      setInitialDataSet(true);
    }

    // setInitialData();
  }, [initialData, initialDataSet]);

  // Reset handlers
  useEffect(() => {
    if (reset) {
      setTitleImage(null);
      setDeletedTitleImage(null);
      setInitialDataSet(false);
    }
  }, [reset]);

  // Image Handlers
  const handleTitleImageChange = (e) => {
    const newImage = { file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]), isNew: true };
    if (titleImage && !titleImage.isNew) {
      setDeletedTitleImage({ old: titleImage, new: newImage });
    }
    setTitleImage(newImage);
  };


  // Remove handlers
  const removeTitleImage = () => {
    if (titleImage.isNew) {
      setTitleImage(null);
    } else {
      setDeletedTitleImage({ old: titleImage, new: null });
      setTitleImage(null);
    }
    //console log all the images
    console.log(titleImage);
    console.log(deletedTitleImage);
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


  // Button Click Handlers
  const triggerTitleImageSelection = () => {
    titleImageRef.current.click();
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
    const deletedTitleImageId = deletedTitleImage.old.id;
    await FileService.deleteFile(deletedTitleImageId);
    return null;
  }

  //if titleImage is not null, and deletedTitleImage is not null, then we need to delete the deletedTitleImage and upload the titleImage
  if (titleImage && deletedTitleImage) {
    console.log('titleImage', titleImage);
    console.log('deletedTitleImage', deletedTitleImage);
    if (titleImage.id === deletedTitleImage.old.id) {
      // 'keep titleImage'
      return titleImage.id;
    } else {
      // 'delete deletedTitleImage, upload titleImage'
      // 'delete deletedTitleImage and upload titleImage'
      const deletedTitleImageId = deletedTitleImage.old.id;
      await FileService.deleteFile(deletedTitleImageId);

      const titleImageData = new FormData();
      titleImageData.append('file', titleImage.file);
      titleImageData.append('userId', user);
      titleImageData.append('label', 'titleImage');
      const titleImageResponse = await FileService.uploadSingle(titleImageData);
      return titleImageResponse.file._id;
    }
  }

  //if titleImage is not null, and deletedTitleImage is null, then we don't need to do anything
  if (titleImage && !deletedTitleImage) {
    if (titleImage.isNew === false) {
      // 'keep titleImage'
      return titleImage.id;
    } else {
      // 'upload titleImage'
      const titleImageData = new FormData();
      titleImageData.append('file', titleImage.file);
      titleImageData.append('userId', user);
      titleImageData.append('label', 'titleImage');
      const titleImageResponse = await FileService.uploadSingle(titleImageData);
      return titleImageResponse.file._id;
    }
  }

};

const UploadSlides = async (slideshowImages, deletedSlideshowImages, user) => {

  if (slideshowImages.length === 0) {
    let projectSlideImages = [];
    //check if there are any deletedSlideshowImages
    if (deletedSlideshowImages.length > 0) {
      //delete all deletedSlideshowImages
      deletedSlideshowImages.forEach(async (image) => {
        await FileService.deleteFile(image.id);
      }
      );
    }

    return JSON.stringify(projectSlideImages);
  }

  if (slideshowImages.length > 0) {
    let projectSlideImages = [];

    //check if any slideshowImages have isNew = false, get their index inside slideshowImages
    let slideshowImagesToUpdate = slideshowImages.filter((image) => image.isNew === false);
    let slideshowImagesToUpdateIndexes = slideshowImagesToUpdate.map((image) => slideshowImages.indexOf(image));

    //check if there are any deletedSlideshowImages
    if (deletedSlideshowImages.length > 0) {
      //delete all deletedSlideshowImages
      for (const image of deletedSlideshowImages) {
        await FileService.deleteFile(image.id);
      }

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
        formData.append('file', image.file);
        formData.append('userId', user);
        formData.append('label', `slideshowImage_${slideshowImagesToUploadIndexes[index]}`);

        const response = await FileService.uploadSingle(formData);

        projectSlideImages.push({ [response.file.metadata.label]: response.file._id });
      })
    );

    //push all slideshowImages that have isNew = false with their index inside slideshowImages to projectSlideImages
    slideshowImagesToUpdate.forEach((image, index) => {
      projectSlideImages.push({ [`slideshowImage_${slideshowImagesToUpdateIndexes[index]}`]: image.id });
    }
    );

    return JSON.stringify(projectSlideImages);

  } else {
    return '[]';
  }
};

export { EditImageBrowser, UploadTitle, UploadSlides };