document.addEventListener('DOMContentLoaded', function () {
    fetchNews();
});
function fetchNews() {
    const apiKey = 'a2138d7d4ed34d8698b3b607415d3bc5';
    const url = `https://newsapi.org/v2/everything?q=(crypto OR binance OR bitcoin)&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming the response data structure matches your requirement
            const newsItems = data.articles.map((article, index) => {
                return `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${article.urlToImage}" class="d-block w-100" alt="${article.title}">
                        <div class="carousel-caption">
                            <h5>${article.title}</h5>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
            }).join('');

            document.getElementById('newsItems').innerHTML = newsItems;
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}

fetchNews();


async function fetchDataFromBinance() {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();
    return data.filter(coin => ['BTCUSDT', 'ZRXUSDT', 'CVXUSDT', 'SSVUSDT'].includes(coin.symbol));
}

// Mapping of coin symbols to their respective graph paths
const graphPaths = {
    'BTCUSDT': '../graphs/bitcoin_analysis',
    'CVXUSDT': '../graphs/CVX_analysis',
    'SSVUSDT': '../graphs/SSV_analysis',
    'ZRXUSDT': '../graphs/ZRX_analysis'
};

// Function to create and populate card elements
async function createBinanceCards() {
    const binanceData = await fetchDataFromBinance();

    const binanceCardsContainer = document.getElementById('binanceCards');
    let coinCount = 0;
    binanceData.forEach(coin => {
        if (coinCount < 9) { // Check if the limit has been reached
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('mb-4', 'coincard');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = coin.symbol;

            const currentPrice = document.createElement('p');
            currentPrice.classList.add('card-text');
            currentPrice.innerHTML = `Current Price: <span class="green-text">$${coin.lastPrice}</span>`;

            const marketCap = document.createElement('p');
            marketCap.classList.add('card-text');
            marketCap.innerHTML = `Market Cap: <span class="green-text">$${coin.volume}</span>`;

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            // Create Prediction button
            const chartButton = document.createElement('button');
            chartButton.classList.add('btn', 'btn-primary', 'col-md-6', 'm-1');
            chartButton.textContent = 'Prediction';

            chartButton.addEventListener('click', function () {
                // Navigate to the corresponding graph path
                const graphPath = graphPaths[coin.symbol];
                window.location.href = graphPath;
            });

            // Append buttons to button container
            buttonContainer.appendChild(chartButton);

            cardBody.appendChild(title);
            cardBody.appendChild(currentPrice);
            cardBody.appendChild(marketCap);
            cardBody.appendChild(buttonContainer);

            cardDiv.appendChild(cardBody);
            binanceCardsContainer.appendChild(cardDiv);
            coinCount++; // Increment the coin count
        }
    });
}

// Call the function to create and populate cards
createBinanceCards();

