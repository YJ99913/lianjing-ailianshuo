/* ===== Notification.js — 成就/彩蛋 解鎖通知（蓮花綻放） ===== */
import { bus } from '../core/EventBus.js';
import { getAchievement } from '../data/achievements.js';
import { getEgg } from '../data/easterEggs.js';

export class Notification {
  constructor({ layer } = {}) {
    this.layer = layer || document.getElementById('toast-layer');
    this._seen = new Set();
    this._bind();
  }

  _bind() {
    bus.on('achievement:unlock', ({ id }) => {
      if (this._seen.has('a' + id)) return; this._seen.add('a' + id);
      const a = getAchievement(id); if (a) this.toast('成就達成', a.name, a.desc);
    });
    bus.on('egg:unlock', ({ id }) => {
      if (this._seen.has('e' + id)) return; this._seen.add('e' + id);
      const e = getEgg(id); if (e) this.toast('發現彩蛋', e.title, '已收入書齋');
    });
  }

  toast(kind, title, desc) {
    const el = document.createElement('div');
    el.className = 'toast fx-lotus-bloom';
    el.innerHTML = `
      <span class="toast-lotus">✽</span>
      <div class="toast-body"><p class="toast-kind">${kind}</p>
      <p class="toast-title">${title}</p><p class="toast-desc">${desc}</p></div>`;
    this.layer.appendChild(el);
    bus.emit('sfx', { name: 'achievement' });
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 600); }, 2600);
  }
}
export default Notification;
