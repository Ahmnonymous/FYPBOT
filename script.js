document.addEventListener('DOMContentLoaded', function () {
    fetchNews();
});

function fetchNews() {
    const apiKey = 'a2138d7d4ed34d8698b3b607415d3bc5';
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming the response data structure matches your requirement
            const newsItems = data.articles.map(article => {
                return `
                    <div class="carousel-item">
                        <img src="${article.urlToImage}" class="d-block w-100" alt="${article.title}">
                        <div class="carousel-caption">
                            <h5>${article.title}</h5>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
            }).join('');

            document.getElementById('newsItems').innerHTML = newsItems;
            document.querySelector('.carousel-item').classList.add('active'); // Set the first item as active
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}


async function fetchDataFromBinance() {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();
    return data;
}

// Function to create and populate card elements
async function createBinanceCards() {
    const binanceData = await fetchDataFromBinance();

    const binanceCardsContainer = document.getElementById('binanceCards');
    let coinCount = 0; // Track the number of coins added

    binanceData.forEach(coin => {
        if (coinCount < 9) { // Check if the limit has been reached
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('col-md-4', 'mb-4');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = coin.symbol;

            const highestPrice = document.createElement('p');
            highestPrice.classList.add('card-text');
            highestPrice.textContent = `Highest Price: $${coin.highPrice}`;

            const currentPrice = document.createElement('p');
            currentPrice.classList.add('card-text');
            currentPrice.textContent = `Current Price: $${coin.lastPrice}`;

            const lowestPrice = document.createElement('p');
            lowestPrice.classList.add('card-text');
            lowestPrice.textContent = `Lowest Price: $${coin.lowPrice}`;

            const coinVolume = document.createElement('p');
            coinVolume.classList.add('card-text');
            coinVolume.textContent = `Coin Volume: ${coin.volume}`;

            const amount = document.createElement('p');
            amount.classList.add('card-text');
            amount.textContent = `Amount: ${coin.volume}`;

            const percent = document.createElement('p');
            percent.classList.add('card-text');
            percent.textContent = `Percent: ${coin.priceChangePercent}%`;

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            // Create Buy button
            const buyButton = document.createElement('button');
            buyButton.classList.add('btn', 'btn-success', 'col-md-6','m-1');
            buyButton.textContent = 'Chart';


            // Append buttons to button container
            buttonContainer.appendChild(buyButton);
            buttonContainer.appendChild(sellButton);

            cardBody.appendChild(title);
            cardBody.appendChild(highestPrice);
            cardBody.appendChild(currentPrice);
            cardBody.appendChild(lowestPrice);
            cardBody.appendChild(coinVolume);
            cardBody.appendChild(amount);
            cardBody.appendChild(percent);
            cardBody.appendChild(buttonContainer);

            cardDiv.appendChild(cardBody);
            binanceCardsContainer.appendChild(cardDiv);

            coinCount++; // Increment the coin count
        }
    });
}

// Call the function to create and populate cards
createBinanceCards();

