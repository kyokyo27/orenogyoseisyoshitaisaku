const CACHE_NAME = 'gyosei-app-v1';

// インストール時に最低限必要なファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

// ネットワークファースト戦略（オンラインなら最新を、オフラインならキャッシュを返す）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 通信に成功したら、最新のデータをキャッシュにも上書き保存しておく
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // 通信に失敗（オフライン等）した場合はキャッシュから返す
        return caches.match(event.request);
      })
  );
});