# 東京友伴 Tokyo Friends

讓住在東京的外國人（和想交外國朋友的日本人）用暱稱與興趣配成 4～5 人的小組，一起見面交朋友。非營利。

- 用 Email＋密碼註冊，**一定要點認證信才能填資料**，防止亂填；Email 不會公開，也不存進資料庫
- 全部使用免費方案（GitHub Pages＋Firebase Spark），不需要綁信用卡
- 只收暱稱、國籍、區域、年齡層、興趣、語言與程度、空閒時間、交友傾向等配對需要的資料
- 每個人只看得到自己的資料和自己所在的小組

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` / `style.css` / `app.js` | 網頁本體 |
| `i18n.js` | 中文・日文・英文的所有文字和選項 |
| `firebase-config.js` | Firebase 設定（空白時為示範模式） |
| `firestore.rules` | 資料庫存取規則 |
| `admin.html` / `admin.js` | 管理後台 |
| `match.js` | 自動配對演算法 |

## 示範模式

`firebase-config.js` 還沒填的時候，網站可以直接用：任何 Email 和密碼都能註冊、不會真的寄信，按「我已經完成認證」就能繼續；資料只存在自己的瀏覽器，配對結果是範例資料。

## 上線步驟

1. **開 GitHub Pages**：repo 的 Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，儲存。幾分鐘後網址會是 `https://aling12007-cyber.github.io/Tokyo_Friends/`。
2. **建立 Firebase 專案**：到 https://console.firebase.google.com 新增專案。
3. **開啟 Email 登入**：Authentication → Sign-in method → 啟用「電子郵件/密碼」（下面的「電子郵件連結」不用開）。在 Settings → Authorized domains 加入 `aling12007-cyber.github.io`。
4. **建立資料庫**：Firestore Database → 建立（地區選 `asia-northeast1` 東京）→ 規則分頁貼上 `firestore.rules` 的內容並發布。
5. **貼上設定**：專案設定 → 你的應用程式 → 新增網頁應用程式，把 `firebaseConfig` 的值貼進 `firebase-config.js`。

## 配對：管理後台

網址：`https://aling12007-cyber.github.io/Tokyo_Friends/admin.html`（首頁沒有連結，只有你知道）

**第一次設定成管理者**
1. 先在首頁註冊並完成 Email 認證。
2. 打開 `admin.html`，畫面會顯示一串你的 uid。
3. 到 Firebase 主控台 → Firestore → 新增集合 `admins`，文件 ID 貼上那串 uid，欄位隨便加一個（例如 `name: 管理者`）。
4. 重新整理 `admin.html` 就能進入後台。

**每個月的配對流程**
1. 選月份 → 按「自動配對」，系統會依相似度排好小組。
2. 有 ⚠ 的小組代表有條件不合（例如沒有共同時間），可以用每個人旁邊的選單換組，或加入「還沒分組的人」。
3. 填 LINE 群組連結（選填）、自訂見面時間地點（選填，不填會自動顯示共同時段和地區）。
4. 按「建立這組」或「建立全部小組」，組員重新整理網頁就會看到。
5. 建錯了可以在「這個月已建立的小組」按「解散這組」。

**自動配對的規則**（在 `match.js`）
- 一定要符合：有共同語言、有共同空閒時段、彼此都在對方想認識的年齡層、聚會人數喜好不衝突、住的地方不會太遠（埼玉×神奈川、埼玉×多摩不會同組）。
- 分數越高越優先：共同興趣、想做的事、同一區、共同時段、同年齡層、氛圍、頻率、想練的語言對方剛好會說…等。
- 從最難配的人先排，小團體湊 4 人、多人聚會湊 5～6 人。

## 費用

全部免費：GitHub Pages 免費；Firebase 用免費的 Spark 方案即可（不用綁信用卡）。

免費方案的主要上限（以 Firebase 官方文件為準）：
- 認證信：每天 1,000 封
- 重設密碼信：每天 150 封
- 資料庫：每天 5 萬次讀取、2 萬次寫入，總容量 1GB（幾百人報名都很夠）
