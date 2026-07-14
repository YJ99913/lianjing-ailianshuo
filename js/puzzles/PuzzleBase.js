/* ===== PuzzleBase.js — 謎題基底 =====
 * 所有謎題繼承此類，統一：
 *   mount(container, ctx)  渲染到指定容器
 *   validate()             回傳 {ok, feedback}
 *   solved 事件            成功時 resolve
 * 失敗不懲罰，只回饋氛圍提示（水波盪開）。
 */
import { bus } from '../core/EventBus.js';

export class PuzzleBase {
  constructor(def = {}) {
    this.def = def;
    this.id = def.id;
    this.type = def.type;
    this.container = null;
    this.ctx = null;
    this._resolve = null;
  }

  /** 掛載並回傳 Promise，解開時 resolve */
  run(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    return new Promise(res => { this._resolve = res; this.render(); });
  }

  render() { this.container.innerHTML = `<p>${this.def.prompt || ''}</p>`; }

  /** 子類呼叫：判定成功 */
  _succeed() {
    bus.emit('puzzle:solved', { id: this.id, type: this.type });
    if (this._resolve) this._resolve({ ok: true });
  }

  /** 子類呼叫：柔性失敗（水波回饋，不懲罰） */
  _softFail(hostEl) {
    bus.emit('puzzle:fail', { id: this.id });
    const host = hostEl || this.container;
    const r = document.createElement('span');
    r.className = 'fx-ripple';
    const rect = host.getBoundingClientRect();
    r.style.left = '50%'; r.style.top = '50%';
    r.style.marginLeft = '-40px'; r.style.marginTop = '-40px';
    host.appendChild(r);
    setTimeout(() => r.remove(), 800);
  }

  $(sel) { return this.container.querySelector(sel); }
  $$(sel) { return [...this.container.querySelectorAll(sel)]; }
}
export default PuzzleBase;
