import { Editor, MarkdownView } from 'obsidian';

/**
 * 全局变量 - 编辑器状态
 */
export let 当前文件: any;
export let 当前文件路径: string;
export let 编辑模式: Editor;
export let 所选文本: string | null = "";
export let 笔记正文: string = "";
export let 笔记全文: any;
export let 当前行文本: string = "";
export let 当前光标: any;
export let 当前行号: number;
export let 选至行首: string = "";
export let 选至行尾: string = "";
export let 末行行号: number;
export let 末行文本: string = "";
export let 选至文首: string = "";
export let 选至文末: string = "";
export let 编辑中: boolean = false;
export let 历史缩进: string = "";
export let 按上档键: boolean = false;

// 格式刷状态标记
export let isGLS: boolean = false;  // 高亮
export let isCTS: boolean = false;  // 粗体
export let isXTS: boolean = false;  // 斜体
export let isSCS: boolean = false;  // 删除线
export let isXHS: boolean = false;  // 下划线
export let isSB: boolean = false;   // 上标
export let isXB: boolean = false;   // 下标

// 设置函数
export function set当前文件(val: any) { 当前文件 = val; }
export function set当前文件路径(val: string) { 当前文件路径 = val; }
export function set编辑模式(val: Editor) { 编辑模式 = val; }
export function set所选文本(val: string | null) { 所选文本 = val; }
export function set笔记正文(val: string) { 笔记正文 = val; }
export function set笔记全文(val: any) { 笔记全文 = val; }
export function set当前行文本(val: string) { 当前行文本 = val; }
export function set当前光标(val: any) { 当前光标 = val; }
export function set当前行号(val: number) { 当前行号 = val; }
export function set选至行首(val: string) { 选至行首 = val; }
export function set选至行尾(val: string) { 选至行尾 = val; }
export function set末行行号(val: number) { 末行行号 = val; }
export function set末行文本(val: string) { 末行文本 = val; }
export function set选至文首(val: string) { 选至文首 = val; }
export function set选至文末(val: string) { 选至文末 = val; }
export function set编辑中(val: boolean) { 编辑中 = val; }
export function set历史缩进(val: string) { 历史缩进 = val; }
export function set按上档键(val: boolean) { 按上档键 = val; }
export function setIsGLS(val: boolean) { isGLS = val; }
export function setIsCTS(val: boolean) { isCTS = val; }
export function setIsXTS(val: boolean) { isXTS = val; }
export function setIsSCS(val: boolean) { isSCS = val; }
export function setIsXHS(val: boolean) { isXHS = val; }
export function setIsSB(val: boolean) { isSB = val; }
export function setIsXB(val: boolean) { isXB = val; }
