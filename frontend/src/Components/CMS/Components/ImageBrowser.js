import React, { useRef } from 'react';
import { Button, FormGroup, Row, Col, FormLabel, CloseButton } from 'react-bootstrap';
import * as FileService from '../../../Services/FileService';

const ImageBrowser = ({ setTitleImage, titleImage }) => {
  const titleImageRef = useRef();

  const handleTitleImageChange = (e) => {
    setTitleImage(e.target.files[0]);
  };

  const removeTitleImage = () => {
    setTitleImage(null);
    titleImageRef.current.value = '';
  };

  const triggerTitleImageSelection = () => {
    titleImageRef.current.click();
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
                  <hr className='mb-1' />
                  <p className='small'>Please select a title image to display on the contact page</p>
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
      </Row>
    </div>
  );
};

const UploadTitle = async (titleImage, user) => {
  const titleImageData = new FormData();
  titleImageData.append('file', titleImage);
  titleImageData.append('userId', user);
  titleImageData.append('label', 'titleImage');
  const titleImageResponse = await FileService.uploadSingle(titleImageData);
  return titleImageResponse.file._id;
};


export { ImageBrowser, UploadTitle };