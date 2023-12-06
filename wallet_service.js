const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const port = 3001;
let wallet = { real: 100000, dolar: 50000, euro: 40000 };

app.get('/wallet', (req, res) => {
    res.json(wallet);
});

app.post('/convert', async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount } = req.body;
        const response = await axios.post('http://localhost:3002/convert', {
            fromCurrency,
            toCurrency,
            amount
        });
        const { convertedAmount } = response.data;

        wallet[fromCurrency] -= amount;
        wallet[toCurrency] += convertedAmount;

        res.json({ message: 'Conversão realizada com sucesso', wallet });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Serviço de Carteira rodando em http://localhost:${port}`);
});