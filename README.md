# oEmbed Validator

This is a simple utility called "oEmbed Validator". It checks if a given JSON or XML is a valid oEmbed response.

## Installation

```bash
npm install
# or
yarn install
```

## Usage

To use this utility, simply import it in your JavaScript file and call the main function with the JSON or XML data you want to validate.

```javascript
// Example usage
const response = `{
	"version": "1.0",
	"type": "video",
	"provider_name": "YouTube",
	"provider_url": "https://youtube.com/",
	"width": 425,
	"height": 344,
	"title": "Amazing Nintendo Facts",
	"url": "test", // extra field
	"author_name": "ZackScott",
	"author_url": "https://www.youtube.com/user/ZackScott",
	"html": "<object width=\\"425\\" height=\\"344\\"><param name=\\"movie\\" value=\\"https://www.youtube.com/v/M3r2XDceM6A&fs=1\\"></param><param name=\\"allowFullScreen\\" value=\\"true\\"></param><param name=\\"allowscriptaccess\\" value=\\"always\\"></param><embed src=\\"https://www.youtube.com/v/M3r2XDceM6A&fs=1\\" type=\\"application/x-shockwave-flash\\" width=\\"425\\" height=\\"344\\" allowscriptaccess=\\"always\\" allowfullscreen=\\"true\\"></embed></object>"
}`;

// Import the function
const {validateOEmbedResponse} = require('oembed-validator');

// Call the function
validateOEmbedResponse(200, response, true).then((result) => {
    console.log('Result:', result);
}).catch((error) => {
    console.error('Error:', error);
});
```

## Dependencies

This project depends on the `xml2js` library for parsing XML data.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC license.