/* ===== ResultScene.js — 結算（完成率/能力雷達/探索率/彩蛋率/時間/稱號/成就） ===== */
import { SceneBase } from './SceneBase.js';
import { EASTER_EGGS } from '../data/easterEggs.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { bus } from '../core/EventBus.js';

const ABILITY_LABEL = { retrieve: '資訊擷取', compare: '比較分析', infer: '推論判斷', author: '作者觀點', synthesis: '統整反思' };

export class ResultScene extends SceneBase {
  constructor() { super('result'); }

  _title(save, complete) {
    if (save?.flags?.insightTriggered && (save?.easterEggs?.length || 0) >= 12) return '真正君子';
    if (save?.flags?.insightTriggered) return '蓮花知音';
    if (complete >= 100) return '博覽群書';
    if (complete >= 60) return '探索者';
    return '初入蓮境';
  }

  render() {
    const s = this.ctx?.save || {};
    const cleared = s.progress?.clearedLevels?.length || 0;
    const complete = Math.round((cleared / 5) * 100);
    const eggRate = Math.round(((s.easterEggs?.length || 0) / EASTER_EGGS.length) * 100);
    const achCount = s.achievements?.length || 0;
    const totalSec = s.time?.total || 0;
    const fmt = t => `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
    const ab = s.abilities || {};
    const radar = this._radarSVG(ab);
    const title = this._title(s, complete);

    return `
      <div class="scene scene-result">
        <div class="result-scroll">
          <h2 class="result-head">蓮境・此行所得</h2>
          <p class="result-title">稱號：<b>${title}</b></p>
          <div class="result-grid">
            <div class="result-metric"><span>完成率</span><b>${complete}%</b></div>
            <div class="result-metric"><span>彩蛋率</span><b>${eggRate}%</b></div>
            <div class="result-metric"><span>探索</span><b>${s.easterEggs?.length||0}/${EASTER_EGGS.length}</b></div>
            <div class="result-metric"><span>用時</span><b>${fmt(totalSec)}</b></div>
            <div class="result-metric"><span>成就</span><b>${achCount}/${ACHIEVEMENTS.length}</b></div>
          </div>
          <div class="result-radar">${radar}</div>
          <p class="result-radar-note">閱讀素養五力分析（依你的探索與推理行為評定）</p>
          <div class="result-ach">${ACHIEVEMENTS.filter(a=>(s.achievements||[]).includes(a.id)).map(a=>`<span class="ach-chip">✦ ${a.name}</span>`).join('') || '<span class="ach-chip">尚無成就</span>'}</div>
          <div class="result-actions">
            <span class="op-enter" id="replay" role="button" tabindex="0">— 重新入境 —</span>
          </div>
        </div>
      </div>`;
  }

  _radarSVG(ab) {
    const keys = ['retrieve','compare','infer','author','synthesis'];
    const cx=140, cy=130, R=90;
    const pts = keys.map((k,i)=>{
      const ang = -Math.PI/2 + i*(2*Math.PI/5);
      const v = Math.max(0,Math.min(100, ab[k]||0))/100;
      return [cx+Math.cos(ang)*R*v, cy+Math.sin(ang)*R*v];
    });
    const grid = [0.25,0.5,0.75,1].map(r=>{
      const p = keys.map((_,i)=>{ const a=-Math.PI/2+i*(2*Math.PI/5); return `${cx+Math.cos(a)*R*r},${cy+Math.sin(a)*R*r}`;}).join(' ');
      return `<polygon points="${p}" fill="none" stroke="#C9A96A" stroke-opacity="0.3"/>`;
    }).join('');
    const axis = keys.map((k,i)=>{ const a=-Math.PI/2+i*(2*Math.PI/5); const x=cx+Math.cos(a)*(R+22), y=cy+Math.sin(a)*(R+22);
      return `<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(a)*R}" y2="${cy+Math.sin(a)*R}" stroke="#C9A96A" stroke-opacity="0.3"/>
              <text x="${x}" y="${y}" font-size="12" fill="#4A4640" text-anchor="middle">${ABILITY_LABEL[k]}</text>`;
    }).join('');
    const poly = pts.map(p=>p.join(',')).join(' ');
    return `<svg viewBox="0 0 280 280" width="280" height="280">${grid}${axis}
      <polygon points="${poly}" fill="#6E8B7A" fill-opacity="0.45" stroke="#47604F" stroke-width="2"/></svg>`;
  }

  async onEnter(ctx) {
    this.ctx = ctx;
    this.root.innerHTML = this.render();
    bus.emit('scene:enter', { scene: 'result' });
    const replay = this.$('#replay');
    const go = () => { ctx.game.saveManager.reset(); location.reload(); };
    replay.addEventListener('click', go);
    replay.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  }
}
export default ResultScene;
