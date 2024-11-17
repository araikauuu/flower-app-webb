//public/script.js
window.onload = async () => {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        console.log('Received Stats:', stats); // Debugging line
        displayStatistics(stats);
        plotCharts(stats);
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

function displayStatistics(stats) {
    console.log('Updating statistics:', stats); // Debugging line
    document.getElementById('average').textContent = `Average Height: ${stats.average.toFixed(2)} cm`;
    document.getElementById('min').textContent = `Min Height: ${stats.min.toFixed(2)} cm`;
    document.getElementById('max').textContent = `Max Height: ${stats.max.toFixed(2)} cm`;
    document.getElementById('speciesMode').textContent = `Most Common Species: ${stats.speciesMode.join(', ')}`;
    document.getElementById('sizeMode').textContent = `Most Common Size: ${stats.sizeMode.join(', ')}`;
    document.getElementById('fragranceMode').textContent = `Most Common Fragrance: ${stats.fragranceMode.join(', ')}`;
}

function plotCharts(stats) {
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    const ctxLine = document.getElementById('lineChart').getContext('2d');

    // Prepare data for the pie chart
    const pieData = {
        labels: Object.keys(stats.speciesCount), // Dynamic labels based on the speciesCount
        datasets: [{
            data: Object.values(stats.speciesCount), // Dynamic data based on the speciesCount
            backgroundColor: ['#be4e5e', '#63252e', '#ffaab2', '#ff6b81'], // Example colors
        }]
    };

    // Prepare data for the line graph (Height statistics)
    const lineData = {
        labels: ['Min Height', 'Average Height', 'Max Height'],
        datasets: [{
            label: 'Flower Heights',
            data: [stats.min, stats.average, stats.max],
            borderColor:'#63252e',
            fill: false
        }]
    };

    // Create Pie Chart
    new Chart(ctxPie, {
        type: 'pie',
        data: pieData,
    });

    // Create Line Chart
    new Chart(ctxLine, {
        type: 'line',
        data: lineData,
    });
}

async function fetchClimateChangeNews() {
    try {
        const response = await fetch('/climate-change-news');
        const data = await response.json();

        if (data.length === 0) {
            document.getElementById('newsContainer').innerHTML = '<p>No news available.</p>';
            return;
        }

        const newsContainer = document.getElementById('newsContainer');
        data.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                        <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                        <p>${item.description}</p>
                        <p><strong>Published on:</strong> ${item.published_at}</p>
                    `;
            newsContainer.appendChild(newsItem);
        });
    } catch (error) {
        console.error('Error fetching climate news:', error);
    }
}

// Call the function when the page loads
fetchClimateChangeNews();
