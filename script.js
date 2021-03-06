const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const krakenEndpoint = 'https://api.kraken.com/0/public/';
const ticker = krakenEndpoint + 'Ticker?pair=XBTEUR,ETHEUR,BCHEUR,XBTUSD,ETHUSD,BCHUSD';
const time = krakenEndpoint + 'Time';
const currencyContainer = document.getElementById('info-container');
const convertBtn = document.getElementById('convertBtn');
const inputValue = document.getElementById('inputValue');
const resultField = document.getElementById('resultField');
const currencyValue = document.getElementById('currencyValue');
const refreshBtn = document.getElementById('refresh-btn');
const currentRate = document.getElementById('currentRate');

// 0 - BTC/EUR, 1 - ETH/EUR, 2 - BCH/EUR
// 3 - BTC/USD, 4 - ETH/USD, 5 - BCH/USD
const exchanges = {};

async function displayInfo() {

    await loadData();
    attachListeners();


    currencyContainer.innerHTML = generateHTML();
    attachRefreshListener();
    // getTime();

}

async function loadData() {

    await Promise.all([await fetch(ticker).then(res => res.json())])
        .then(res => {
            let data = res[0].result;

            for (curr of Object.keys(data)) {
                const exchangePrice = res[0].result[curr].c[0];
                const buyRate = Number(exchangePrice * 1.1).toFixed(2);
                const sellRate = Number(exchangePrice * 0.9).toFixed(2);

                exchanges[curr] = { buyRate, sellRate };
            }
        });

}

function generateHTML() {

    let html = createTable(exchanges.XXBTZEUR, exchanges.XXBTZUSD, 'BTC');
    html += createTable(exchanges.XETHZEUR, exchanges.XETHZUSD, 'ETH');
    html += createTable(exchanges.BCHEUR, exchanges.BCHUSD, 'BCH');

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

function attachRefreshListener() {
    refreshBtn.addEventListener('click', e => {
        e.preventDefault();
        displayInfo();
    });
}

function attachListeners() {

    convertBtn.addEventListener('click', e => {
        e.preventDefault();
        resultField.value = calculateAndChangeRate('buy');
    });

}

function calculateAndChangeRate() {
    let rate = 0;
    let result = 0;
    let currency = currencyValue.value;
    const transaction = currency.charAt(0);
    currency = currency.substring(1);
    const amount = inputValue.value;

    switch (transaction) {
        case '0':
            rate = exchanges[currency].sellRate;
            result = Number(rate * amount).toFixed(2);
            break;
        case '1':
            rate = exchanges[currency].buyRate;
            result = Number(amount / rate).toFixed(8);
            break;
    }

    const strCurrency = String(currency);
    currentRate.innerHTML = `${rate} ${strCurrency.substr(strCurrency.length - 3)}`;

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
