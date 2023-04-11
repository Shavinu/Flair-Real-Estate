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

async function verifyLicense() {
  try {
    const token = await getAccessToken();

    const verifyResponse = await axios.get('https://api.onegov.nsw.gov.au/propertyregister/v1/verify', {
      params: { licenceNumber: '10055055' },
      headers: {
        'Authorization': `Bearer {${token}}`,
        'apikey': NSW_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(verifyResponse.data);
  } catch (error) {
    if( error.response ){
        console.log(error.response.data);
    }
  }
}

module.exports = {
  verifyLicense
}
