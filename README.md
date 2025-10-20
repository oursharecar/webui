# OurShareCar UI

OurShareCarフロントエンドはViteで構築されたVue 3のシングルページアプリケーションで、世帯が共有車両の利用状況を記録・管理できるようにします。UIは`../backend`が提供するREST APIを利用します。

## プロジェクトスクリプト

以下のコマンドは`odometer/ui`ディレクトリで実行してください。

- `npm install` – プロジェクトの依存関係をインストールします。
- `npm run dev` – Vite開発サーバーを`http://localhost:5173/`で起動し、ホットモジュールリプレースメントを有効にします。
- `npm run build` – 最適化された本番ビルドを`dist/`に出力します。
- `npm run preview` – 本番ビルドをローカルで配信し、スモークテストを行います。

## ディレクトリ概要

- `src/main.js` – エントリーポイント。`App.vue` を `#app` にマウントし、`router` を適用します。
- `src/router.js` – 画面遷移を定義する Vue Router の設定。
- `src/store.js` – アプリ全体で共有するリアクティブストア（ユーザー一覧の取得など）。
- `src/backend.js` – `ky` と Auth0 を用いた認可付きバックエンド API クライアント。
- `src/config.js` – 環境変数から読み込むバックエンド/認証設定。
- `src/components/` – UI コンポーネント群。`HomeView.vue`、`UserView.vue`、`FormView.vue`、`TripsOverview.vue`、`HistoryView.vue`、`Auth0Login.vue`、`Auth0CallbackHandler.vue` など。
- `src/utils/` – ユーティリティ。`date.js` など。
- `src/App.vue` – ルートコンポーネント。
- `src/style.css` – グローバルスタイル。
- `index.html` – Vite の HTML テンプレート。

## 設定

`src/config.js` は Vite の環境変数（`import.meta.env.*`）を通じてバックエンドURLと Auth0 設定を読み込みます。リポジトリにはローカル開発用の `.env` が同梱されており、次のデフォルト値を設定しています。

```
VITE_BACKEND_ENDPOINT=http://localhost:3000
VITE_AUTH0_DOMAIN=oursharecar-dev.jp.auth0.com
VITE_AUTH0_CLIENT_ID=0s9czDDre6SMV1pIgUWABd0Mu08ECKgR
VITE_AUTH0_AUDIENCE=https://backend.odometer.westelh.dev
```

別環境向けに値を変更する場合は `.env` を編集するか、`.env.production` などのファイルを作成してビルド時に利用してください。`VITE_AUTH0_REDIRECT_URI` を設定するとリダイレクト先をカスタマイズできます（未設定の場合は `window.location.origin + '/callback'` が使用されます）。Auth0 のアプリ設定では Allowed Callback URLs に `http://localhost:5173/callback` など、実際に利用するURIを登録してください。

## Docker イメージ

UI には `Dockerfile` が用意されており、ビルド済みアセットを nginx で配信します。

```
docker build \
  --build-arg VITE_BACKEND_ENDPOINT=https://api.example.com \
  --build-arg VITE_AUTH0_DOMAIN=tenant.auth0.com \
  --build-arg VITE_AUTH0_CLIENT_ID=abcdefgh12345678 \
  --build-arg VITE_AUTH0_AUDIENCE=https://api.example.com \
  --build-arg VITE_AUTH0_REDIRECT_URI=https://ui.example.com/callback \
  -t oursharecar-ui ./odometer/ui

docker run --rm -p 8080:80 oursharecar-ui
```

本番向けの認証設定が必要な場合は、ビルド前に `.env` を更新するか、上記のように `--build-arg` で `VITE_*` 変数を渡してください。（`VITE_AUTH0_REDIRECT_URI` は省略可能です。未指定の場合は `window.location.origin + '/callback'` を使用します。）

ローカルでバックエンドと連携する場合は、UIとバックエンドの両方のディレクトリで `npm run dev` を実行するか、Docker イメージを利用して UI を起動し、`.env` 内のエンドポイントをバックエンドに合わせて調整してください。

GitHub Actions では `UI Docker Image` ワークフローが `odometer/ui/Dockerfile` をビルドして GHCR へ push します。`dev` ブランチは `ui-staging` 環境、`main` ブランチは `ui-prod` 環境を使用するため、各環境に `VITE_BACKEND_ENDPOINT` などのシークレットを設定してください。

## 開発のヒント

- Vue Devtoolsブラウザー拡張機能を導入し、開発中にコンポーネント状態を確認しましょう。
- API契約の変更はルートディレクトリの`/README.md`にあるバックエンドドキュメントと必ず同期させてください。
- 大きなUI変更の前には`npm run build`を実行し、欠落したインポートやタイプミスなどのビルド時エラーを検出してください。
