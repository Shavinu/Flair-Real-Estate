const axios = require('axios');

async function altVerifyLicense(req, res) {
    const { id } = req.params;
    let data = JSON.stringify({
        "filters": [
            {
                "type": "searchTerms",
                "params": {
                    "searchTerms": id
                }
            },
            {
                "type": "topic",
                "params": {
                    "topic": "Property"
                }
            }
        ]
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://verify.licence.nsw.gov.au/publicregisterapi/v1/licence/search/query',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        const results = response.data.results;

        if (results.length === 0) {
            res.status(404).json({ message: 'License not found' });
            return;
        }

        const status = results[0].status;

        if (status === 'Expired') {
            res.status(403).json({ message: 'License expired' });
            return;
        }

        if (status === 'Current') {
            res.status(200).json({ message: 'License is valid' });
            return;
        }

        res.status(403).json({ message: 'License not active' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
}

module.exports = {
    altVerifyLicense
}
