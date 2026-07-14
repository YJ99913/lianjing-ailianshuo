/* ===== SaveManager.js — LocalStorage 存檔（M1 基礎版，M2 擴充遷移/自動存） ===== */
import { bus } from '../core/EventBus.js';

const SAVE_KEY = 'lianjing_save_v1';

export const DEFAULT_SAVE = () => ({
  version: 1,
  progress: { currentScene: 'opening', clearedLevels: [] },
  inventory: [],
  collectibles: [],
  documents: [],
  easterEggs: [],
  achievements: [],
  time: { total: 0, perLevel: {} },
  abilities: { retrieve: 0, compare: 0, infer: 0, author: 0, synthesis: 0 },
  flags: { insightTriggered: false, noHint3Used: true },
  lastPosition: { scene: 'opening', x: 0.5, y: 0.5 },
  settings: { bgmVolume: 0.7, sfxVolume: 0.8, textMode: 'vertical' },
});

export class SaveManager {
  constructor() {
    this.data = null;
    this._bindAutoSave();
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) { this.data = DEFAULT_SAVE(); return this.data; }
      const parsed = JSON.parse(raw);
      this.data = this._migrate(parsed);
      return this.data;
    } catch (e) {
      console.warn('[SaveManager] 讀檔失敗，重建預設存檔', e);
      this.data = DEFAULT_SAVE();
      return this.data;
    }
  }

  /** 淺合併 patch，避免整包覆蓋 */
  save(patch = {}) {
    if (!this.data) this.load();
    this.data = { ...this.data, ...patch };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
      bus.emit('save:written', { key: SAVE_KEY });
    } catch (e) {
      console.error('[SaveManager] 寫檔失敗', e);
    }
    return this.data;
  }

  has() { return !!localStorage.getItem(SAVE_KEY); }

  reset() {
    localStorage.removeItem(SAVE_KEY);
    this.data = DEFAULT_SAVE();
    bus.emit('save:reset', {});
    return this.data;
  }

  _migrate(old) {
    // 版本遷移預留：目前僅補齊缺欄位
    const base = DEFAULT_SAVE();
    return { ...base, ...old, version: base.version };
  }

  /** 監聽關鍵事件自動存檔（單向存檔流） */
  _bindAutoSave() {
    const persist = () => this.save({});
    bus.on('scene:enter', ({ scene }) => {
      if (!this.data) this.load();
      this.data.progress.currentScene = scene;
      this.data.lastPosition.scene = scene;
      persist();
    });
    bus.on('level:cleared', ({ level }) => {
      if (!this.data) this.load();
      if (level && !this.data.progress.clearedLevels.includes(level)) {
        this.data.progress.clearedLevels.push(level);
      }
      persist();
    });
    bus.on('item:pickup', ({ id }) => {
      if (id && !this.data.inventory.includes(id)) this.data.inventory.push(id);
      persist();
    });
    bus.on('achievement:unlock', ({ id }) => {
      if (id && !this.data.achievements.includes(id)) this.data.achievements.push(id);
      persist();
    });
    bus.on('egg:unlock', ({ id }) => {
      if (id && !this.data.easterEggs.includes(id)) this.data.easterEggs.push(id);
      persist();
    });
    bus.on('collectible:get', ({ id }) => {
      if (id && !this.data.collectibles.includes(id)) this.data.collectibles.push(id);
      persist();
    });
    bus.on('flag:set', ({ key, value }) => {
      if (!this.data.flags) this.data.flags = {};
      this.data.flags[key] = value;
      persist();
    });
    // 追蹤是否使用過第三階提示（隱藏結局判定）
    bus.on('hint:used', ({ stage }) => {
      if (stage >= 3) { this.data.flags.noHint3Used = false; persist(); }
    });
  }
}

export default SaveManager;
