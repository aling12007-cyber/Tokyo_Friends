// 三語文字：zh = 繁體中文、ja = 日本語、en = English
export const LANGS_UI = ['zh', 'ja', 'en'];
export const HTML_LANG = { zh: 'zh-Hant', ja: 'ja', en: 'en' };

export const T = {
  zh: {
    brand: '東京友伴',
    demo: '示範模式：尚未連接 Firebase，不會真的寄信，任何 Email 都能註冊，資料只存在這台裝置。',
    bannerAlt: '珍珠奶茶、天燈、梅花，和台北 101 與東京鐵塔的插畫',
    heroTitle: '在東京，找到<span class="hl">合得來</span>的朋友',
    heroSub: '用暱稱和興趣配成 3～4 人小組，每週三公布配對結果。',
    tabSignup: '註冊', tabLogin: '登入', authMode: '註冊或登入',
    emailLabel: 'Email', passwordLabel: '密碼（至少 8 個字）', passwordLabelLogin: '密碼',
    signupBtn: '建立帳號', loginBtn: '登入', working: '處理中…', forgot: '忘記密碼？',
    resetSent: '已寄出重設密碼的信，請到信箱查看。',
    verifyTitle: '請到信箱點認證連結',
    verifyText: '我們寄了一封認證信到 {email}。點信裡的連結後，回來按「我已經完成認證」。沒看到的話請檢查垃圾郵件。',
    verifyDone: '我已經完成認證', verifyResend: '重寄認證信', useOtherEmail: '改用其他 Email',
    verifyResent: '已重寄，請到信箱查看。', verifyWait: '請等 {n} 秒後再重寄。', verifyNotYet: '還沒完成認證喔，請先點信裡的連結。',
    errEmail: '請輸入正確的 Email。', errPassword: '密碼至少要 8 個字。', errEmailInUse: '這個 Email 已經註冊過了，請改用「登入」。',
    errLoginFail: 'Email 或密碼不正確。', errNeedEmail: '請先在上面輸入你的 Email。',
    privacyNote: 'Email 只用來登入和確認你是真人，<strong>不會公開</strong>也不會用來推銷。',
    step2: '步驟 2 / 3', logout: '登出',
    profileTitle: '介紹一下你自己', profileSub: '不需要真名或住址，用暱稱就好。',
    avatarTitle: '頭像照片（選填）', choosePhoto: '選擇照片', removePhoto: '移除照片',
    avatarHint: '不一定要放臉，風景、寵物、插圖都可以。照片只有同組的人看得到。',
    nick: '暱稱', nickPh: '例：Mochi',
    nationality: '國籍', nationalityPick: '請選擇', nationalityOther: '其他（自己填寫）', nationalityOtherPh: '請填寫國籍', errNationality: '請選擇國籍（也可以選「不想透露」）。', sumNationality: '國籍',
    area: '常出沒的區域', areaPick: '請選擇', areaOther: '其他（自己填寫）', areaOtherPh: '請填寫地區或車站，例：千葉・船橋',
    interests: '興趣（最多 8 個）', selectedN: '已選 {n} 個',
    activities: '想一起做的事', activityOtherPh: '其他想做的事（選填）',
    langLevelPick: '選擇程度', errLangLevel: '請幫每個語言選擇程度。',
    langs: '會說的語言', wants: '交友目的', genderWant: '希望認識的性別', sumGenderWant: '性別偏好', errGenderWant: '請選擇希望認識的性別。',
    ageTitle: '年齡層', myAge: '你的年齡層', agePick: '請選擇', ageWant: '想認識的年齡層（可複選）', ageHint: '本服務限 18 歲以上使用。', errAge: '請選擇你的年齡層。', errAgeWant: '請選擇想認識的年齡層，或選「不在意年齡」。', sumAge: '年齡',
    friendStyle: '交友傾向', friendStyleHint: '聚會人數必選，其他選填。', errPrefSize: '請選擇想參加的聚會人數。', sumStyle: '傾向',
    freeTime: '空閒時間', lifestyle: '你的生活型態', lifestylePick: '請選擇', freeTimeWhen: '通常什麼時候有空（可複選）',
    errLifestyle: '請選擇生活型態。', errFreeTime: '請至少選一個有空的時段。', sumFree: '有空',
    years: '來日本多久了', yearsPick: '請選擇',
    agree: '我同意<a href="#rules" class="open-rules">社群守則</a>：不推銷、不傳教、不騷擾，第一次見面在公開場所。',
    save: '儲存並開始配對', editProfile: '編輯個人檔案',
    doneEyebrow: '報名完成', waitingTitle: '正在幫你找小組',
    waitingSub: '資料已登記，尚未配對。每週三由管理者公布 3～4 人小組；公布後會顯示在這裡。',
    matchedEyebrow: '配對完成', groupTitle: '這是你這個月的小組',
    common: '你們的共同點', meetTitle: '建議第一次見面', meetDefault: '週末白天・公開場所（咖啡廳、餐廳）',
    meetAuto: '{when}・{area}附近（公開場所）',
    joinChat: '加入小組聊天', rules: '安全守則', report: '檢舉',
    rulesTitle: '社群守則',
    rulesList: ['只用暱稱，不要求別人提供真名、住址、工作地點。', '禁止推銷、直銷、傳教、募款、招攬投資。', '禁止騷擾或以交往為目的的私訊；這裡是交朋友的地方。', '第一次見面請選公開場所，並告訴信任的人你去哪裡。', '遇到不舒服的事請檢舉，違規者會被移除。'],
    gotIt: '我知道了', loading: '載入中…',
    sumArea: '區域', sumInterests: '興趣', sumTodo: '想一起', sumLangs: '語言', sumWants: '交友目的', sumYears: '在日',
    you: '你',
    errTooMany: '嘗試次數太多，請稍後再試。',
    errGeneric: '發生錯誤，請稍後再試。', errNick: '請填寫暱稱。', errArea: '請選擇區域。', errAreaOther: '請填寫你的區域。', errInterest: '請至少選一個興趣。',
    errActivity: '請至少選一件想一起做的事。', errLang: '請至少選一個語言。', errWant: '請選擇想找的朋友類型。', errYears: '請選擇來日本多久。',
    errAgree: '請先同意社群守則。', errSave: '儲存失敗，請稍後再試。', errNotImage: '請選擇圖片檔。', errBadImage: '這張照片讀不出來，換一張試試。',
    errConn: '無法連線，請重新整理頁面。',
    demoMeet: '週末白天・{area}附近的咖啡廳（公開場所）',
    demoMembers: ['日本人・日文、英文・想練中文', '在日半年・英文、葡萄牙文', '在日 1 年・韓文、日文']
  },

  ja: {
    brand: '東京友伴',
    demo: 'デモモード：Firebase 未接続のため、メールは送信されません。どのメールアドレスでも登録でき、データはこの端末にだけ保存されます。',
    bannerAlt: 'タピオカミルクティー、天灯、梅の花、台北101と東京タワーのイラスト',
    heroTitle: '東京で、<span class="hl">気の合う</span>友達を。',
    heroSub: 'ニックネームと趣味で 3〜4 人のグループを作り、毎週水曜日に結果を公開します。',
    tabSignup: '新規登録', tabLogin: 'ログイン', authMode: '新規登録またはログイン',
    emailLabel: 'メールアドレス', passwordLabel: 'パスワード（8 文字以上）', passwordLabelLogin: 'パスワード',
    signupBtn: 'アカウントを作成', loginBtn: 'ログイン', working: '処理中…', forgot: 'パスワードを忘れた？',
    resetSent: 'パスワード再設定のメールを送りました。メールを確認してください。',
    verifyTitle: 'メールの認証リンクを押してください',
    verifyText: '{email} に認証メールを送りました。メール内のリンクを押してから、「認証しました」を押してください。届かない場合は迷惑メールフォルダも確認してください。',
    verifyDone: '認証しました', verifyResend: '認証メールを再送', useOtherEmail: '別のメールアドレスを使う',
    verifyResent: '再送しました。メールを確認してください。', verifyWait: '{n} 秒後に再送できます。', verifyNotYet: 'まだ認証されていません。メール内のリンクを押してください。',
    errEmail: '正しいメールアドレスを入力してください。', errPassword: 'パスワードは 8 文字以上にしてください。', errEmailInUse: 'このメールアドレスは登録済みです。「ログイン」してください。',
    errLoginFail: 'メールアドレスまたはパスワードが違います。', errNeedEmail: '上にメールアドレスを入力してください。',
    privacyNote: 'メールアドレスはログインと本人確認だけに使います。<strong>公開されず</strong>、勧誘にも使いません。',
    step2: 'ステップ 2 / 3', logout: 'ログアウト',
    profileTitle: '自己紹介', profileSub: '本名や住所はいりません。ニックネームで大丈夫。',
    avatarTitle: 'プロフィール写真（任意）', choosePhoto: '写真を選ぶ', removePhoto: '写真を削除',
    avatarHint: '顔じゃなくても OK。風景・ペット・イラストでも。写真は同じグループの人だけに見えます。',
    nick: 'ニックネーム', nickPh: '例：Mochi',
    nationality: '国籍', nationalityPick: '選んでください', nationalityOther: 'その他（自由入力）', nationalityOtherPh: '国籍を入力', errNationality: '国籍を選んでください（「答えたくない」も選べます）。', sumNationality: '国籍',
    area: 'よく行くエリア', areaPick: '選んでください', areaOther: 'その他（自由入力）', areaOtherPh: 'エリアや駅名を入力（例：千葉・船橋）',
    interests: '趣味（8 個まで）', selectedN: '{n} 個選択中',
    activities: '一緒にやりたいこと', activityOtherPh: 'その他やりたいこと（任意）',
    langLevelPick: 'レベルを選ぶ', errLangLevel: 'それぞれの言語のレベルを選んでください。',
    langs: '話せる言語', wants: '交流の目的', genderWant: '出会いたい相手の性別', sumGenderWant: '性別の希望', errGenderWant: '希望する相手の性別を選んでください。',
    ageTitle: '年齢層', myAge: 'あなたの年齢層', agePick: '選んでください', ageWant: '出会いたい年齢層（複数選択可）', ageHint: '18 歳以上の方のみご利用いただけます。', errAge: '年齢層を選んでください。', errAgeWant: '出会いたい年齢層を選ぶか、「年齢は気にしない」を選んでください。', sumAge: '年齢',
    friendStyle: '友達づくりのスタイル', friendStyleHint: '人数は必須、ほかは任意です。', errPrefSize: '参加したいグループの人数を選んでください。', sumStyle: 'スタイル',
    freeTime: '空いている時間', lifestyle: 'ライフスタイル', lifestylePick: '選んでください', freeTimeWhen: 'だいたい空いている時間（複数選択可）',
    errLifestyle: 'ライフスタイルを選んでください。', errFreeTime: '空いている時間を 1 つ以上選んでください。', sumFree: '空き時間',
    years: '日本に来てどのくらい？', yearsPick: '選んでください',
    agree: '<a href="#rules" class="open-rules">コミュニティルール</a>に同意します：勧誘・宗教勧誘・ハラスメント禁止、初対面は公共の場所で。',
    save: '保存してマッチング開始', editProfile: 'プロフィールを編集',
    doneEyebrow: '登録完了', waitingTitle: 'グループを探しています',
    waitingSub: '登録完了。マッチング結果は毎週水曜日に管理者が公開します。公開後、3〜4 人のグループがここに表示されます。
    matchedEyebrow: 'マッチング完了', groupTitle: '今月のあなたのグループ',
    common: 'みんなの共通点', meetTitle: '初めて会うなら', meetDefault: '週末の昼・公共の場所（カフェやレストラン）',
    meetAuto: '{when}・{area}周辺（公共の場所）',
    joinChat: 'グループチャットに参加', rules: '安全ガイド', report: '通報',
    rulesTitle: 'コミュニティルール',
    rulesList: ['ニックネームのみ。本名・住所・勤務先を聞かないでください。', '営業・マルチ・宗教勧誘・募金・投資の勧誘は禁止です。', 'ハラスメントや恋愛目的の DM は禁止。ここは友達作りの場です。', '初めて会うときは公共の場所で。行き先を信頼できる人に伝えましょう。', '嫌なことがあったら通報してください。違反した人は削除します。'],
    gotIt: 'わかりました', loading: '読み込み中…',
    sumArea: 'エリア', sumInterests: '趣味', sumTodo: 'やりたいこと', sumLangs: '言語', sumWants: '交流の目的', sumYears: '在日歴',
    you: 'あなた',
    errTooMany: '試行回数が多すぎます。しばらくしてからお試しください。',
    errGeneric: 'エラーが発生しました。しばらくしてからお試しください。', errNick: 'ニックネームを入力してください。', errArea: 'エリアを選んでください。', errAreaOther: 'エリアを入力してください。', errInterest: '趣味を 1 つ以上選んでください。',
    errActivity: 'やりたいことを 1 つ以上選んでください。', errLang: '言語を 1 つ以上選んでください。', errWant: '探している友達のタイプを選んでください。', errYears: '在日歴を選んでください。',
    errAgree: 'コミュニティルールに同意してください。', errSave: '保存できませんでした。しばらくしてからお試しください。', errNotImage: '画像ファイルを選んでください。', errBadImage: 'この写真は読み込めませんでした。別の写真をお試しください。',
    errConn: '接続できません。ページを再読み込みしてください。',
    demoMeet: '週末の昼・{area}周辺のカフェ（公共の場所）',
    demoMembers: ['日本人・日本語、英語・中国語を練習中', '在日半年・英語、ポルトガル語', '在日 1 年・韓国語、日本語']
  },

  en: {
    brand: 'Tokyo Friends',
    demo: 'Demo mode: Firebase isn’t connected, so no emails are sent. Any email works, and data stays on this device only.',
    bannerAlt: 'Illustration of bubble tea, sky lanterns, plum blossoms, Taipei 101 and Tokyo Tower',
    heroTitle: 'Find friends in Tokyo who <span class="hl">get you</span>',
    heroSub: 'Join a group of 3–4 people. Matching results are published every Wednesday.',
    tabSignup: 'Sign up', tabLogin: 'Log in', authMode: 'Sign up or log in',
    emailLabel: 'Email', passwordLabel: 'Password (8+ characters)', passwordLabelLogin: 'Password',
    signupBtn: 'Create account', loginBtn: 'Log in', working: 'Working…', forgot: 'Forgot password?',
    resetSent: 'We sent you an email to reset your password.',
    verifyTitle: 'Check your inbox',
    verifyText: 'We sent a verification email to {email}. Click the link in it, then come back and tap “I’ve verified”. Check your spam folder if you can’t find it.',
    verifyDone: 'I’ve verified', verifyResend: 'Resend email', useOtherEmail: 'Use a different email',
    verifyResent: 'Sent again — check your inbox.', verifyWait: 'Please wait {n} seconds before resending.', verifyNotYet: 'Not verified yet — please click the link in the email first.',
    errEmail: 'Please enter a valid email.', errPassword: 'Password must be at least 8 characters.', errEmailInUse: 'This email is already registered — please log in.',
    errLoginFail: 'Wrong email or password.', errNeedEmail: 'Please enter your email above first.',
    privacyNote: 'Your email is only used to log in and confirm you’re a real person. It’s <strong>never shown</strong> or used for marketing.',
    step2: 'Step 2 / 3', logout: 'Log out',
    profileTitle: 'Tell us about you', profileSub: 'No real name or address needed — a nickname is fine.',
    avatarTitle: 'Profile photo (optional)', choosePhoto: 'Choose photo', removePhoto: 'Remove photo',
    avatarHint: 'Doesn’t have to be your face — scenery, pets or drawings are fine. Only your group can see it.',
    nick: 'Nickname', nickPh: 'e.g. Mochi',
    nationality: 'Nationality', nationalityPick: 'Choose one', nationalityOther: 'Other (type it in)', nationalityOtherPh: 'Your nationality', errNationality: 'Please choose your nationality (or “Prefer not to say”).', sumNationality: 'Nationality',
    area: 'Where you usually hang out', areaPick: 'Choose one', areaOther: 'Other (type it in)', areaOtherPh: 'Area or station, e.g. Funabashi, Chiba',
    interests: 'Interests (up to 8)', selectedN: '{n} selected',
    activities: 'Things you’d like to do together', activityOtherPh: 'Anything else? (optional)',
    langLevelPick: 'Choose level', errLangLevel: 'Please choose a level for each language.',
    langs: 'Languages you speak', wants: 'Purpose of Connecting', genderWant: 'Gender preference', sumGenderWant: 'Gender preference', errGenderWant: 'Please choose a gender preference.',
    ageTitle: 'Age', myAge: 'Your age group', agePick: 'Choose one', ageWant: 'Ages you’d like to meet (pick any)', ageHint: 'You must be 18 or older to use this service.', errAge: 'Please choose your age group.', errAgeWant: 'Please choose the ages you’d like to meet, or “Any age”.', sumAge: 'Age',
    friendStyle: 'Your friendship style', friendStyleHint: 'Group size is required; the rest is optional.', errPrefSize: 'Please choose a group size.', sumStyle: 'Style',
    freeTime: 'Free time', lifestyle: 'Your lifestyle', lifestylePick: 'Choose one', freeTimeWhen: 'When are you usually free? (pick any)',
    errLifestyle: 'Please choose your lifestyle.', errFreeTime: 'Please pick at least one time you’re free.', sumFree: 'Free',
    years: 'How long have you been in Japan?', yearsPick: 'Choose one',
    agree: 'I agree to the <a href="#rules" class="open-rules">community rules</a>: no selling, no recruiting, no harassment, and first meetups in public places.',
    save: 'Save & start matching', editProfile: 'Edit profile',
    doneEyebrow: 'You’re signed up', waitingTitle: 'Finding your group',
    waitingSub: 'Each month we group 4–5 people who live nearby and share interests. Your group will show up here.',
    matchedEyebrow: 'Matched!', groupTitle: 'Your group this month',
    common: 'What you have in common', meetTitle: 'Suggested first meetup', meetDefault: 'Weekend daytime, in a public place (café or restaurant)',
    meetAuto: '{when}, near {area} (public place)',
    joinChat: 'Join group chat', rules: 'Safety rules', report: 'Report',
    rulesTitle: 'Community rules',
    rulesList: ['Nicknames only — don’t ask for real names, addresses or workplaces.', 'No sales, MLM, religious recruiting, fundraising or investment pitches.', 'No harassment or dating-focused messages — this is for friendship.', 'Meet in public places the first time and tell someone you trust where you’re going.', 'Report anything that makes you uncomfortable. Rule-breakers will be removed.'],
    gotIt: 'Got it', loading: 'Loading…',
    sumArea: 'Area', sumInterests: 'Interests', sumTodo: 'Want to do', sumLangs: 'Languages', sumWants: 'Purpose', sumYears: 'In Japan',
    you: 'you',
    errTooMany: 'Too many attempts. Please try again later.',
    errGeneric: 'Something went wrong. Please try again later.', errNick: 'Please enter a nickname.', errArea: 'Please choose an area.', errAreaOther: 'Please type in your area.', errInterest: 'Please pick at least one interest.',
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
  ['chat', '聊天', 'おしゃべり', 'Chat'], ['hangout', '一起出去玩', '一緒に遊びに行く', 'Hang out together'],
  ['career', '職涯與成長交流', 'キャリア・成長について交流', 'Career & growth networking']
];

export const YEARS = [
  ['new', '剛來（半年內）', '来たばかり（半年以内）', 'Just arrived (under 6 months)'],
  ['2y', '半年～2 年', '半年〜2 年', '6 months – 2 years'],
  ['5y', '2～5 年', '2〜5 年', '2–5 years'],
  ['5y+', '5 年以上', '5 年以上', '5+ years'],
  ['local', '日本人・在日本長大', '日本人・日本育ち', 'Japanese / grew up here']
];

// ---------- 分類（每類一個顏色） ----------
export const INTEREST_GROUPS = [
  { label: ['美食', 'グルメ', 'Food'], ids: ['cafe', 'food', 'tw-food', 'bubbletea', 'izakaya', 'sweets', 'cooking', 'baking'] },
  { label: ['戶外・旅行', 'アウトドア・旅行', 'Outdoors & travel'], ids: ['hiking', 'camping', 'onsen', 'travel-jp', 'travel-abroad', 'walking'] },
  { label: ['運動', 'スポーツ', 'Sports'], ids: ['sports', 'gym', 'running', 'yoga', 'swimming', 'ballsports', 'snow'] },
  { label: ['娛樂', 'エンタメ', 'Entertainment'], ids: ['movies', 'dramas', 'anime', 'games', 'boardgames', 'escape', 'karaoke'] },
  { label: ['音樂', '音楽', 'Music'], ids: ['music', 'kpop', 'instrument'] },
  { label: ['藝文・創作', 'アート・創作', 'Arts & making'], ids: ['photo', 'drawing', 'crafts', 'writing', 'reading', 'museums', 'fashion'] },
  { label: ['日本文化', '日本文化', 'Japanese culture'], ids: ['jp-culture', 'shrines', 'festivals', 'tea', 'kimono'] },
  { label: ['生活・學習', '暮らし・学び', 'Life & learning'], ids: ['pets', 'languages', 'tech', 'investing'] }
];

export const ACTIVITY_GROUPS = [
  { label: ['吃吃喝喝', '食べる・飲む', 'Eat & drink'], ids: ['coffee', 'meal', 'tw-restaurant', 'drinks', 'cook'] },
  { label: ['出門走走', 'おでかけ', 'Go out'], ids: ['shopping', 'museum', 'hike', 'onsen', 'daytrip'] },
  { label: ['季節・傳統', '季節・伝統行事', 'Seasons & traditions'], ids: ['seasons', 'festival', 'shrine'] },
  { label: ['室內玩樂', 'インドアで遊ぶ', 'Indoor fun'], ids: ['karaoke', 'boardgame', 'movie', 'concert'] },
  { label: ['學習・運動', '学ぶ・体を動かす', 'Learn & move'], ids: ['study', 'bookclub', 'exchange', 'sport'] }
];

export const LIFESTYLES = [
  ['office', '上班族', '会社員', 'Office worker'],
  ['student', '學生', '学生', 'Student'],
  ['shift', '打工・排班制', 'アルバイト・シフト制', 'Part-time / shift work'],
  ['freelance', '自由業・自營', 'フリーランス・自営業', 'Freelance / self-employed'],
  ['home', '家管・育兒中', '主婦・主夫・子育て中', 'Homemaker / parenting'],
  ['jobhunting', '求職中', '求職中', 'Job hunting'],
  ['other', '其他', 'その他', 'Other']
];

export const FREE_TIMES = [
  ['weekday-day', '平日白天', '平日の昼', 'Weekday daytime'],
  ['weekday-night', '平日晚上', '平日の夜', 'Weekday evenings'],
  ['sat', '週六', '土曜日', 'Saturdays'],
  ['sun', '週日', '日曜日', 'Sundays'],
  ['holiday', '國定假日', '祝日', 'Public holidays'],
  ['irregular', '不固定（看排班）', '不定期（シフト次第）', 'Varies (shift-based)']
];

// 選了生活型態時，自動先勾的時段（還沒選任何時段時才會套用）
export const FREE_TIME_DEFAULTS = {
  office: ['weekday-night', 'sat', 'sun', 'holiday'],
  student: ['weekday-night', 'sat', 'sun'],
  shift: ['irregular'],
  freelance: ['weekday-day', 'weekday-night'],
  home: ['weekday-day'],
  jobhunting: ['weekday-day', 'weekday-night'],
  other: []
};

// 交友傾向：single = 這一類只能選一個
export const PREF_GROUPS = [
  { key: 'size', label: ['聚會人數', '参加したい人数', 'Group size'], items: [
    ['size-small', '小團體（4 人以下）', '少人数（4 人以下）', 'Small groups (up to 4)'],
    ['size-large', '多人聚會（5 人以上）', '大人数（5 人以上）', 'Bigger groups (5+)'],
    ['size-pair', '一對一也 OK', '1 対 1 も OK', 'One-on-one is fine too']
  ] },
  { key: 'freq', single: true, label: ['見面頻率', '会う頻度', 'How often'], items: [
    ['freq-weekly', '每週', '毎週', 'Weekly'],
    ['freq-monthly', '每月 1～2 次', '月 1〜2 回', '1–2 times a month'],
    ['freq-casual', '有空再約', '都合が合えば', 'Whenever we’re free']
  ] },
  { key: 'vibe', label: ['聚會氛圍', '雰囲気', 'Vibe'], items: [
    ['vibe-quiet', '安靜聊天型', '落ち着いておしゃべり', 'Quiet chats'],
    ['vibe-lively', '熱鬧玩樂型', 'ワイワイ楽しく', 'Lively & fun'],
    ['vibe-themed', '有主題的活動', 'テーマのある活動', 'Themed activities'],
    ['vibe-slow', '慢慢熟起來就好', 'ゆっくり仲良くなりたい', 'Take it slow'],
    ['vibe-longterm', '想交長久的朋友', '長く付き合える友達がほしい', 'Long-term friends']
  ] },
  { key: 'who', label: ['想認識的人', '出会いたい人', 'Who you’d like to meet'], items: [
    ['who-same', '同鄉（同國家）的人', '同じ国の人', 'People from my country'],
    ['who-intl', '不同國家的人', 'いろんな国の人', 'People from other countries'],
    ['who-jp', '日本人', '日本人', 'Japanese people'],
    ['who-any', '都可以', 'こだわらない', 'Anyone']
  ] },
  { key: 'talk', label: ['聊天語言', '話したい言語', 'Language to chat in'], items: [
    ['talk-native', '用母語輕鬆聊', '母語で気楽に', 'My own language'],
    ['talk-ja', '想練日文', '日本語を練習したい', 'Practice Japanese'],
    ['talk-en', '想練英文', '英語を練習したい', 'Practice English'],
    ['talk-any', '什麼語言都行', '何語でも OK', 'Any language']
  ] }
];

export const AGES = [
  ['18-24', '18～24 歲', '18〜24 歳', '18–24'],
  ['25-29', '25～29 歲', '25〜29 歳', '25–29'],
  ['30-34', '30～34 歲', '30〜34 歳', '30–34'],
  ['35-39', '35～39 歲', '35〜39 歳', '35–39'],
  ['40-49', '40～49 歲', '40〜49 歳', '40–49'],
  ['50+', '50 歲以上', '50 歳以上', '50+']
];
export const AGE_ANY = ['age-any', '不在意年齡', '年齢は気にしない', 'Any age'];

// 語言程度（由高到低）
export const LANG_LEVELS = [
  ['native', '母語', 'ネイティブ', 'Native'],
  ['fluent', '流利', '流暢', 'Fluent'],
  ['conv', '日常會話', '日常会話', 'Conversational'],
  ['basic', '簡單溝通', '簡単な会話', 'Basic'],
  ['beginner', '初學', '勉強中', 'Beginner']
];

export const NATIONALITIES = [
  ['tw', '台灣', '台湾', 'Taiwan'], ['jp', '日本', '日本', 'Japan'], ['cn', '中國', '中国', 'China'],
  ['hk', '香港', '香港', 'Hong Kong'], ['mo', '澳門', 'マカオ', 'Macau'], ['kr', '韓國', '韓国', 'South Korea'],
  ['vn', '越南', 'ベトナム', 'Vietnam'], ['ph', '菲律賓', 'フィリピン', 'Philippines'], ['th', '泰國', 'タイ', 'Thailand'],
  ['id', '印尼', 'インドネシア', 'Indonesia'], ['my', '馬來西亞', 'マレーシア', 'Malaysia'], ['sg', '新加坡', 'シンガポール', 'Singapore'],
  ['in', '印度', 'インド', 'India'], ['np', '尼泊爾', 'ネパール', 'Nepal'], ['us', '美國', 'アメリカ', 'United States'],
  ['ca', '加拿大', 'カナダ', 'Canada'], ['gb', '英國', 'イギリス', 'United Kingdom'], ['fr', '法國', 'フランス', 'France'],
  ['de', '德國', 'ドイツ', 'Germany'], ['it', '義大利', 'イタリア', 'Italy'], ['es', '西班牙', 'スペイン', 'Spain'],
  ['au', '澳洲', 'オーストラリア', 'Australia'], ['nz', '紐西蘭', 'ニュージーランド', 'New Zealand'], ['br', '巴西', 'ブラジル', 'Brazil'],
  ['mx', '墨西哥', 'メキシコ', 'Mexico']
];
export const NATIONALITY_NONE = ['none', '不想透露', '答えたくない', 'Prefer not to say'];

export const GENDER_WANTS = [
  ['male', '男性', '男性', 'Men'],
  ['female', '女性', '女性', 'Women'],
  ['nonbinary', '非二元／其他性別', 'ノンバイナリー／その他', 'Non-binary / another gender'],
  ['any', '不在意性別', '性別は気にしない', 'Any gender']
];
