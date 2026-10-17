# 東京友伴 Tokyo Friends

讓住在東京的外國人（和想交外國朋友的日本人）用暱稱與興趣配成 4～5 人的小組，一起見面交朋友。非營利。

- 用手機簡訊驗證註冊，防止亂填；**手機號碼不會公開，也不存進資料庫**
- 只收暱稱、常出沒區域、興趣、語言、想找的朋友類型、來日多久
- 每個人只看得到自己的資料和自己所在的小組

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` / `style.css` / `app.js` | 網頁本體 |
| `firebase-config.js` | Firebase 設定（空白時為示範模式） |
| `firestore.rules` | 資料庫存取規則 |

## 示範模式

`firebase-config.js` 還沒填的時候，網站可以直接用：驗證碼輸入 `123456`，資料只存在自己的瀏覽器，配對結果是範例資料。

## 上線步驟

1. **開 GitHub Pages**：repo 的 Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，儲存。幾分鐘後網址會是 `https://aling12007-cyber.github.io/tokyo_friends/`。
2. **建立 Firebase 專案**：到 https://console.firebase.google.com 新增專案。
3. **開啟手機驗證**：Authentication → Sign-in method → 啟用「電話」。在 Settings → Authorized domains 加入 `aling12007-cyber.github.io`。
4. **建立資料庫**：Firestore Database → 建立（地區選 `asia-northeast1` 東京）→ 規則分頁貼上 `firestore.rules` 的內容並發布。
5. **貼上設定**：專案設定 → 你的應用程式 → 新增網頁應用程式，把 `firebaseConfig` 的值貼進 `firebase-config.js`。

## 怎麼配對（目前手動）

1. 在 Firestore 的 `users` 看大家填的資料，依區域和興趣分組。
2. 在 `groups` 集合新增一個文件，欄位例如：

```json
{
  "memberUids": ["uid1", "uid2", "uid3", "uid4"],
  "members": [
    { "nick": "Mochi", "meta": "在日 2～5 年・中文、日文" },
    { "nick": "Kenta", "meta": "日本人・日文、英文" }
  ],
  "common": ["咖啡廳", "登山健行", "新宿・澀谷"],
  "meet": "11/8（六）14:00・新宿的咖啡廳",
  "chatUrl": "https://line.me/ti/g/xxxxxx"
}
```

組員重新整理網頁就會看到自己的小組。

## 費用

GitHub Pages 免費。Firebase 簡訊驗證有免費額度但每則簡訊可能收費，請在 Firebase 的用量頁面確認目前的計費方式並設定預算提醒。
