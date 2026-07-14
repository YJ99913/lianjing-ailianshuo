/* ===== MatchPuzzle.js — 象徵配對（左句 ↔ 右品德，點左再點右連線） ===== */
import { PuzzleBase } from './PuzzleBase.js';

export class MatchPuzzle extends PuzzleBase {
  render() {
    const pairs = this.def.pairs;
    const lefts = pairs.map(p => p.left);
    const rights = [...pairs.map(p => p.right), ...(this.def.distractors || [])]
      .sort(() => Math.random() - 0.5);
    this.map = new Map(pairs.map(p => [p.left, p.right]));
    this.matched = new Set();
    this.sel = null;

    this.container.innerHTML = `
      <p class="pz-prompt">${this.def.prompt}</p>
      <div class="pz-match">
        <ul class="pz-col left">${lefts.map(l => `<li class="pz-item" data-side="l" data-v="${l}">${l}</li>`).join('')}</ul>
        <ul class="pz-col right">${rights.map(r => `<li class="pz-item" data-side="r" data-v="${r}">${r}</li>`).join('')}</ul>
      </div>`;
    this.$$('.pz-item').forEach(it => it.addEventListener('click', () => this._tap(it)));
  }

  _tap(it) {
    if (it.classList.contains('matched')) return;
    if (it.dataset.side === 'l') {
      this.$$('.pz-item.left, .left .pz-item').forEach(x => x.classList.remove('sel'));
      this.$$('[data-side="l"]').forEach(x => x.classList.remove('sel'));
      it.classList.add('sel'); this.sel = it;
    } else if (this.sel) {
      const left = this.sel.dataset.v, right = it.dataset.v;
      if (this.map.get(left) === right) {
        it.classList.add('matched'); this.sel.classList.add('matched'); this.sel.classList.remove('sel');
        this.matched.add(left); this.sel = null;
        if (this.matched.size === this.map.size) { this.container.classList.add('pz-done'); setTimeout(() => this._succeed(), 400); }
      } else { this._softFail(it); it.classList.add('wrong'); setTimeout(() => it.classList.remove('wrong'), 500); }
    }
  }
}
export default MatchPuzzle;
