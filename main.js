// import * as faceapi from 'face-api.js';

const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
]).then(async () => {
    startVideo();
}).catch((error) => {
    console.log(error);
});

const startVideo = () => {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        error => console.log(error)
    )
}

video.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const results = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor()
        if (typeof results === 'undefined') return;
        // const resizedDetections = faceapi.resizeResults(results, displaySize);
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        const faceMatcher = new faceapi.FaceMatcher(results)
        const perfil = document.getElementById('perfil');
        const singleResult = await faceapi
            .detectSingleFace(perfil, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor()
        if (singleResult) {
            const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
            console.log(bestMatch)
        }
    }, 1000)
})