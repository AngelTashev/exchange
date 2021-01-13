const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR,ETHEUR,BCHEUR,XBTUSD,ETHUSD,BCHUSD';
const time = krakenEndpoint + 'Time';
const currencyContainer = document.getElementById('currency-container');
const buyBtn = document.getElementById('buyBtn');
const sellBtn = document.getElementById('sellBtn');
const inputValue = document.getElementById('inputValue');
const resultField = document.getElementById('resultField');
const currencyValue = document.getElementById('currencyValue');

// 0 - BTC/EUR, 1 - ETH/EUR, 2 - BCH/EUR
// 3 - BTC/USD, 4 - ETH/USD, 5 - BCH/USD
const exchanges = {};

async function displayInfo() {
    
    await loadData();
    attachListeners();


    currencyContainer.innerHTML = generateHTML();
    // getTime();

}

async function loadData() {

    await Promise.all([await fetch(ticker).then(res => res.json())])
    .then(res => {
        let data = res[0].result;

        for (curr of Object.keys(data)) {
            const exchangePrice = res[0].result[curr].c[0];
            const buyRate = Number(exchangePrice * 1.02).toFixed(2);
            const sellRate = Number(exchangePrice * 0.98).toFixed(2);

            exchanges[curr] = { buyRate, sellRate };
        }
    });
    
}

function generateHTML() {

    html += createTable(exchanges.XXBTZEUR, exchanges.XXBTZUSD, 'BTC');
    html += createTable(exchanges.XETHZEUR, exchanges.XETHZUSD, 'ETH');
    html += createTable(exchanges.XETHZEUR, exchanges.XETHZUSD, 'BCH');

    return html;
}

function createTable(currEUR, currUSD, currency) {

    let table = '<div class="table table-dark table-striped">';
    table += '<table class="eur">';
    table += `<tr><td>Client <strong>buys</strong> 1 ${currency} for</td>`;
    table += `<td>${currEUR.buyRate} EUR</td></tr>`;
    table += `<tr><td>Client <strong>sells</strong> 1 ${currency} for</td>`;
    table += `<td>${currEUR.sellRate} EUR</td></tr>`;
    table += '</table>';
    table += '<table class="usd">';
    table += `<tr><td>Client <strong>buys</strong> 1 ${currency} for</td>`;
    table += `<td>${currUSD.buyRate} USD</td></tr>`;
    table += `<tr><td>Client <strong>sells</strong> 1 ${currency} for</td>`;
    table += `<td>${currUSD.sellRate} USD</td></tr>`;
    table += '</table></div>';

    return table;
}

function attachListeners() {
    buyBtn.addEventListener('click', e => {
        e.preventDefault();
        resultField.value = calculate('buy');
    });

    sellBtn.addEventListener('click', e => {
        e.preventDefault();
        resultField.value = calculate('sell');
    })
}

function calculate(operation) {
    let result = 0;
    const currency = currencyValue.value;
    const amount = inputValue.value;
    switch(operation) {
        case 'buy':
            result = Number(exchanges[currency].buyRate * amount).toFixed(2);
            break;
        case 'sell':
            result = Number(exchanges[currency].sellRate * amount).toFixed(2);
            break;
    }

    return result;
}

// async function getTime() {
//     let timeResult = {};
//     await fetch(time)
//         .then(res => res.json())
//         .then(data => timeResult = data);
//     console.log(JSON.stringify(timeResult.result.rfc1123));
// }

displayInfo();