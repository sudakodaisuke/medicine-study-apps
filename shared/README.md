# Shared

このフォルダは共通素材の原本です。

- `assets/`: キャラクター、背景、ゲーム画像、音声、アイコン

各アプリの `assets/` はここから自動コピーされます。

```bash
node scripts/copy-shared.js syoni
node scripts/copy-shared.js kokushi
```

`apps/*/assets` 側は編集しないでください。
