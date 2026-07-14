/* ===== Timer.js — 每關倒數 + 全程累積 + 閒置偵測 ===== */
import { bus } from '../core/EventBus.js';
import { CONFIG } from '../data/config.js';

export class Timer {
  constructor({ saveManager } = {}) {
    this.save = saveManager;
    this.levelId = null;
    this.remain = CONFIG.levelSeconds;
    this.total = this.save?.data?.time?.total || 0;
    this.idleMs = 0;
    this._tick = this._tick.bind(this);
    this._bind();
  }

  _bind() {
    bus.on('scene:enter', ({ scene }) => {
      if (scene && scene.startsWith('level')) { this.startLevel(scene); }
      else { this.stop(); }
    });
    // 任意互動重置閒置計時
    ['puzzle:solved', 'puzzle:fail', 'hint:request', 'item:pickup', 'egg:unlock', 'puzzle:start'].forEach(ev =>
      bus.on(ev, () => { this.idleMs = 0; }));
    document.addEventListener('click', () => { this.idleMs = 0; });
  }

  startLevel(id) {
    this.levelId = id;
    this.remain = CONFIG.levelSeconds;
    this.idleMs = 0;
    this.stop();
    this._interval = setInterval(this._tick, 1000);
  }

  _tick() {
    this.remain = Math.max(0, this.remain - 1);
    this.total += 1;
    this.idleMs += 1000;
    if (this.save?.data) { this.save.data.time.total = this.total; this.save.data.time.perLevel[this.levelId] = (CONFIG.levelSeconds - this.remain); }
    bus.emit('timer:tick', { remain: this.remain, total: this.total, level: this.levelId });
    if (this.idleMs >= CONFIG.idleHintMs) { this.idleMs = 0; bus.emit('idle:timeout', { level: this.levelId }); }
  }

  stop() { if (this._interval) { clearInterval(this._interval); this._interval = null; } }
}
export default Timer;
