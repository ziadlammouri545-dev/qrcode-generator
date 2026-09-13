# qr generator

Paste a link, get a QR PNG or SVG to download or share.

Live: https://qrcode-generator-lyart-three.vercel.app
Repo: https://github.com/ziadlammouri545-dev/qrcode-generator

## run

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## api

`GET /qr?text=<link>` returns a PNG. Also accepts `size`, `dark`, and `light` colors.

```sh
curl -o qr.png "http://localhost:3000/qr?text=https://github.com/ziadlammouri545-dev"
```

## test

```sh
npm test
```