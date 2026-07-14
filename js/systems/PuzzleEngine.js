/* ===== PuzzleEngine.js — 五型謎題統一入口 ===== */
import { SequencePuzzle } from '../puzzles/SequencePuzzle.js';
import { MatchPuzzle } from '../puzzles/MatchPuzzle.js';
import { FilterPuzzle } from '../puzzles/FilterPuzzle.js';
import { RevealPuzzle } from '../puzzles/RevealPuzzle.js';
import { MechanismPuzzle } from '../puzzles/MechanismPuzzle.js';
import { getDialogue } from '../data/dialogues.js';

const MAP = {
  sequence: SequencePuzzle,
  match: MatchPuzzle,
  filter: FilterPuzzle,
  reveal: RevealPuzzle,
  mechanism: MechanismPuzzle,
};

export class PuzzleEngine {
  constructor({ dialogue } = {}) { this.dialogue = dialogue; }

  /** 執行單一謎題定義，回傳 Promise（解開後 resolve，insight 型另回傳 {insight}） */
  async run(def, container, ctx) {
    if (def.type === 'insight') return this._runInsight(def, ctx);
    const Cls = MAP[def.type];
    if (!Cls) { console.warn('未知謎題型別', def.type); return { ok: true }; }
    const p = new Cls(def);
    return p.run(container, ctx);
  }

  /** insight：以對話分支呈現，選出言外之意 */
  async _runInsight(def, ctx) {
    const d = getDialogue(def.dialogueKey);
    if (!d || !this.dialogue) return { ok: true, insight: false };
    let picked = null;
    while (!picked || !picked.insight) {
      picked = await this.dialogue.ask({ npc: d.npc, prompt: d.prompt, options: d.options });
      await this.dialogue.say({ npc: d.npc, line: picked.feedback });
      if (!picked.insight) { /* 允許再試，不懲罰 */ }
    }
    return { ok: true, insight: true };
  }
}
export default PuzzleEngine;
