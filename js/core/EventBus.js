/* ===== EventBus.js — 全域事件匯流排（發布/訂閱，模組解耦） ===== */
/**
 * 極簡 pub/sub。所有模組透過事件溝通，避免直接耦合。
 * 用法：
 *   import { bus } from './core/EventBus.js';
 *   const off = bus.on('puzzle:solved', payload => {...});
 *   bus.emit('puzzle:solved', { id: 'lv1_reveal' });
 *   off(); // 取消訂閱
 */
class EventBus {
  constructor() { this._map = new Map(); }

  on(type, handler) {
    if (!this._map.has(type)) this._map.set(type, new Set());
    this._map.get(type).add(handler);
    return () => this.off(type, handler);
  }

  once(type, handler) {
    const wrap = (payload) => { this.off(type, wrap); handler(payload); };
    return this.on(type, wrap);
  }

  off(type, handler) {
    const set = this._map.get(type);
    if (set) set.delete(handler);
  }

  emit(type, payload) {
    const set = this._map.get(type);
    if (!set) return;
    // 複製一份避免迭代中被修改
    [...set].forEach(h => {
      try { h(payload); }
      catch (e) { console.error(`[EventBus] handler error for "${type}":`, e); }
    });
  }

  clear() { this._map.clear(); }
}

export const bus = new EventBus();
export default bus;
