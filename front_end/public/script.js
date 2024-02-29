// script.js
async function getQuote() {
    try {
        const response = await fetch('http://mybackend:5000/quote');
        const data = await response.json();
        document.getElementById('quote').textContent = data.quote;
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}
