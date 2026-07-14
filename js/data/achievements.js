/* ===== achievements.js — 成就定義（20 項） ===== */
export const ACHIEVEMENTS = [
  { id: 'ach_1',  name: '初入蓮境',   desc: '完成教學，踏入書院。' },
  { id: 'ach_2',  name: '出淤泥',     desc: '通關第一關・淤泥門。' },
  { id: 'ach_3',  name: '辨花者',     desc: '通關第二關・三花圃。' },
  { id: 'ach_4',  name: '中通外直',   desc: '通關第三關・通直廊。' },
  { id: 'ach_5',  name: '聞弦知意',   desc: '通關第四關・濂溪堂。' },
  { id: 'ach_6',  name: '蓮心可鑑',   desc: '通關第五關・蓮心堂。' },
  { id: 'ach_7',  name: '蓮花知音',   desc: '達成真結局。' },
  { id: 'ach_8',  name: '真正君子',   desc: '達成隱藏結局。' },
  { id: 'ach_9',  name: '博覽群書',   desc: '收集全部閱讀文件。' },
  { id: 'ach_10', name: '探索者',     desc: '場景互動覆蓋率達九成。' },
  { id: 'ach_11', name: '解謎高手',   desc: '全程未使用第三階提示。' },
  { id: 'ach_12', name: '一氣呵成',   desc: '單關全程未使用提示。' },
  { id: 'ach_13', name: '濯清漣',     desc: '完成所有清水顯字機關。' },
  { id: 'ach_14', name: '不蔓不枝',   desc: '語序拼接零錯誤。' },
  { id: 'ach_15', name: '香遠益清',   desc: '集齊全部彩蛋。' },
  { id: 'ach_16', name: '陶潛知己',   desc: '觸發陶淵明彩蛋。' },
  { id: 'ach_17', name: '洛陽花下',   desc: '觸發牡丹文化彩蛋。' },
  { id: 'ach_18', name: '濂溪門人',   desc: '觸發理學／二程彩蛋。' },
  { id: 'ach_19', name: '惜時如金',   desc: '四十分鐘內通關。' },
  { id: 'ach_20', name: '不改其樂',   desc: '同一存檔回訪蓮境三次以上。' },
];
export function getAchievement(id) { return ACHIEVEMENTS.find(a => a.id === id) || null; }
export default ACHIEVEMENTS;
