# Olivia Lin｜Portfolio

這是我的個人前端作品集，使用 Vue 3 + TypeScript + Vite + TailwindCSS 開發，使用 GSAP 製作動畫效果。

---

## 技術棧

- **框架**：Vue 3 + TypeScript  
- **打包工具**：Vite  
- **狀態管理**：Pinia
- **樣式**：TailwindCSS + SCSS  
- **動畫**：GSAP + ScrollTrigger  
- **圖示**：@fortawesome/vue-fontawesome  

---

## 安裝與運行

1. 下載專案或 clone：

```bash
git clone https://github.com/olivialin21/portfolio.git
cd portfolio
````

2. 安裝依賴：

```bash
npm install
```

3. 啟動開發環境：

```bash
npm run dev
```

4. 編譯與預覽生產版本：

```bash
npm run build
npm run preview
```

---

## 專案結構

```
portfolio/
├─ src/
│  ├─ components/        # Vue 組件
│  ├─ data/              # JSON / 靜態資料
│  ├─ assets/            # 圖片與樣式資源
│  ├─ sections/          # 頁面區塊或主要版面組件
│  ├─ stores/            # Pinia 狀態管理
│  ├─ App.vue
│  └─ main.ts
├─ public/
├─ vite.config.ts
└─ package.json

```