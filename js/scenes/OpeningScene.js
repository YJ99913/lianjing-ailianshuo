/* ===== OpeningScene.js — 開場（M2 最小可玩版，M5 補完整動畫/旁白） ===== */
import { SceneBase } from './SceneBase.js';

export class OpeningScene extends SceneBase {
  constructor() { super('opening'); }

  render() {
    return `
      <div class="scene scene-opening">
        <div class="op-paper">
          <p class="op-verse" id="opVerse">水陸草木之花，可愛者甚蕃……</p>
          <p class="op-narr">這世上愛花的人很多，愛菊的、愛牡丹的……<br>
             卻幾乎無人記得，還有一朵花，生於汙泥，而不肯染上一點汙濁。</p>
          <div class="op-enter" id="opEnter" role="button" tabindex="0">— 踏入霧中書院 —</div>
        </div>
      </div>`;
  }

  async onEnter(ctx) {
    const go = () => ctx.game.next();
    const btn = this.$('#opEnter');
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
    // 墨字暈開：延遲淡入
    requestAnimationFrame(() => this.$('#opVerse')?.classList.add('ink-in'));
  }
}
export default OpeningScene;
