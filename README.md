# Thang's Dev Profile ⚡

Dashboard phát triển năng lực cá nhân — phân tích bởi Claude AI.

## Cấu trúc

```
├── public/
│   ├── data.json       ← 🔥 FILE DUY NHẤT CẦN CẬP NHẬT
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   └── App.jsx          ← UI, fetch data từ /data.json
├── index.html
└── package.json
```

## Cách cập nhật hàng ngày

1. Chat với Claude AI trên [claude.ai](https://claude.ai) → yêu cầu đánh giá lại
2. Claude xuất file `data.json` mới
3. Vào GitHub → `public/data.json` → ✏️ Edit → Paste → Commit
4. Vercel tự deploy (30 giây)

**Không cần sửa code. Chỉ thay `data.json`.**

## Local dev

```bash
npm install
npm run dev
```

## Deploy Vercel

Import repo từ GitHub → Framework: Vite → Deploy.
