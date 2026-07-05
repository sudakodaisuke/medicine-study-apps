# 相棒・効果音アセット

画像や音声が未配置でも、アプリはプレースホルダーと短い代替音で動作します。
本番素材を追加すると自動的に差し替わります。

## 相棒画像

`assets/buddy/` に配置してください。

- `buddy-level-1.png` / `buddy-level-5.png` / `buddy-level-10.png`
- `otter-level-1.png` / `otter-level-5.png` / `otter-level-10.png`
- `quokka-level-1.png` / `quokka-level-5.png` / `quokka-level-10.png`
- `reactions/nupero/*.png`
- `reactions/mendacorn/*.png`
- `reactions/mojaram/*.png`
- `generated-sheets/nupero-sheet.png`
- `generated-sheets/mendacorn-sheet.png`
- `generated-sheets/mojaram-sheet.png`
- `reactions/kumori/*.png`
- `reactions/mocheri/*.png`
- `reactions/awarin/*.png`
- `generated-sheets/kumori-sheet.png`
- `generated-sheets/mocheri-sheet.png`
- `generated-sheets/awarin-sheet.png`
- `reactions/pukumaru/*.png`
- `reactions/rampuru/*.png`
- `generated-sheets/pukumaru-sheet.png`
- `generated-sheets/rampuru-sheet.png`
- `reactions/gubora/*.png`
- `reactions/enkira/*.png`
- `generated-sheets/gubora-sheet.png`
- `generated-sheets/enkira-sheet.png`
- `reactions/zangar/*.png`
- `reactions/pendor/*.png`
- `reactions/hakomon/*.png`
- `reactions/babuzenshi/*.png`
- `reactions/milano-auntie/*.png`
- `reactions/chinanago/*.png`
- `reactions/anagochin/*.png`
- `reactions/tanpanman/*.png`
- `reactions/menrikyu/*.png`
- `reactions/shodoku-taishi/*.png`
- `reactions/ponmori/*.png`
- `reactions/sakabambaspis/*.png`
- `reactions/fuwapape-sun/*.png`
- `reactions/tibetan-fox/*.png`
- `reactions/hedgehog/*.png`
- `reactions/gachi-kuma/*.png`
- `reactions/kuma-cute/*.png`
- `reactions/panic-shark/*.png`
- `reactions/plush-shark/*.png`
- `reactions/manul-cat/*.png`
- `reactions/blobfish/*.png`
- `reactions/saturn/*.png`
- `reactions/muscle-kangaroo/*.png`
- `reactions/muscle-shibaken/*.png`
- `reactions/marmot/*.png`
- `reactions/stretchy-cat/*.png`
- `reactions/dance-cat/*.png`
- `reactions/void-alpaca/*.png`
- `reactions/void-alpaca-real/*.png`
- `reactions/t-man/*.png`
- `reactions/giga-chad/*.png`
- `reactions/real-tibetan-fox/*.png`
- `reactions/real-quokka/*.png`
- `reactions/real-cat/*.png`
- `reactions/happy-cat/*.png`
- `generated-sheets/zangar-sheet.png`
- `generated-sheets/pendor-sheet.png`
- `generated-sheets/hakomon-sheet.png`
- `generated-sheets/babuzenshi-sheet.png`
- `generated-sheets/milano-auntie-sheet.png`
- `generated-sheets/chinanago-sheet.png`
- `generated-sheets/anagochin-sheet.png`
- `generated-sheets/tanpanman-sheet.png`
- `generated-sheets/menrikyu-sheet.png`
- `generated-sheets/shodoku-taishi-sheet.png`
- `generated-sheets/ponmori-sheet.png`
- `generated-sheets/sakabambaspis-sheet.png`
- `generated-sheets/fuwapape-sun-sheet.png`
- `generated-sheets/tibetan-fox-sheet.png`
- `generated-sheets/hedgehog-sheet.png`
- `generated-sheets/gachi-kuma-sheet.png`
- `generated-sheets/kuma-cute-sheet.png`
- `generated-sheets/panic-shark-sheet.png`
- `generated-sheets/plush-shark-sheet.png`
- `generated-sheets/manul-cat-sheet.png`
- `generated-sheets/blobfish-sheet.png`
- `generated-sheets/saturn-sheet.png`
- `generated-sheets/muscle-kangaroo-sheet.png`
- `generated-sheets/muscle-shibaken-sheet.png`
- `generated-sheets/marmot-sheet.png`
- `generated-sheets/stretchy-cat-sheet.png`
- `generated-sheets/dance-cat-sheet.png`
- `generated-sheets/void-alpaca-sheet.png`
- `generated-sheets/void-alpaca-real-sheet.png`
- `generated-sheets/t-man-sheet.png`
- `generated-sheets/giga-chad-sheet.png`
- `generated-sheets/real-tibetan-fox-sheet.png`
- `generated-sheets/real-quokka-sheet.png`
- `generated-sheets/real-cat-sheet.png`
- `generated-sheets/happy-cat-sheet.png`
- `hat-beret.svg` / `hat-crown.svg` / `hat-wizard.svg` / `hat-ribbon.svg`
- `hand-book.svg` / `hand-pencil.svg` / `hand-wand.svg` / `hand-sword.svg`
- `accessory-bow.svg` / `accessory-scarf.svg` / `accessory-glasses.svg` / `accessory-heart.svg`
- `background-room.svg` / `background-night.svg` / `background-forest.svg` / `background-city.svg`

相棒本体は透過PNGです。帽子、手持ち、アクセサリー、背景は軽量なSVGレイヤーです。
装備レイヤーは相棒本体へ重ねた時に正しい位置へ表示されるよう、同じ座標系で作成します。
背景画像は同じ縦横比で用意してください。

## 効果音

`assets/audio/chime/`、`assets/audio/arcade/`、`assets/audio/pop/`、`assets/audio/synth/` に、それぞれ以下のWAVを配置してください。

- `click.wav`
- `reveal.wav`
- `correct.wav`
- `wrong.wav`
- `purchase.wav`
- `level-up.wav`

現在は `scripts/generate-sounds.mjs` で生成した短い効果音を使用します。
差し替える場合も、短い音を推奨します。未配置の音はブラウザ内で生成する代替音へフォールバックします。
