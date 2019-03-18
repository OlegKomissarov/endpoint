# Endpoint

This is HTTP endpoint for getting companies with their names, symbols, 
logo urls and prices, optionally limited by the given time frame.
To get all companies don't set any parameter. 
To get information about one particular company specify parameter "symbol" in url 
like this: /?symbol={value}. Initial available symbols are: A, AAON, ABCB, AAN, AAME, AADR, AAPL.
Now you can't search by several companies in one request.
To limit prices by the time frame set one or both parameters "startTime" and "endTime" 
like this: /?startTime={MM.DD.YYYY}&endTime={MM.DD.YYYY}.
It uses Google Datastore as NoSQL database. 
The database endpoint is set as environment variable DATASTORE_ENDPOINT.
To launch it locally use npm install to install packages, 
then create .env file in project directory by example of file example.env, 
specify project name and port there
and then run npm start to launch server.
To test it use npm test. To configure tests change config.json in test directory.

To make this app production-ready one need to: 
 - Add validation on dates requests to avoid requests 
 when the end date is before the start date.
 - Improve database queries. 
 E.g. add date frame to the prices query and remove filter by date after getting whole list.
 - Add possibility to search by couple of symbols. 
 - Add other useful metrics.
 - Test receiving data on compliance with specified parameters.
 - Add querying by more precise time frame using hours and minutes