/* ===== EndingScene.js — Final Ending（三結局分歧） ===== */
import { SceneBase } from './SceneBase.js';
import { bus } from '../core/EventBus.js';
import { EASTER_EGGS } from '../data/easterEggs.js';

export class EndingScene extends SceneBase {
  constructor() { super('ending'); }

  _decideEnding(save) {
    const insight = save?.flags?.insightTriggered;
    const eggRate = (save?.easterEggs?.length || 0) / EASTER_EGGS.length;
    const noHigh = save?.flags?.noHint3Used !== false;
    if (insight && eggRate >= 0.7 && noHigh) return 'hidden';
    if (insight) return 'true';
    return 'normal';
  }

  render() {
    const save = this.ctx?.save || {};
    const ending = this._decideEnding(save);
    this._ending = ending;
    const texts = {
      normal: { t: '普通結局・集字之人', p: '你集齊了《愛蓮說》一百一十九字，石碑重光。<br>然而周敦頤望著你，輕輕一嘆：「字，你讀完了；心，還在路上。」' },
      true:   { t: '真結局・蓮花知音', p: '你不只集齊了字，更聽見了那聲「噫」背後的心。<br>周敦頤頷首：「同予者，終於有其人。願你出淤泥，而不染。」' },
      hidden: { t: '隱藏結局・真正君子', p: '幾乎未倚仗提示，遍歷書齋典故，又讀懂了言外之意——<br>霧散，一條通往「淨植台」的路為你而開。你已是那亭亭淨植的君子。' },
    };
    const e = texts[ending];
    return `
      <div class="scene scene-ending">
        <div class="ending-paper">
          <h2 class="ending-title">${e.t}</h2>
          <p class="ending-text">${e.p}</p>
          <p class="ending-verse fx-ink-reveal">出淤泥而不染，濯清漣而不妖。</p>
          <span class="op-enter" id="toResult" role="button" tabindex="0">— 觀你此行所得 —</span>
        </div>
      </div>`;
  }

  async onEnter(ctx) {
    this.ctx = ctx;
    // render 依賴 ctx.save，重繪一次確保結局判定正確
    this.root.innerHTML = this.render();
    bus.emit('audio:bgm', { track: 'bgm_ending' });
    bus.emit('ending:decided', { ending: this._ending });
    if (this._ending === 'hidden') bus.emit('achievement:unlock', { id: 'ach_8' });
    if (this._ending !== 'normal') bus.emit('achievement:unlock', { id: 'ach_7' });
    const btn = this.$('#toResult');
    const go = () => ctx.game.goScene('result');
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  }
}
export default EndingScene;
