const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

const port = 3003;
let transactionHistory = [];

app.get('/history', (req, res) => {
  res.json(transactionHistory);
});

app.post('/record', (req, res) => {
  const transaction = req.body;
  transaction.timestamp = new Date();
  transactionHistory.push(transaction);
  res.send('Transação registrada com sucesso.');
});

app.listen(port, () => {
  console.log(`Serviço de Histórico de Transações rodando em http://localhost:${port}`);
});