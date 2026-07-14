/* ===== SequencePuzzle.js — 語序拼接（點選字/段依序排回） ===== */
import { PuzzleBase } from './PuzzleBase.js';

export class SequencePuzzle extends PuzzleBase {
  render() {
    const isSeg = this.def.mode === 'segments';
    const pool = isSeg
      ? this.def.segments.map(s => ({ key: s.order, label: s.label }))
      : this.def.shuffled.map((c, i) => ({ key: c + '_' + i, label: c }));
    this.picked = [];
    this.answer = isSeg ? this.def.answer : this.def.answer;
    this.isSeg = isSeg;

    this.container.innerHTML = `
      <p class="pz-prompt">${this.def.prompt}</p>
      <div class="pz-slots" id="pzSlots"></div>
      <div class="pz-pool">${pool.map(p =>
        `<span class="pz-chip ${isSeg ? 'seg' : ''}" data-key="${p.key}">${p.label}</span>`).join('')}</div>
      <p class="pz-tip">依正確順序點選；點已選的可取消。</p>`;

    this.$$('.pz-chip').forEach(chip => chip.addEventListener('click', () => this._pick(chip)));
  }

  _pick(chip) {
    if (chip.classList.contains('used')) return;
    chip.classList.add('used');
    this.picked.push(chip);
    this._renderSlots();
    this._check();
  }

  _renderSlots() {
    const slots = this.$('#pzSlots');
    slots.innerHTML = this.picked.map((c, i) =>
      `<span class="pz-slot" data-idx="${i}">${c.textContent}</span>`).join('');
    slots.querySelectorAll('.pz-slot').forEach(s => s.addEventListener('click', () => {
      const idx = +s.dataset.idx; const chip = this.picked.splice(idx, 1)[0];
      chip.classList.remove('used'); this._renderSlots();
    }));
  }

  _check() {
    if (this.picked.length !== this.answer.length) return;
    let ok;
    if (this.isSeg) {
      const orders = this.picked.map(c => +c.dataset.key);
      ok = orders.every((o, i) => o === this.answer[i]);
    } else {
      const chars = this.picked.map(c => c.textContent).join('');
      ok = chars === this.def.answer.join('');
    }
    if (ok) { this.container.classList.add('pz-done'); setTimeout(() => this._succeed(), 400); }
    else { this._softFail(); this.picked.forEach(c => c.classList.remove('used')); this.picked = []; this._renderSlots(); }
  }
}
export default SequencePuzzle;
