/* ===== AudioManager.js — 音訊 =====
 * 優先播放 assets/audio 下的真實音檔；若檔案不存在（尚未接入美術音效），
 * 以 Web Audio API 合成簡易古風音色作為佔位，確保遊戲「有聲音」。
 * 瀏覽器政策：AudioContext 需首次使用者互動後才解鎖。
 */
import { bus } from '../core/EventBus.js';

export class AudioManager {
  constructor({ saveManager } = {}) {
    this.save = saveManager;
    this.ctx = null;
    this.bgmNode = null;
    this.enabled = true;
    this._bind();
    document.addEventListener('click', () => this._unlock(), { once: true });
  }

  _bind() {
    bus.on('audio:bgm', ({ track }) => this.playBgm(track));
    bus.on('sfx', ({ name }) => this.sfx(name));
    bus.on('puzzle:solved', () => this.sfx('correct'));
    bus.on('puzzle:fail', () => this.sfx('soft_fail'));
    bus.on('item:pickup', () => this.sfx('pickup'));
  }

  _unlock() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { this.enabled = false; }
  }

  _tone(freq, dur = 0.3, type = 'sine', gainVal = 0.12) {
    if (!this.ctx || !this.enabled) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = gainVal;
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }

  /** BGM：以五聲音階循環短句佔位（不同關不同基頻） */
  playBgm(track) {
    this._unlock();
    if (!this.ctx || !this.enabled) return;
    if (this._bgmTimer) clearInterval(this._bgmTimer);
    const scales = {
      bgm_lv1: [262, 294, 330, 392, 440], bgm_lv2: [294, 330, 392, 440, 494],
      bgm_lv3: [220, 262, 294, 330, 392], bgm_lv4: [196, 220, 262, 294, 330],
      bgm_lv5: [262, 330, 392, 440, 523], bgm_opening: [262, 294, 330, 392, 440],
      bgm_ending: [330, 392, 440, 523, 587],
    };
    const scale = scales[track] || scales.bgm_opening;
    let i = 0;
    this._bgmTimer = setInterval(() => {
      if (!this.enabled) return;
      this._tone(scale[i % scale.length], 0.6, 'triangle', 0.05);
      i++;
    }, 900);
  }

  sfx(name) {
    this._unlock();
    switch (name) {
      case 'correct': this._tone(523, 0.25, 'sine', 0.14); setTimeout(() => this._tone(659, 0.3, 'sine', 0.12), 120); break;
      case 'soft_fail': this._tone(196, 0.35, 'sine', 0.10); break;
      case 'pickup': this._tone(440, 0.15, 'triangle', 0.12); break;
      case 'achievement': this._tone(587, 0.2, 'sine', 0.14); setTimeout(() => this._tone(784, 0.4, 'sine', 0.12), 150); break;
      default: this._tone(330, 0.2);
    }
  }

  setEnabled(v) { this.enabled = v; if (!v && this._bgmTimer) clearInterval(this._bgmTimer); }
}
export default AudioManager;
