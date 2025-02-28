// Access video element and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const saveButton = document.getElementById('save');
const photosContainer = document.getElementById('photos');
const context = canvas.getContext('2d');
const instructionText = document.getElementById('instruction');

let capturedPhotos = [];  // Store the captured images
let photoCount = 0;       // Keep track of how many photos are taken

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

        // Draw the three images vertically on the new canvas
        for (let i = 0; i < 3; i++) {
            const img = new Image();
            img.src = capturedPhotos[i];
            img.onload = function() {
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
});

// Set canvas size based on video size
video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});
