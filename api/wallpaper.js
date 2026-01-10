export const config = {
  runtime: 'edge',
};

export default function handler() {
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

  const cols = 21;
  const dotSize = 16;
  const spacing = 44;
  const gridWidth = (cols - 1) * spacing + dotSize;
  const startX = (1170 - gridWidth) / 2;
  const startY = 400;

  let dots = '';
  for (let i = 0; i < daysInYear; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * spacing + dotSize / 2;
    const y = startY + row * spacing + dotSize / 2;
    
    let color;
    if (i < dayOfYear - 1) {
      color = '#ffffff';
    } else if (i === dayOfYear - 1) {
      color = '#ff6b35';
    } else {
      color = '#333333';
    }
    
    dots += `<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="${color}"/>`;
  }

  const svg = `<svg width="1170" height="2532" xmlns="http://www.w3.org/2000/svg">
  <rect width="1170" height="2532" fill="#000000"/>
  ${dots}
  <text x="585" y="2282" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="#ff6b35" text-anchor="middle">${daysLeft}d left</text>
  <text x="585" y="2362" font-family="Arial,sans-serif" font-size="48" fill="#666666" text-anchor="middle">${percentage}%</text>
  <text x="585" y="2452" font-family="Arial,sans-serif" font-size="40" font-weight="bold" fill="#444444" text-anchor="middle">${year}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
