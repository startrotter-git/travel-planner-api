# Travel Planner API Server

Google Maps APIのプロキシサーバー

## デプロイ手順（Render.com）

### 1. Renderでプロジェクトを作成

1. [Render.com](https://render.com)にサインアップ
2. 「New +」→「Web Service」を選択
3. 「Build and deploy from a Git repository」を選択
4. このリポジトリを接続

### 2. 設定

- **Name**: `travel-planner-api`（任意）
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3. 環境変数の設定

Environment Variablesに以下を追加：

```
GOOGLE_MAPS_API_KEY=あなたのGoogle Maps APIキー
```

### 4. デプロイ

「Create Web Service」をクリックしてデプロイ開始

デプロイ完了後、URLが表示されます（例：https://travel-planner-api.onrender.com）

## ローカルでの実行

```bash
npm install
npm start
```

## 使用しているGoogle Maps API

- Places API (Text Search)
- Places API (Place Details)
- Directions API
- Distance Matrix API

これらのAPIをGoogle Cloud Consoleで有効にしてください。
