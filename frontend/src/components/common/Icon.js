import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

function Feather({ children, size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export function Icon({ name, size = 20, color = '#F5F7FA', filled = false }) {
  if (filled && name === 'check-circle') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill={color} />
        <Path d="M8 12.5l2.4 2.4L16.5 9" fill="none" stroke="#0B0F14" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }
  if (filled && name === 'x-circle') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill={color} />
        <Path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="#0B0F14" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    );
  }

  const body = {
    compass: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
      </>
    ),
    signal: (
      <>
        <Path d="M2 20h.01" />
        <Path d="M7 20v-4" />
        <Path d="M12 20v-8" />
        <Path d="M17 20V8" />
        <Path d="M22 4v16" />
      </>
    ),
    wifi: (
      <>
        <Path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <Path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <Circle cx="12" cy="20" r="1" fill={color} />
      </>
    ),
    'credit-card': (
      <>
        <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <Line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
    cog: (
      <>
        <Circle cx="12" cy="12" r="3" />
        <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    radar: (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Circle cx="12" cy="12" r="6" />
        <Circle cx="12" cy="12" r="2" />
        <Path d="M12 12L19 8" />
      </>
    ),
    store: (
      <>
        <Path d="M3 9l1-4h16l1 4" />
        <Path d="M3 9h18v11H3z" />
        <Path d="M9 20v-6h6v6" />
      </>
    ),
    coffee: (
      <>
        <Path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <Line x1="6" y1="1" x2="6" y2="4" />
        <Line x1="10" y1="1" x2="10" y2="4" />
        <Line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
    restaurant: (
      <>
        <Path d="M4 3v8a2 2 0 0 0 2 2h1V3" />
        <Path d="M7 13v8" />
        <Path d="M16 3l1 6c0 2-1.5 3-3 3s-3-1-3-3l1-6" />
        <Path d="M14 12v9" />
      </>
    ),
    book: (
      <>
        <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
    'arrow-left': (
      <>
        <Line x1="19" y1="12" x2="5" y2="12" />
        <Polyline points="12 19 5 12 12 5" />
      </>
    ),
    x: (
      <>
        <Line x1="18" y1="6" x2="6" y2="18" />
        <Line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    edit: (
      <>
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <Polyline points="3 6 5 6 21 6" />
        <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <Path d="M10 11v6" />
        <Path d="M14 11v6" />
        <Path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    ),
    'check-circle': (
      <>
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    'x-circle': (
      <>
        <Circle cx="12" cy="12" r="10" />
        <Line x1="15" y1="9" x2="9" y2="15" />
        <Line x1="9" y1="9" x2="15" y2="15" />
      </>
    ),
    users: (
      <>
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    'arrow-down-left': (
      <>
        <Line x1="17" y1="7" x2="7" y2="17" />
        <Polyline points="17 17 7 17 7 7" />
      </>
    ),
    'arrow-up-right': (
      <>
        <Line x1="7" y1="17" x2="17" y2="7" />
        <Polyline points="7 7 17 7 17 17" />
      </>
    ),
    plus: (
      <>
        <Line x1="12" y1="5" x2="12" y2="19" />
        <Line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    send: (
      <>
        <Line x1="22" y1="2" x2="11" y2="13" />
        <Polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    download: (
      <>
        <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <Polyline points="7 10 12 15 17 10" />
        <Line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    shield: (
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    bell: (
      <>
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    moon: (
      <>
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </>
    ),
    sun: (
      <>
        <Circle cx="12" cy="12" r="5" />
        <Line x1="12" y1="1" x2="12" y2="3" />
        <Line x1="12" y1="21" x2="12" y2="23" />
        <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <Line x1="1" y1="12" x2="3" y2="12" />
        <Line x1="21" y1="12" x2="23" y2="12" />
        <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
    map: (
      <>
        <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <Line x1="8" y1="2" x2="8" y2="18" />
        <Line x1="16" y1="6" x2="16" y2="22" />
      </>
    ),
    list: (
      <>
        <Line x1="8" y1="6" x2="21" y2="6" />
        <Line x1="8" y1="12" x2="21" y2="12" />
        <Line x1="8" y1="18" x2="21" y2="18" />
        <Line x1="3" y1="6" x2="3.01" y2="6" />
        <Line x1="3" y1="12" x2="3.01" y2="12" />
        <Line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    terminal: (
      <>
        <Polyline points="4 17 10 11 4 5" />
        <Line x1="12" y1="19" x2="20" y2="19" />
      </>
    ),
  };

  const key = name === 'settings' || name === 'close' ? (name === 'settings' ? 'cog' : 'x') : name;
  return <Feather size={size} color={color}>{body[key] || <Circle cx="12" cy="12" r="9" />}</Feather>;
}
