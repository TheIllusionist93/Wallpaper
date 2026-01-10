import { ImageResponse } from '@vercel/og';

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

  const dots = [];
  for (let i = 0; i < daysInYear; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * spacing;
    const y = startY + row * spacing;
    
    let color;
    if (i < dayOfYear - 1) {
      color = '#ffffff';
    } else if (i === dayOfYear - 1) {
      color = '#ff6b35';
    } else {
      color = '#333333';
    }
    
    dots.push({ x, y, color });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000',
          position: 'relative',
        }}
      >
        {dots.map((dot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: dot.x,
              top: dot.y,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dot.color,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: 250,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#ff6b35',
            }}
          >
            {daysLeft}d left
          </div>
          <div
            style={{
              fontSize: 48,
              color: '#666',
              marginTop: 20,
            }}
          >
            {percentage}%
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              color: '#444',
              marginTop: 30,
            }}
          >
            {year}
          </div>
        </div>
      </div>
    ),
    {
      width: 1170,
      height: 2532,
    }
  );
}
