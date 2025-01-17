const request = require('request');

const getLocation = async (address) => {
  let map_box_url = process.env.map_box_url
  let url = `${map_box_url}/geocoding/v5/mapbox.places/`
            + encodeURIComponent(address) + '.json?access_token='
            + process.env.map_box_api_key + '&limit=1';
    console.log(map_box_url);
    
    return request({ url: url, json: true }, function (error, response) {
        if (error) {
            throw new Error('Unable to connect to Geocode API');
        } else if (response.body.features.length == 0) {
            throw new Error('Unable to find location. Try to '
                    + 'search another location.');
        } else {
            let longitude = response.body.features[0].center[0]
            let latitude = response.body.features[0].center[1]
            let type = response.body.features[0].type
            let location = response.body.features[0].place_name
            let zipcode = response.body.features[0].context[0].text
            
            return{
                type : type,
                coordinates : [longitude, latitude],
                location : location,
                zipcode: zipcode
            };
        }
    })
}
module.exports = {
  getLocation
};