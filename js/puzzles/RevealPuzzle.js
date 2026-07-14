/* ===== RevealPuzzle.js — 墨痕顯影（用清水擦拭泥漬，字浮現） ===== */
import { PuzzleBase } from './PuzzleBase.js';

export class RevealPuzzle extends PuzzleBase {
  render() {
    const spots = this.def.spots || 3;
    this.total = spots; this.cleared = 0;
    this.container.innerHTML = `
      <p class="pz-prompt">${this.def.prompt}</p>
      <div class="pz-reveal">
        <div class="reveal-wall">
          <span class="reveal-target">${this.def.target}</span>
          ${Array.from({ length: spots }).map((_, i) =>
            `<span class="mud-spot" data-i="${i}" style="left:${8 + i * (84 / spots)}%"></span>`).join('')}
        </div>
        <p class="pz-tip">點背包取「清水」後，擦去 ${spots} 處泥漬（此處直接點泥漬模擬）。</p>
      </div>`;
    this.$$('.mud-spot').forEach(sp => sp.addEventListener('click', () => this._wipe(sp)));
  }

  _wipe(sp) {
    if (sp.classList.contains('wiped')) return;
    sp.classList.add('wiped');
    this.cleared++;
    if (this.cleared >= this.total) {
      this.$('.reveal-target').classList.add('fx-ink-reveal', 'shown');
      this.container.classList.add('pz-done');
      setTimeout(() => this._succeed(), 900);
    }
  }
}
export default RevealPuzzle;
