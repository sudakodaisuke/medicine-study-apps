# Medicine Study Apps

GitHub上ではmonorepo風に、複数の静的HTMLアプリを1つのリポジトリで管理します。

## 構成

```text
medicine-study-apps/
├─ apps/
│  ├─ syoni/      小児用量＋先発後発版
│  └─ kokushi/    国試対策版
├─ shared/        共通素材・共通ファイル
├─ scripts/       共通ファイルのコピーや検証用スクリプト
├─ package.json
└─ README.md
```

`apps/syoni` と `apps/kokushi` は、それぞれ独立した静的HTMLアプリとして動きます。

- 小児用量版: `apps/syoni`
- 国試対策版: `apps/kokushi`

共通のキャラクター画像やゲーム素材などは `shared/` に置きます。ただし、静的HTMLアプリでは `../../shared/...` のように直接参照するとVercel公開時にうまく配信されないことがあるため、デプロイ前に `scripts/copy-shared.js` で各アプリ内へコピーします。

```text
shared/assets/
↓ コピー
apps/syoni/assets/
apps/kokushi/assets/
```

## Scripts

```json
{
  "prepare:syoni": "node scripts/copy-shared.js syoni",
  "prepare:kokushi": "node scripts/copy-shared.js kokushi",
  "prepare:all": "node scripts/copy-shared.js syoni && node scripts/copy-shared.js kokushi",
  "verify": "node scripts/verify-apps.js"
}
```

## Vercel

Vercelでは、この1つのGitHubリポジトリから2つのプロジェクトを作ります。

- 小児用量版: Root Directory `apps/syoni`
- 国試対策版: Root Directory `apps/kokushi`

この構成にすると、キャラクターやミニゲームなどの共通機能を使い回しつつ、小児版と国試版を別々のURL・別々のアプリとして公開できます。共通素材や共通コードはGitHub上でまとめて管理できるため、後から機能を横展開しやすくなります。
