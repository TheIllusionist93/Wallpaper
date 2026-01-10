const { createCanvas } = require('canvas');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════
// 🎨 KONFIGURATIONS-BEREICH - HIER KANNST DU ALLES ANPASSEN
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  // Farben
  colors: {
    background: '#f5f5f0',      // Hintergrundfarbe (cremeweiß)
    pastDays: '#2d2d2d',         // Vergangene Tage (dunkelgrau)
    today: '#4ade80',            // Heutiger Tag (grün)
    futureDays: '#d4d4d4',       // Zukünftige Tage (hellgrau)
    progressBar: '#4ade80',      // Fortschrittsbalken (grün)
    progressBarBg: '#e5e5e5',    // Fortschrittsbalken Hintergrund
    year: '#9ca3af',             // Jahreszahl (grau)
  },
  
  // Punkte
  dots: {
    size: 14,                    // Größe der Punkte (in Pixel)
    spacing: 42,                 // Abstand zwischen Punkten
    columns: 21,                 // Anzahl Spalten
  },
  
  // Position (vertikal)
  position: {
    verticalOffset: +100,         // Verschiebung nach oben (-) oder unten (+)
  },
  
  // Fortschrittsbalken
  progressBar: {
    show: true,                  // true = anzeigen, false = verstecken
    height: 4,                   // Höhe des Balkens
    distanceFromDots: 40,        // Abstand zu den Punkten
  },
  
  // Jahreszahl
  yearLabel: {
    show: true,                  // true = anzeigen, false = verstecken
    fontSize: 32,                // Schriftgröße
    distanceFromBar: 60,         // Abstand zum Fortschrittsbalken
  },
};

// ═══════════════════════════════════════════════════════════════════
// 🔧 AB HIER MUSST DU NICHTS MEHR ÄNDERN
// ═══════════════════════════════════════════════════════════════════

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

// Hintergrund
ctx.fillStyle = CONFIG.colors.background;
ctx.fillRect(0, 0, 1170, 2532);

// Grid berechnen
const cols = CONFIG.dots.columns;
const dotSize = CONFIG.dots.size;
const spacing = CONFIG.dots.spacing;
const gridWidth = (cols - 1) * spacing + dotSize;
const gridHeight = Math.ceil(daysInYear / cols) * spacing;
const startX = (1170 - gridWidth) / 2;
const startY = (2532 - gridHeight) / 2 + CONFIG.position.verticalOffset;

// Punkte zeichnen
for (let i = 0; i < daysInYear; i++) {
  const row = Math.floor(i / cols);
  const col = i % cols;
  
  const x = startX + col * spacing + dotSize / 2;
  const y = startY + row * spacing + dotSize / 2;

  ctx.beginPath();
  ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);

  if (i < dayOfYear - 1) {
    ctx.fillStyle = CONFIG.colors.pastDays;
  } else if (i === dayOfYear - 1) {
    ctx.fillStyle = CONFIG.colors.today;
  } else {
    ctx.fillStyle = CONFIG.colors.futureDays;
  }
  
  ctx.fill();
}

// Fortschrittsbalken (optional)
if (CONFIG.progressBar.show) {
  const barWidth = gridWidth;
  const barHeight = CONFIG.progressBar.height;
  const barX = startX;
  const barY = startY + gridHeight + CONFIG.progressBar.distanceFromDots;

  // Hintergrund
  ctx.fillStyle = CONFIG.colors.progressBarBg;
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Fortschritt
  ctx.fillStyle = CONFIG.colors.progressBar;
  ctx.fillRect(barX, barY, (barWidth * percentage) / 100, barHeight);
  
  // Jahreszahl (optional)
  if (CONFIG.yearLabel.show) {
    ctx.fillStyle = CONFIG.colors.year;
    ctx.font = `${CONFIG.yearLabel.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(year.toString(), 585, barY + CONFIG.yearLabel.distanceFromBar);
  }
} else if (CONFIG.yearLabel.show) {
  // Falls kein Balken, aber Jahr gewünscht
  const barY = startY + gridHeight + CONFIG.progressBar.distanceFromDots;
  ctx.fillStyle = CONFIG.colors.year;
  ctx.font = `${CONFIG.yearLabel.fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(year.toString(), 585, barY);
}

// Als PNG speichern
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('wallpaper.png', buffer);

console.log('✅ Wallpaper generated successfully!');
console.log(`📅 Day ${dayOfYear} of ${daysInYear} (${percentage}% complete)`);
console.log(`🎨 Colors: Background=${CONFIG.colors.background}, Today=${CONFIG.colors.today}`);
