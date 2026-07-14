/* ===== SealButton.js — 印章（開始／主要動作，蓋章動畫） ===== */
export class SealButton {
  /**
   * @param {object} opts
   * @param {string} opts.text 印面文字（預設「始」）
   * @param {string} opts.caption 下方標籤
   * @param {function} opts.onClick
   */
  constructor({ text = '始', caption = '開始', onClick } = {}) {
    this.onClick = onClick;
    this.el = this._build(text, caption);
  }

  _build(text, caption) {
    const wrap = document.createElement('div');
    wrap.className = 'seal-button';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', caption);
    wrap.innerHTML = `
      <svg viewBox="0 0 120 120" class="seal-svg">
        <rect x="14" y="14" width="92" height="92" rx="10"
              fill="#9E4B3B" stroke="#7d3a2d" stroke-width="3"/>
        <rect x="24" y="24" width="72" height="72" rx="6"
              fill="none" stroke="#F3ECDD" stroke-width="2" opacity="0.85"/>
        <text x="60" y="76" text-anchor="middle" font-family="serif"
              font-size="52" fill="#F3ECDD">${text}</text>
      </svg>
      <span class="seal-cap">${caption}</span>`;
    const fire = () => this._press();
    wrap.addEventListener('click', fire);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
    return wrap;
  }

  _press() {
    this.el.classList.remove('stamp');
    void this.el.offsetWidth;
    this.el.classList.add('stamp');
    if (typeof this.onClick === 'function') setTimeout(this.onClick, 260);
  }
}
export default SealButton;
