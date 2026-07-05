# Medicine Study Apps

薬剤師・薬学生向け学習アプリを1つのGitHubリポジトリで管理するmonorepoです。

## Apps

- `apps/pediatric-dose/`
  - 小児+先発後発 カメラ改造版
  - 新人薬剤師向け
  - 小児用量、先発・後発、4択クイズ、弱点復習、学習記録、相棒機能を扱います。

- `apps/sayoukijo-master/`
  - 国試対策 作用機序マスター カメラ改造版
  - 薬学生向け
  - 薬理の作用機序、薬効群、標的、適応、副作用、国試ポイントを扱います。

## Shared

- `shared/`
  - 2つのアプリで共有するアセットや共通素材を置く場所です。
  - 現時点では各アプリが配信用に必要なファイルを自分の `assets/` に持っています。

## Vercel

GitHubでは同じリポジトリで管理しますが、Vercelではアプリごとに別プロジェクトとして公開します。

- 小児+先発後発 カメラ改造版
  - Project: `syoni-camera-kaizou`
  - Root Directory: `apps/pediatric-dose`
  - Production URL: `https://syoni-camera-kaizou.vercel.app`

- 国試対策 作用機序マスター カメラ改造版
  - Project: `kokusi-kaizou`
  - Root Directory: `apps/sayoukijo-master`
  - Production URL: `https://kokusi-kaizou.vercel.app`

PWAキャッシュ名とlocalStorageキーはアプリごとに分けているため、スマホに追加しても学習記録は混ざりません。
