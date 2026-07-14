/* ===== JadeSeal.js — 確認玉璽（謎題提交按鈕） ===== */
export class JadeSeal {
  /**
   * @param {object} opts
   * @param {string} opts.label 璽面文字（預設「印」）
   * @param {function} opts.onConfirm 點擊回呼
   */
  constructor({ label = '印', onConfirm } = {}) {
    this.label = label;
    this.onConfirm = onConfirm;
    this.el = this._build();
  }

  _build() {
    const wrap = document.createElement('div');
    wrap.className = 'jade-seal';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', '確認');
    wrap.innerHTML = `
      <svg viewBox="0 0 100 100" class="jade-seal-svg">
        <rect x="18" y="18" width="64" height="64" rx="8"
              fill="#6E8B7A" stroke="#47604F" stroke-width="3"/>
        <rect x="26" y="26" width="48" height="48" rx="4"
              fill="none" stroke="#F3ECDD" stroke-width="1.5" opacity="0.6"/>
        <text x="50" y="58" text-anchor="middle" font-family="serif"
              font-size="30" fill="#F3ECDD">${this.label}</text>
      </svg>
      <span class="jade-seal-cap">確認</span>`;
    const fire = () => this._press();
    wrap.addEventListener('click', fire);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
    return wrap;
  }

  _press() {
    this.el.classList.remove('stamping');
    void this.el.offsetWidth;         // reflow 重觸動畫
    this.el.classList.add('stamping'); // 下沉 + 印泥暈染（見 animations.css）
    if (typeof this.onConfirm === 'function') this.onConfirm();
  }

  disable(v = true) { this.el.classList.toggle('disabled', v); }
}
export default JadeSeal;
