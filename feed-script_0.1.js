let currentPage = 1;
const articlesPerPage = 5;
let totalPages = 1;

// Function to render articles on the page
function renderArticles(articles, page) {
    const start = (page - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToShow = articles.slice(start, end);

    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = ''; // Clear existing articles

    articlesToShow.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('w3-col', 'w3-hover-light-gray', 'w3-hover-opacity', 'w3-padding');
        articleElement.setAttribute('data-topics', article.topics);

        const articleLink = document.createElement('a');
        articleLink.href = article.url;
        articleLink.classList.add('w3-margin');
        articleLink.style.textDecoration = 'none';

        const articleImage = document.createElement('img');
        articleImage.classList.add('w3-col', 'w3-round-xlarge');
        articleImage.style.width = '98%';
        articleImage.src = article.image;
        articleImage.alt = article.altText;

        const articleContent = document.createElement('div');
        articleContent.classList.add('w3-row');
        articleContent.style.margin = '0 4px';

        const articleTitle = document.createElement('h3');
        articleTitle.classList.add('w3-row');
        articleTitle.style.textAlign = 'left';
        articleTitle.innerText = article.title;

        const articleDescription = document.createElement('p');
        articleDescription.classList.add('w3-row', 'w3-left-align');
        articleDescription.innerText = article.description;

        const articleAuthorDate = document.createElement('p');
        articleAuthorDate.classList.add('w3-row', 'w3-left-align', 'w3-padding-top-32');
        articleAuthorDate.innerText = `By ${article.author} | ${article.date}`;

        articleContent.appendChild(articleTitle);
        articleContent.appendChild(articleDescription);
        articleContent.appendChild(articleAuthorDate);

        articleLink.appendChild(articleImage);
        articleLink.appendChild(articleContent);
        articleElement.appendChild(articleLink);
        articlesContainer.appendChild(articleElement);
    });
}

// Function to render pagination buttons
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    const prevBtn = document.createElement('a');
    prevBtn.href = "#";
    prevBtn.classList.add('w3-button');
    prevBtn.innerHTML = '&laquo;';
    prevBtn.id = 'prev-btn';
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('a');
        pageBtn.href = "#";
        pageBtn.classList.add('w3-button');
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderArticles(articles, currentPage);
            updatePaginationControls();
        });
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('a');
    nextBtn.href = "#";
    nextBtn.classList.add('w3-button');
    nextBtn.innerHTML = '&raquo;';
    nextBtn.id = 'next-btn';
    paginationContainer.appendChild(nextBtn);

    // Attach event listeners for the first and last buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles(articles, currentPage);
            updatePaginationControls();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderArticles(articles, currentPage);
            updatePaginationControls();
        }
    });
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Highlight the current page
    const pageButtons = document.querySelectorAll('#pagination .w3-button');
    pageButtons.forEach((btn, index) => {
        btn.classList.remove('w3-green'); // Remove any existing highlights
        if (index === currentPage) { // +1 to account for the prev button
            btn.classList.add('w3-green');
        }
    });
}

// Fetch the JSON data
let articles = [];
fetch('./articles_0.1.json')
    .then(response => response.json())
    .then(data => {
        articles = data.articles;
        totalPages = Math.ceil(articles.length / articlesPerPage);

        // Render the first page of articles and the pagination controls
        renderArticles(articles, currentPage);
        renderPagination(totalPages);
        updatePaginationControls();
    })
    .catch(error => console.error('Error fetching JSON data:', error));
