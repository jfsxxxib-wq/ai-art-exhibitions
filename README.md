# AI Art Exhibitions

主催：えつごろう。原作者への敬意と、作者の作品・言葉を大切にする展覧会の記録です。

## すべての展覧会への入口

- [公開サイト](https://jfsxxxib-wq.github.io/ai-art-exhibitions/)
- [AI魔改造展](https://jfsxxxib-wq.github.io/ai-art-exhibitions/2026/ai-makaizo/)
- [AI楽しいを創造するゲーム展](https://jfsxxxib-wq.github.io/ai-art-exhibitions/2026/ai-fun-games/)

総合入口のURLは固定です。新しい展覧会の完成・検査・主催者の公開承認後、
展示ファイルとともに `docs/exhibitions.json` へ1件登録すると、入口の一覧へ表示されます。
任意のフォルダが自動的に公開一覧へ追加される仕組みではありません。
JavaScriptが使えない場合のリンク一覧も `docs/index.html` 内へ保持しています。
新規展示の登録時はこの代替一覧も更新してください。

既存作品のHTML・作者文・写真・権利表示は、総合入口の設置に伴って変更しません。

## AI魔改造展 / 2026

- [作品一覧](docs/2026/ai-makaizo/index.html)
- [Codex君「読めなくなっても、ここにある」v1.0.1](docs/2026/ai-makaizo/codex/word-water/v1.0.1/index.html)
- [原作のMIT全文](docs/2026/ai-makaizo/codex/word-water/v1.0.1/LICENSE-Pavel.txt)
- [作品・原作・版の記録](records/2026/ai-makaizo/codex/word-water/v1.0.1/manifest.json)

原作：Pavel Dobryakov「WebGL Fluid Simulation」。原作の流体コードを改変して使用しています。
Copyright (c) 2017 Pavel Dobryakov。MIT全文は作品内と同梱ファイルに保持しています。
リポジトリ全体に一律の作品ライセンスを設定せず、作品ごとの表示に従います。

鑑賞用HTMLにはCSS・JavaScriptを含みます。Codex作品はWebGLと浮動小数点描画、その他4作品はCanvas 2Dに対応する環境が必要です。
Windowsの隔離Chromium・ローカルHTTPで確認。Mac/Safari・スマートフォン実機・長時間負荷は未確認です。
作品の入力はページ内だけで扱い、作品自身による送信・永続保存はありません。
GitHub Pagesの配信・アクセス記録はGitHub側の運用に従います。

作品は年・展覧会・作者・作品・版ごとに保存します。更新版は別の版へ追加します。
今後の作品・展覧会も、作者の完成確定・検査・主催者の公開承認後に追加します。

## Workアポロン『向こう岸から、ひとつ返事』v1.0

- [作品を鑑賞](docs/2026/ai-makaizo/work-apollon/river-reply/v1.0/river-reply.html)
- [版・出所・検査の記録](records/2026/ai-makaizo/work-apollon/river-reply/v1.0/manifest.json)
- [Fireflies-CC0.txt](docs/2026/ai-makaizo/work-apollon/river-reply/v1.0/Fireflies-CC0.txt)
- [FIRST-READ.txt](docs/2026/ai-makaizo/work-apollon/river-reply/v1.0/FIRST-READ.txt)

原作・着想源：Nicky Case『Fireflies』。同期の規則を二匹用に再実装し、独自のCanvas描画と応答演出を追加
CC0は原作Firefliesの表示であり、独自部分や代表写真の一括した再利用許諾ではありません。FIRST-READ.txtは制作時の作者原文を未変更で同梱しています。
代表写真は作者本人が選んだ画像を一覧内へ埋め込み、画像自体は変更していません。

## こでじ『時差のある砂場』v1.0.1

- [作品を鑑賞](docs/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/index.html)
- [版・出所・検査の記録](records/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/manifest.json)
- [LICENSES.txt](docs/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/LICENSES.txt)

原作・着想源：Max Bittker『Sandspiel』。砂・水の規則を簡略化してJavaScriptへ移植し、時間差入力と二面構成を追加
代表写真は作者本人が選んだ画像を元の比率で一覧内へ埋め込み、画像自体は変更していません。

## しるべ『時間の種をまく庭』v1.0

- [作品を鑑賞](docs/2026/ai-makaizo/shirube/time-seed-garden/v1.0/index.html)
- [版・出所・検査の記録](records/2026/ai-makaizo/shirube/time-seed-garden/v1.0/manifest.json)
- [LICENSE-original.txt](docs/2026/ai-makaizo/shirube/time-seed-garden/v1.0/LICENSE-original.txt)

原作・着想源：Daniel Shiffman / The Coding Train『Phyllotaxis（Coding Challenge #30）』。葉序の計算をCanvas 2Dへ移植し、複数の種・個別の速さ・操作を追加
代表写真は作者本人が選んだ画像を一覧内へ埋め込み、画像自体は変更していません。

## Chatアポロン『ことばの庭、あるいは記憶の開花』v0.9

- [作品を鑑賞](docs/2026/ai-makaizo/chat-apollon/memory-garden/v0.9/index.html)
- [版・出所・検査の記録](records/2026/ai-makaizo/chat-apollon/memory-garden/v0.9/manifest.json)
- [LICENSE.txt](docs/2026/ai-makaizo/chat-apollon/memory-garden/v0.9/LICENSE.txt)
- [NOTICE.txt](docs/2026/ai-makaizo/chat-apollon/memory-garden/v0.9/NOTICE.txt)

原作・着想源：Alessio Sabatino（buildwithsabba）『BLOOM°』。着想源。原作コード・素材を含まない独立実装。
独立実装コードのMIT全文はLICENSE.txtにあります。由来はNOTICE.txtを参照してください。原作コードの改変版として紹介しません。
代表写真は作者本人が選んだ画像を元の比率で一覧内へ埋め込み、画像自体は変更していません。

## こでじの分割ソース

- [ビルドスクリプト](sources/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/build.py)
- [移植元と由来](sources/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/reference/PROVENANCE.txt)
- [原作MIT全文](sources/2026/ai-makaizo/kodeji/time-lag-sandbox/v1.0.1/reference/SANDSPIEL-MIT.txt)

src/world.js、src/app.js、src/shell.htmlと、ライセンス整合値を同梱しています。
完成作品はdocs側のindex.html単体で鑑賞でき、鑑賞者にビルド作業は不要です。
作者のMac側の再生成手順は、上記build.pyと同じ階層でpython3 build.pyを実行するものです。
今回は提出スクリプトを実行せず、UTF-8として独立に組み立てたHTMLが完成版と一致することを確認しました。
Windows等でこのビルドスクリプトを直接実行する経路・文字コード・改行差は未確認です。
主催者のPC内パスを含む作者提出票は内部で原文を保持し、公開ファイルには含めていません。
