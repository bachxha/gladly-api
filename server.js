//jshint esversion:6

// dependencies
const parse = require("csv-parse");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

// static variables
const inputFile ="resource/sample-exercise (3).csv"
const url = process.env.GLADLY_POST_ITEMS_URL;
const options = {
    method: "POST",
    auth: process.env.GLADLY_USER_NAME + ":" + process.env.GLADLY_API_KEY
}

// dynamic variable
var csvData = [];

// parse csv file into array
var parser = parse({delimiter: ','}, function (err, data) {
    data.forEach((line) => {
        var customer = {
            "emailAddress" : line[0]
        };

        var content = {
            "type" : "CUSTOMER_ACTIVITY",
            "title" : line[1],
            "body" : line[2],
            "activityType" : "EMAIL",
            "sourceName" : "Bach"
        }

        var requestObject = {
            "customer" : customer,
            "content" : content
        };
        console.log(requestObject);
     csvData.push(requestObject);
    });

    // get rid of the first object, it's the header
    csvData.shift();

    // post request to gladly api
    csvData.forEach((line) => {
        const jsonData = JSON.stringify(line);
        const request = https.request(url, options, (response) => {
            response.on("data", (data) => {
                console.log(JSON.parse(data));
            });
        });
    
        request.on("error", (error) => {
            console.log(error);
        });
    
        request.write(jsonData);
        request.end();
    });
});

fs.createReadStream(inputFile).pipe(parser);

