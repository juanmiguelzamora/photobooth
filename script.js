// Access video element and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const saveButton = document.getElementById('save');
const photosContainer = document.getElementById('photos');
const context = canvas.getContext('2d');

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
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
});

// Save the photo when the 'Save Photo' button is clicked
saveButton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = dataUrl;
    photosContainer.appendChild(img);
    canvas.style.display = 'none';
});

// Set canvas size based on video size
video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});
