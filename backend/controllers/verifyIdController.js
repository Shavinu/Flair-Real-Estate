const axios = require('axios');
const { config } = require('dotenv')

config();

const { NSW_API_KEY, NSW_API_SECRET, NSW_API_AUTHORIZATION_HEADER, NSW_ACCESS_TOKEN, NSW_ACCESS_TOKEN_EXPIRATION } = process.env;

let accessToken = NSW_ACCESS_TOKEN;
let accessTokenExpiration = NSW_ACCESS_TOKEN_EXPIRATION ? new Date(NSW_ACCESS_TOKEN_EXPIRATION) : null;

async function getAccessToken() {
  if (accessToken !== null && new Date() < accessTokenExpiration) {
    console.log('Using existing access token');
    return accessToken;
  }

  try {
    const response = await axios.get('https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken', {
      params: { grant_type: 'client_credentials' },
      headers: {
        'Authorization': NSW_API_AUTHORIZATION_HEADER,
        'Content-Type': 'application/json'
      }
    });

    accessToken = response.data.access_token;
    accessTokenExpiration = new Date(new Date().getTime() + response.data.expires_in * 1000);

    // write access token to env variables
    process.env.NSW_ACCESS_TOKEN = accessToken;
    process.env.NSW_ACCESS_TOKEN_EXPIRATION = accessTokenExpiration.toISOString();

    console.log('New access token obtained and stored to environment variables');
    console.log(accessToken, accessTokenExpiration);

    return accessToken;
  } catch (error) {
    if( error.response ){
        console.log(error.response.data);
    }
  }
}

async function verifyLicense(req, res) {
  try {
    const token = await getAccessToken();
    const id = req.params.id;
    const idType = req.params.idType;

    const verifyResponse = await axios.get('https://api.onegov.nsw.gov.au/propertyregister/v1/verify', {
      params: { licenceNumber: id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': NSW_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const results = verifyResponse.data;
    console.log(results);

    if (results.length === 0) {
      res.status(404).json({ message: 'License not found' });
      return;
    }

    const status = results[0].status;
    const licenseType = results[0].licenceType;

    if (licenseType != idType) {
      res.status(404).json({ message: 'License type is not matching' });
      return;
    }

    if (status === 'Expired') {
        res.status(404).json({ message: 'License expired' });
        return;
    }

    if (status === 'Current' && licenseType === idType) {
        res.status(200).json({ message: 'License is valid' });
        return;
    }

  } catch (error) {
    if( error.response ){
        console.log(error.response.data);
    }
  }
}

module.exports = {
  verifyLicense
}
