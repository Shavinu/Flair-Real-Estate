const axios = require('axios');
const { config } = require('dotenv')

config();

async function getAccessToken(idType) {

  let access_token = idType == 'agent' || idType == 'agency' ? process.env.NSW_API_PROPERTY_ACCESS_TOKEN : process.env.NSW_API_CONTRACTOR_ACCESS_TOKEN;
  let accessTokenExpiration = idType == 'agent' || idType == 'agency' ? (process.env.NSW_API_PROPERTY_ACCESS_TOKEN_EXPIRATION ? new Date(process.env.NSW_API_PROPERTY_ACCESS_TOKEN_EXPIRATION) : null) : (process.env.NSW_API_CONTRACTOR_ACCESS_TOKEN_EXPIRATION ? new Date(process.env.NSW_API_CONTRACTOR_ACCESS_TOKEN_EXPIRATION) : null);
  let NSW_API_AUTHORIZATION_HEADER = idType === 'agent' || idType === 'agency' ? process.env.NSW_API_PROPERTY_AUTHORIZATION_HEADER : process.env.NSW_API_CONTRACTOR_AUTHORIZATION_HEADER;

  if (access_token !== null && new Date() < accessTokenExpiration) {
    console.log('Using existing access token');
    return access_token;
  }

  try {
    const response = await axios.get('https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken', {
      params: { grant_type: 'client_credentials' },
      headers: {
        'Authorization': NSW_API_AUTHORIZATION_HEADER,
        'Content-Type': 'application/json'
      }
    });

    access_token = response.data.access_token;
    accessTokenExpiration = new Date(new Date().getTime() + response.data.expires_in * 1000);

    // write access token to env variables
    idType == 'agent' || idType == 'agency' ?
      (process.env.NSW_API_PROPERTY_ACCESS_TOKEN = access_token,
      process.env.NSW_API_PROPERTY_ACCESS_TOKEN_EXPIRATION = accessTokenExpiration?.toISOString() || null)
      :
      (process.env.NSW_API_CONTRACTOR_ACCESS_TOKEN = access_token,
      process.env.NSW_API_CONTRACTOR_ACCESS_TOKEN_EXPIRATION = accessTokenExpiration?.toISOString() || null);

    console.log('New access token obtained and stored to environment variables');

    return access_token;

  } catch (error) {
    if( error.response ){
        console.log(error.response.data);
    }
  }
}

async function verifyLicence(req, res) {
  try {
    const id = req.params.id;
    const idType = req.params.idType;
    const token = await getAccessToken(idType);

    let url = (idType == 'agent' || idType == 'agency')
      ? 'https://api.onegov.nsw.gov.au/propertyregister/v1/verify'
      : 'https://api.onegov.nsw.gov.au/tradesregister/v1/verify';

    let apikey = (idType == 'agent' || idType == 'agency')
      ? process.env.NSW_API_PROPERTY_KEY
      : process.env.NSW_API_CONTRACTOR_KEY;

    const verifyResponse = await axios.get(url, {
      params: { licenceNumber: id },
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': apikey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const results = verifyResponse.data;
    console.log(results);

    if (results.length === 0) {
      console.log("License not found")
      res.status(404).json({ message: 'Licence not found' });
      return;
    }

    let licenceTypeInput = idType == 'agent' ? 'Property - Individual' : 'Property - Corporation';
    const status = results[0].status;
    const licenceType = results[0].licenceType;

    if (idType == 'agent' || idType == 'agency') {
      if (licenceType != licenceTypeInput) {
        console.log("Licence type is not matching")
        res.status(404).json({ message: 'Licence type is not matching' });
        return;
      }
    }

    if (status === 'Expired') {
      console.log("Licence expired")
        res.status(404).json({ message: 'Licence expired' });
        return;
    }

    if (status === 'Current') {
        console.log("Licence is valid")
        res.status(200).json({ message: 'Licence is valid' });
        return;
    }

  } catch (error) {
    if( error.response ){
        console.log(error.response.data);
    }
  }
}

module.exports = {
  verifyLicence
}
