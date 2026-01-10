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
const percentage = Math.round((dayOfYear / daysInYear) * 100);

// Canvas erstellen
const canvas = createCanvas(1170, 2532);
const ctx = canvas.getContext('2d');

// Heller Hintergrund (cremeweiß/beige)
ctx.fillStyle = '#f5f5f0';
ctx.fillRect(0, 0, 1170, 2532);

// Grid Setup - zentriert in der Mitte des Bildschirms
const cols = 21;
const dotSize = 14;
const spacing = 42;
const gridWidth = (cols - 1) * spacing + dotSize;
const gridHeight = 17 * spacing + dotSize;
const startX = (1170 - gridWidth) / 2;
const startY = (2532 - gridHeight) / 2 - 50; // Leicht nach oben für bessere Zentrierung

// Punkte zeichnen
for (let i = 0; i < daysInYear; i++) {
  const row = Math.floor(i / cols);
  const col = i % cols;
  
  const x = startX + col * spacing + dotSize / 2;
  const y = startY + row * spacing + dotSize / 2;

  ctx.beginPath();
  ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);

  if (i < dayOfYear - 1) {
    // Vergangene Tage - dunkelgrau
    ctx.fillStyle = '#2d2d2d';
  } else if (i === dayOfYear - 1) {
    // Heutiger Tag - schönes Grün
    ctx.fillStyle = '#4ade80';
  } else {
    // Zukünftige Tage - sehr hell
    ctx.fillStyle = '#d4d4d4';
  }
  
  ctx.fill();
}

// Fortschrittsbalken (optional - minimalistisch)
const barWidth = gridWidth;
const barHeight = 4;
const barX = startX;
const barY = startY + gridHeight + 40;

// Hintergrund des Balkens
ctx.fillStyle = '#e5e5e5';
ctx.fillRect(barX, barY, barWidth, barHeight);

// Fortschritt des Balkens
ctx.fillStyle = '#4ade80';
ctx.fillRect(barX, barY, (barWidth * percentage) / 100, barHeight);

// Jahr unten - dezent
ctx.fillStyle = '#9ca3af';
ctx.font = '32px Arial';
ctx.textAlign = 'center';
ctx.fillText(year.toString(), 585, barY + 60);

// Als PNG speichern
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('wallpaper.png', buffer);

console.log('Wallpaper generated successfully!');
console.log(`Day ${dayOfYear} of ${daysInYear} - ${percentage}% complete`);
