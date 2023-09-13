const dotenv = require("dotenv");
const express = require("express");
const https = require("https");
const http = require("http");
const logger = require("morgan");
const path = require("path");
const devCerts = require("office-addin-dev-certs");
const router = require("./routes/index");

dotenv.config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;
app.use("/", router);

app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });
// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: process.env.NODE_ENV !== "production" ? err : {},
    });
  });

  // http.createServer(app).listen(port, () => {
  //   console.log(`Listening on ${port}`);
  // });
devCerts.getHttpsServerOptions().then((options) => {
  https
    .createServer(options, app)
    .listen(port, () => console.log(`Server running on ${port} in ${process.env.NODE_ENV} mode`));
});