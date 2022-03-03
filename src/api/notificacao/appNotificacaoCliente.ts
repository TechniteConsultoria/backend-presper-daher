const express = require('express');
const router = express.Router();
var schedule = require('node-schedule');
var axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = new schedule.Range(0, 23);
rule.minute = new schedule.Range(0, 59, 10);

//const ip = process.env.BACKEND_URL
const disparo = process.env.DISPARO;
const ip = 'http://localhost:8142/api';

var j = schedule.scheduleJob(rule, async function () {
  let dados = [];

  if (disparo == 'publicado') {
    try {
      await axios
        .get(`${ip}/notificacaoCliente`)
        .then((res) => {
          dados = res.data.notificacoes;
          dados.forEach((element) => {
            let dataDisparo = new Date(element['data']);
            let dataAtual = new Date();

            if (dataDisparo < dataAtual) {
              notificacao(element, dataAtual, 'antigo');
            } else {
              let notificar = schedule.scheduleJob(
                dataDisparo,
                function () {
                  notificacao(
                    element,
                    dataDisparo,
                    'atual',
                  );
                },
              );
            }
          });
        })
        .catch((errors) => {
          console.log(errors);
        });
    } catch (e) {
      console.log(e);
    }
  }
});

let notificacao = async (element, data, opcao) => {
  let one = 'https://exp.host/--/api/v2/push/send';
  let two = `${ip}/notificacaoCliente/finalizar/${element['id']}/${element['notificacao']}`;

  const requestOne = await axios.post(one, {
    to: element['token'],
    sound: 'default',
    title: element['nome'],
    body: element['texto'],
    data: { data: 'oi' },
  });

  const requestTwo = await axios.put(two, {
    id: element['id'],
    data: {
      token: element['token'],
      ultima: data,
      cliente: element['cliente'],
    },
  });

  await axios
    .all([requestOne, requestTwo])
    .catch((errors) => {
      console.log(errors);
    });
};

module.exports = router;
