/* ===== SceneManager.js — 場景載入/切換/進出場動畫 =====
 * - 以「墨跡過場」包裹每次切換：舊場景淡出 → overlay 墨暈 → 新場景淡入
 * - 場景以工廠函式註冊（lazy），避免一次載入全部
 */
import { bus } from './EventBus.js';

export class SceneManager {
  /**
   * @param {object} opts
   * @param {object} opts.ctxProvider 提供 enter 所需 ctx 的物件（通常是 Game）
   */
  constructor({ ctxProvider } = {}) {
    this.ctxProvider = ctxProvider;
    this.registry = new Map();   // id -> () => SceneBase
    this.current = null;         // 當前場景 id
    this._instance = null;       // 當前場景實例
    this._transitioning = false;
    this.layers = {
      scene: document.getElementById('scene-layer'),
      hud: document.getElementById('hud-layer'),
      dialogue: document.getElementById('dialogue-layer'),
      panel: document.getElementById('panel-layer'),
      overlay: document.getElementById('overlay-layer'),
      toast: document.getElementById('toast-layer'),
    };
  }

  /** 註冊場景工廠 */
  register(id, factory) { this.registry.set(id, factory); return this; }

  /** 是否已註冊真實場景（未註冊者交回 Game 佔位） */
  has(id) { return this.registry.has(id); }

  /** 切換場景（含墨跡過場） */
  async go(id) {
    if (this._transitioning) return;
    if (!this.registry.has(id)) {
      // 尚未實作真實場景 → 交由 Game 佔位渲染
      this.current = id;
      return false;
    }
    this._transitioning = true;
    bus.emit('scene:leave', { from: this.current, to: id });

    await this._inkOut();                 // 墨暈遮罩淡入
    if (this._instance) await this._instance.exit();

    const scene = this.registry.get(id)();
    this._instance = scene;
    this.current = id;

    const ctx = this._buildCtx();
    await scene.mount(ctx);              // 建立場景 DOM（同步部分）

    await this._inkIn();                 // 墨暈遮罩淡出（在 onEnter 前，避免遮罩擋住互動）
    this._transitioning = false;

    // onEnter（可能含長時間對話/謎題）在過場結束後執行，不阻塞過場
    if (typeof scene.onEnter === 'function') scene.onEnter(ctx);
    return true;
  }

  _buildCtx() {
    const base = this.ctxProvider?.getSceneContext?.() || {};
    return { ...base, bus, layers: this.layers, manager: this };
  }

  /** 墨跡過場：遮罩淡入 */
  _inkOut() {
    return new Promise(resolve => {
      const ov = this.layers.overlay;
      ov.innerHTML = `<div class="ink-transition"></div>`;
      const el = ov.firstChild;
      requestAnimationFrame(() => el.classList.add('active'));
      setTimeout(resolve, 700);
    });
  }

  /** 墨跡過場：遮罩淡出並清除 */
  _inkIn() {
    return new Promise(resolve => {
      const ov = this.layers.overlay;
      const el = ov.querySelector('.ink-transition');
      if (!el) { resolve(); return; }
      el.classList.remove('active');
      el.classList.add('leaving');
      setTimeout(() => { ov.innerHTML = ''; resolve(); }, 700);
    });
  }
}

export default SceneManager;
