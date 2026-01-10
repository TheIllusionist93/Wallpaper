const { createCanvas } = require('canvas');
const fs = require('fs');

// Datum berechnen
const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay) + 1;
const year = now.getFullYear();
const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
const daysInYear = isLeap ? 366 : 365;
const daysLeft = daysInYear - dayOfYear;
const percentage = Math.round((dayOfYear / daysInYear) * 100);

// Canvas erstellen
const canvas = createCanvas(1170, 2532);
const ctx = canvas.getContext('2d');

// Hintergrund
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 1170, 2532);

// Grid Setup
const cols = 21;
const dotSize = 16;
const spacing = 44;
const gridWidth = (cols - 1) * spacing + dotSize;
const startX = (1170 - gridWidth) / 2;
const startY = 400;

// Punkte zeichnen
for (let i = 0; i < daysInYear; i++) {
  const row = Math.floor(i / cols);
  const col = i % cols;
  
  const x = startX + col * spacing + dotSize / 2;
  const y = startY + row * spacing + dotSize / 2;

  ctx.beginPath();
  ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);

  if (i < dayOfYear - 1) {
    ctx.fillStyle = '#ffffff';
  } else if (i === dayOfYear - 1) {
    ctx.fillStyle = '#ff6b35';
  } else {
    ctx.fillStyle = '#333333';
  }
  
  ctx.fill();
}

// Text unten
ctx.fillStyle = '#ff6b35';
ctx.font = 'bold 72px Arial';
ctx.textAlign = 'center';
ctx.fillText(`${daysLeft}d left`, 585, 2282);

ctx.fillStyle = '#666666';
ctx.font = '48px Arial';
ctx.fillText(`${percentage}%`, 585, 2362);

ctx.fillStyle = '#444444';
ctx.font = 'bold 40px Arial';
ctx.fillText(year.toString(), 585, 2452);

// Als PNG speichern
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('wallpaper.png', buffer);

console.log('Wallpaper generated successfully!');
console.log(`Day ${dayOfYear} of ${daysInYear} - ${daysLeft} days left (${percentage}%)`);
