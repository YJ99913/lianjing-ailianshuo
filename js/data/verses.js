/* ===== verses.js — 《愛蓮說》全文與殘句拆解（單一真相來源） ===== */

/** 全文（周敦頤．愛蓮說，一百一十九字） */
export const FULL_TEXT =
  '水陸草木之花，可愛者甚蕃：晉陶淵明獨愛菊，自李唐來，世人盛愛牡丹。' +
  '予獨愛蓮之出淤泥而不染，濯清漣而不妖；中通外直，不蔓不枝；' +
  '香遠益清，亭亭淨植，可遠觀而不可褻玩焉。' +
  '予謂：菊，花之隱逸者也；牡丹，花之富貴者也；蓮，花之君子者也。' +
  '噫！菊之愛，陶後鮮有聞。蓮之愛，同予者何人？牡丹之愛，宜乎眾矣！';

/** 五枚殘句竹簡：每關還原一枚，第五關統整全文 */
export const VERSES = [
  { id: 'verse_1', level: 1, name: '殘簡・淤泥',
    text: '出淤泥而不染',
    meaning: '蓮從汙泥中生長，卻不受汙染——象徵君子潔身自愛，不同流合汙。' },
  { id: 'verse_2', level: 2, name: '殘簡・清漣',
    text: '濯清漣而不妖',
    meaning: '蓮在清水中洗濯卻不妖媚——象徵君子品格清高，不媚世隨俗。' },
  { id: 'verse_3', level: 3, name: '殘簡・通直',
    text: '中通外直，不蔓不枝',
    meaning: '花梗中空外直、不蔓生不旁枝——象徵君子虛心正直，不攀附關係。' },
  { id: 'verse_4', level: 4, name: '殘簡・遠清',
    text: '香遠益清，亭亭淨植，可遠觀而不可褻玩焉',
    meaning: '香氣遠播更清、亭亭挺立——象徵君子德性芬芳、令人敬重而不敢輕慢。' },
  { id: 'verse_5', level: 5, name: '殘簡・知音',
    text: '噫！菊之愛，陶後鮮有聞。蓮之愛，同予者何人？牡丹之愛，宜乎眾矣！',
    meaning: '感嘆愛菊隱者稀、愛蓮君子少、逐富貴者眾——這正是作者的言外之意。' },
];

/** 三花象徵（第二關對比用） */
export const FLOWERS = [
  { id: 'ju',    name: '菊',   persona: '隱逸者', trait: '避世隱居、獨善其身', symbol: '隱逸' },
  { id: 'mudan', name: '牡丹', persona: '富貴者', trait: '濃艷華麗、追逐富貴', symbol: '富貴' },
  { id: 'lian',  name: '蓮',   persona: '君子',   trait: '出淤泥而不染、不媚世', symbol: '君子' },
];

/** 蓮特質 ↔ 君子品德（象徵配對題庫，貫穿各關） */
export const SYMBOL_PAIRS = [
  { verse: '出淤泥而不染', virtue: '潔身自愛，不同流合汙' },
  { verse: '濯清漣而不妖', virtue: '品格清高，不媚世隨俗' },
  { verse: '中通外直',     virtue: '虛心正直' },
  { verse: '不蔓不枝',     virtue: '不攀附關係，獨立自主' },
  { verse: '香遠益清',     virtue: '德性芬芳遠播' },
  { verse: '亭亭淨植',     virtue: '人格高潔令人敬仰' },
  { verse: '可遠觀而不可褻玩', virtue: '使人敬重而不敢輕慢' },
];

/** 全文分段（第五關統整還原的正確語序） */
export const TEXT_SEGMENTS = [
  { order: 1, seg: '予獨愛蓮之出淤泥而不染，濯清漣而不妖', part: '描寫（蓮之出泥不染）' },
  { order: 2, seg: '中通外直，不蔓不枝；香遠益清，亭亭淨植，可遠觀而不可褻玩焉', part: '描寫（蓮之形神）' },
  { order: 3, seg: '菊，花之隱逸者也；牡丹，花之富貴者也；蓮，花之君子者也', part: '評論（三花人格）' },
  { order: 4, seg: '噫！菊之愛，陶後鮮有聞。蓮之愛，同予者何人？牡丹之愛，宜乎眾矣', part: '感嘆（言外之意）' },
];

export function getVerse(id) { return VERSES.find(v => v.id === id) || null; }
export function versesByLevel(lv) { return VERSES.filter(v => v.level === lv); }

export default { FULL_TEXT, VERSES, FLOWERS, SYMBOL_PAIRS, TEXT_SEGMENTS, getVerse, versesByLevel };
