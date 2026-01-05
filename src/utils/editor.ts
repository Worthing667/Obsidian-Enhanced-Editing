import { App, Editor, MarkdownView } from 'obsidian';
import * as globals from '../globals';

/**
 * 编辑器工具函数模块
 */

/**
 * 获取当前编辑模式
 */
export function 获取编辑模式(app: App): Editor | undefined {
    const view = app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) { return undefined; }
    return (view as any).sourceMode?.cmEditor;
}

/**
 * 获取所选文本
 */
export function 获取所选文本(app: App): string | null {
    const cmEditor = 获取编辑模式(app);
    if (!cmEditor) return null;
    if (cmEditor.getSelection() === "") {
        return null;
    } else {
        return cmEditor.getSelection();
    }
}

/**
 * 获取笔记正文（选中文本或全文）
 */
export function 获取笔记正文(app: App): string | undefined {
    const cmEditor = 获取编辑模式(app);
    if (!cmEditor) return undefined;
    if (cmEditor.getSelection() === "") {
        return cmEditor.getValue();
    } else {
        return cmEditor.getSelection();
    }
}

/**
 * 替换所选文本
 */
export function 替换所选文本(app: App, selection: string | null): void {
    const cmEditor = 获取编辑模式(app);
    if (!cmEditor || selection === null) {
        return;
    }
    cmEditor.replaceSelection(selection);
}

/**
 * 替换笔记正文
 */
export function 替换笔记正文(app: App, lines: string): void {
    const cmEditor = 获取编辑模式(app);
    if (!cmEditor) return;
    if (cmEditor.getSelection() === "") {
        cmEditor.setValue(lines);
    } else {
        cmEditor.replaceSelection(lines);
    }
}

/**
 * 获取编辑器信息
 * 初始信息获取，最基本函数
 */
export function 获取编辑器信息(app: App): boolean {
    const 编辑模式 = 获取编辑模式(app);
    if (!编辑模式) { return false; }

    globals.set编辑模式(编辑模式);

    const 笔记全文 = (编辑模式 as any).getDoc();
    globals.set笔记全文(笔记全文);

    const 笔记正文 = 获取笔记正文(app) || "";
    globals.set笔记正文(笔记正文);

    const 所选文本 = 获取所选文本(app);
    globals.set所选文本(所选文本);

    const 当前光标 = 编辑模式.getCursor();
    globals.set当前光标(当前光标);

    const 当前行号 = 当前光标.line;
    globals.set当前行号(当前行号);

    const 当前行文本 = 编辑模式.getLine(当前行号);
    globals.set当前行文本(当前行文本);

    const 选至行首 = 编辑模式.getRange({ line: 当前行号, ch: 0 }, 当前光标);
    globals.set选至行首(选至行首);

    if (当前行文本 !== "") {
        const 选至行尾 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 当前行文本.length });
        globals.set选至行尾(选至行尾);
    } else {
        const 选至行尾 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 0 });
        globals.set选至行尾(选至行尾);
    }

    const 末行行号 = 编辑模式.lastLine();
    globals.set末行行号(末行行号);

    const 末行文本 = 编辑模式.getLine(末行行号);
    globals.set末行文本(末行文本);

    const 选至文首 = 编辑模式.getRange({ line: 0, ch: 0 }, { line: 当前行号, ch: 0 });
    globals.set选至文首(选至文首);

    if (末行文本 !== "") {
        const 选至文末 = 编辑模式.getRange({ line: 当前行号, ch: 0 }, { line: 末行行号, ch: 末行文本.length });
        globals.set选至文末(选至文末);
    } else {
        const 选至文末 = 编辑模式.getRange({ line: 当前行号, ch: 0 }, { line: 末行行号, ch: 0 });
        globals.set选至文末(选至文末);
    }

    return true;
}
