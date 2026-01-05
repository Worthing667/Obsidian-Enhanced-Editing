import { Plugin } from 'obsidian';
import { Settings } from './settings';

/**
 * 插件接口定义
 * 用于解决循环引用问题
 */
export interface IMyPlugin extends Plugin {
    settings: Settings;
    saveSettings(): void;
    loadSettings(): void;
}
