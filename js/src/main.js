import { embedDescription, extractDescription, getDescriptionLength } from './embedder.js';

const originalImageElement = document.getElementById('original');
const embeddedImageElement = document.getElementById('embedded');

const form = document.querySelector('form');
const exampleSelect = document.getElementById('exampleSelect');
const fileButton = form.querySelector('form button');
const fileInput = form.querySelector('input[type="file"]');
const fileName = document.getElementById('filename');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const exampleImages = {
  cats: {
    imagePath: 'images/cats.jpg',
    altText: 'two maine coon cats posing in front of a blue background'
  },
  bird: {
    imagePath: 'images/bird.jpg',
    altText: 'a small bird standing on a cherry blossom tree branch'
  },
  coffee: {
    imagePath: 'images/coffee.jpg',
    altText: 'a cup of coffee on a table in front of a hand writing in a notebook'
  }
};

const loadImage = async (url) => {
  const response = await fetch(url).catch(console.error);
  const blob = await response.blob();
  const objectURL = URL.createObjectURL(blob);
  return objectURL;
};

const drawImage = (url) => {
  return new Promise((resolve, reject) => {
    originalImageElement.onload = () => {
      canvas.height = originalImageElement.naturalHeight;
      canvas.width = originalImageElement.naturalWidth;
      context.drawImage(originalImageElement, 0, 0); 
      resolve();
    }
    originalImageElement.src = url;
  });
};

const run = async (imagePath, altText) => {
  let imageDataURL;
  if (typeof imagePath === 'string') {
    imageDataURL = await loadImage(imagePath).catch(console.error);
  } else {
    imageDataURL = imagePath;
  }
  await drawImage(imageDataURL);

  const [w, h] = [originalImageElement.naturalHeight, originalImageElement.naturalWidth];
  const imageData = context.getImageData(0, 0, w, h);

  const embeddedImageData = embedDescription(altText, imageData);
  context.putImageData(embeddedImageData, 0, 0); 
  canvas.toBlob((blob) => embeddedImageElement.src = URL.createObjectURL(blob));

  const extraction = extractDescription(embeddedImageData);
  embeddedImageElement.setAttribute('alt', extraction);
  
  console.log('description length:', getDescriptionLength(embeddedImageData));
  console.log('extracted description:', extraction);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const altText = event.target.querySelector('input[type="text"]').value;
  const files = event.target.querySelector('input[type="file"]').files;
  const dataURL = URL.createObjectURL(files[0]);
  run(dataURL, altText);
});

fileButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  fileName.textContent = file.name;
});

exampleSelect.addEventListener('change', (event) => {
  const example = exampleImages[event.target.value];
  run(example.imagePath, example.altText);
});

run(exampleImages.cats.imagePath, exampleImages.cats.altText);

