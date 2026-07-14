/* ===== BambooBag.js — 竹編背包（點擊展開道具格） ===== */
import { bus } from '../core/EventBus.js';

export class BambooBag {
  constructor({ getItems } = {}) {
    this.getItems = getItems || (() => []);
    this.open = false;
    this.el = this._build();
    // 有新道具時微光
    this._off = bus.on('item:pickup', () => this._flash());
  }

  _build() {
    const wrap = document.createElement('div');
    wrap.className = 'bamboo-bag hud-item';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', '背包');
    wrap.innerHTML = `
      <svg viewBox="0 0 70 64" class="bag-svg">
        <path d="M10 22 Q35 4 60 22 L56 58 Q35 64 14 58 Z"
              fill="#C9A96A" stroke="#47604F" stroke-width="2"/>
        <path d="M18 24 h34 M16 34 h38 M16 44 h38" stroke="#4A4640" stroke-width="1.4" opacity="0.5"/>
        <path d="M28 26 v28 M40 26 v28" stroke="#4A4640" stroke-width="1.4" opacity="0.5"/>
        <path d="M22 20 Q35 10 48 20" fill="none" stroke="#47604F" stroke-width="3"/>
      </svg>
      <span class="hud-cap">背包</span>
      <div class="bag-panel" hidden></div>`;
    const toggle = () => this.toggle();
    wrap.querySelector('.bag-svg').addEventListener('click', toggle);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    return wrap;
  }

  toggle() {
    this.open = !this.open;
    const panel = this.el.querySelector('.bag-panel');
    if (this.open) { this._render(panel); panel.hidden = false; panel.classList.add('show'); }
    else { panel.classList.remove('show'); setTimeout(() => panel.hidden = true, 250); }
  }

  _render(panel) {
    const items = this.getItems();
    panel.innerHTML = items.length
      ? `<ul class="bag-grid">${items.map(it =>
          `<li class="bag-cell" title="${it.name || it.id}">${it.icon || '📜'}<span>${it.name || it.id}</span></li>`
        ).join('')}</ul>`
      : `<p class="bag-empty">竹包空空，尚無所得。</p>`;
  }

  _flash() { this.el.classList.add('flash'); setTimeout(() => this.el.classList.remove('flash'), 800); }
  destroy() { this._off && this._off(); }
}
export default BambooBag;
