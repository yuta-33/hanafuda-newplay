# デプロイ手順書

最終確認日：2026-03-31

---

## 事前チェックリスト

デプロイ前に以下をブラウザで確認してください。

- [ ] `index.html` をブラウザで直接開き、ゲームが起動する
- [ ] 2人モードでゲーム開始〜終了まで通しプレイできる
- [ ] カードフリップアニメーションが正常に動く
- [ ] マッチ時のゴールドグローが表示される
- [ ] ミス時のシェイクアニメーションが表示される
- [ ] ターン交代オーバーレイが表示され、タップで閉じられる
- [ ] 「役一覧」ボタンでモーダルが開閉できる
- [ ] 結果画面で役が正しく表示される
- [ ] スマートフォン幅（375px）でレイアウトが崩れない
- [ ] タブレット幅（768px）でレイアウトが問題ない

---

## STEP 1 — GitHub リポジトリ作成

```bash
# プロジェクトフォルダに移動
cd /Users/sasayuta/Documents/花札

# Git 初期化
git init
git add index.html README.md REQUIREMENTS.md .gitignore
git commit -m "feat: 花札神経衰弱 v1.0.0 初回リリース"

# GitHub でリポジトリを新規作成後（例: hanafuda-memory）
git remote add origin https://github.com/YOUR_USERNAME/hanafuda-memory.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — 自前サイト（Netlify）へデプロイ

### 方法A：ドラッグ＆ドロップ（最速）

1. [app.netlify.com](https://app.netlify.com/) にサインイン
2. 「Sites」→「Add new site」→「Deploy manually」
3. `花札` フォルダ全体をドラッグ＆ドロップ
4. URLが即時発行される（例: `https://hanafuda-memory-xxxx.netlify.app`）

### 方法B：GitHub 連携（自動デプロイ）

1. Netlify で「Add new site」→「Import an existing project」
2. GitHub を選択 → `hanafuda-memory` リポジトリを選択
3. Build command: 空欄のまま
4. Publish directory: `.`（ルートディレクトリ）
5. 「Deploy site」をクリック
6. 以降は `git push` するたびに自動デプロイ

### 独自ドメイン設定（任意）

```
Netlify → Domain settings → Add custom domain
例: hanafuda.yourdomain.com
```

---

## STEP 3 — itch.io へゲームを公開

### ZIPファイルの作成

```bash
cd /Users/sasayuta/Documents/花札

# 以前のZIPがあれば削除
rm -f hanafuda-memory.zip

# index.html をルート直下に保ったまま、必要アセットとライセンス文書をまとめる
zip -r hanafuda-memory.zip index.html assets LICENSE THIRD_PARTY_NOTICES.md
```

> **重要**: `index.html` は ZIP のルート直下に置くこと。
> `assets/` は `index.html` と同じ階層に入っていれば問題ありません。
> 画像素材を使うため、`assets/` とライセンス文書も一緒に含めてください。

### itch.io アップロード手順

1. [itch.io/game/new](https://itch.io/game/new) にアクセス
2. 以下の設定を行う：

| 項目 | 設定値 |
|------|--------|
| Title | 花札神経衰弱 / Hanafuda Memory |
| Project URL | `hanafuda-memory`（任意のスラッグ） |
| Kind of project | **HTML** |
| Classification | Games |
| Genre | Card Game |
| Release status | Released |
| Pricing | **No payments** → Donations enabled（Pay What You Want） |

3. 「Uploads」セクション:
   - `hanafuda-memory.zip` をアップロード
   - ✅「**This file will be played in the browser**」にチェック
   - Embed options: Width `820`, Height `960`
   - ✅「**Mobile friendly**」にチェック

4. Description 欄に `itch-description.md` の内容を貼り付け

5. Tags 欄に以下を入力:
   ```
   hanafuda, card-game, memory-game, japanese, browser-game,
   html5, tabletop, casual, multiplayer, pass-and-play
   ```

6. Cover image（630×500px）をアップロード

7. Screenshots（3〜5枚）をアップロード

8. 「**Save & view page**」で確認後、問題なければ **「Publish」**

> **注意**: 公開すると「Most Recent」一覧の上位に表示されます。
> 公開前にページの見た目（タイトル・説明文・画像）を必ず整えておくこと。

---

## STEP 4 — README の URL 更新

デプロイ完了後、`README.md` の以下の箇所を実際のURLに更新してください。

```markdown
- **itch.io**: https://YOUR_USERNAME.itch.io/hanafuda-memory
- **ポートフォリオ**: https://hanafuda-memory-xxxx.netlify.app
```

---

## ファイル最終構成

```
花札/
├── index.html              ← ゲーム本体（これ1つが製品）
├── README.md               ← GitHub 用説明
├── REQUIREMENTS.md         ← 要件定義書
├── DEPLOY.md               ← 本ファイル（デプロイ手順）
├── itch-description.md     ← itch.io 説明文の下書き
├── .gitignore
└── （hanafuda-memory.zip）← itch.io 用、Git管理外
```

---

## バージョン管理ルール

| バージョン | タイミング |
|-----------|-----------|
| v1.0.0 | 初回リリース（現在） |
| v1.0.x | バグ修正 |
| v1.1.0 | アニメーション・UI改善 |
| v1.2.0 | 効果音追加 |
| v2.0.0 | 大幅な機能追加（CPU対戦など） |

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| itch.io でゲームが表示されない | ZIPの構造が間違っている | `index.html` がZIPのルートに存在するか確認 |
| カードがめくれない | ブラウザのJSが無効 | JavaScript を有効にして再読み込み |
| アニメーションが動かない | 古いブラウザ | Chrome/Firefox/Safari の最新版を使用 |
| スマホでカードが小さすぎる | 画面幅が極端に狭い | 横向き（landscape）で試す |
