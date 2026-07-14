/* ===== FilterPuzzle.js — 對比篩選（篩掉不符者，留下正解） ===== */
import { PuzzleBase } from './PuzzleBase.js';

export class FilterPuzzle extends PuzzleBase {
  render() {
    this.answer = new Set(this.def.answer);
    this.removed = new Set();
    this.container.innerHTML = `
      <p class="pz-prompt">${this.def.prompt}</p>
      <ul class="pz-filter">
        ${this.def.options.map(o =>
          `<li class="pz-flower" data-id="${o.id}" data-keep="${o.keep}" role="button" tabindex="0">${o.label}</li>`).join('')}
      </ul>
      <p class="pz-tip">點選「不符君子」者將其淘汰，只留正解。</p>`;
    this.$$('.pz-flower').forEach(el => {
      const act = () => this._toggle(el);
      el.addEventListener('click', act);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
  }

  _toggle(el) {
    const id = el.dataset.id;
    const keep = el.dataset.keep === 'true';
    if (keep) {
      // 誤淘汰正解 → 柔性失敗
      this._softFail(el); el.classList.add('wrong'); setTimeout(() => el.classList.remove('wrong'), 500); return;
    }
    el.classList.toggle('removed');
    if (el.classList.contains('removed')) this.removed.add(id); else this.removed.delete(id);
    this._check();
  }

  _check() {
    // 需淘汰所有非答案項
    const toRemove = this.def.options.filter(o => !o.keep).map(o => o.id);
    const done = toRemove.every(id => this.removed.has(id));
    if (done) { this.container.classList.add('pz-done'); setTimeout(() => this._succeed(), 400); }
  }
}
export default FilterPuzzle;
