// Access video element and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const saveButton = document.getElementById('save');
const photosContainer = document.getElementById('photos');
const context = canvas.getContext('2d');
const backgroundSelector = document.getElementById('background-selector');
const filterSelector = document.getElementById('filter-selector');
const instructionText = document.getElementById('instruction');

let capturedPhotos = [];  // Store the captured images
let photoCount = 0;       // Keep track of how many photos are taken
let selectedBackground = 'none';
let selectedFilter = 'none';

// Set up video stream from the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.log("Error accessing webcam: ", err);
    });

// Take a snapshot when the 'Take Photo' button is clicked
snapButton.addEventListener('click', () => {
    if (photoCount < 3) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png'); // Get the image data URL
        capturedPhotos.push(dataUrl);
        photoCount++;
        photosContainer.innerHTML = ''; // Clear previous images
        for (let i = 0; i < photoCount; i++) {
            const img = document.createElement('img');
            img.src = capturedPhotos[i];
            photosContainer.appendChild(img);
        }
        if (photoCount === 3) {
            instructionText.textContent = "You have captured all three images! Now you can download your collage.";
        }
    }
});

// Background and Filter Change Handlers
backgroundSelector.addEventListener('change', (event) => {
    selectedBackground = event.target.value;
});

filterSelector.addEventListener('change', (event) => {
    selectedFilter = event.target.value;
});

// Save the collage when the 'Save Collage' button is clicked
saveButton.addEventListener('click', () => {
    if (capturedPhotos.length === 3) {
        // Create a new canvas to hold the vertical collage
        const collageCanvas = document.createElement('canvas');
        const collageContext = collageCanvas.getContext('2d');
        const collageWidth = canvas.width;
        const collageHeight = canvas.height * 3;

        collageCanvas.width = collageWidth;
        collageCanvas.height = collageHeight;

        // Draw the background if any is selected
        if (selectedBackground !== 'none') {
            const background = new Image();
            background.src = `${selectedBackground}.jpg`; // Assuming backgrounds are stored in the same directory
            background.onload = function () {
                collageContext.drawImage(background, 0, 0, collageWidth, collageHeight);
                drawPhotosOnCanvas();
            };
        } else {
            drawPhotosOnCanvas();
        }

        // Function to draw photos on the collage
        function drawPhotosOnCanvas() {
            // Draw the three images vertically on the new canvas
            for (let i = 0; i < 3; i++) {
                const img = new Image();
                img.src = capturedPhotos[i];
                img.onload = function () {
                    // Apply the filter if any is selected
                    collageContext.filter = getCanvasFilter(selectedFilter);
                    collageContext.drawImage(img, 0, i * canvas.height, collageWidth, canvas.height);
                };
            }

            // When all images are drawn, enable downloading
            setTimeout(() => {
                const dataUrl = collageCanvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'photo-booth-collage.png';
                link.click();
            }, 1000); // Delay to ensure images are drawn properly
        }
    }
});

// Set canvas size based on video size
video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

// Get canvas filter based on user selection
function getCanvasFilter(filter) {
    switch (filter) {
        case 'sepia':
            return 'sepia(1)';
        case 'grayscale':
            return 'grayscale(1)';
        case 'invert':
            return 'invert(1)';
        default:
            return 'none';
    }
}
