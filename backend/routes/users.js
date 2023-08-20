const express = require('express')
const router = express.Router()
const {
  getUsers,
  getaUser,
  createUser,
  deleteUser,
  deleteManyUsers,
  updateUser,
  requestChange,
  verifyRequest,
  deleteToken,
  approveUser,
  favouriteUser,
  favouriteUserDelete,
} = require('../controllers/userController')

//Get all users
router.get('', getUsers)

//Get single user
router.get('/:id', getaUser)

//register a new user
router.post('/create', createUser)

//Refresh token
router.post('/refresh-token', async (req, res, next) => {
  res.send('This is refresh-token route');
});

//logout a user (IDK why its .delete tho)
router.delete('/logout', async (req, res, next) => {
  res.send('This is logout route');
});

//delete many user
router.post('/delete-many', deleteManyUsers)

//delete a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

// request change
router.post("/request-change", requestChange)

// verify request link
router.get('/verify-request/:userId/:token/:company', verifyRequest)

// delete token
router.post('/delete-token', deleteToken);

//Approve user
router.post('/approve', approveUser);

// Route to add favorite project/listing to user's favorites
router.post('/addFavorite', favouriteUser);

// Route to add favorite project/listing to user's favorites
router.post('/deleteFavorite/:userId/:listingType/:listingId', favouriteUserDelete);

module.exports = router;
