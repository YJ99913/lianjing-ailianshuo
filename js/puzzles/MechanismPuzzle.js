/* ===== MechanismPuzzle.js — 環境機關（水位/光影/石門，撥動 N 次到位） ===== */
import { PuzzleBase } from './PuzzleBase.js';

export class MechanismPuzzle extends PuzzleBase {
  render() {
    const steps = this.def.steps || 3;
    this.steps = steps; this.pos = 0;
    const kind = this.def.kind || 'water';
    const knobLabel = kind === 'light' ? '旋轉花窗' : (kind === 'water' ? '撥動水閘' : '推動機關');
    this.container.innerHTML = `
      <p class="pz-prompt">${this.def.prompt}</p>
      <div class="pz-mech kind-${kind}">
        <div class="mech-stage">
          <span class="mech-target">${this.def.target}</span>
          <div class="mech-gauge"><div class="mech-fill" style="width:0%"></div></div>
        </div>
        <div class="mech-knob" role="button" tabindex="0">${knobLabel}（0/${steps}）</div>
      </div>`;
    const knob = this.$('.mech-knob');
    const act = () => this._turn(knob);
    knob.addEventListener('click', act);
    knob.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  }

  _turn(knob) {
    this.pos = Math.min(this.pos + 1, this.steps);
    const pct = Math.round((this.pos / this.steps) * 100);
    this.$('.mech-fill').style.width = pct + '%';
    knob.textContent = knob.textContent.replace(/（.*）/, `（${this.pos}/${this.steps}）`);
    if (this.pos >= this.steps) {
      this.$('.mech-target').classList.add('fx-ink-reveal', 'shown');
      this.container.classList.add('pz-done');
      setTimeout(() => this._succeed(), 700);
    }
  }
}
export default MechanismPuzzle;
