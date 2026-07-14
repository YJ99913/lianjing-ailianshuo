/* ===== ScrollPanel.js — 卷軸面板（返回 / 顯示文本，卷軸展開動畫） ===== */
export class ScrollPanel {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.mount 掛載層（通常 panel-layer）
   */
  constructor({ mount } = {}) {
    this.mount = mount || document.getElementById('panel-layer');
    this.el = null;
  }

  /** 展開卷軸顯示內容（title + html 內文） */
  show({ title = '', html = '', onClose } = {}) {
    this.close(true);
    const el = document.createElement('div');
    el.className = 'scroll-panel';
    el.innerHTML = `
      <div class="scroll-roller top"></div>
      <div class="scroll-paper">
        ${title ? `<h3 class="scroll-title">${title}</h3>` : ''}
        <div class="scroll-content">${html}</div>
        <div class="scroll-back" role="button" tabindex="0" aria-label="返回">— 收 卷 —</div>
      </div>
      <div class="scroll-roller bottom"></div>`;
    this.mount.appendChild(el);
    this.el = el;
    this._onClose = onClose;
    requestAnimationFrame(() => el.classList.add('unroll')); // 觸發展開動畫

    const back = el.querySelector('.scroll-back');
    const doClose = () => this.close();
    back.addEventListener('click', doClose);
    back.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doClose(); } });
  }

  close(immediate = false) {
    if (!this.el) return;
    const el = this.el; this.el = null;
    const cb = this._onClose;
    if (immediate) { el.remove(); return; }
    el.classList.remove('unroll');
    el.classList.add('rolling');
    setTimeout(() => { el.remove(); if (typeof cb === 'function') cb(); }, 500);
  }
}
export default ScrollPanel;
