const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=5a6a018bcf2506b2b9228c314b089c4f&query=${latitude},${longitude}&units=f`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to the weather service.', undefined);
        } else if (body.error) {
            callback('Unable to retrieve weather for provided query.', undefined);
        } else {
            const curr = body.current;
            callback(undefined, `${curr.weather_descriptions[0]}. It is currently ${curr.temperature} degrees out. It feels like ${curr.feelslike} degrees out. There is ${curr.humidity}% humidity.`);
        }
    });
};

module.exports = forecast;