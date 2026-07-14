/* ===== TutorialScene.js — 教學（M2 最小版，M5 補掃葉人完整對白） ===== */
import { SceneBase } from './SceneBase.js';

export class TutorialScene extends SceneBase {
  constructor() { super('tutorial'); }

  render() {
    return `
      <div class="scene scene-tutorial">
        <div class="tut-paper">
          <p class="tut-name">掃葉人</p>
          <p class="tut-line">「客官迷路了？此處是濂溪書院。<br>
             在這裡，先看、再想、最後才動手——<br>
             泥裡藏字，光看是看不清的。」</p>
          <div class="op-enter" id="tutNext" role="button" tabindex="0">— 前往第一關・淤泥門 —</div>
        </div>
      </div>`;
  }

  async onEnter(ctx) {
    const go = () => ctx.game.next();
    const btn = this.$('#tutNext');
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  }
}
export default TutorialScene;
