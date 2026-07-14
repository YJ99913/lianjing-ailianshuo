/* ===== AbilityMeter.js — 行為訊號 → 五大閱讀素養能力值 =====
 * 不以選擇題正確率計分，而以遊戲行為換算（符合非考卷原則）：
 *  - 每關完成 → 該關對應能力基礎分
 *  - 使用高階提示 → 該能力扣減（越少提示越高）
 *  - 觸發言外之意 → 作者觀點加成
 *  - 彩蛋/探索 → 統整反思加成
 */
import { bus } from '../core/EventBus.js';

export class AbilityMeter {
  constructor({ saveManager } = {}) {
    this.save = saveManager;
    this.hintPenalty = {}; // 每關提示扣分暫存
    this._bind();
  }

  _bind() {
    bus.on('hint:used', ({ level, stage }) => {
      this.hintPenalty[level] = Math.max(this.hintPenalty[level] || 0, stage * 12); // 第三階扣最多
    });
    bus.on('ability:gain', ({ key, amount, insight }) => {
      const a = this.save?.data?.abilities; if (!a) return;
      const lvKey = this._levelOfAbility(key);
      const penalty = this.hintPenalty[lvKey] || 0;
      a[key] = Math.max(0, Math.min(100, (a[key] || 0) + amount - penalty));
      if (insight) a.author = Math.min(100, (a.author || 0) + 10);
      this.save.save({});
    });
    bus.on('egg:unlock', () => {
      const a = this.save?.data?.abilities; if (!a) return;
      a.synthesis = Math.min(100, (a.synthesis || 0) + 3);
    });
  }

  _levelOfAbility(key) {
    const map = { retrieve: 'level1', compare: 'level2', infer: 'level3', author: 'level4', synthesis: 'level5' };
    return map[key];
  }
}
export default AbilityMeter;
