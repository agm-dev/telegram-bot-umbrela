'use strict';
// Defines codes from open weather that triggers
// an alert.
// More info in: http://openweathermap.org/weather-conditions

const AlertCodes = [
    200, // Thunderstorm with light rain
    201, // Thunderstorm with rain
    202, // Thunderstorm with heavy rain
    230, // Thunderstorm with light drizzle
    231, // Thunderstorm with drizzle
    232, // Thunderstorm with heavy drizzle
    300, // Light instensity drizzle
    301, // Drizzle
    302, // Heavy intensity drizzle
    310, // Light intensity drizle rain
    311, // Drizzle rain
    312, // Heavy intensity drizzle rain
    313, // Shower rain and drizzle
    314, // Heavy shower rain and drizzle
    321, // Shower drizzle
    500, // Light rain
    501, // Moderate rain
    502, // Heavy intensity rain
    503, // Very heavy rain
    504, // Extreme rain
    511, // Freezing rain
    520, // Light intensity shower rain
    521, // Shower rain
    522, // Heavy intensity shower rain
    531, // Ragged shower rain
    600, // Light snow
    601, // Snow
    602, // Heavy snow
    611, // Sleet
    612, // Shower Sleet
    615, // Light rain and snow
    616, // Rain and snow
    620, // Light shower snow
    621, // Shower snow
    622 // Heavy shower snow
];

module.exports = AlertCodes;
