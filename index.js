const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.get('/api', (req, res) => {
    //two request query parameters
    const {slack_name, track} = req.query;
    //check if both parameters are provided
    if (!slack_name || !track) {
        return res.status(400).json({error: 'Both slack_name and track are required'});
    }

    //get the current day of the week
    const current = new Date();
    const options = {
        weekday: "long",
    }
    const current_day = current.toLocaleDateString("en-Us", options);

    //get UTC  time (with validation of +/-2)
    function getCurrentUTCWithinWindow(){
        const lowerBound = new Date(current);

        //calculate the window
        lowerBound.setUTCMinutes(current.getUTCMinutes() - 2);
        const upperBound = new Date(current);
        upperBound.setUTCMinutes(current.getUTCMinutes() + 2);

        if (current >= lowerBound && current <= upperBound) {
            //format the current UTC time
            const formattedUTC = current.toISOString().split('.')[0] + 'Z';
            return formattedUTC;
        } else{
            return null;
        }
    }
    
    
    //Json response based on task
    const responseData = {
        slack_name : slack_name,
        current_day: current_day,
        utc_time: getCurrentUTCWithinWindow(),
        track : track,
        github_file_url : "https://github.com/OluwatuyiAbiola/hngstage1task/blob/master/index.js",
        github_repo_url : "https://github.com/OluwatuyiAbiola/hngstage1task",
        status_code : res.statusCode
    };

    //send the json response
    res.json(responseData);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})