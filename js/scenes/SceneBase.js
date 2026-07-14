/* ===== SceneBase.js — 場景基底類別 =====
 * 所有場景繼承此類，統一生命週期：
 *   enter(ctx)  進場（建立 DOM、綁事件、觸發進場動畫）
 *   update(dt)  每幀更新（可選，供動畫/計時）
 *   exit()      離場（清理 DOM、解除事件）
 * ctx 提供共用依賴：{ game, save, bus, layers }
 */
import { bus } from '../core/EventBus.js';

export class SceneBase {
  /** @param {string} id 場景識別 */
  constructor(id) {
    this.id = id;
    this.root = null;         // 本場景掛載的 DOM 容器
    this.ctx = null;
    this._offs = [];          // 事件取消函式清單，離場統一解除
  }

  /** 訂閱事件並登記，離場時自動解除，避免記憶體洩漏 */
  listen(type, handler) {
    this._offs.push(bus.on(type, handler));
  }

  /** 子類覆寫：回傳本場景的 HTML 內容字串或直接操作 this.root */
  render() { return `<div class="scene"><span class="scene-placeholder">〔${this.id}〕</span></div>`; }

  /** 進場：由 SceneManager 呼叫 */
  async enter(ctx) {
    this.ctx = ctx;
    const layer = ctx.layers.scene;
    this.root = document.createElement('div');
    this.root.className = 'scene-wrap';
    this.root.dataset.scene = this.id;
    this.root.innerHTML = this.render();
    layer.appendChild(this.root);
    // 注意：onEnter 由 SceneManager 在過場遮罩淡出「之後」呼叫，
    // 避免 onEnter 內的對話被遮罩擋住而死鎖。
  }

  /** 建立 DOM（同步部分），供 SceneManager 於過場中呼叫 */
  async mount(ctx) { await this.enter(ctx); }

  /** 子類覆寫：進場後的初始化（綁互動、起動畫、播 BGM） */
  async onEnter(_ctx) {}

  /** 子類覆寫：每幀更新 */
  update(_dt) {}

  /** 離場：清理 */
  async exit() {
    await this.onExit();
    this._offs.forEach(off => off());
    this._offs = [];
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    this.root = null;
  }

  /** 子類覆寫：離場前的收尾 */
  async onExit() {}

  /** 便捷：在本場景 root 內查詢元素 */
  $(sel) { return this.root ? this.root.querySelector(sel) : null; }
  $$(sel) { return this.root ? [...this.root.querySelectorAll(sel)] : []; }
}

export default SceneBase;
