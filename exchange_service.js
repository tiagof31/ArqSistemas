const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

const port = 3002;
const exchangeRates = { realToDolar: 0.2, dolarToReal: 5, euroToDolar: 1.1, dolarToEuro: 0.9 };

app.post('/convert', async (req, res) => {
    const { fromCurrency, toCurrency, amount } = req.body;
    const walletResponse = await axios.get('http://localhost:3001/wallet');
    const wallet = walletResponse.data;
    adjustExchangeRates(wallet, fromCurrency, toCurrency);
    const conversionRate = exchangeRates[`${fromCurrency}To${toCurrency.charAt(0).toUpperCase() + toCurrency.slice(1)}`];
    const convertedAmount = amount * conversionRate;
    await axios.post('http://localhost:3003/record', {
            fromCurrency,
            toCurrency,
            originalAmount: amount,
            convertedAmount,
            conversionRate
    });
    res.json({ convertedAmount, conversionRate });
});

function adjustExchangeRates(wallet, fromCurrency, toCurrency) {
    const baseExchangeRates = {
        realToDolar: 0.2, dolarToReal: 5, euroToDolar: 1.1, dolarToEuro: 0.9
    };

    const totalAmount = Object.values(wallet).reduce((acc, curr) => acc + curr, 0);
    const currencyRatio = wallet[fromCurrency] / totalAmount;

    const originalRate = baseExchangeRates[`${fromCurrency}To${toCurrency.charAt(0).toUpperCase() + toCurrency.slice(1)}`];
    let adjustedRate = originalRate;

    if (currencyRatio > 0.5) {
        adjustedRate = Math.max(originalRate * 0.5, originalRate * (1 - currencyRatio));
    } else if (currencyRatio < 0.5) {
        adjustedRate = Math.min(originalRate * 1.5, originalRate * (1 + currencyRatio));
    }

    exchangeRates[`${fromCurrency}To${toCurrency.charAt(0).toUpperCase() + toCurrency.slice(1)}`] = adjustedRate;
}

app.listen(port, () => {
    console.log(`Serviço de Câmbio rodando em http://localhost:${port}`);
});