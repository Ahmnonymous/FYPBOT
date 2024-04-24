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
