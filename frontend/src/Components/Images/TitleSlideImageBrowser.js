import React, { useRef } from 'react';
import { Button, Form, FormGroup, FormLabel, CloseButton } from 'react-bootstrap';

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
      <FormGroup>
        <FormLabel>Title Image</FormLabel>
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
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
            <CloseButton className='close' aria-label="Close" variant="white" onClick={removeTitleImage} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              &times;
            </CloseButton >
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabel className='mt-2'>Slideshow Images</FormLabel>
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
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
              <CloseButton className="close" aria-label="Close" variant="white" onClick={() => removeSlideshowImage(index)} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                &times;
              </CloseButton >
            </div>
          ))}
        </div>
      </FormGroup>
    </div>
  );
};

export default TitleSlideImageBrowser;
