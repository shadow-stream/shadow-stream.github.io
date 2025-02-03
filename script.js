const videoPlayer = document.getElementById('videoPlayer');
const videoSrcBox = document.getElementById('videoSrc');
const loadVideoButton = document.getElementById('loadVideoButton');
const progressSlider = document.getElementById('progressSlider');
const statusMessage = document.getElementById('statusMessage');

// Update status message
function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    if (isError) {
        statusMessage.classList.add('error');
        statusMessage.classList.remove('success');
    } else {
        statusMessage.classList.add('success');
        statusMessage.classList.remove('error');
    }
}

// Function to check if the video URL is valid (supporting .mp4, .webm, .ogg, .mkv)
function isValidUrl(url) {
    return (url.startsWith('http://') || url.startsWith('https://')) && 
           (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.endsWith('.mkv'));
}

// Function to check if MKV is supported
function isMkvSupported() {
    const videoElement = document.createElement('video');
    return videoElement.canPlayType('video/x-matroska') !== '';  // Check if browser can play MKV files
}

// Reset video and play new URL
function resetVideoPlayer() {
    videoPlayer.pause();
    videoPlayer.currentTime = 0; // Reset the video to the start
    progressSlider.value = 0; // Reset the slider position
}

// When the button is clicked, update the video player with the URL from the text box
loadVideoButton.addEventListener('click', () => {
    const videoUrl = videoSrcBox.value;
    if (!videoUrl) {
        updateStatus("Please enter a valid video URL.", true);
        return;
    }

    // Validate the URL before attempting to load it
    if (!isValidUrl(videoUrl)) {
        updateStatus("Invalid URL or unsupported video format. Supported formats: .mp4, .webm, .ogg, .mkv.", true);
        return;
    }

    // If the video is MKV, check if it's supported
    if (videoUrl.endsWith('.mkv') && !isMkvSupported()) {
        updateStatus("Loading video failed! Unsupported MKV format.", true);
        return;
    }

    updateStatus("Video is loading...", false); // Set loading status

    // Reset the video player before loading new video
    resetVideoPlayer();

    // Create a new video source element and set the URL
    const newSource = document.createElement('source');
    newSource.src = videoUrl;
    newSource.type = "video/mp4"; // You can modify this according to the video type if needed

    // Remove any previous source elements
    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(newSource);

    // Reload the video player
    videoPlayer.load();  // Reload the video with the new source

    // Add a listener to handle loading error or success
    videoPlayer.onloadeddata = () => {
        updateStatus("Video loaded successfully!", false); // Set success status
        
        // Fade out the success message after 2 seconds
        setTimeout(() => {
            statusMessage.classList.add('fade-out'); // Apply fade-out animation
            setTimeout(() => {
                statusMessage.style.display = 'none'; // Set display to none after fade-out
            }, 1000); // Wait for fade-out animation to complete (1s)
        }, 2000); // Wait 2 seconds before starting fade-out
        
        videoPlayer.play();  // Start playing the video
    };

    videoPlayer.onerror = () => {
        updateStatus("Error loading video. Please check the URL.", true); // Show error status
    };
});
