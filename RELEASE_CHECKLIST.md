# 公開前チェックリスト

このファイルは、花札ゲームを公開・販売・広告収益化する前の確認用チェックリストです。

法的な最終判断そのものではなく、実務上の公開前確認として使ってください。

---

## A. リリース停止レベル

- [ ] 画像の出所を説明できる
- [ ] 任天堂製カード画像のスキャンや写真を使っていない
- [ ] 画像ライセンスを README、ゲーム内、販売ページで明記している
- [ ] 最終タイトル名を J-PlatPat で検索した
- [ ] 配布物に必要な画像アセットが含まれている
- [ ] 配布物にライセンス情報が追える導線がある

---

## B. 画像ライセンス

- [ ] 使用画像の元ページ URL を控えている
- [ ] 作者名を控えている
- [ ] ライセンス名を控えている
- [ ] ライセンス URL を控えている
- [ ] PNG化、縮小、色変更、トリミングなどをした場合は「改変あり」と書く
- [ ] 画像由来部分に CC BY-SA 4.0 がかかる前提を理解している
- [ ] 配布時に第三者が再利用条件を確認できるようにしている

---

## C. 表記文言

- [ ] README に「コードは MIT」と「画像は CC BY-SA 4.0」を分けて書く
- [ ] ゲーム内クレジットに作者名、ライセンス名、リンクを置く
- [ ] itch.io 説明欄にも同じ内容を書く
- [ ] 改変したなら `Original by ... / modified by ...` 相当の表記を入れる
- [ ] 「任天堂公式素材使用」のような誤認表現を書かない
- [ ] 「任天堂公認」「公式準拠」などの表現を使わない

---

## D. タイトル・名称

- [ ] `花札` を使う場合は最終タイトル全体を J-PlatPat で確認する
- [ ] `こいこい` を使う場合も同様に確認する
- [ ] ロゴ化したタイトル案も別途確認する
- [ ] 既存有名タイトルに近すぎる名称を避ける
- [ ] 説明文で「伝統的な花札ゲーム」と書くのは可
- [ ] 「任天堂の花札」と誤認される書き方は避ける

---

## E. ゲーム内容

- [ ] 実装ルールと説明文が一致している
- [ ] 「任天堂ルール」と書くなら実装差分を潰す
- [ ] 一致していないなら「本作独自ルールを含みます」と明記する
- [ ] 役一覧、得点、倍付条件を画面と説明文で一致させる

---

## F. GitHub 公開

- [ ] リポジトリに `LICENSE` を置く
- [ ] 画像ライセンスを README に追記する
- [ ] 素材出所リンクを残す
- [ ] 再配布条件が読めるようにする
- [ ] 公開物に第三者権利物が混ざっていないか再確認する

---

## G. itch.io 販売

- [ ] ZIP 内に `index.html` だけでなく必要アセットも含める
- [ ] itch.io 説明文に画像クレジットを書く
- [ ] 商用利用可能ライセンスであることを再確認する
- [ ] 購入者が素材条件を確認できる導線を用意する
- [ ] タイトル、サムネ、説明文で他社公式作と誤認させない

---

## H. 広告・収益化

- [ ] AdSense 導入前に著作権表記を整える
- [ ] 権利侵害素材がない状態にする
- [ ] 広告クリック誘導をしない
- [ ] プレイ妨害レベルの広告配置をしない
- [ ] 子ども向けに見える場合は広告ポリシーも確認する

---

## I. このリポジトリで今すぐ確認すべき点

- [ ] [`DEPLOY.md`](/Users/sasayuta/Documents/花札/DEPLOY.md) の ZIP 手順
- [ ] [`README.md`](/Users/sasayuta/Documents/花札/README.md) のライセンス表記
- [ ] [`index.html`](/Users/sasayuta/Documents/花札/index.html) の画像クレジット
- [ ] [`index.html`](/Users/sasayuta/Documents/花札/index.html) のこいこい得点処理
- [ ] [`index.html`](/Users/sasayuta/Documents/花札/index.html) の取得札ラベル

---

## 最終 Go 判断

- [ ] A がすべて OK
- [ ] B〜H に重大な未確認がない
- [ ] タイトル商標検索が終わっている

---

## 参考リンク

- [文化庁 FAQ](https://www.bunka.go.jp/seisaku/chosakuken/kaizoku/faq.html)
- [特許庁: 出願しても登録にならない商標](https://www.jpo.go.jp/system/trademark/shutugan/tetuzuki/mitoroku.html)
- [任天堂: 花札の歴史・遊びかた](https://www.nintendo.com/jp/others/hanafuda_kabufuda/howtoplay/index.html)
- [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- [Wikimedia Commons 再利用ガイド](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
