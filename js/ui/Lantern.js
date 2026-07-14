/* ===== Lantern.js — 燈籠提示（三階遞進） ===== */
import { bus } from '../core/EventBus.js';

export class Lantern {
  constructor() {
    this.stage = 0;            // 0=未用；1/2/3 三階
    this.el = this._build();
  }

  _build() {
    const wrap = document.createElement('div');
    wrap.className = 'lantern hud-item';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', '提示');
    wrap.innerHTML = `
      <svg viewBox="0 0 60 90" class="lantern-svg">
        <line x1="30" y1="0" x2="30" y2="10" stroke="#4A4640" stroke-width="2"/>
        <ellipse class="lantern-body" cx="30" cy="45" rx="22" ry="30"
                 fill="#9E4B3B" stroke="#47604F" stroke-width="2"/>
        <rect x="14" y="12" width="32" height="6" rx="2" fill="#4A4640"/>
        <rect x="14" y="72" width="32" height="6" rx="2" fill="#4A4640"/>
        <line x1="30" y1="78" x2="30" y2="88" stroke="#C9A96A" stroke-width="2"/>
        <circle class="lantern-glow" cx="30" cy="45" r="30" fill="#C9A96A" opacity="0"/>
      </svg>
      <span class="hud-cap">提示</span>`;
    const fire = () => this.request();
    wrap.addEventListener('click', fire);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
    return wrap;
  }

  /** 玩家索取提示：三階遞進，發事件給 HintSystem */
  request() {
    this.stage = Math.min(this.stage + 1, 3);
    this.el.style.setProperty('--glow', (this.stage / 3).toFixed(2));
    this.el.classList.add('lit');
    const glow = this.el.querySelector('.lantern-glow');
    if (glow) glow.setAttribute('opacity', (0.15 * this.stage).toFixed(2));
    bus.emit('hint:request', { stage: this.stage });
  }

  /** 換關時重置 */
  reset() {
    this.stage = 0;
    this.el.classList.remove('lit');
    const glow = this.el.querySelector('.lantern-glow');
    if (glow) glow.setAttribute('opacity', '0');
  }
}
export default Lantern;
