// script.js
async function getQuote() {
    // Show loading spinner
    document.getElementById('loader').style.display = 'block';
    
    try {
        // Get backend URL from environment variable SARDIS_BACKEND_URL or default to 'http://sardisbackend:5000/quote'
        const backendUrl = process.env.SARDIS_BACKEND_URL || 'http://sardisbackend:5000/quote';
        const response = await fetch(backendUrl);
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