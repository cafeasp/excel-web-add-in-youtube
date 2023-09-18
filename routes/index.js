var router = require("express").Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/weather", function (req, res, next){
  const params = {
    key: `${process.env.WEATHER_KEY}`,
    q: `${req.body.zip}`,days:1
  };
let url = process.env.URL;

  try {
    axios.get(url,{ params })
    .then(function (response) {
     
      let data = {location:response.data.location.name,temperature:response.data.current.temp_f,
        condition:response.data.current.condition.text,icon:response.data.current.condition.icon,
        forcast_icon:response.data.forecast.forecastday[0].day.condition.icon,
        forcast_condition:response.data.forecast.forecastday[0].day.condition.text,
        forcast_high:response.data.forecast.forecastday[0].day.maxtemp_f,
        forcast_low:response.data.forecast.forecastday[0].day.mintemp_f,
        daily_chance_of_rain:response.data.forecast.forecastday[0].day.daily_chance_of_rain};

      res.send(data);
    })
    .catch(function (error) {
      // handle error
      
      res.send(error);
    })
    .finally(function () {
      console.log("Weather API call complete");
    });
  } catch (error) {
    console.log(error);
  }
});





module.exports = router;
