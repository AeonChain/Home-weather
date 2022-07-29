const UserCalls = require('./modules/users');
const WeatherCalls = require('./modules/weatherApi');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const dataDirPath = './data/';
const filePaths = {
	users: dataDirPath + "users.json"
};

app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

//weather query

//Users
new UserCalls(app, filePaths.users);

//Weather search
new WeatherCalls(app);


