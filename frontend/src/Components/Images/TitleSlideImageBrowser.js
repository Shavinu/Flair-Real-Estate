import React, { useRef } from 'react';
import { Button, FormGroup, Row, Col, FormLabel, CloseButton } from 'react-bootstrap';
import * as FileService from '../../Services/FileService';

const TitleSlideImageBrowser = ({ setTitleImage, setSlideshowImages, titleImage, slideshowImages }) => {
  const titleImageRef = useRef();
  const slideshowImagesRef = useRef();

  const handleTitleImageChange = (e) => {
    setTitleImage(e.target.files[0]);
  };

  const handleSlideshowImagesChange = (e) => {
    setSlideshowImages([...slideshowImages, ...Array.from(e.target.files)]);
  };

  const removeTitleImage = () => {
    setTitleImage(null);
    titleImageRef.current.value = '';
  };

  const removeSlideshowImage = (index) => {
    const newSlideshowImages = slideshowImages.filter((_, i) => i !== index);
    setSlideshowImages(newSlideshowImages);
  };

  const triggerTitleImageSelection = () => {
    titleImageRef.current.click();
  };

  const triggerSlideshowImageSelection = () => {
    slideshowImagesRef.current.click();
  };

  const getImageCountText = () => {
    return slideshowImages.length > 0 ? `${slideshowImages.length} image(s) selected` : 'Select Slideshow Images';
  };

  return (
    <div>
      <Row className='justify-content-evenly m-0'>
        {titleImage ? (
          <FormGroup>
            <Row className='justify-content-around'>
              <Col lg={12}>
                <p><FormLabel>Title Image</FormLabel></p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTitleImageChange}
                  ref={titleImageRef}
                  style={{ display: 'none' }}
                />
                <div>
                  <Button onClick={triggerTitleImageSelection} className="mt-0">{titleImage ? 'Title Image Selected' : 'Select Title Image'}</Button>
                </div>
                {titleImage && (
                  <div className='mt-1' style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={URL.createObjectURL(titleImage)}
                      alt="Title"
                      style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'cover' }}
                    />
                    <CloseButton className='close' aria-label="Close" variant="white" onClick={removeTitleImage} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                      &times;
                    </CloseButton >
                  </div>
                )}
              </Col>
            </Row>
          </FormGroup>
        ) : (
          <>
            <FormGroup className='w-100'>
              <FormLabel>Title Image</FormLabel>
              <Row className='row justify-content-evenly'>
                <Col lg={6}>
                  <hr className='mb-1'/>
                  <p className='small'>Please select a title image to display on your project</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTitleImageChange}
                    ref={titleImageRef}
                    style={{ display: 'none' }}
                  />
                </Col>
                <Col lg={6} className='align-self-center'>
                  <div>
                    <Button onClick={triggerTitleImageSelection} className="mt-0">{titleImage ? 'Title Image Selected' : 'Select Title Image'}</Button>
                  </div>
                </Col>
              </Row>
            </FormGroup>
          </>
        )}
        {slideshowImages.length > 0 ? (
          <FormGroup className='w-100'>
            <FormLabel >Slideshow Images</FormLabel>
            <Row className='justify-content-evenly'>
              <Col lg={12}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSlideshowImagesChange}
                  ref={slideshowImagesRef}
                  style={{ display: 'none' }}
                />
                <div>
                  <Button onClick={triggerSlideshowImageSelection} className="mt-0">{getImageCountText()}</Button>
                </div>
                <div>
                  {slideshowImages.map((image, index) => (
                    <div className='mt-1' key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Slideshow ${index + 1}`}
                        style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'cover' }}
                      />
                      <CloseButton className="close" aria-label="Close" variant="white" onClick={() => removeSlideshowImage(index)} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                        &times;
                      </CloseButton >
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </FormGroup>) : (
          <>
            <FormGroup className='mt-2 w-100'>
              <FormLabel>Slideshow Images</FormLabel>
              <Row className='row justify-content-evenly'>
                <Col lg={6}>
                  <hr/>
                  <p className='small'>Please select images to display in your project slideshow</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSlideshowImagesChange}
                    ref={slideshowImagesRef}
                    style={{ display: 'none' }}
                  />
                </Col>
                <Col lg={6} className='col align-self-center'>
                  <div>
                    <Button onClick={triggerSlideshowImageSelection} className="mt-0">{getImageCountText()}</Button>
                  </div>
                </Col>
              </Row>
            </FormGroup>
          </>
        )}
      </Row>
    </div>
  );
};

const uploadTitleImageAndGetId = async (titleImage, user) => {
  const titleImageData = new FormData();
  titleImageData.append('file', titleImage);
  titleImageData.append('userId', user);
  titleImageData.append('label', 'titleImage');
  const titleImageResponse = await FileService.uploadSingle(titleImageData);
  return titleImageResponse.file._id;
};

const uploadSlideshowImagesAndGetIds = async (slideshowImages, user) => {
  try {
    const projectSlideImages = await Promise.all(
      slideshowImages.map(async (image, index) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('userId', user);
        formData.append('label', `slideshowImage_${index}`);

        const response = await FileService.uploadSingle(formData);

        return { [response.file.metadata.label]: response.file._id };
      })
    );

    console.log(projectSlideImages);
    return JSON.stringify(projectSlideImages);
  } catch (e) {
    console.log(e);
  }
};

export { TitleSlideImageBrowser, uploadTitleImageAndGetId, uploadSlideshowImagesAndGetIds };