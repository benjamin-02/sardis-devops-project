// script.js
// import { backendUrl } from './config.js';
async function getQuote() {
    // Show loading spinner
    document.getElementById('loader').style.display = 'block';
    const apiUrl = '%%API_URL%%';
    try {
        // 1.version: Get backend URL from environment variable SARDIS_BACKEND_IP
        // const backendUrl = `${process.env.SARDIS_BACKEND_IP}:5000/quote`;
        // 2.version: Get the url from config.js with importing it:
        // const response = await fetch(backendUrl);
        // 3. version: hardcoded:
        const response = await fetch(`http://${apiUrl}:5000/quote`);
        const data = await response.json();
        // Hide loading spinner
        document.getElementById('loader').style.display = 'none';
        // Update quote placeholder with fetched quote
        document.getElementById('quote-placeholder').textContent = data.quote;
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Hide loading spinner
        document.getElementById('loader').style.display = 'none';
        // Display error message
        document.getElementById('quote-placeholder').textContent = 'Error fetching quote. Please try again later.';
    }
}