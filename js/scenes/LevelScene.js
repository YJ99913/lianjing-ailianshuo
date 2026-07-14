/* ===== LevelScene.js — 通用關卡場景（資料驅動，五關共用） =====
 * 流程：進場 BGM → intro 對話 → 探索(彩蛋熱區) → 依序解三型謎題
 *       → 取得殘句 → 加能力值 → 解成就 → clear 對話 → 關卡結尾 → 下一關
 */
import { SceneBase } from './SceneBase.js';
import { getLevel } from '../data/levels.js';
import { getDialogue } from '../data/dialogues.js';
import { getVerse } from '../data/verses.js';
import { eggsByLevel, getEgg } from '../data/easterEggs.js';
import { bus } from '../core/EventBus.js';

const BG_LABEL = {
  level1: '淤泥門 · 霧鎖殘荷', level2: '三花圃 · 菊牡丹蓮',
  level3: '通直廊 · 竹林花窗', level4: '濂溪堂 · 書房古琴',
  level5: '蓮心堂 · 一池清蓮',
};

export class LevelScene extends SceneBase {
  constructor(levelId) { super(levelId); this.level = getLevel(levelId); this.levelNum = parseInt(levelId.replace('level', ''), 10); }

  render() {
    const eggs = eggsByLevel(this.levelNum);
    return `
      <div class="scene scene-level scene-${this.id}">
        <div class="level-bg"><span class="level-bg-label">〔${BG_LABEL[this.id] || this.id}〕</span></div>
        ${eggs.map((e, i) => `<span class="hotspot egg-spot" data-egg="${e.id}"
            style="left:${12 + i * 20}%; top:${20 + (i % 2) * 40}%; width:52px; height:52px;"
            title="可探索" role="button" tabindex="0">✦</span>`).join('')}
        <div class="level-actions">
          <span class="level-explore-tip">✦ 為可探索之處（彩蛋）；準備好後點此開始試煉</span>
          <span class="op-enter level-begin" id="lvBegin" role="button" tabindex="0">— 開始試煉 —</span>
        </div>
      </div>`;
  }

  async onEnter(ctx) {
    this.ctx = ctx;
    bus.emit('audio:bgm', { track: this.level.bgm });

    // 彩蛋熱區
    this.$$('.egg-spot').forEach(sp => {
      const open = () => this._openEgg(sp.dataset.egg, sp);
      sp.addEventListener('click', open);
      sp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // intro 對話
    const intro = getDialogue(this.level.intro);
    if (intro) await ctx.dialogue.play(intro);

    // 開始試煉
    this.$('#lvBegin').addEventListener('click', () => this._startPuzzles());
    this.$('#lvBegin').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') this._startPuzzles(); });
  }

  _openEgg(id, sp) {
    const egg = getEgg(id); if (!egg) return;
    this.ctx.scroll.show({ title: egg.title, html: `<p>${egg.html}</p>` });
    if (!sp.classList.contains('found')) {
      sp.classList.add('found'); sp.textContent = '✧';
      bus.emit('egg:unlock', { id });
    }
  }

  async _startPuzzles() {
    const begin = this.$('#lvBegin'); if (begin) begin.style.display = 'none';
    const host = document.createElement('div');
    host.className = 'puzzle-host';
    this.ctx.layers.panel.appendChild(host);

    let insightHit = false;
    for (const def of this.level.puzzles) {
      host.innerHTML = '';
      bus.emit('puzzle:start', { level: this.id, id: def.id });
      const res = await this.ctx.puzzle.run(def, host, this.ctx);
      if (res && res.insight) insightHit = true;
    }
    host.remove();

    // 取得殘句 + 能力 + 成就
    const verse = getVerse(this.level.verse);
    if (verse) {
      bus.emit('item:pickup', { id: verse.id, name: verse.name });
      bus.emit('collectible:get', { id: verse.id });
      this.ctx.scroll.show({ title: `獲得 ${verse.name}`, html: `<p class="verse-line">${verse.text}</p><p>${verse.meaning}</p>` });
      await this._wait(1600);
      this.ctx.scroll.close();
    }
    bus.emit('ability:gain', { key: this.level.ability, amount: 100, insight: insightHit });
    if (this.level.achievement) bus.emit('achievement:unlock', { id: this.level.achievement });
    if (insightHit) bus.emit('flag:set', { key: 'insightTriggered', value: true });

    // clear 對話
    const clear = getDialogue(this.level.clear);
    if (clear) await this.ctx.dialogue.play(clear);

    bus.emit('level:cleared', { level: this.id });
    await this.ctx.game.next();
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}
export default LevelScene;
