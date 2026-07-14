/* ===== HUD.js — 四角 HUD 統籌（章節/計時/背包/燈籠） ===== */
import { bus } from '../core/EventBus.js';
import { BambooBag } from './BambooBag.js';
import { Lantern } from './Lantern.js';

const SCENE_TITLE = {
  level1: '第一試・淤泥門', level2: '第二試・三花圃',
  level3: '第三試・通直廊', level4: '第四試・濂溪堂',
  level5: '第五試・蓮心堂',
};

export class HUD {
  constructor({ layer, getItems } = {}) {
    this.layer = layer || document.getElementById('hud-layer');
    this.getItems = getItems || (() => []);
    this.bag = new BambooBag({ getItems: this.getItems });
    this.lantern = new Lantern();
    this._build();
    this._bind();
    this.hide(); // 預設隱藏，進入關卡才顯示
  }

  _build() {
    // 左上：章節牌
    this.chapter = document.createElement('div');
    this.chapter.className = 'hud-topleft chapter-tag';
    this.chapter.innerHTML = `<span class="chapter-text">—</span>`;

    // 右上：香炷計時
    this.timer = document.createElement('div');
    this.timer.className = 'hud-topright incense-timer';
    this.timer.innerHTML = `
      <svg viewBox="0 0 20 60" class="incense-svg" aria-hidden="true">
        <rect x="9" y="6" width="2" height="48" fill="#C9A96A"/>
        <rect class="incense-burn" x="8.5" y="6" width="3" height="0" fill="#9E4B3B"/>
        <ellipse cx="10" cy="56" rx="6" ry="2.5" fill="#4A4640"/>
      </svg>
      <span class="timer-text">08:00</span>
      <span class="timer-total">共 00:00</span>`;

    // 左下背包、右下燈籠
    this.bag.el.classList.add('hud-bottomleft');
    this.lantern.el.classList.add('hud-bottomright');

    this.layer.append(this.chapter, this.timer, this.bag.el, this.lantern.el);
  }

  _bind() {
    bus.on('scene:enter', ({ scene }) => {
      if (scene && scene.startsWith('level')) {
        this.setChapter(SCENE_TITLE[scene] || scene);
        this.lantern.reset();
        this.show();
      } else {
        this.hide();
      }
    });
    // 由 Timer 系統（M9）發布，這裡先接介面更新
    bus.on('timer:tick', ({ remain, total }) => this.setTime(remain, total));
  }

  setChapter(text) { this.chapter.querySelector('.chapter-text').textContent = text; }

  setTime(remainSec = 0, totalSec = 0) {
    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    this.timer.querySelector('.timer-text').textContent = fmt(Math.max(0, remainSec));
    this.timer.querySelector('.timer-total').textContent = `共 ${fmt(Math.max(0, totalSec))}`;
    const burn = this.timer.querySelector('.incense-burn');
    if (burn) { const p = Math.min(1, 1 - remainSec / 480); burn.setAttribute('height', (48 * p).toFixed(1)); }
  }

  show() { this.layer.querySelectorAll('.hud-topleft,.hud-topright,.hud-bottomleft,.hud-bottomright').forEach(e => e.style.opacity = '1'); }
  hide() { this.layer.querySelectorAll('.hud-topleft,.hud-topright,.hud-bottomleft,.hud-bottomright').forEach(e => e.style.opacity = '0'); }
}
export default HUD;
