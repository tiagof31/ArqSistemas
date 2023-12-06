const axios = require('axios');
let inquirer;

const walletServiceUrl = 'http://localhost:3001';
const exchangeServiceUrl = 'http://localhost:3002';
const historyServiceUrl = 'http://localhost:3003';

async function main() {
    inquirer = (await import('inquirer')).default;
    let exit = false;

    while (!exit) {
        const { action } = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Escolha uma ação:',
            choices: ['Converter', 'Mostrar Saldo', 'Mostrar Histórico', 'Finalizar Programa'],
        });

        switch (action) {
            case 'Converter':
                await convertCurrency();
                break;
            case 'Mostrar Saldo':
                await showWallet();
                break;
            case 'Mostrar Histórico':
                await showHistory();
                break;
            case 'Finalizar Programa':
                exit = true;
                break;
        }
    }
}

async function convertCurrency() {
    const { fromCurrency } = await inquirer.prompt({
        name: 'fromCurrency',
        type: 'list',
        message: 'Selecione a moeda para converter:',
        choices: ['real', 'dolar', 'euro'],
    });

    const { toCurrency } = await inquirer.prompt({
        name: 'toCurrency',
        type: 'list',
        message: 'Selecione a moeda alvo:',
        choices: ['real', 'dolar', 'euro'],
    });

    const { amount } = await inquirer.prompt({
        name: 'amount',
        type: 'input',
        message: 'Digite o valor para conversão:',
        validate: value => value > 0 || 'Por favor, insira um valor válido.'
    });

    try {
        const response = await axios.post(`${walletServiceUrl}/convert`, {
            fromCurrency,
            toCurrency,
            amount: parseFloat(amount)
        });

        console.log("Conversão realizada, verifique sua carteira.");
    } catch (error) {
        console.error('Erro na conversão:', error.message);
    }
}

async function showWallet() {
    try {
        const response = await axios.get(`${walletServiceUrl}/wallet`);
        console.log('Saldo da Carteira:', response.data);
    } catch (error) {
        console.error('Erro ao exibir o saldo:', error.message);
    }
}

async function showHistory() {
    try {
        const response = await axios.get(`${historyServiceUrl}/history`);
        console.log('Histórico de Transações:', response.data);
    } catch (error) {
        console.error('Erro ao exibir o histórico:', error.message);
    }
}

main();
