// Function to calculate reading time
function calculateReadingTime() {
    const wordsPerMinute = 200; // Average reading speed (words per minute)
    
    // Get all paragraphs with the class 'text'
    const paragraphs = document.querySelectorAll('.articletext');
    
    // Initialize total word count
    let totalWordCount = 0;
    
    // Loop through each paragraph and count words
    paragraphs.forEach(paragraph => {
        const text = paragraph.innerText;
        const wordCount = text.split(' ').length;
        totalWordCount += wordCount;
    });
    
    // Calculate reading time in minutes
    const readingTimeMinutes = totalWordCount / wordsPerMinute;
    
    // Determine the display text
    let displayText;
    if (readingTimeMinutes < 1) {
        displayText = "<1 minute read time";
    } else {
        displayText = `${Math.ceil(readingTimeMinutes)} minute read time`;
    }
    
    // Display the estimated reading time on the page
    const readingTimeElement = document.getElementById('readingtime');
    readingTimeElement.innerText = displayText;
}

// Call the function when the page loads
window.onload = calculateReadingTime;
