const express2 = require('express');
const router2 = express2.Router();
var schedule = require('node-schedule');
var axios = require('axios');
const dotenv2 = require('dotenv');

dotenv2.config();

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = new schedule.Range(0, 23);
rule.minute = new schedule.Range(0, 59, 1);

//const ip = process.env.BACKEND_URL
const disparo2 = process.env.DISPARO;
const ip2 = 'http://localhost:8142/api';

var j = schedule.scheduleJob(rule, async function () {
  let dados = [];

  if (disparo2 == 'publicado') {
    try {
      await axios
        .get(`${ip2}/agendaNotificacao`)
        .then((res) => {
          dados = res.data;
          dados.forEach(e => {
            notificacao2(e);
          })
        })
        .catch((errors) => {
          console.log(errors);
        });
    } catch (e) {
      console.log(e);
    }
  }
});

let notificacao2 = async (element) => {
  let one = 'https://exp.host/--/api/v2/push/send';

  const requestOne = await axios.post(one, {
    to: element['token'],
    sound: 'default',
    title: `Lembrete ${element['nome']}`,
    body: `Olá ${element['nome']} você tem uma consulta às ${element['dataAgendada']}, não se esqueça!`,
    data: { data: `Lembrete ${element['nome']}` },
  });

  await axios
  .all([requestOne])
  .catch((errors) => {
    console.log(errors);
  });
};

module.exports = router2;
