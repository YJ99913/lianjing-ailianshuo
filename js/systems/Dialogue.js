/* ===== Dialogue.js — NPC 對話（逐字打字 + 分支選項） ===== */
import { bus } from '../core/EventBus.js';

export class Dialogue {
  constructor({ layer } = {}) {
    this.layer = layer || document.getElementById('dialogue-layer');
    this.box = null;
    this._typing = false;
  }

  /** 播放一組對白（陣列），逐句點擊前進，結束後 resolve */
  play({ npc = '', lines = [] } = {}) {
    return new Promise(resolve => {
      let i = 0;
      this._ensureBox();
      const showLine = () => {
        if (i >= lines.length) { this.close(); resolve(); return; }
        this._type(npc, lines[i]);
        i++;
      };
      this._advance = () => { if (this._typing) { this._finishTyping(); } else { showLine(); } };
      this.box.onclick = this._advance;
      showLine();
    });
  }

  /** 呈現分支提問，回傳所選 option 物件 */
  ask({ npc = '', prompt = '', options = [] } = {}) {
    return new Promise(resolve => {
      this._ensureBox();
      this.box.onclick = null;
      this.box.innerHTML = `
        <p class="dlg-npc">${npc}</p>
        <p class="dlg-text">${prompt}</p>
        <ul class="dlg-options">
          ${options.map((o, idx) => `<li class="dlg-opt" data-i="${idx}" role="button" tabindex="0">${o.text}</li>`).join('')}
        </ul>`;
      this.box.querySelectorAll('.dlg-opt').forEach(li => {
        const pick = () => resolve(options[+li.dataset.i]);
        li.addEventListener('click', pick);
        li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
    });
  }

  /** 顯示單句回饋（如選項後的評語），點擊關閉 */
  say({ npc = '', line = '' } = {}) {
    return this.play({ npc, lines: [line] });
  }

  _ensureBox() {
    if (this.box) return;
    this.box = document.createElement('div');
    this.box.className = 'dialogue-box';
    this.layer.appendChild(this.box);
  }

  _type(npc, text) {
    this._typing = true;
    this._fullText = text;
    this.box.innerHTML = `<p class="dlg-npc">${npc}</p><p class="dlg-text"></p><span class="dlg-more">▾</span>`;
    const el = this.box.querySelector('.dlg-text');
    let n = 0;
    clearInterval(this._timer);
    this._timer = setInterval(() => {
      el.textContent = text.slice(0, ++n);
      if (n >= text.length) { clearInterval(this._timer); this._typing = false; }
    }, 34);
  }

  _finishTyping() {
    clearInterval(this._timer);
    if (this.box) { const el = this.box.querySelector('.dlg-text'); if (el) el.textContent = this._fullText; }
    this._typing = false;
  }

  close() {
    clearInterval(this._timer);
    if (this.box) { this.box.remove(); this.box = null; }
  }
}
export default Dialogue;
