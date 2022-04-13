const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routers/index");
require("dotenv").config();
require("./config/cloudinary")(); // configured cloudinary
const app = express();

// Setup view/template engine
app.set("view engine", "ejs");
app.set("views", "views");

const { DB_URI_CLOUD, NODE_ENV, PORT } = process.env;

// Middleware Array
const middleware = [morgan("dev"), cors(), express.static("public"), express.urlencoded({ extended: true }), express.json(), cookieParser()];
app.use(middleware);
console.clear();

app.use(routes);

// Database
const URL = NODE_ENV === "production" ? DB_URI_CLOUD : "mongodb://localhost/zaynaxgroup-recruitment-task";

mongoose
	.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		console.log(`Database connected ${NODE_ENV === "production" ? "Cloud" : "Local"}`);

		app.listen(PORT, () => {
			console.log(`Server is Running on ${PORT}`);
		});
	})
	.catch((e) => {
		return console.log(e);
	});
