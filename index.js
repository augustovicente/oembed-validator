const { parseString } = require('xml2js');

const requiredFields = [
    'type',
    'version',
];

const requiredByType = {
    photo: [
        'url',
        'width',
        'height',
    ],
    video: [
        'html',
        'width',
        'height',
    ],
    link: [
        'url',
    ],
    rich: [
        'html',
        'width',
        'height',
    ],
};

const optionalFields = [
    'title',
    'author_name',
    'author_url',
    'provider_name',
    'provider_url',
    'cache_age',
    'thumbnail_url',
    'thumbnail_width',
    'thumbnail_height'
];

const allowedErrors = [
    401,
    404,
    501,
];

const validateOEmbedResponseReturn = {
    VALID_OEMBED_JSON: 'Valid oEmbed JSON response',
    INVALID_OEMBED_JSON: 'Invalid oEmbed JSON response',
    VALID_OEMBED_XML: 'Valid oEmbed XML response',
    INVALID_OEMBED_XML: 'Invalid oEmbed XML response',
    VALID_OEMBED_ERROR: 'Valid oEmbed error response',
    INVALID_OEMBED_ERROR: 'Invalid oEmbed error response',
};

/**
 * Check if json or xml is a valid oembed response
 * @param {number} statusCode
 * @param {string} response 
 * @returns {Promise<string>}
 */
async function validateOEmbedResponse(statusCode, response) {
    return new Promise((resolve, reject) => {
        // Check if the status code is 200
        if (statusCode === 200) {
            // Check if the response is a valid JSON
            try {
                const json = JSON.parse(response);
                if (json.type === 'oembed') {
                    const fields = Object.keys(json);
                    const missingFields = requiredFields.filter(field => !fields.includes(field));
                    if (missingFields.length === 0) {
                        const extraFields = fields.filter(field => !requiredFields.includes(field) && !optionalFields.includes(field));
                        if (extraFields.length === 0) {
                            resolve(validateOEmbedResponseReturn.VALID_OEMBED_JSON);
                        } else {
                            for (const field of extraFields) {
                                if (!requiredByType[json.type].includes(field)) {
                                    reject(validateOEmbedResponseReturn.INVALID_OEMBED_JSON);
                                    return;
                                }
                            }

                            resolve(validateOEmbedResponseReturn.VALID_OEMBED_JSON);
                        }
                    } else {
                        reject(validateOEmbedResponseReturn.INVALID_OEMBED_JSON);
                    }
                }
            } catch (error) {
                reject(validateOEmbedResponseReturn.INVALID_OEMBED_JSON);
            }

            // Check if the response is a valid XML
            try {
                parseString(response, (error, result) => {
                    if (error) {
                        reject(validateOEmbedResponseReturn.INVALID_OEMBED_XML);
                    }

                    if (result.oembed.type[0] === 'oembed') {
                        const fields = Object.keys(result.oembed);
                        const missingFields = requiredFields.filter(field => !fields.includes(field));
                        if (missingFields.length === 0) {
                            const extraFields = fields.filter(field => !requiredFields.includes(field) && !optionalFields.includes(field));
                            if (extraFields.length === 0) {
                                resolve(validateOEmbedResponseReturn.VALID_OEMBED_XML);
                            } else {
                                for (const field of extraFields) {
                                    if (!requiredByType[result.oembed.type[0]].includes(field)) {
                                        reject(validateOEmbedResponseReturn.INVALID_OEMBED_XML);
                                        return;
                                    }
                                }

                                resolve(validateOEmbedResponseReturn.VALID_OEMBED_XML);
                            }
                        } else {
                            reject(validateOEmbedResponseReturn.INVALID_OEMBED_XML);
                        }
                    } else {
                        reject(validateOEmbedResponseReturn.INVALID_OEMBED_XML);
                    }
                });
            } catch (error) {
                reject(validateOEmbedResponseReturn.INVALID_OEMBED_XML);
            }   
        } else if (allowedErrors.includes(statusCode)) {
            resolve(validateOEmbedResponseReturn.VALID_OEMBED_ERROR);
        } else {
            reject(validateOEmbedResponseReturn.INVALID_OEMBED_ERROR);
        }
    });
}

module.exports = {
    validateOEmbedResponse,
    validateOEmbedResponseReturn,
};