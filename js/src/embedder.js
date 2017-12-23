import random from 'seed-random';
const seed = 42;

const generateIndices = (seed, length, range) => {
  const indices = [];
  const r = random(seed);
  for (let i = 0; i < length; i++) {
    // the min 8 reserves the first 8 red LSBs for the header (msg length)
    const index = Math.floor(r() * (range - 8) + 8) * 4;
    indices.push(index);  
  };
  return indices;
};

const embedByte = (byte, imageData, indices) => {
  for (let i = 7; i >= 0; i--) {
    const shiftByte = byte >>> i;
    const currentBit = shiftByte & 1;
    const index = indices.shift();

    if (!currentBit) {
      imageData.data[index] &= ~0x01;
    } else {
      imageData.data[index] |= 0x01;
    }
  }
};

const embedHeader = (byte, imageData) => {
  const indices = [0, 4, 8, 12, 16, 20, 24, 28];
  embedByte(byte, imageData, indices);
};

export const embedDescription = (description, imageData) => {
  const messageLength = description.length;
  embedHeader(messageLength, imageData);

  const length = messageLength * 8;
  const range = imageData.data.length / 4; 
  const pixelIndices = generateIndices(seed, length, range);

  description.split('').forEach((char, i) => {
    const start = i * 8;
    const end = start + 8;
    const byteIndices = pixelIndices.slice(start, end);

    const byte = char.charCodeAt();
    embedByte(byte, imageData, byteIndices);
  });

  return imageData;
};

const extractByte = (imageData, indices) => {
  const byteString = indices.reduce((byte, i) => byte += imageData.data[i] & 1, '');
  const byteInt = parseInt(byteString, 2);

  return byteInt;
};

const extractHeader = (imageData) => {
  const indices = [0, 4, 8, 12, 16, 20, 24, 28];

  return extractByte(imageData, indices); 
};

export const getDescriptionLength = extractHeader;

export const extractDescription = (imageData) => {
  const messageLength = extractHeader(imageData);
  
  const length = messageLength * 8;
  const range = imageData.data.length / 4; 
  const pixelIndices = generateIndices(seed, length, range);
  const extraction = []; 

  for (let i = 0; i < messageLength; i++) {
    const start = i * 8;
    const end = start + 8;
    const byteIndices = pixelIndices.slice(start, end);
    const byte = extractByte(imageData, byteIndices);
    extraction.push(byte);
  };

  const charExtraction = extraction.map((b) => String.fromCharCode(b));

  return charExtraction.join('');
};


