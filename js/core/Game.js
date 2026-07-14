/* ===== Game.js — 遊戲總控（狀態機 + 流程調度） ===== */
import { bus } from './EventBus.js';

/** 遊戲主要狀態 */
export const GameState = Object.freeze({
  BOOT: 'boot',
  OPENING: 'opening',
  TUTORIAL: 'tutorial',
  PLAYING: 'playing',
  ENDING: 'ending',
  RESULT: 'result',
});

/** 場景流程順序（M1 先以佔位場景表示，後續模組替換為真實 Scene） */
export const SCENE_FLOW = [
  'opening', 'tutorial',
  'level1', 'level2', 'level3', 'level4', 'level5',
  'ending', 'result',
];

export class Game {
  constructor({ sceneManager, saveManager } = {}) {
    this.state = GameState.BOOT;
    this.sceneManager = sceneManager || null;
    this.saveManager = saveManager || null;
    this.save = null;
  }

  /** 啟動：載入存檔，決定進入點 */
  async start() {
    this.save = this.saveManager ? this.saveManager.load() : null;
    const resume = this.save && this.save.progress
      && this.save.progress.currentScene
      && this.save.progress.currentScene !== 'opening';

    const entry = resume ? this.save.progress.currentScene : 'opening';
    bus.emit('game:start', { resume: !!resume, entry });
    await this.goScene(entry);
  }

  /** 切換場景（透過 SceneManager；未註冊真實場景者安全降級為佔位） */
  async goScene(sceneId) {
    this._syncStateByScene(sceneId);
    let handled = false;
    if (this.sceneManager && typeof this.sceneManager.go === 'function') {
      handled = await this.sceneManager.go(sceneId);
    }
    if (!handled) {
      // 降級：直接在 scene-layer 顯示佔位（供尚未實作的場景）
      this._renderPlaceholder(sceneId);
    }
    bus.emit('scene:enter', { scene: sceneId });
  }

  /** 提供給場景的共用上下文 */
  getSceneContext() {
    const s = this.systems || {};
    return {
      game: this, save: this.save, bus,
      dialogue: s.dialogue, puzzle: s.puzzle, scroll: s.scroll,
    };
  }

  /** 前往流程中的下一個場景 */
  async next() {
    const cur = this.sceneManager?.current || this.save?.progress?.currentScene || 'opening';
    const idx = SCENE_FLOW.indexOf(cur);
    const nextId = SCENE_FLOW[Math.min(idx + 1, SCENE_FLOW.length - 1)];
    await this.goScene(nextId);
  }

  _syncStateByScene(sceneId) {
    if (sceneId === 'opening') this.state = GameState.OPENING;
    else if (sceneId === 'tutorial') this.state = GameState.TUTORIAL;
    else if (sceneId.startsWith('level')) this.state = GameState.PLAYING;
    else if (sceneId === 'ending') this.state = GameState.ENDING;
    else if (sceneId === 'result') this.state = GameState.RESULT;
  }

  _renderPlaceholder(sceneId) {
    const layer = document.getElementById('scene-layer');
    if (!layer) return;
    const names = {
      opening: '開場・墨字暈開', tutorial: '教學・掃葉人',
      level1: '第一關・淤泥門', level2: '第二關・三花圃',
      level3: '第三關・通直廊', level4: '第四關・濂溪堂',
      level5: '第五關・蓮心堂', ending: 'Final Ending', result: '結算・長卷',
    };
    layer.innerHTML =
      `<div class="scene"><span class="scene-placeholder">〔${names[sceneId] || sceneId}〕</span></div>`;
  }
}

export default Game;
