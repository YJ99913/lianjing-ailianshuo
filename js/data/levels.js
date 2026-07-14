/* ===== levels.js — 五關配置（資料驅動：謎題、道具、提示、彩蛋、能力） =====
 * 每關含：id, name, ability(素養), bgm, intro/clear 對話 key, 三種謎題定義, 三階提示, 通關殘句。
 * 謎題型別：reveal(墨痕顯影) / sequence(語序拼接) / match(象徵配對)
 *          / filter(對比篩選) / mechanism(環境機關)
 */
export const LEVELS = [
  {
    id: 'level1', name: '淤泥門', ability: 'retrieve', abilityName: '資訊擷取',
    bgm: 'bgm_lv1', intro: 'level1_intro', clear: 'level1_clear',
    verse: 'verse_1', achievement: 'ach_2',
    puzzles: [
      { type: 'reveal', id: 'l1_reveal', prompt: '牆面被淤泥覆蓋，點取「清水」擦拭三處，讓字浮現。',
        target: '出淤泥而不染', spots: 3 },
      { type: 'sequence', id: 'l1_seq', prompt: '顯出的字被泥漬打亂，請依語意排回正確順序。',
        answer: ['出','淤','泥','而','不','染'], shuffled: ['泥','淤','出','染','不','而'] },
      { type: 'match', id: 'l1_match', prompt: '將「出淤泥而不染」連到它象徵的君子品德。',
        pairs: [{ left: '出淤泥而不染', right: '潔身自愛，不同流合汙' }],
        distractors: ['隨波逐流', '攀附權貴'] },
    ],
    hints: [
      '這裡的「髒」，正是遮住答案的東西。',
      '牆上的泥需要被洗去——先找到能盛水的東西（清水）。',
      '點背包的「清水」，再點牆面三處泥漬，字會浮現；接著把六字排成「出淤泥而不染」，最後連向「潔身自愛」。',
    ],
  },
  {
    id: 'level2', name: '三花圃', ability: 'compare', abilityName: '比較分析',
    bgm: 'bgm_lv2', intro: 'level2_intro', clear: 'level2_clear',
    verse: 'verse_2', achievement: 'ach_3',
    puzzles: [
      { type: 'filter', id: 'l2_filter', prompt: '君子之花評選：篩掉不符「不媚俗、不妖艷」者，留下君子之花。',
        options: [{ id: 'ju', label: '菊（避世）', keep: false }, { id: 'mudan', label: '牡丹（逐貴）', keep: false }, { id: 'lian', label: '蓮（不染不妖）', keep: true }],
        answer: ['lian'] },
      { type: 'match', id: 'l2_match', prompt: '將三花連到它們所象徵的人格。',
        pairs: [{ left: '菊', right: '隱逸者' }, { left: '牡丹', right: '富貴者' }, { left: '蓮', right: '君子' }] },
      { type: 'mechanism', id: 'l2_mech', prompt: '撥動水閘調整水位，讓「濯清漣而不妖」的字浮到正確位置。',
        target: '濯清漣而不妖', kind: 'water', steps: 3 },
    ],
    hints: [
      '三朵花，各有各的「個性」，先分清誰避世、誰逐貴、誰不染。',
      '君子之花，既不像菊避世，也不像牡丹逐貴——它「不媚不妖」。',
      '留下「蓮」；再把菊→隱逸者、牡丹→富貴者、蓮→君子；最後撥水閘三次讓字浮出。',
    ],
  },
  {
    id: 'level3', name: '通直廊', ability: 'infer', abilityName: '推論判斷',
    bgm: 'bgm_lv3', intro: 'level3_intro', clear: 'level3_clear',
    verse: 'verse_3', achievement: 'ach_4',
    puzzles: [
      { type: 'mechanism', id: 'l3_light', prompt: '旋轉三扇花窗，讓陽光在地面投出「中通外直」四字。',
        target: '中通外直', kind: 'light', steps: 3 },
      { type: 'sequence', id: 'l3_seq', prompt: '竹節上「不○不○」的字缺了，補成對稱句。',
        answer: ['不','蔓','不','枝'], shuffled: ['枝','不','蔓','不'] },
      { type: 'match', id: 'l3_match', prompt: '推想竹與蓮的特質，連到對應君子品德。',
        pairs: [{ left: '中通', right: '虛心' }, { left: '外直', right: '正直' }, { left: '不蔓不枝', right: '不攀附' }] },
    ],
    hints: [
      '路不通，是因為它還沒「取直」。',
      '光穿過花窗會成字；竹節上有缺字要補成「不○不○」。',
      '轉三扇花窗成「中通外直」；補「不蔓不枝」；再連中通→虛心、外直→正直、不蔓不枝→不攀附。',
    ],
  },
  {
    id: 'level4', name: '濂溪堂', ability: 'author', abilityName: '作者觀點',
    bgm: 'bgm_lv4', intro: 'level4_intro', clear: 'level4_clear',
    verse: 'verse_4', achievement: 'ach_5',
    puzzles: [
      { type: 'match', id: 'l4_match', prompt: '整理文稿，將末段三句連到象徵的君子德行。',
        pairs: [{ left: '香遠益清', right: '德性芬芳遠播' }, { left: '亭亭淨植', right: '人格高潔令人敬仰' }, { left: '可遠觀而不可褻玩', right: '使人敬重而不敢輕慢' }] },
      { type: 'reveal', id: 'l4_reveal', prompt: '書桌末句被墨團覆蓋，以清水擦出「可遠觀而不可褻玩焉」。',
        target: '可遠觀而不可褻玩焉', spots: 2 },
      { type: 'insight', id: 'l4_insight', prompt: '回答周敦頤關於「言外之意」的提問。',
        dialogueKey: 'level4_insight_q' },
    ],
    hints: [
      '先生的話，字面之外，還藏著一聲嘆息。',
      '他問「同予者何人」，不是真在問人數，是在問——還有誰懂？',
      '選「嘆懂君子之道的人太少、追逐富貴的人太多」，即是言外之意。',
    ],
  },
  {
    id: 'level5', name: '蓮心堂', ability: 'synthesis', abilityName: '統整反思',
    bgm: 'bgm_lv5', intro: 'level5_intro', clear: 'level5_clear',
    verse: 'verse_5', achievement: 'ach_6',
    puzzles: [
      { type: 'sequence', id: 'l5_synth', prompt: '將全文四段依「描寫→評論→感嘆」正確語序嵌入石碑。',
        mode: 'segments',
        answer: [1, 2, 3, 4],
        segments: [
          { order: 3, label: '菊，花之隱逸者也；牡丹，花之富貴者也；蓮，花之君子者也' },
          { order: 1, label: '予獨愛蓮之出淤泥而不染，濯清漣而不妖' },
          { order: 4, label: '噫！菊之愛，陶後鮮有聞。蓮之愛，同予者何人？牡丹之愛，宜乎眾矣' },
          { order: 2, label: '中通外直，不蔓不枝；香遠益清，亭亭淨植，可遠觀而不可褻玩焉' },
        ] },
      { type: 'filter', id: 'l5_final', prompt: '終驗：三象之中，確認何者為君子之定位。',
        options: [{ id: 'ju', label: '菊', keep: false }, { id: 'mudan', label: '牡丹', keep: false }, { id: 'lian', label: '蓮', keep: true }],
        answer: ['lian'] },
      { type: 'mechanism', id: 'l5_relight', prompt: '撥動池心水閘，清水漫過石碑，全文重光。',
        target: '愛蓮說', kind: 'water', steps: 1 },
    ],
    hints: [
      '文章有它的來去次序：先寫景（蓮之特質），後論人（三花），最後才是那一聲「噫」。',
      '順序是：描寫蓮 → 評論三花 → 感嘆言外之意。',
      '依序放：予獨愛蓮… → 中通外直… → 菊花之隱逸者… → 噫！菊之愛…；再確認「蓮」為君子，撥水閘。',
    ],
  },
];

export function getLevel(id) { return LEVELS.find(l => l.id === id) || null; }
export const LEVEL_ORDER = LEVELS.map(l => l.id);
export default LEVELS;
