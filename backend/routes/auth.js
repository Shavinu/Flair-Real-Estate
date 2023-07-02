const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/token');
const {
  register,
  verifyEmail,
  verifyLicenceNumber,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  getCurrentUser,
} = require('../controllers/authController');

router.post('/register', register);

router.get("/verify/:userId/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.get("/reset-password/:userId/:token", resetPassword);

router.patch("/update-password", updatePassword);

router.get('/verify-licence/:accType/:licence', verifyLicenceNumber)

router.post('/login', login);

router.get('/current-user', verifyAccessToken, getCurrentUser);

router.post('/refresh-token', async (req, res, next) => {
  res.send('This is refresh-token route');
});

router.delete('/logout', async (req, res, next) => {
  res.send('This is logout route');
});
module.exports = router;
