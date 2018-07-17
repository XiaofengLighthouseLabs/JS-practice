const canvas = document.getElementById('photo');
const fileInput = document.querySelector('input[type="file"]');
const asciiImage = document.getElementById('ascii');

const ctx = canvas.getContext('2d');

function grayScale(r, g, b){
  return 0.21 * r + 0.72 * g + 0.07 * b;
}

function convertGray (ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const grayScales = [];
  console.log(imageData.data);
  for (let i = 0; i < imageData.data.length; i += 4){
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const gray = grayScale(r, g, b);
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = gray;
    grayScales.push(gray);

  }
  return grayScales;
}

const maxWidth = 120;
const maxHeight = 120;

function modifyPic (width, height){
  if(height > maxHeight){
    const modifyWidth = Math.floor(width * maxHeight / height);
    return [modifyWidth, maxHeight];
  }
    if(width > maxWidth){
    const modifyHeighth = Math.floor(height * maxWidth / width);
    return [maxWidth, modifyHeighth];
  }
  return [width, height];
}

const grayNote = ' @.'
const noteLength = grayNote.length;

function getNoteforGray (gray){
  return grayNote[Math.ceil((noteLength - 1) * gray / 255)];
}

function drawAscii(grayScales, width){
  const ascii = grayScales.reduce((asciiImage, gray, index)=>{
    let nextNote = getNoteforGray(gray);
    if((index + 1) % width === 0){
      nextNote += '\n';
    }
    return asciiImage + nextNote;
  }, '');
  asciiImage.textContent = ascii;
}

fileInput.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
     const image = new Image();
     image.onload = () => {
      const [width, height] = modifyPic(image.width, image.height);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      grayScales = convertGray(ctx, width, height);
      drawAscii(grayScales, width);
     }
     image.src = event.target.result;
  }
  reader.readAsDataURL(file);
}





