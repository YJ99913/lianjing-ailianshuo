/* ===== easterEggs.js — 彩蛋定義（16 項，含康軒課文文化知識） =====
 * 每個彩蛋 = 場景中一件隱藏可點物件，點擊後以卷軸展示一段文化知識，並收入 Codex。
 */
export const EASTER_EGGS = [
  { id: 'egg_zhou_life', level: 4, title: '周敦頤其人',
    html: '周敦頤，字茂叔，北宋道州營道人。為官正直清廉，人品高潔。晚年隱居廬山，建濂溪書堂，世稱「濂溪先生」。' },
  { id: 'egg_zhou_timeline', level: 4, title: '濂溪年表',
    html: '生於真宗天禧元年（1017），卒於神宗熙寧六年（1073），享年五十七。一生為州縣地方官，俸祿甚微，仍捐積蓄救濟宗族。' },
  { id: 'egg_lixue', level: 4, title: '理學之祖',
    html: '周敦頤融合佛、道思想於儒學，開創「理學」，被尊為宋代理學開山始祖。程顥、程頤（二程）皆出其門下。' },
  { id: 'egg_ercheng', level: 3, title: '二程受業',
    html: '程顥、程頤兄弟師事周敦頤，後均成著名理學家，將理學發揚光大，史稱「程朱理學」之源。' },
  { id: 'egg_taoyuanming', level: 2, title: '陶淵明與菊',
    html: '「晉陶淵明獨愛菊」。陶淵明不為五斗米折腰，歸隱田園，菊遂成隱逸高潔的象徵。文中以菊襯蓮，凸顯君子入世之志。' },
  { id: 'egg_mudan', level: 2, title: '牡丹．國色',
    html: '「自李唐來，世人盛愛牡丹」。唐人尚牡丹，視為富貴華麗之花。文中以牡丹反襯，批判世人逐富貴之風。' },
  { id: 'egg_lotus_botany', level: 1, title: '蓮之生態',
    html: '蓮生於水底淤泥，花梗中空而外挺直，不生蔓、不旁枝。周敦頤正是取其生態特徵，一一對應君子品德。' },
  { id: 'egg_chuni', level: 1, title: '「淤」字音義',
    html: '「淤」音ㄩ，指水底爛泥。「出淤泥而不染」的「染」為沾染汙濁——最能代表君子潔身自守。' },
  { id: 'egg_shuti', level: 3, title: '何謂「說」體',
    html: '「說」又稱「雜說」，是古代用來解說事理或表達看法的文體，與「論」性質相近，合稱「論說文」。' },
  { id: 'egg_jiewuyanzhi', level: 3, title: '借物言志',
    html: '作者藉描寫蓮花的具體形象，寄託思想與人生理想——這正是〈愛蓮說〉最核心的寫作手法。' },
  { id: 'egg_binyu', level: 5, title: '賓語提前',
    html: '「菊之愛」「蓮之愛」原為「愛菊」「愛蓮」，將賓語提前並加助詞「之」。同類如「唯利是圖」「馬首是瞻」。' },
  { id: 'egg_plants', level: 2, title: '花木象徵',
    html: '松柏堅貞、竹虛心有節、梅傲骨、蘭高潔、菊隱逸、蓮清廉、牡丹富貴、紅豆相思——中國文學的花木密碼。' },
  { id: 'egg_buran_buddhism', level: 1, title: '不染與佛理',
    html: '「出淤泥而不染」與佛教「不染世俗」相呼應，體現佛道思想對周敦頤理學的影響。' },
  { id: 'egg_lianchi', level: 4, title: '濂溪蓮池',
    html: '周敦頤曾在軍衙東側掘池種蓮，公餘與友人池畔賞花品茗。他留下的蓮池與〈愛蓮說〉，為後世珍視。' },
  { id: 'egg_liangxiu', level: 5, title: '兩袖清風',
    html: '周敦頤離任廬陵時，將俸祿盡數資助貧困子弟，只餘兩袖清風——正是「不慕錢財，以正道為貴」的寫照。' },
  { id: 'egg_secret_room', level: 5, title: '隱藏．淨植台',
    html: '若你讀懂了那聲「噫」的言外之意，又幾乎不倚賴提示——一條通往「淨植台」的路，將為真正的君子開啟。' },
];
export function getEgg(id) { return EASTER_EGGS.find(e => e.id === id) || null; }
export function eggsByLevel(lv) { return EASTER_EGGS.filter(e => e.level === lv); }
export default EASTER_EGGS;
