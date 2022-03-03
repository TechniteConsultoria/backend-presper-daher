const express3 = require('express');
const router3 = express3.Router();
var schedule = require('node-schedule');
var axios = require('axios');
const dotenv3 = require('dotenv');

dotenv3.config();

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = new schedule.Range(0, 23);
rule.minute = new schedule.Range(0, 59, 1);

//const ip = process.env.BACKEND_URL
const disparo3 = process.env.DISPARO;
const ip3 = 'http://localhost:8142/api';

var j = schedule.scheduleJob(rule, async function () {
  if (disparo3 == 'publicado') {
    try {
        await axios
        .get(`${ip3}/curso-cliente/rotina`)
        .then((res) => {
          console.log(res.data)
        })
        .catch((errors) => {
          console.log(errors);
        });
    } catch (e) {
      console.log(e);
    }
  }
});


module.exports = router3;
