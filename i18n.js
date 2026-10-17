// 三語文字：zh = 繁體中文、ja = 日本語、en = English
export const LANGS_UI = ['zh', 'ja', 'en'];
export const HTML_LANG = { zh: 'zh-Hant', ja: 'ja', en: 'en' };

export const T = {
  zh: {
    brand: '東京友伴',
    demo: '示範模式：尚未連接 Firebase，驗證碼請輸入 <strong>123456</strong>，資料只存在這台裝置。',
    bannerAlt: '珍珠奶茶、天燈、梅花，和台北 101 與東京鐵塔的插畫',
    heroTitle: '在東京，找到<span class="hl">合得來</span>的朋友',
    heroSub: '用暱稱和興趣配成 4～5 人小組，一起出去玩。',
    phoneLabel: '手機號碼', countryLabel: '國碼',
    sendCode: '傳送驗證碼', sending: '傳送中…',
    codeLabel: '簡訊驗證碼（6 位數）', verify: '驗證並繼續', changePhone: '換一個號碼',
    privacyNote: '手機號碼只用來確認你是真人，<strong>不會公開</strong>也不會用來推銷。',
    step2: '步驟 2 / 3', logout: '登出',
    profileTitle: '介紹一下你自己', profileSub: '不需要真名或住址，用暱稱就好。',
    avatarTitle: '頭像照片（選填）', choosePhoto: '選擇照片', removePhoto: '移除照片',
    avatarHint: '不一定要放臉，風景、寵物、插圖都可以。照片只有同組的人看得到。',
    nick: '暱稱', nickPh: '例：Mochi',
    area: '常出沒的區域', areaPick: '請選擇', areaOther: '其他（自己填寫）', areaOtherPh: '請填寫地區或車站，例：千葉・船橋',
    interests: '興趣（最多 8 個）', selectedN: '已選 {n} 個',
    activities: '想一起做的事', activityOtherPh: '其他想做的事（選填）',
    langs: '會說的語言', wants: '想找什麼樣的朋友',
    years: '來日本多久了', yearsPick: '請選擇',
    agree: '我同意<a href="#rules" class="open-rules">社群守則</a>：不推銷、不傳教、不騷擾，第一次見面在公開場所。',
    save: '儲存並開始配對', editProfile: '編輯個人檔案',
    doneEyebrow: '報名完成', waitingTitle: '正在幫你找小組',
    waitingSub: '每個月會把住在附近、興趣相近的 4～5 人湊成一組，配好後會出現在這裡。',
    matchedEyebrow: '配對完成', groupTitle: '這是你這個月的小組',
    common: '你們的共同點', meetTitle: '建議第一次見面', meetDefault: '週末白天・公開場所（咖啡廳、餐廳）',
    joinChat: '加入小組聊天', rules: '安全守則', report: '檢舉',
    rulesTitle: '社群守則',
    rulesList: ['只用暱稱，不要求別人提供真名、住址、工作地點。', '禁止推銷、直銷、傳教、募款、招攬投資。', '禁止騷擾或以交往為目的的私訊；這裡是交朋友的地方。', '第一次見面請選公開場所，並告訴信任的人你去哪裡。', '遇到不舒服的事請檢舉，違規者會被移除。'],
    gotIt: '我知道了', loading: '載入中…',
    sumArea: '區域', sumInterests: '興趣', sumTodo: '想一起', sumLangs: '語言', sumWants: '想找', sumYears: '在日',
    you: '你',
    errPhoneEmpty: '請輸入手機號碼。', errBadPhone: '手機號碼格式不正確，請確認後再試。', errTooMany: '嘗試次數太多，請稍後再試。',
    errBadCode: '驗證碼不正確。', errExpired: '驗證碼已過期，請重新傳送。', errGeneric: '發生錯誤，請稍後再試。', errCode6: '請輸入 6 位數驗證碼。',
    errNick: '請填寫暱稱。', errArea: '請選擇區域。', errAreaOther: '請填寫你的區域。', errInterest: '請至少選一個興趣。',
    errActivity: '請至少選一件想一起做的事。', errLang: '請至少選一個語言。', errWant: '請選擇想找的朋友類型。', errYears: '請選擇來日本多久。',
    errAgree: '請先同意社群守則。', errSave: '儲存失敗，請稍後再試。', errNotImage: '請選擇圖片檔。', errBadImage: '這張照片讀不出來，換一張試試。',
    errConn: '無法連線，請重新整理頁面。',
    demoMeet: '週末白天・{area}附近的咖啡廳（公開場所）',
    demoMembers: ['日本人・日文、英文・想練中文', '在日半年・英文、葡萄牙文', '在日 1 年・韓文、日文']
  },

  ja: {
    brand: '東京友伴',
    demo: 'デモモード：Firebase 未接続です。認証コードは <strong>123456</strong>、データはこの端末にだけ保存されます。',
    bannerAlt: 'タピオカミルクティー、天灯、梅の花、台北101と東京タワーのイラスト',
    heroTitle: '東京で、<span class="hl">気の合う</span>友達を。',
    heroSub: 'ニックネームと趣味で 4〜5 人のグループを作って、一緒に遊ぼう。',
    phoneLabel: '電話番号', countryLabel: '国番号',
    sendCode: '認証コードを送る', sending: '送信中…',
    codeLabel: 'SMS 認証コード（6 桁）', verify: '認証して次へ', changePhone: '別の番号にする',
    privacyNote: '電話番号は本人確認だけに使います。<strong>公開されず</strong>、勧誘にも使いません。',
    step2: 'ステップ 2 / 3', logout: 'ログアウト',
    profileTitle: '自己紹介', profileSub: '本名や住所はいりません。ニックネームで大丈夫。',
    avatarTitle: 'プロフィール写真（任意）', choosePhoto: '写真を選ぶ', removePhoto: '写真を削除',
    avatarHint: '顔じゃなくても OK。風景・ペット・イラストでも。写真は同じグループの人だけに見えます。',
    nick: 'ニックネーム', nickPh: '例：Mochi',
    area: 'よく行くエリア', areaPick: '選んでください', areaOther: 'その他（自由入力）', areaOtherPh: 'エリアや駅名を入力（例：千葉・船橋）',
    interests: '趣味（8 個まで）', selectedN: '{n} 個選択中',
    activities: '一緒にやりたいこと', activityOtherPh: 'その他やりたいこと（任意）',
    langs: '話せる言語', wants: 'どんな友達を探してる？',
    years: '日本に来てどのくらい？', yearsPick: '選んでください',
    agree: '<a href="#rules" class="open-rules">コミュニティルール</a>に同意します：勧誘・宗教勧誘・ハラスメント禁止、初対面は公共の場所で。',
    save: '保存してマッチング開始', editProfile: 'プロフィールを編集',
    doneEyebrow: '登録完了', waitingTitle: 'グループを探しています',
    waitingSub: '毎月、近くに住んでいて趣味が近い 4〜5 人でグループを作ります。決まったらここに表示されます。',
    matchedEyebrow: 'マッチング完了', groupTitle: '今月のあなたのグループ',
    common: 'みんなの共通点', meetTitle: '初めて会うなら', meetDefault: '週末の昼・公共の場所（カフェやレストラン）',
    joinChat: 'グループチャットに参加', rules: '安全ガイド', report: '通報',
    rulesTitle: 'コミュニティルール',
    rulesList: ['ニックネームのみ。本名・住所・勤務先を聞かないでください。', '営業・マルチ・宗教勧誘・募金・投資の勧誘は禁止です。', 'ハラスメントや恋愛目的の DM は禁止。ここは友達作りの場です。', '初めて会うときは公共の場所で。行き先を信頼できる人に伝えましょう。', '嫌なことがあったら通報してください。違反した人は削除します。'],
    gotIt: 'わかりました', loading: '読み込み中…',
    sumArea: 'エリア', sumInterests: '趣味', sumTodo: 'やりたいこと', sumLangs: '言語', sumWants: '探している', sumYears: '在日歴',
    you: 'あなた',
    errPhoneEmpty: '電話番号を入力してください。', errBadPhone: '電話番号の形式が正しくありません。', errTooMany: '試行回数が多すぎます。しばらくしてからお試しください。',
    errBadCode: '認証コードが違います。', errExpired: '認証コードの有効期限が切れました。もう一度送信してください。', errGeneric: 'エラーが発生しました。しばらくしてからお試しください。', errCode6: '6 桁の認証コードを入力してください。',
    errNick: 'ニックネームを入力してください。', errArea: 'エリアを選んでください。', errAreaOther: 'エリアを入力してください。', errInterest: '趣味を 1 つ以上選んでください。',
    errActivity: 'やりたいことを 1 つ以上選んでください。', errLang: '言語を 1 つ以上選んでください。', errWant: '探している友達のタイプを選んでください。', errYears: '在日歴を選んでください。',
    errAgree: 'コミュニティルールに同意してください。', errSave: '保存できませんでした。しばらくしてからお試しください。', errNotImage: '画像ファイルを選んでください。', errBadImage: 'この写真は読み込めませんでした。別の写真をお試しください。',
    errConn: '接続できません。ページを再読み込みしてください。',
    demoMeet: '週末の昼・{area}周辺のカフェ（公共の場所）',
    demoMembers: ['日本人・日本語、英語・中国語を練習中', '在日半年・英語、ポルトガル語', '在日 1 年・韓国語、日本語']
  },

  en: {
    brand: 'Tokyo Friends',
    demo: 'Demo mode: Firebase is not connected yet. Use code <strong>123456</strong>. Data stays on this device only.',
    bannerAlt: 'Illustration of bubble tea, sky lanterns, plum blossoms, Taipei 101 and Tokyo Tower',
    heroTitle: 'Find friends in Tokyo who <span class="hl">get you</span>',
    heroSub: 'Get matched into a group of 4–5 by nickname and interests, then hang out.',
    phoneLabel: 'Phone number', countryLabel: 'Country code',
    sendCode: 'Send code', sending: 'Sending…',
    codeLabel: 'SMS code (6 digits)', verify: 'Verify & continue', changePhone: 'Use a different number',
    privacyNote: 'Your number is only used to confirm you’re a real person. It’s <strong>never shown</strong> or used for marketing.',
    step2: 'Step 2 / 3', logout: 'Log out',
    profileTitle: 'Tell us about you', profileSub: 'No real name or address needed — a nickname is fine.',
    avatarTitle: 'Profile photo (optional)', choosePhoto: 'Choose photo', removePhoto: 'Remove photo',
    avatarHint: 'Doesn’t have to be your face — scenery, pets or drawings are fine. Only your group can see it.',
    nick: 'Nickname', nickPh: 'e.g. Mochi',
    area: 'Where you usually hang out', areaPick: 'Choose one', areaOther: 'Other (type it in)', areaOtherPh: 'Area or station, e.g. Funabashi, Chiba',
    interests: 'Interests (up to 8)', selectedN: '{n} selected',
    activities: 'Things you’d like to do together', activityOtherPh: 'Anything else? (optional)',
    langs: 'Languages you speak', wants: 'What kind of friends?',
    years: 'How long have you been in Japan?', yearsPick: 'Choose one',
    agree: 'I agree to the <a href="#rules" class="open-rules">community rules</a>: no selling, no recruiting, no harassment, and first meetups in public places.',
    save: 'Save & start matching', editProfile: 'Edit profile',
    doneEyebrow: 'You’re signed up', waitingTitle: 'Finding your group',
    waitingSub: 'Each month we group 4–5 people who live nearby and share interests. Your group will show up here.',
    matchedEyebrow: 'Matched!', groupTitle: 'Your group this month',
    common: 'What you have in common', meetTitle: 'Suggested first meetup', meetDefault: 'Weekend daytime, in a public place (café or restaurant)',
    joinChat: 'Join group chat', rules: 'Safety rules', report: 'Report',
    rulesTitle: 'Community rules',
    rulesList: ['Nicknames only — don’t ask for real names, addresses or workplaces.', 'No sales, MLM, religious recruiting, fundraising or investment pitches.', 'No harassment or dating-focused messages — this is for friendship.', 'Meet in public places the first time and tell someone you trust where you’re going.', 'Report anything that makes you uncomfortable. Rule-breakers will be removed.'],
    gotIt: 'Got it', loading: 'Loading…',
    sumArea: 'Area', sumInterests: 'Interests', sumTodo: 'Want to do', sumLangs: 'Languages', sumWants: 'Looking for', sumYears: 'In Japan',
    you: 'you',
    errPhoneEmpty: 'Please enter your phone number.', errBadPhone: 'That phone number doesn’t look right.', errTooMany: 'Too many attempts. Please try again later.',
    errBadCode: 'That code is incorrect.', errExpired: 'The code expired. Please send a new one.', errGeneric: 'Something went wrong. Please try again later.', errCode6: 'Please enter the 6-digit code.',
    errNick: 'Please enter a nickname.', errArea: 'Please choose an area.', errAreaOther: 'Please type in your area.', errInterest: 'Please pick at least one interest.',
    errActivity: 'Please pick at least one thing to do together.', errLang: 'Please pick at least one language.', errWant: 'Please choose what kind of friends you’re looking for.', errYears: 'Please choose how long you’ve been in Japan.',
    errAgree: 'Please agree to the community rules.', errSave: 'Couldn’t save. Please try again later.', errNotImage: 'Please choose an image file.', errBadImage: 'Couldn’t read that photo — try another one.',
    errConn: 'Can’t connect. Please reload the page.',
    demoMeet: 'Weekend daytime, a café near {area} (public place)',
    demoMembers: ['Japanese · Japanese, English · practicing Chinese', '6 months in Japan · English, Portuguese', '1 year in Japan · Korean, Japanese']
  }
};

// ---------- 選項（存的是 id，顯示時依語言翻譯） ----------
export const AREA_GROUPS = [
  { label: ['東京 23 區', '東京 23 区', 'Tokyo 23 wards'], items: [
    ['shinjuku', '新宿・新大久保', '新宿・新大久保', 'Shinjuku / Shin-Okubo'],
    ['shibuya', '澀谷・原宿・表參道', '渋谷・原宿・表参道', 'Shibuya / Harajuku / Omotesando'],
    ['ikebukuro', '池袋・高田馬場', '池袋・高田馬場', 'Ikebukuro / Takadanobaba'],
    ['ueno', '上野・淺草・秋葉原', '上野・浅草・秋葉原', 'Ueno / Asakusa / Akihabara'],
    ['tokyo-st', '東京站・銀座・日本橋', '東京駅・銀座・日本橋', 'Tokyo Sta. / Ginza / Nihonbashi'],
    ['shinagawa', '品川・目黑・五反田', '品川・目黒・五反田', 'Shinagawa / Meguro / Gotanda'],
    ['ebisu', '惠比壽・中目黑・自由之丘', '恵比寿・中目黒・自由が丘', 'Ebisu / Nakameguro / Jiyugaoka'],
    ['roppongi', '六本木・麻布・赤坂', '六本木・麻布・赤坂', 'Roppongi / Azabu / Akasaka'],
    ['nakano', '中野・高圓寺', '中野・高円寺', 'Nakano / Koenji'],
    ['shimokita', '下北澤・三軒茶屋', '下北沢・三軒茶屋', 'Shimokitazawa / Sangenjaya'],
    ['kinshicho', '錦糸町・押上・龜戶', '錦糸町・押上・亀戸', 'Kinshicho / Oshiage / Kameido'],
    ['kitasenju', '北千住・赤羽', '北千住・赤羽', 'Kita-Senju / Akabane'],
    ['toyosu', '豐洲・月島・台場', '豊洲・月島・お台場', 'Toyosu / Tsukishima / Odaiba'],
    ['kamata', '蒲田・大森', '蒲田・大森', 'Kamata / Omori']
  ] },
  { label: ['東京 多摩', '東京・多摩', 'Tokyo Tama area'], items: [
    ['kichijoji', '吉祥寺・三鷹', '吉祥寺・三鷹', 'Kichijoji / Mitaka'],
    ['tachikawa', '立川・國立', '立川・国立', 'Tachikawa / Kunitachi'],
    ['hachioji', '八王子・高尾', '八王子・高尾', 'Hachioji / Takao'],
    ['machida', '町田', '町田', 'Machida'],
    ['chofu', '調布・府中', '調布・府中', 'Chofu / Fuchu']
  ] },
  { label: ['埼玉', '埼玉', 'Saitama'], items: [
    ['omiya', '大宮', '大宮', 'Omiya'],
    ['urawa', '浦和', '浦和', 'Urawa'],
    ['kawaguchi', '川口・蕨・西川口', '川口・蕨・西川口', 'Kawaguchi / Warabi'],
    ['tokorozawa', '所澤', '所沢', 'Tokorozawa'],
    ['kawagoe', '川越', '川越', 'Kawagoe'],
    ['koshigaya', '越谷・草加', '越谷・草加', 'Koshigaya / Soka'],
    ['wako', '和光・朝霞・志木', '和光・朝霞・志木', 'Wako / Asaka / Shiki'],
    ['kasukabe', '春日部', '春日部', 'Kasukabe']
  ] },
  { label: ['神奈川', '神奈川', 'Kanagawa'], items: [
    ['yokohama', '橫濱站周邊', '横浜駅周辺', 'Yokohama Sta. area'],
    ['minatomirai', '港未來・關內・中華街', 'みなとみらい・関内・中華街', 'Minatomirai / Kannai / Chinatown'],
    ['shinyokohama', '新橫濱・日吉', '新横浜・日吉', 'Shin-Yokohama / Hiyoshi'],
    ['kawasaki', '川崎・武藏小杉', '川崎・武蔵小杉', 'Kawasaki / Musashi-Kosugi'],
    ['mizonokuchi', '溝之口・登戶', '溝の口・登戸', 'Mizonokuchi / Noborito'],
    ['sagamihara', '相模原・橋本', '相模原・橋本', 'Sagamihara / Hashimoto'],
    ['shonan', '湘南・藤澤・茅崎', '湘南・藤沢・茅ヶ崎', 'Shonan / Fujisawa / Chigasaki'],
    ['kamakura', '鎌倉・逗子', '鎌倉・逗子', 'Kamakura / Zushi'],
    ['yokosuka', '橫須賀・三浦', '横須賀・三浦', 'Yokosuka / Miura'],
    ['atsugi', '厚木・海老名', '厚木・海老名', 'Atsugi / Ebina']
  ] }
];

export const INTERESTS = [
  ['cafe', '咖啡廳', 'カフェ', 'Cafés'], ['food', '美食探店', 'グルメ巡り', 'Food hunting'],
  ['tw-food', '台灣美食', '台湾グルメ', 'Taiwanese food'], ['bubbletea', '珍奶・手搖飲', 'タピオカ・ドリンク', 'Bubble tea'],
  ['izakaya', '居酒屋', '居酒屋', 'Izakaya'], ['sweets', '甜點', 'スイーツ', 'Desserts'],
  ['cooking', '料理', '料理', 'Cooking'], ['baking', '烘焙', 'お菓子・パン作り', 'Baking'],
  ['hiking', '登山健行', '登山・ハイキング', 'Hiking'], ['camping', '露營', 'キャンプ', 'Camping'],
  ['onsen', '溫泉旅行', '温泉旅行', 'Onsen trips'], ['travel-jp', '國內旅行', '国内旅行', 'Travel in Japan'],
  ['travel-abroad', '海外旅行', '海外旅行', 'Travel abroad'], ['walking', '散步・街拍', '散歩・街歩き', 'City walks'],
  ['photo', '攝影', '写真', 'Photography'], ['drawing', '畫畫', 'イラスト・絵', 'Drawing'],
  ['crafts', '手作', 'ハンドメイド', 'Crafts'], ['writing', '寫作', '文章を書く', 'Writing'],
  ['reading', '讀書', '読書', 'Reading'], ['movies', '電影', '映画', 'Movies'],
  ['dramas', '日劇・韓劇', 'ドラマ', 'TV dramas'], ['anime', '動漫', 'アニメ・マンガ', 'Anime & manga'],
  ['games', '遊戲', 'ゲーム', 'Video games'], ['boardgames', '桌遊', 'ボードゲーム', 'Board games'],
  ['escape', '密室逃脫', '謎解き・脱出ゲーム', 'Escape rooms'], ['music', '音樂・Live', '音楽・ライブ', 'Music & gigs'],
  ['kpop', 'K-POP', 'K-POP', 'K-pop'], ['karaoke', '卡拉 OK', 'カラオケ', 'Karaoke'],
  ['instrument', '樂器', '楽器', 'Playing music'], ['sports', '運動', 'スポーツ', 'Sports'],
  ['gym', '健身', '筋トレ', 'Gym'], ['running', '跑步', 'ランニング', 'Running'],
  ['yoga', '瑜伽', 'ヨガ', 'Yoga'], ['swimming', '游泳', '水泳', 'Swimming'],
  ['ballsports', '球類運動', '球技', 'Ball sports'], ['snow', '滑雪・單板', 'スキー・スノボ', 'Skiing & snowboarding'],
  ['jp-culture', '日本傳統文化', '日本の伝統文化', 'Japanese culture'], ['shrines', '神社・寺院', '神社・お寺', 'Shrines & temples'],
  ['festivals', '祭典・花火', 'お祭り・花火', 'Festivals & fireworks'], ['tea', '茶道・花道', '茶道・華道', 'Tea ceremony & ikebana'],
  ['kimono', '和服', '着物', 'Kimono'], ['museums', '美術館・展覽', '美術館・展示', 'Museums & exhibitions'],
  ['fashion', '時尚', 'ファッション', 'Fashion'], ['pets', '寵物', 'ペット', 'Pets'],
  ['tech', '程式・科技', 'プログラミング・IT', 'Tech & coding'], ['investing', '投資理財', '投資・マネー', 'Investing'],
  ['languages', '語言學習', '語学', 'Language learning']
];

export const ACTIVITIES = [
  ['coffee', '喝咖啡聊天', 'お茶しながらおしゃべり', 'Coffee & chat'], ['meal', '一起吃飯', 'ごはん', 'Meals together'],
  ['tw-restaurant', '吃台灣料理', '台湾料理を食べに行く', 'Taiwanese restaurants'], ['drinks', '喝一杯', '飲みに行く', 'Drinks'],
  ['shopping', '逛街', 'ショッピング', 'Shopping'], ['museum', '逛美術館・展覽', '美術館・展示めぐり', 'Museums & exhibits'],
  ['hike', '爬山・健行', '山登り・ハイキング', 'Hiking'], ['onsen', '去溫泉', '温泉', 'Onsen'],
  ['daytrip', '一日小旅行', '日帰り旅行', 'Day trips'], ['seasons', '賞花・賞楓', 'お花見・紅葉狩り', 'Cherry blossoms & autumn leaves'],
  ['festival', '看祭典・花火', 'お祭り・花火大会', 'Festivals & fireworks'], ['shrine', '參拜神社・寺院', '神社・お寺めぐり', 'Shrine & temple visits'],
  ['karaoke', '唱 KTV', 'カラオケ', 'Karaoke'], ['boardgame', '玩桌遊', 'ボードゲーム', 'Board games'],
  ['movie', '看電影', '映画', 'Movies'], ['concert', '去 Live・演唱會', 'ライブ・コンサート', 'Concerts'],
  ['sport', '一起運動', '一緒にスポーツ', 'Sports together'], ['bookclub', '讀書會', '読書会', 'Book club'],
  ['study', '一起讀書・自習', '一緒に勉強・もくもく会', 'Study sessions'], ['exchange', '語言交換', '言語交換', 'Language exchange'],
  ['cook', '一起做料理', '一緒に料理', 'Cooking together']
];

export const LANGS = [
  ['zh', '中文', '中国語', 'Chinese'], ['tw', '台語', '台湾語', 'Taiwanese Hokkien'],
  ['ja', '日文', '日本語', 'Japanese'], ['en', '英文', '英語', 'English'],
  ['ko', '韓文', '韓国語', 'Korean'], ['other', '其他', 'その他', 'Other']
];

export const WANTS = [
  ['chat', '聊天朋友', '話し相手', 'Someone to chat with'], ['hangout', '一起出去玩', '遊び友達', 'Friends to hang out with'],
  ['exchange', '語言交換', '言語交換', 'Language exchange'], ['help', '生活互助', '生活の助け合い', 'Help with daily life']
];

export const YEARS = [
  ['new', '剛來（半年內）', '来たばかり（半年以内）', 'Just arrived (under 6 months)'],
  ['2y', '半年～2 年', '半年〜2 年', '6 months – 2 years'],
  ['5y', '2～5 年', '2〜5 年', '2–5 years'],
  ['5y+', '5 年以上', '5 年以上', '5+ years'],
  ['local', '日本人・在日本長大', '日本人・日本育ち', 'Japanese / grew up here']
];
