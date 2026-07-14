/* ===== main.js — 啟動器（完整接線：所有系統 + 九場景） ===== */
import { bus } from './core/EventBus.js';
import { Game } from './core/Game.js';
import { SceneManager } from './core/SceneManager.js';
import { SaveManager } from './systems/SaveManager.js';
import { Dialogue } from './systems/Dialogue.js';
import { PuzzleEngine } from './systems/PuzzleEngine.js';
import { HintSystem } from './systems/HintSystem.js';
import { Timer } from './systems/Timer.js';
import { AbilityMeter } from './systems/AbilityMeter.js';
import { AudioManager } from './systems/AudioManager.js';
import { OpeningScene } from './scenes/OpeningScene.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { HUD } from './ui/HUD.js';
import { ScrollPanel } from './ui/ScrollPanel.js';
import { Notification } from './ui/Notification.js';
import { getVerse } from './data/verses.js';

function fitStage() {
  const root = document.getElementById('game-root');
  if (!root) return;
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  root.style.transform = `scale(${scale})`;
}

async function boot() {
  fitStage();
  window.addEventListener('resize', fitStage);

  const saveManager = new SaveManager();
  saveManager.load();
  const game = new Game({ saveManager });

  // 系統
  const scroll = new ScrollPanel({ mount: document.getElementById('panel-layer') });
  const dialogue = new Dialogue({ layer: document.getElementById('dialogue-layer') });
  const puzzle = new PuzzleEngine({ dialogue });
  const hint = new HintSystem({ scroll });
  const timer = new Timer({ saveManager });
  const ability = new AbilityMeter({ saveManager });
  const audio = new AudioManager({ saveManager });
  const notify = new Notification({ layer: document.getElementById('toast-layer') });

  // 回訪計數（成就 ach_20）
  bus.once('game:start', () => {
    const d = saveManager.data;
    d.visits = (d.visits || 0) + 1;
    if (d.visits >= 3) bus.emit('achievement:unlock', { id: 'ach_20' });
    saveManager.save({});
  });

  // 場景管理器 + 九場景
  const sceneManager = new SceneManager({ ctxProvider: game });
  sceneManager
    .register('opening', () => new OpeningScene())
    .register('tutorial', () => new TutorialScene())
    .register('level1', () => new LevelScene('level1'))
    .register('level2', () => new LevelScene('level2'))
    .register('level3', () => new LevelScene('level3'))
    .register('level4', () => new LevelScene('level4'))
    .register('level5', () => new LevelScene('level5'))
    .register('ending', () => new EndingScene())
    .register('result', () => new ResultScene());
  game.sceneManager = sceneManager;
  game.systems = { dialogue, puzzle, scroll, hint, timer, ability, audio, notify, layers: sceneManager.layers };

  // HUD
  const hud = new HUD({
    getItems: () => (saveManager.data?.inventory || []).map(id => {
      const v = getVerse(id); return v ? { id, name: v.name, icon: '📜' } : { id, name: id, icon: '📦' };
    }),
  });

  window.__lianjing = { game, bus, saveManager, sceneManager, hud, dialogue, puzzle, hint, timer, ability, audio };

  bus.once('game:start', ({ resume, entry }) => {
    console.log(`[蓮境] 啟動：${resume ? '續玩' : '新局'} → ${entry}`);
    const bootEl = document.getElementById('boot-screen');
    if (bootEl) setTimeout(() => bootEl.classList.add('hide'), 600);
  });

  await game.start();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
