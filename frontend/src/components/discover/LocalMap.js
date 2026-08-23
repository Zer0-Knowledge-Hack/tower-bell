import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LoadingBlock } from '../common/LoadingBlock';
import { MAP_CENTER, merchantsForMap } from '../../utils/geo';
import { useThemeColors } from '../../utils/useThemeColors';

function buildMapHtml({ merchants, dark, selectedId }) {
  const places = merchantsForMap(merchants).map((m) => ({
    id: m.id,
    name: m.name,
    status: m.status || 'open',
    message: m.message || m.promotion || '',
    category: m.categoryLabel || m.category || '',
    lat: m.lat,
    lng: m.lng,
  }));

  const tile = dark
    ? {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attr: '&copy; OpenStreetMap &copy; CARTO',
      }
    : {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attr: '&copy; OpenStreetMap &copy; CARTO',
      };

  const payload = JSON.stringify({
    center: MAP_CENTER,
    places,
    tile,
    selectedId: selectedId || null,
    dark,
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { margin:0; height:100%; width:100%; background:${dark ? '#0B1220' : '#E8EEF7'}; }
    .leaflet-control-attribution { font-size:9px; }
    .you-marker {
      width:18px; height:18px; border-radius:50%;
      background:#54ADF6; border:3px solid #fff; box-shadow:0 0 0 6px rgba(84,173,246,.28);
    }
    .shop-marker {
      min-width:28px; height:28px; border-radius:14px; padding:0 8px;
      display:flex; align-items:center; justify-content:center;
      color:#fff; font:700 11px/1 system-ui,sans-serif;
      border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,.35);
      background:#0D47A1;
    }
    .shop-marker.open { background:#1F8A4C; }
    .shop-marker.closed { background:#C62828; }
    .shop-marker.active { transform:scale(1.12); box-shadow:0 0 0 4px rgba(84,173,246,.45); }
    .popup {
      font:600 13px/1.35 system-ui,sans-serif; color:${dark ? '#E8EEF7' : '#0A110F'};
    }
    .popup small { color:${dark ? '#8B95A8' : '#5B6475'}; font-weight:500; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const data = ${payload};
    const map = L.map('map', { zoomControl: true, attributionControl: true }).setView([data.center.lat, data.center.lng], 15);
    L.tileLayer(data.tile.url, { maxZoom: 19, attribution: data.tile.attr }).addTo(map);

    const youIcon = L.divIcon({ className: '', html: '<div class="you-marker"></div>', iconSize: [18,18], iconAnchor: [9,9] });
    L.marker([data.center.lat, data.center.lng], { icon: youIcon })
      .addTo(map)
      .bindPopup('<div class="popup"><b>You are here</div>');

    const bounds = [[data.center.lat, data.center.lng]];
    data.places.forEach((p) => {
      const active = data.selectedId && data.selectedId === p.id ? ' active' : '';
      const cls = 'shop-marker ' + (p.status || 'open') + active;
      const icon = L.divIcon({
        className: '',
        html: '<div class="' + cls + '">' + (p.name || '?').slice(0,1).toUpperCase() + '</div>',
        iconSize: [28,28],
        iconAnchor: [14,14]
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup(
        '<div class="popup"><b>' + p.name + '</b><br/><small>' +
        (p.category || '') + ' · ' + (p.status || '') + '</small><br/>' +
        (p.message || '') + '</div>'
      );
      marker.on('click', function () {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: p.id }));
        } else if (window.parent) {
          window.parent.postMessage(JSON.stringify({ type: 'select', id: p.id }), '*');
        }
      });
      bounds.push([p.lat, p.lng]);
    });

    if (bounds.length > 1) {
      try { map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 }); } catch (e) {}
    }

    setTimeout(function () { map.invalidateSize(); }, 120);
  </script>
</body>
</html>`;
}

export function LocalMap({ merchants = [], selectedId, onSelect, height = 320 }) {
  const c = useThemeColors();
  const dark = c.mapTile === 'dark';
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const html = useMemo(
    () => buildMapHtml({ merchants, dark, selectedId }),
    [merchants, dark, selectedId]
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    const onMessage = (event) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : '';
        if (!raw || raw[0] !== '{') return;
        const msg = JSON.parse(raw);
        if (msg.type === 'select' && onSelect) {
          const found = merchants.find((m) => m.id === msg.id);
          if (found) onSelect(found);
        }
      } catch {
        // ignore foreign messages
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [merchants, onSelect]);

  const onNativeMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'select' && onSelect) {
        const found = merchants.find((m) => m.id === msg.id);
        if (found) onSelect(found);
      }
    } catch {
      // ignore
    }
  };

  return (
    <View style={[styles.shell, { height, borderColor: c.border, backgroundColor: c.panel }]}>
      {loading ? (
        <View style={styles.loader}>
          <LoadingBlock compact label="Loading local map (OpenStreetMap)..." />
        </View>
      ) : null}

      {Platform.OS === 'web' ? (
        // eslint-disable-next-line react/no-unknown-property
        <iframe
          ref={iframeRef}
          title="Towerbell local map"
          srcDoc={html}
          style={styles.frame}
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <NativeMap html={html} onMessage={onNativeMessage} />
      )}
    </View>
  );
}

function NativeMap({ html, onMessage }) {
  try {
    // Lazy require so web bundle never hard-fails if webview is missing.
    // eslint-disable-next-line global-require
    const { WebView } = require('react-native-webview');
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={onMessage}
        style={styles.frame}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        setSupportMultipleWindows={false}
      />
    );
  } catch {
    return (
      <View style={styles.frame}>
        <LoadingBlock label="Install react-native-webview for the native map" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  frame: { flex: 1, width: '100%', height: '100%', borderWidth: 0 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(11,18,32,0.35)',
  },
});
