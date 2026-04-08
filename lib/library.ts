export interface LibraryItem {
  id: string
  title: string
  titleUrdu: string
  category: 'huroof' | 'islamic' | 'school' | 'poems'
  categoryLabel: string
  lines: string[]
  recommendedPreset: string
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  // ─── Huroof ──────────────────────────────────────────────────────────────
  {
    id: 'alif-bay',
    title: 'Urdu Alphabet (Alif to Yay)',
    titleUrdu: 'اردو حروف تہجی (الف سے یاء)',
    category: 'huroof',
    categoryLabel: 'حروف تہجی',
    recommendedPreset: 'playgroup',
    lines: [
      'ا  ب  پ  ت  ٹ',
      'ث  ج  چ  ح  خ',
      'د  ڈ  ذ  ر  ڑ',
      'ز  ژ  س  ش  ص',
      'ض  ط  ظ  ع  غ',
      'ف  ق  ک  گ  ل',
      'م  ن  و  ہ  ی',
    ],
  },
  {
    id: 'alif-forms',
    title: 'Letter Alif — all forms',
    titleUrdu: 'حرف الف — تمام اشکال',
    category: 'huroof',
    categoryLabel: 'حروف تہجی',
    recommendedPreset: 'playgroup',
    lines: ['ا  آ  اَ  اِ  اُ'],
  },

  // ─── Islamic ─────────────────────────────────────────────────────────────
  {
    id: 'bismillah',
    title: 'Bismillah',
    titleUrdu: 'بسم اللہ',
    category: 'islamic',
    categoryLabel: 'اسلامی',
    recommendedPreset: 'kg',
    lines: [
      'بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ',
    ],
  },
  {
    id: 'surah-fatiha',
    title: 'Surah Al-Fatiha',
    titleUrdu: 'سورۃ الفاتحہ',
    category: 'islamic',
    categoryLabel: 'اسلامی',
    recommendedPreset: 'class1-3',
    lines: [
      'بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ',
      'اَلْحَمْدُ لِلّٰہِ رَبِّ الْعٰلَمِیْنَ',
      'اَلرَّحْمٰنِ الرَّحِیْمِ',
      'مٰلِکِ یَوْمِ الدِّیْنِ',
      'اِیَّاکَ نَعْبُدُ وَاِیَّاکَ نَسْتَعِیْنُ',
      'اِہْدِنَا الصِّرَاطَ الْمُسْتَقِیْمَ',
      'صِرَاطَ الَّذِیْنَ اَنْعَمْتَ عَلَیْہِمْ',
      'غَیْرِ الْمَغْضُوْبِ عَلَیْہِمْ وَلَا الضَّآلِّیْنَ',
    ],
  },
  {
    id: 'surah-ikhlas',
    title: 'Surah Al-Ikhlas',
    titleUrdu: 'سورۃ الاخلاص',
    category: 'islamic',
    categoryLabel: 'اسلامی',
    recommendedPreset: 'class1-3',
    lines: [
      'قُلْ ہُوَ اللّٰہُ اَحَدٌ',
      'اَللّٰہُ الصَّمَدُ',
      'لَمْ یَلِدْ وَلَمْ یُوْلَدْ',
      'وَلَمْ یَکُنْ لَّہٗ کُفُوًا اَحَدٌ',
    ],
  },
  {
    id: 'kalima-tayyiba',
    title: 'Kalima Tayyiba',
    titleUrdu: 'کلمہ طیبہ',
    category: 'islamic',
    categoryLabel: 'اسلامی',
    recommendedPreset: 'kg',
    lines: [
      'لَآ اِلٰہَ اِلَّا اللّٰہُ مُحَمَّدٌ رَّسُوْلُ اللّٰہِ',
    ],
  },
  {
    id: 'duas-daily',
    title: 'Daily Duas',
    titleUrdu: 'روزانہ کی دعائیں',
    category: 'islamic',
    categoryLabel: 'اسلامی',
    recommendedPreset: 'class1-3',
    lines: [
      'بِسْمِ اللّٰہِ (کھانے سے پہلے)',
      'اَلْحَمْدُ لِلّٰہِ (کھانے کے بعد)',
      'اَلسَّلَامُ عَلَیْکُمْ (ملتے وقت)',
      'وَعَلَیْکُمُ السَّلَام (جواب میں)',
      'اِنْ شَآءَ اللّٰہ (آئندہ کے لیے)',
      'جَزَاکَ اللّٰہُ خَیْرًا (شکریہ)',
    ],
  },

  // ─── School ───────────────────────────────────────────────────────────────
  {
    id: 'days-of-week',
    title: 'Days of the Week',
    titleUrdu: 'ہفتے کے دن',
    category: 'school',
    categoryLabel: 'اسکول',
    recommendedPreset: 'class1-3',
    lines: [
      'پیر',
      'منگل',
      'بدھ',
      'جمعرات',
      'جمعہ',
      'ہفتہ',
      'اتوار',
    ],
  },
  {
    id: 'months-urdu',
    title: 'Months of the Year',
    titleUrdu: 'مہینوں کے نام',
    category: 'school',
    categoryLabel: 'اسکول',
    recommendedPreset: 'class1-3',
    lines: [
      'جنوری  فروری  مارچ',
      'اپریل  مئی   جون',
      'جولائی  اگست  ستمبر',
      'اکتوبر  نومبر  دسمبر',
    ],
  },
  {
    id: 'numbers-1-10',
    title: 'Numbers 1–10 in Urdu',
    titleUrdu: 'گنتی ۱ تا ۱۰',
    category: 'school',
    categoryLabel: 'اسکول',
    recommendedPreset: 'kg',
    lines: [
      'ایک   دو   تین',
      'چار   پانچ  چھ',
      'سات   آٹھ  نو',
      'دس',
    ],
  },
  {
    id: 'colours',
    title: 'Colours',
    titleUrdu: 'رنگوں کے نام',
    category: 'school',
    categoryLabel: 'اسکول',
    recommendedPreset: 'class1-3',
    lines: [
      'سرخ   نیلا   سبز',
      'زرد   سفید   کالا',
      'نارنجی  بنفشی  گلابی',
    ],
  },
  {
    id: 'body-parts',
    title: 'Body Parts',
    titleUrdu: 'جسم کے اعضاء',
    category: 'school',
    categoryLabel: 'اسکول',
    recommendedPreset: 'class1-3',
    lines: [
      'سر   آنکھ   کان',
      'ناک   منہ   دانت',
      'ہاتھ   پیر   انگلی',
    ],
  },

  // ─── Poems ────────────────────────────────────────────────────────────────
  {
    id: 'lab-pe-aati',
    title: 'Lab Pe Aati Hai (Iqbal)',
    titleUrdu: 'لب پہ آتی ہے (اقبال)',
    category: 'poems',
    categoryLabel: 'نظمیں',
    recommendedPreset: 'class1-3',
    lines: [
      'لب پہ آتی ہے دعا بن کے تمنا میری',
      'زندگی شمع کی صورت ہو خدایا میری',
      'دور دنیا کا مرے دم سے اندھیرا ہو جائے',
      'ہر جگہ میرے چمکنے سے اجالا ہو جائے',
    ],
  },
  {
    id: 'mera-pakistan',
    title: 'Mera Pakistan',
    titleUrdu: 'میرا پاکستان',
    category: 'poems',
    categoryLabel: 'نظمیں',
    recommendedPreset: 'class1-3',
    lines: [
      'پاکستان کا مطلب کیا — لا الہ الا اللہ',
      'سبز ہلالی پرچم میرا — میری شان ہے',
      'اے وطن کے سجیلے جوانو — میرے نغمے تمہارے لیے',
    ],
  },
]

export const LIBRARY_CATEGORIES = [
  { id: 'all',     label: 'سب',         labelEn: 'All'      },
  { id: 'huroof',  label: 'حروف تہجی',  labelEn: 'Alphabet' },
  { id: 'islamic', label: 'اسلامی',     labelEn: 'Islamic'  },
  { id: 'school',  label: 'اسکول',      labelEn: 'School'   },
  { id: 'poems',   label: 'نظمیں',      labelEn: 'Poems'    },
]
