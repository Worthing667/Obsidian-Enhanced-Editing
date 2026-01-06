/**
 * 所有功能方法的实现
 * 从原始 main.js 提取并转换为 TypeScript
 */

import { Notice, MarkdownView, TFile, App, Editor } from "obsidian";
import { 获取编辑模式 as utils获取编辑模式 } from "../utils/editor";
import { 简体字表, 繁体字表 } from "../data/char-tables";
import { Settings } from "../settings";

// 全局变量引用
let app: App;
let settings: Settings;
let 编辑模式: Editor;
let 所选文本: string | null;
let 笔记正文: string;
let 笔记全文: any;
let 当前行文本: string;
let 当前光标: any;
let 当前行号: number;
let 选至行首: string;
let 选至行尾: string;
let 末行行号: number;
let 末行文本: string;
let 选至文首: string;
let 选至文末: string;

// 格式刷状态
let isGLS = false;
let isCTS = false;
let isXTS = false;
let isSCS = false;
let isXHS = false;
let isSB = false;
let isXB = false;

// 设置全局变量的函数
export function setGlobals(globals: { app: App; settings: Settings }) {
  app = globals.app;
  settings = globals.settings;
}

// 获取格式刷状态
export function getFormatBrushState() {
  return { isGLS, isCTS, isXTS, isSCS, isXHS, isSB, isXB };
}

// 格式刷管理
export function 关闭格式刷() {
  isGLS = false;
  isCTS = false;
  isXTS = false;
  isSCS = false;
  isXHS = false;
  isSB = false;
  isXB = false;
}

// ==================== 基础 Helper 函数 ====================

function 获取编辑模式(): Editor | undefined {
  return utils获取编辑模式(app);
}

function 获取编辑器信息() {
  编辑模式 = 获取编辑模式()!;
  if (!编辑模式) return;

  笔记全文 = 编辑模式.getDoc();
  笔记正文 = 编辑模式.getValue(); // Use getValue directly
  所选文本 = 编辑模式.getSelection();
  当前光标 = 编辑模式.getCursor();
  当前行号 = 当前光标.line;
  当前行文本 = 编辑模式.getLine(当前行号);
  选至行首 = 编辑模式.getRange({ line: 当前行号, ch: 0 }, 当前光标);

  if (当前行文本 != "") {
    选至行尾 = 编辑模式.getRange(当前光标, {
      line: 当前行号,
      ch: 当前行文本.length,
    });
  } else {
    选至行尾 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 0 });
  }

  末行行号 = 编辑模式.lastLine();
  末行文本 = 编辑模式.getLine(末行行号);
  选至文首 = 编辑模式.getRange({ line: 0, ch: 0 }, { line: 当前行号, ch: 0 });

  if (末行文本 != "") {
    选至文末 = 编辑模式.getRange(
      { line: 当前行号, ch: 0 },
      { line: 末行行号, ch: 末行文本.length }
    );
  } else {
    选至文末 = 编辑模式.getRange(
      { line: 当前行号, ch: 0 },
      { line: 末行行号, ch: 0 }
    );
  }
}

function 替换所选文本(text: string) {
  if (!编辑模式) 获取编辑器信息();
  if (text == null) return;
  编辑模式.replaceSelection(text);
}

function 替换笔记正文(text: string) {
  if (!编辑模式) 获取编辑器信息();
  // 使用缓存的 所选文本 变量而不是实时调用 getSelection()
  // 因为在函数调用链中选区状态可能已改变
  if (!所选文本 || 所选文本 === "") {
    编辑模式.setValue(text);
  } else {
    编辑模式.replaceSelection(text);
  }
}

// ==================== 光标导航功能 ====================

export function 选择当前语法() {
  获取编辑器信息();
  if (!选至行首 || !选至行尾) return;
  var m1 = 选至行首.match(/(\*\*|==|~~|%%|\[\[)[^\*=~%\[\]]*$/m);
  var m2 = 选至行尾.match(/^[^\*=~%\[\]]*(\*\*|==|~~|%%|\]\])/m);

  if (m1 && m2) {
    var 句前 = m1[0];
    var 句后 = m2[0];
    var _length1 = 选至行首.length - 句前.length;
    var _length2 = 选至行首.length + 句后.length;
    编辑模式.setSelection(
      { line: 当前行号, ch: _length1 },
      { line: 当前行号, ch: _length2 }
    );
  }
}

export function 切换文件列表(_num: number, app: App) {
  const 当前文件 = app.workspace.getActiveFile();
  if (!当前文件) return;

  const 当前文件路径 = 当前文件.path;
  const 父级文件夹 = 当前文件路径.replace(/[^\\/]+$/, "");

  let 同级文件列表: TFile[] = [];
  app.vault.getMarkdownFiles().forEach((file) => {
    if (file.path == 父级文件夹 + file.basename + ".md") {
      同级文件列表.push(file);
    }
  });

  同级文件列表 = 同级文件列表.sort((str1, str2) => {
    return str1.path.localeCompare(str2.path, "zh");
  });

  let thisID = 同级文件列表.indexOf(当前文件) + _num;
  if (thisID > 同级文件列表.length - 1) {
    thisID = 0;
  } else if (thisID < 0) {
    thisID = 同级文件列表.length - 1;
  }

  const xinFile = 同级文件列表[thisID];
  (app.workspace as any).activeLeaf.openFile(xinFile);
}

// ==================== 追加功能函数 ====================

export function 重复当前行() {
  获取编辑器信息();
  if (!编辑模式 || !当前行文本) return;
  var 新行文本 = "\n" + 当前行文本;
  let ch = 当前行文本.length;
  笔记全文.replaceRange(
    新行文本,
    { line: 当前行号, ch: ch },
    { line: 当前行号, ch: ch }
  );
}

export function 智能符号() {
  获取编辑器信息();
  if (!编辑模式 || !选至行首 || !选至行尾 || !当前光标) return;

  var 标前两字 = 编辑模式.getRange(
    { line: 当前行号, ch: 选至行首.length - 2 },
    当前光标
  );
  // var 标后两字 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 选至行首.length + 2 });

  if (选至行尾.match(/^(\]\]|\=\=|\*\*|\~\~)/)) {
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行尾.match(/^[$》〉］｝】〗〕』」）}\)]/)) {
    编辑模式.exec("goRight");
  } else if (标前两字.match(/^[【\[][（\(]$/)) {
    笔记全文.replaceRange(
      "〖",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^[（\(][《\<]$/)) {
    笔记全文.replaceRange(
      "〈",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^[\(（][【\[]$/)) {
    笔记全文.replaceRange(
      "〔",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^[“\"][【\[]$/)) {
    笔记全文.replaceRange(
      "『",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^[‘\'][【\[]$/)) {
    笔记全文.replaceRange(
      "「",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^……$/)) {
    笔记全文.replaceRange(
      "^",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
  } else if (标前两字.match(/^￥￥$/)) {
    笔记全文.replaceRange(
      "$$",
      { line: 当前行号, ch: 选至行首.length - 2 },
      当前光标
    );
    编辑模式.exec("goLeft");
  } else if (选至行首.match(/《[^《》〈〉｛｝【】〖〗〔〕（）『』「」]*$/)) {
    笔记全文.replaceRange("》", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/〈[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("〉", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/［[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("］", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/｛[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("｝", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/【[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("】", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/〖[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("〗", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/〔[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("〕", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/『[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("』", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/「[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("」", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (
    选至行首.match(/（[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)
  ) {
    笔记全文.replaceRange("）", 当前光标, 当前光标);
    编辑模式.exec("goRight");
  } else if (选至行首.match(/^》$/)) {
    笔记全文.replaceRange(">", { line: 当前行号, ch: 0 }, 当前光标);
  } else if (选至行首.match(/^、$/)) {
    笔记全文.replaceRange("/", { line: 当前行号, ch: 0 }, 当前光标);
  } else if (选至行首.match(/\[\[[^=\[\]\*~]*$/)) {
    笔记全文.replaceRange("]]", 当前光标, 当前光标);
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行首.match(/==[^=\[\]\*~]*$/)) {
    笔记全文.replaceRange("==", 当前光标, 当前光标);
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行首.match(/\*\*[^=\[\]\*~]*$/)) {
    笔记全文.replaceRange("**", 当前光标, 当前光标);
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行首.match(/%%[^=\[\]\*~%]*$/)) {
    笔记全文.replaceRange("%%", 当前光标, 当前光标);
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行首.match(/~~[^=\[\]\*~]*$/)) {
    笔记全文.replaceRange("~~", 当前光标, 当前光标);
    编辑模式.exec("goRight");
    编辑模式.exec("goRight");
  } else if (选至行首.match(/^(dataview|dv)$/i)) {
    笔记全文.replaceRange(
      "```dataview\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  } else if (选至行首.match(/^(mermaid|mm)$/i)) {
    笔记全文.replaceRange(
      "```mermaid\ngraph TD\n\nA[2021]\nB[2022]\n\nA-->B\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
  } else if (选至行首.match(/^(query|qy)$/i)) {
    笔记全文.replaceRange(
      "```query\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  } else if (选至行首.match(/^(JavaScript|js)$/i)) {
    笔记全文.replaceRange(
      "```JavaScript\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  } else if (选至行首.match(/^```js$/i)) {
    笔记全文.replaceRange("```JavaScript", { line: 当前行号, ch: 0 }, 当前光标);
    编辑模式.exec("goDown");
  } else if (选至行首.match(/^(Java|ja)$/i)) {
    笔记全文.replaceRange(
      "```Java\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  } else if (选至行首.match(/^```ja$/i)) {
    笔记全文.replaceRange("```Java", { line: 当前行号, ch: 0 }, 当前光标);
    编辑模式.exec("goDown");
  } else if (选至行首.match(/^(Python|py)$/i)) {
    笔记全文.replaceRange(
      "```Python\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  } else if (选至行首.match(/^```py$/i)) {
    笔记全文.replaceRange("```Python", { line: 当前行号, ch: 0 }, 当前光标);
    编辑模式.exec("goDown");
  } else if (选至行首.match(/^(CSS)$/i)) {
    笔记全文.replaceRange(
      "```CSS\n\n```\n",
      { line: 当前行号, ch: 0 },
      当前光标
    );
    编辑模式.exec("goLeft");
    编辑模式.exec("goUp");
  }
}

export function 标题语法(_str: string) {
  var link = new RegExp("^" + _str + " ([^#]+)"); //是否包含几个#符号
  获取编辑器信息();
  if (!编辑模式) return;

  var 新文本 = "";
  var 新定位 = 选至行首.replace(/^#+\s/, "");
  if (_str == "") {
    新文本 = 当前行文本.replace(/^\s*#+\s/, "");
  } else if (link.test(当前行文本)) {
    新文本 = 当前行文本.replace(link, "$1");
  } else {
    新文本 = 当前行文本.replace(/^#+[ ]+/, "");
    新文本 = 新文本.replace(/^\s*/, _str + " ");
    新定位 = _str + " " + 新定位;
  }
  笔记全文.replaceRange(
    新文本,
    { line: 当前行号, ch: 0 },
    { line: 当前行号, ch: 当前行文本.length }
  );
  编辑模式.setCursor({ line: 当前行号, ch: 新定位.length });
}

export function 转换无语法文本() {
  获取编辑器信息();
  if (!编辑模式) return;

  var mdText =
    /(^#+\s|(?<=^|\s*)#|^\>|^\- \[( |x)\]|^\+ |\<[^\<\>]+?\>|^1\. |^\s*\- |^\-+$|^\*+$)/gm;
  if (所选文本 == null) {
    if (isCTS || isGLS || isSB || isSCS || isXB || isXHS || isXTS) {
      // @ts-ignore
      isCTS = false;
      isGLS = false;
      isSB = false;
      isSCS = false;
      isXB = false;
      isXHS = false;
      isXTS = false;
      new Notice("已关闭格式刷！");
    } else {
      var reg1 =
        /(~~|%%|==|\*\*?|\<[^\<\>]*?\>|!?\[\[*|`|_|!?\[)([^!#=\[\]\<\>\`_\*~\(\)]*)$/;
      var reg2 =
        /^([^!=\[\]\<\>\`_\*~\(\)]*)(~~|%%|==|\*\*?|\<[^\<\>]*\>|\]\]|`|_|\]\([^\(\)\[\]]*\))/;
      if (选至行首.match(reg1) != null && 选至行尾.match(reg2) != null) {
        // @ts-ignore
        const newHead = 选至行首.replace(reg1, "$2");
        // @ts-ignore
        const newTail = 选至行尾.replace(reg2, "$1");
        var _ch = newHead.length;
        笔记全文.replaceRange(
          newHead + newTail,
          { line: 当前行号, ch: 0 },
          { line: 当前行号, ch: 当前行文本.length }
        );
        编辑模式.setCursor({ line: 当前行号, ch: _ch });
      }
    }
  } else {
    let text = 所选文本;
    text = text.replace(mdText, "");
    text = text.replace(/(\r*\n)+/gm, "\r\n");
    替换所选文本(text);
  }
}

export function 转换内部链接() {
  let 提示语 = "";
  let 旧文本 = "";
  获取编辑器信息();
  if (所选文本 == null) {
    替换所选文本("[[");
    return;
  }
  旧文本 = 所选文本;

  var link = /[\"\|\[\]\?\\\*\<\>\/:]/g;
  var link1 =
    /^([^\[\]]*)!\[+([^\[\]]*)$|^([^\[\]]*)\[+([^\[\]]*)$|^([^\[\]]*)\]+([^\[\]]*)$|^([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)$/g;
  var link2 = /^[^\[\]]*(\[\[[^\[\]]*\]\][^\[\]]*)+$/g;
  var link4 = /([^\[\]\(\)\r\n]*)(\n*)(http.*)/gm;
  var link5 = /!?\[([^\[\]\r\n]*)(\n*)\]\((http[^\(\)]*)\)/gm;
  var link8 = /([、\n])/g;
  if (link.test(所选文本)) {
    if (link1.test(所选文本)) {
      new Notice("划选内容不符合内链语法格式！");
      return;
    } else if (link2.test(所选文本)) {
      提示语 = "内容包含内链语法格式，已经去除[[]]！";
      所选文本 = 所选文本.replace(/(\[\[(.*\|)*)/g, "");
      所选文本 = 所选文本.replace(/\]\]/g, "");
    } else if (link5.test(所选文本)) {
      所选文本 = 所选文本.replace(link5, "$1$3");
      提示语 = "内容包含有[]()链接语法，已经去除符号！";
    } else if (link4.test(所选文本)) {
      所选文本 = 所选文本.replace(link4, "[$1]($3)");
      所选文本 = 所选文本.replace("[\r\n]", "");
      提示语 = "内容包含有说明文本和网址，已经转换！";
    } else {
      new Notice('文件名不能包含下列字符:*"\\/<>:|?');
      return;
    }
  } else {
    提示语 = "内容未包含内链语法格式，需要转换";
    if (link8.test(所选文本)) {
      所选文本 = 所选文本.replace(link8, "]]$1[[");
    }
    所选文本 = "[[" + 所选文本 + "]]";
  }
  console.log("您划选了 " + 旧文本 + "\n" + 提示语);
  替换所选文本(所选文本);
}

export function 转换同义链接() {
  获取编辑器信息();
  if (所选文本 == null) {
    替换所选文本("[[");
    return;
  }
  var lNum = 所选文本.length + 3;
  var link = /[\"\|\[\]\?\\\*\<\>\/:\n]/g;
  if (link.test(所选文本)) {
    return;
  } else {
    所选文本 = "[[|" + 所选文本 + "]]";
  }
  替换所选文本(所选文本);

  var i = 0;
  while (i < lNum) {
    编辑模式.exec("goLeft");
    i++;
  }
}

export function 转换挖空() {
  获取编辑器信息();
  var link = /\{\{c\d::[^\{\}]+\}\}/g;
  var link1 = /\{\{c[^\{\}]*$|^[^\{\}]*\}\}/g;

  if (!所选文本) return;

  if (link1.test(所选文本)) {
    return;
  } else if (link.test(所选文本)) {
    所选文本 = 所选文本.replace(/(\{\{c\d::|\}\})/g, "");
  } else {
    所选文本 = 所选文本.replace(/^(.+)$/gm, "{{c1::$1}}");
  }
  替换所选文本(所选文本);
}

// ==================== 事件处理 ====================

function 获取所选文本(): string | null {
  if (!编辑模式) 获取编辑器信息();
  if (!编辑模式) return null;
  return 编辑模式.getSelection() || null;
}

export function handleMouseUp() {
  获取编辑器信息(); // Update globals
  // 格式刷功能已移除
}

// 全局变量 for Keydown
let 历史缩进: string = "";
let 按上档键: boolean = false;
let 编辑中: boolean = false;

export function handleEditorChange() {
  编辑中 = true;
  按上档键 = false;
}

export function handleKeyDown(e: KeyboardEvent) {
  if (e.key == "Shift") {
    按上档键 = true;
  }

  if (e.key == "Enter") {
    let dn1, dn2;
    let 代码块内 = false;
    获取编辑器信息();
    if (!编辑模式) return;

    const 上行文本 = 编辑模式.getLine(当前行号 - 1);
    const 缩进字符 = 上行文本.match(/^[\t\s]*/)?.[0] || "";

    if (编辑中) {
      const 头代码 = 选至文首.match(/^```/gm);
      const 尾代码 = 选至文末.match(/^```/gm);
      const 在列表行 = 当前行文本.search(/^[\t ]*(\-|\d+\.) /);
      const reg1 = /^[\t ]+$/m;
      const reg2 = /^[\t ]*\/\//m;

      if (头代码 != null && 尾代码 != null) {
        dn1 = 头代码.length;
        dn2 = 尾代码.length;

        if (dn1 % 2 == 1 && dn2 % 2 == 1) {
          代码块内 = true;
          console.log("当前光标处在代码块内！");
          let 缩进文本 = "";
          let 缩进次数,
            i = 0;

          if (上行文本.match(reg1) != null) {
            缩进文本 = 历史缩进;
          } else if (
            上行文本.match(/[;\}]$/m) != null ||
            上行文本.match(reg2) != null
          ) {
            缩进文本 = 缩进字符 + "";
          } else if (上行文本.match(/[\{\)]$/m) != null) {
            缩进文本 = 缩进字符 + "\t";
          } else if (上行文本 == "") {
            缩进文本 = "";
          }

          if (缩进文本 == "") {
            缩进次数 = 0;
          } else {
            缩进次数 = 缩进文本.length;
            笔记全文.replaceRange(缩进文本, 当前光标, 当前光标);
            while (i < 缩进次数) {
              编辑模式.exec("goRight");
              i++;
            }
          }
          历史缩进 = 缩进文本;
        }
      } else if (settings.twoEnter && !代码块内 && 在列表行 < 0) {
        if (按上档键) {
          笔记全文.replaceRange("", 当前光标, 当前光标);
        } else {
          笔记全文.replaceRange("\n", 当前光标, 当前光标);
          编辑模式.exec("goRight");
        }
      }
      编辑中 = false;
    }
  }
}

export function 指定当前文件名() {
  获取编辑器信息();
  if (!app) return;
  const 当前文件 = app.workspace.getActiveFile();
  if (!当前文件) return;

  if (!所选文本) return;

  app.vault.adapter.rename(当前文件.path, 所选文本 + ".md");
  console.log(当前文件.path + "\n" + 所选文本);
}

export function 获取相对路径() {
  获取编辑器信息();
  if (!app) return;
  const 当前文件 = app.workspace.getActiveFile();
  if (!当前文件) return;
  const 当前文件路径 = 当前文件.path;
  const 相对目录 = 当前文件路径.replace(/(?<=\/)[^/]+$/m, "");
  new Notice("当前笔记位于：" + 相对目录);
}

export function 简体转繁() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  for (let i = 0; i < 简体字表.length; i++) {
    text = text.replace(new RegExp(简体字表[i], "g"), 繁体字表[i]);
  }
  替换笔记正文(text);
}

export function 繁体转简() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  for (let i = 0; i < 繁体字表.length; i++) {
    text = text.replace(new RegExp(繁体字表[i], "g"), 简体字表[i]);
  }
  替换笔记正文(text);
}

export function 英转中文标点() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/(?<=[^a-z0-9\>\]]),/g, "，");
  text = text.replace(/(?<=[^a-z0-9\>\]])\./gis, "。");
  text = text.replace(/(?<=[^a-z0-9\>\]])\?/g, "？");
  text = text.replace(/(?<=[^a-z0-9\>\]])!(?=[^\[])/g, "！");
  text = text.replace(/;/g, "；");
  text = text.replace(/(?<=[^:]):|:(?=[^:])/g, "：");
  text = text.replace(/\(/g, "（");
  text = text.replace(/\)/g, "）");
  text = text.replace(/\{([^{}]*)\}/g, "｛$1｝");
  text = text.replace(/\"([^\"]*?)\"/g, "“$1”");
  替换笔记正文(text);
}

export function 中转英文标点() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/，/g, ",");
  text = text.replace(/。/g, ".");
  text = text.replace(/？/g, "?");
  text = text.replace(/！/g, "!");
  text = text.replace(/；/g, ";");
  text = text.replace(/：/g, ":");
  text = text.replace(/（/g, "(");
  text = text.replace(/）/g, ")");
  text = text.replace(/｛([^｛｝]*)｝/g, "{$1}");
  text = text.replace(/“([^“”]*)”/g, '"$1"');
  替换笔记正文(text);
}

/**
 * 判断一行是否属于特殊区域（应跳过空行处理）
 * 特殊区域包括：表格行、引用行
 */
function 是特殊行(行内容: string): boolean {
  // 表格行：包含 | 且以 | 开头或结尾（忽略首尾空格）
  const 去除空格的行 = 行内容.trim();
  if (去除空格的行.startsWith("|") || 去除空格的行.endsWith("|")) {
    return true;
  }
  // 表格分隔行：如 |---|---|
  if (/^\|?[\s\-:]+\|/.test(去除空格的行)) {
    return true;
  }
  // 引用行：以 > 开头
  if (/^\s*>/.test(行内容)) {
    return true;
  }
  return false;
}

/**
 * 判断一行是否为代码块边界
 */
function 是代码块边界(行内容: string): boolean {
  return /^\s*```/.test(行内容);
}

/**
 * 判断一行是否为列表行
 */
function 是列表行(行内容: string): boolean {
  return /^\s*(\-|\+|\*|\d+\.)\s/.test(行内容);
}

/**
 * 判断一行是否为空行
 */
function 是空行(行内容: string): boolean {
  return /^\s*$/.test(行内容);
}

export function 批量插入空行() {
  获取编辑器信息();
  if (!笔记正文) return;

  const 行列表 = 笔记正文.split(/\r?\n/);
  const 结果行: string[] = [];
  let 在代码块内 = false;

  for (let i = 0; i < 行列表.length; i++) {
    const 当前行 = 行列表[i];
    const 上一行 = i > 0 ? 行列表[i - 1] : "";

    // 检测代码块边界
    if (是代码块边界(当前行)) {
      在代码块内 = !在代码块内;
      结果行.push(当前行);
      continue;
    }

    // 如果在代码块内，直接添加不处理
    if (在代码块内) {
      结果行.push(当前行);
      continue;
    }

    // 检查是否需要在当前行前插入空行
    // 不插入空行的条件：
    // 1. 第一行
    // 2. 上一行是空行
    // 3. 当前行是空行
    // 4. 当前行或上一行是特殊行（表格、引用）
    // 5. 当前行或上一行是列表行
    // 6. 上一行是代码块边界

    const 需要跳过 =
      i === 0 ||
      是空行(上一行) ||
      是空行(当前行) ||
      是特殊行(当前行) ||
      是特殊行(上一行) ||
      是列表行(当前行) ||
      是列表行(上一行) ||
      是代码块边界(上一行);

    if (!需要跳过) {
      结果行.push("");
    }

    结果行.push(当前行);
  }

  替换笔记正文(结果行.join("\n"));
}

export function 批量去除空行() {
  获取编辑器信息();
  if (!笔记正文) return;

  const 行列表 = 笔记正文.split(/\r?\n/);
  const 结果行: string[] = [];
  let 在代码块内 = false;

  for (let i = 0; i < 行列表.length; i++) {
    const 当前行 = 行列表[i];

    // 检测代码块边界（以 ``` 开头的行）
    if (/^\s*```/.test(当前行)) {
      在代码块内 = !在代码块内;
      结果行.push(当前行);
      continue;
    }

    // 如果在代码块内，直接添加不处理
    if (在代码块内) {
      结果行.push(当前行);
      continue;
    }

    // 判断当前行是否为空行
    const 是空行 = /^\s*$/.test(当前行);

    // 判断前一行和后一行是否为特殊行
    const 是上一行特殊行 = i > 0 ? 是特殊行(行列表[i - 1]) : false;
    const 是下一行特殊行 =
      i < 行列表.length - 1 ? 是特殊行(行列表[i + 1]) : false;
    const 是上一行引用 = i > 0 ? /^\s*>/.test(行列表[i - 1]) : false;
    const 是下一行引用 =
      i < 行列表.length - 1 ? /^\s*>/.test(行列表[i + 1]) : false;

    // 如果是空行且前后都不是特殊行（表格、引用），则跳过该空行
    if (
      是空行 &&
      !是上一行特殊行 &&
      !是下一行特殊行 &&
      !是上一行引用 &&
      !是下一行引用
    ) {
      continue;
    }

    结果行.push(当前行);
  }

  替换笔记正文(结果行.join("\n"));
}

export function 首行缩进两字符() {
  获取编辑器信息();
  let isIndent = true; // Logic simplified from original, blindly indenting or toggling?
  // Original had logic to toggle based on `isIndent` var which was local to function (re-initialized every call).
  // So it always entered first branch? `let isIndent = true`.
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  // Always remove first then add?
  text = text.replace(/^[‌‌‌　]+/gm, "");
  text = text.replace(
    /^(?!([\n\s\>#]+|```|\-\-\-|\|[^\|]|\*\*\*))/gm,
    "‌‌‌　　"
  );
  替换笔记正文(text);
}

export function 末尾追加空格() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/(?<!(\-\-\-|\*\*\*|\s\s))\n/g, "  \n");
  替换笔记正文(text);
}

export function 去除末尾空格() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/\s\s\n/g, "\n");
  替换笔记正文(text);
}

export function 添加中英间隔() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/([a-zA-Z]+)([一-鿆]+)/g, "$1 $2");
  text = text.replace(/([一-鿆]+)([a-zA-Z]+)/g, "$1 $2");
  替换笔记正文(text);
}

export function 去除所有空格() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/[ 　]+/g, "");
  替换笔记正文(text);
}

export function 上方插入空行() {
  获取编辑器信息();
  if (!当前行文本) return;
  var 新文本 = "\r\n" + 当前行文本;
  笔记全文.replaceRange(
    新文本,
    { line: 当前行号, ch: 0 },
    { line: 当前行号, ch: 当前行文本.length }
  );
}

export function 下方插入空行() {
  获取编辑器信息();
  if (!当前行文本) return;
  var 新文本 = 当前行文本 + "\r\n";
  笔记全文.replaceRange(
    新文本,
    { line: 当前行号, ch: 0 },
    { line: 当前行号, ch: 当前行文本.length }
  );
  编辑模式.setSelection(
    { line: 当前行号, ch: 当前行文本.length + 1 },
    { line: 当前行号, ch: 当前行文本.length + 1 }
  );
}

export function 修复意外断行() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(/(?<=[^a-zA-Z])\s+(?=\r*\n)/g, "");
  text = text.replace(/(?<=[a-zA-Z])\s+(?=\r*\n)/g, " ");
  text = text.replace(/([^。？！\.\?\!])(\r?\n)+/g, "$1");
  替换笔记正文(text);
}

export function 修复错误语法() {
  获取编辑器信息();
  let text = 所选文本 || 笔记正文;
  if (!text) return;
  text = text.replace(
    /[\[【]([^\[\]【】]*)[】\]][（|\(]([^\(\)（）]*)[）|\)]/g,
    "[$1]($2)"
  );
  text = text.replace(/\[+([^\[\]]*)\]+\(/g, "[$1](");
  text = text.replace(/(?<=^|\s)    /gm, "\t");
  text = text.replace(/(?<=\]\([^\(\)]+\))$/g, "  ");
  text = text.replace(/\*\s+\>\s+/g, "- ");
  text = text.replace(/(?<=\s)[0-9]+。 /g, "1. ");
  替换笔记正文(text);
}

export function 转换路径() {
  获取编辑器信息();
  if (所选文本 == null) {
    return;
  }
  var link1 = /^[a-zA-Z]:\\/;
  var link2 = /^(\[[^\[\]]*\]\()*file:\/\/\/[^\(\)]*\)*/;
  var link3 = /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/;
  if (link1.test(所选文本)) {
    所选文本 = 所选文本.replace(/\s/gm, "%20");
    所选文本 = 所选文本.replace(/^(.*)$/m, "[file](file:///$1)");
    所选文本 = 所选文本.replace(/\\/gim, "/");
    替换所选文本(所选文本);
  } else if (link2.test(所选文本)) {
    所选文本 = 所选文本.replace(/%20/gm, " ");
    所选文本 = 所选文本.replace(
      /^(\[[^\[\]]*\]\()*file:\/\/\/([^\(\)]*)\)*/m,
      "$2"
    );
    所选文本 = 所选文本.replace(/\//gm, "\\");
    替换所选文本(所选文本);
  } else if (link3.test(所选文本)) {
    所选文本 = 所选文本.replace(
      /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/m,
      "$1"
    );
    替换所选文本(所选文本);
  } else {
    new Notice("您划选的路径格式不正确！");
    return;
  }
}

export function 续选当前文本() {
  获取编辑器信息();
  if (!所选文本) return;
  // @ts-ignore
  var lang = 选至行尾.indexOf(所选文本);
  var 起始 = 选至行首.length + lang;
  var 结束 = 起始 + 所选文本.length;
  if (lang < 0) {
    return;
  }
  // @ts-ignore
  编辑模式.setSelection(
    { line: 当前行号, ch: 起始 },
    { line: 当前行号, ch: 结束 }
  );
}

export function 智能粘贴() {
  获取编辑器信息();
  navigator.clipboard
    .readText()
    .then((clipText) => {
      if (clipText == "" || clipText == null) {
        return;
      }
      var tmpText = clipText.replace(/[\r\n|\n]+/g, "");
      var tableReg = /\|.*?\|.*/;
      // @ts-ignore
      var htmlReg = /<[^>]+>/g;
      // @ts-ignore
      var codeReg = /`[^`]+`/;
      if (tableReg.test(tmpText)) {
        clipText = clipText.replace(/\t/g, "|");
        clipText = clipText.replace(/^(?=[^\r\n])|(?<=[^\r\n])$/gm, "|");
        clipText = clipText.replace(/(?<=\|)(?=\|)/g, "　");
        new Notice("剪贴板数据已转为MD语法表格！");
      } else if (htmlReg.test(tmpText)) {
        console.log("获取到富文本");
      } else {
        clipText = "```\n" + clipText + "\n```\n";
        new Notice("剪贴板数据已转为代码块格式！");
      }
      编辑模式.replaceSelection(clipText);
    })
    .catch((err) => {
      console.error("未能读取到剪贴板上的内容: ", err);
    });
}

export function 获取标注文本() {
  获取编辑器信息();
  if (!笔记正文) return;
  var tmp = 笔记正文.replace(
    /^(?!#+ |#注释|#标注|#批注|#反思|#备注|.*==|.*%%).*$|^[^#\n%=]*(==|%%)|(==|%%)[^\n%=]*$|(==|%%)[^\n%=]*(==|%%)/gm,
    "\n"
  );
  tmp = tmp.replace(/[\r\n|\n]+/g, "\n");
  new Notice("已成功获取标注类文本，可以粘贴！");
  navigator.clipboard.writeText(tmp);
}

export function 获取无语法文本() {
  获取编辑器信息();
  var mdText =
    /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\-+$|^\*+$|==|\*+|~~|```|!*\[\[|\]\])/gm;
  if (所选文本 == "") {
    new Notice("请先划选部分文本，再执行命令！");
  } else {
    // @ts-ignore
    所选文本 = 所选文本.replace(/\[([^\[\]]*)\]\([^\(\)]+\)/gim, "$1");
    所选文本 = 所选文本.replace(mdText, "");
    所选文本 = 所选文本.replace(/^[ ]+|[ ]+$/gm, "");
    所选文本 = 所选文本.replace(/(\r\n|\n)+/gm, "\n");
    new Notice("已成功获取无语法文本，可以粘贴！");
    navigator.clipboard.writeText(所选文本);
  }
}

export function 嵌入当前网址页面() {
  获取编辑器信息();
  var vid, web;
  var 基本格式 =
    '\n<iframe src="■" width=100% height="500px" frameborder="0" scrolling="auto"></iframe>';
  // @ts-ignore
  if (所选文本.match(/^https?:\/\/[^:]+/)) {
    // @ts-ignore
    if (所选文本.match(/^https?:\/\/v\.qq\.com/)) {
      // @ts-ignore
      vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\.html.*)?$/, "$1");
      web = "https://v.qq.com/txp/iframe/player.html?vid=" + vid;
      // @ts-ignore
    } else if (所选文本.match(/^https?:\/\/www\.bilibili\.com/)) {
      // @ts-ignore
      vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\?spm.*)?$/, "$1");
      web = "https://player.bilibili.com/player.html?bvid=" + vid;
      // @ts-ignore
    } else if (所选文本.match(/^https?:\/\/www\.youtube\.com/)) {
      // @ts-ignore
      vid = 所选文本.replace(/^http.*?v=([^\/=\?\.]+)(\/.*)?$/, "$1");
      web = "https://www.youtube.com/embed/" + vid;
    } else {
      web = 所选文本;
    }
    基本格式 = 基本格式.replace(/■/, web);
    笔记全文.replaceRange(
      基本格式,
      { line: 当前行号, ch: 当前行文本.length },
      { line: 当前行号, ch: 当前行文本.length }
    );
    编辑模式.exec("goRight");
  } else {
    new Notice("所选文本不符合网址格式，无法嵌入！");
  }
}

export function 列表转为图示() {
  获取编辑器信息();
  // @ts-ignore
  var 大纲文本 = 所选文本.replace(/(    |\t)/gm, "■");
  大纲文本 = 大纲文本.replace(/(\-\s|\d+\.\s)/gm, "");
  大纲文本 = 大纲文本.replace(/\s+$/gm, "");
  大纲文本 = 大纲文本.replace(/\n/g, "↵");
  大纲文本 = 大纲文本.replace(/↵+$/, "");
  var tagAry = 大纲文本.split("↵");

  var fName = "";
  var 主要语法 = "";
  var m = -1; // 初始化 m 变量
  for (var i = 0; i < tagAry.length; i++) {
    var thisLine = tagAry[i];
    var n = thisLine.lastIndexOf("■");
    if (i > 0) {
      var upLine = tagAry[i - 1];
      m = upLine.lastIndexOf("■");
    }

    if (n < 0) {
      fName = thisLine;
    } else {
      thisLine = thisLine.replace(/^■+/, "");
      if (n > m) {
        fName = fName + "-->" + thisLine;
      } else if (n == m) {
        fName = fName.replace(/(?<=(^|\-\-\>))[^\-\>]+$/, thisLine);
      } else {
        var cha = Number(m - n) + 1;
        // @ts-ignore
        fName = fName.replace(
          new RegExp("(-->[^->]+){" + cha + "}$"),
          "-->" + thisLine
        );
      }
      var 行语法 = fName.replace(/^.*\-\-\>(?=[^\-\>]+\-\-\>[^\-\>]+$)/gm, "");
      主要语法 = 主要语法 + "↵" + 行语法;
    }
  }
  var 输出语法 = "%%此图示由列表文本转换而成！%%↵" + 主要语法;
  // @ts-ignore
  编辑模式.setCursor({ line: 0, ch: 0 });
  // @ts-ignore
  笔记正文 = 获取笔记正文(); // Fix: manually call if internal helper doesn't update text object?
  // 其实 获取编辑器信息() 已经更新了 笔记正文, but original code calls 获取笔记正文 again?
  // 获取编辑器信息() calls 获取笔记正文(). So it should be fine.
  // But original code: 笔记正文 = this.获取笔记正文();
  // Maybe it expects refresh?
  // Let's call it just in case.
  // Wait, 获取笔记正文() returns string but also updates global 笔记正文?
  // In all-features.ts: function 获取笔记正文() { var text = ...; 笔记正文 = text; return text; }
  // So calling it updates global.

  var 新正文 = 笔记正文.replace(/\n/g, "↵");
  if (新正文.includes("%%此图示由列表文本转换而成！%%")) {
    新正文 = 新正文.replace(
      /%%此图示由列表文本转换而成！%%↵.+?(?=↵```)/g,
      输出语法
    );
    新正文 = 新正文.replace(/↵/g, "\n");
    替换笔记正文(新正文);
  } else {
    new Notice("列表文本已转为MerMaid语法。\n可以粘贴！");
    输出语法 = 输出语法.replace(/↵/g, "\n");
    navigator.clipboard.writeText(
      "```mermaid\ngraph TD\n" + 输出语法 + "\n```\n"
    );
  }
}

export function 折叠当前同级标题() {
  获取编辑器信息();
  if (!笔记全文) return;
  if (/^#+\s/.test(当前行文本)) {
    // @ts-ignore
    app.commands.executeCommandById("editor:unfold-all");
    var _str = 当前行文本.replace(/^(#+)\s.*$/, "$1");
    // @ts-ignore
    var 末行行号 = 编辑模式.lastLine();
    for (var i = 末行行号; i >= 0; i--) {
      // @ts-ignore
      编辑模式.setCursor({ line: i, ch: 0 });
      // @ts-ignore
      var 本行文本 = 编辑模式.getLine(i);
      if (new RegExp("^" + _str + "(?=[^#])").test(本行文本)) {
        // @ts-ignore
        app.commands.executeCommandById("editor:toggle-fold");
      }
    }
  }
}

// ==================== 补全遗漏功能 ====================

export function 游标上移() {
  获取编辑器信息();
  编辑模式.exec("goUp");
}
export function 游标下移() {
  获取编辑器信息();
  编辑模式.exec("goDown");
}
export function 游标左移() {
  获取编辑器信息();
  编辑模式.exec("goLeft");
}
export function 游标右移() {
  获取编辑器信息();
  编辑模式.exec("goRight");
}
export function 游标置首() {
  获取编辑器信息();
  编辑模式.exec("goStart");
}
export function 游标置尾() {
  获取编辑器信息();
  编辑模式.exec("goEnd");
}

export function 转为超链接语法() {
  获取编辑器信息();
  if (!笔记正文) return;
  笔记正文 = 笔记正文.replace(/\[\[([^\[\]]+)\]\]/g, "[$1]($1)");
  笔记正文 = 笔记正文.replace(/(?<=\]\([^\s]*)\s(?=[^\s]*\))/g, "%20");
  替换笔记正文(笔记正文);
}

export function 转换待办列表() {
  获取编辑器信息();
  var 当前新文本 = 当前行文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[) (?=\]\s[^\s])/gm,
    "x☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)x(?=\]\s[^\s])/gm,
    "-☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\-(?=\]\s[^\s])/gm,
    "!☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\!(?=\]\s[^\s])/gm,
    "?☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\?(?=\]\s[^\s])/gm,
    ">☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\>(?=\]\s[^\s])/gm,
    "<☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\<(?=\]\s[^\s])/gm,
    "+☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\+(?=\]\s[^\s])/gm,
    " ☀"
  );
  当前新文本 = 当前新文本.replace(
    /(?<=^\s*([\-\+]|[0-9]+\.)\s\[[\sx\-\+\?\!\<\>])☀(?=\]\s[^\s])/gm,
    ""
  );
  笔记全文.replaceRange(
    当前新文本,
    { line: 当前行号, ch: 0 },
    { line: 当前行号, ch: 当前行文本.length }
  );
}

export function 自动设置标题() {
  获取编辑器信息();
  if (!笔记正文) return;
  笔记正文 = 笔记正文.replace(/\r?\n/g, "↫");
  笔记正文 = 笔记正文.replace(/↫\s*↫/g, "↫↫");
  笔记正文 = 笔记正文.replace(/\s*(?=↫)/g, "");
  笔记正文 = 笔记正文.replace(
    /(?<=^|↫)([^#`\[\]\(\)↫]{3,}[^\.\?\!:,0-9，：。？！）↫])(?=↫|$)/g,
    "↫### $1↫"
  );
  笔记正文 = 笔记正文.replace(/#+([^#↫]+)↫*$/gm, "$1");
  笔记正文 = 笔记正文.replace(/↫{3,}/g, "\r\n\r\n");
  笔记正文 = 笔记正文.replace(/↫/g, "\r\n");
  替换笔记正文(笔记正文);
}

export async function 获取富文本() {
  获取编辑器信息();
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      if (item.types.includes("text/html")) {
        const blob = await item.getType("text/html");
        const text = await blob.text();
        替换所选文本(text);
        new Notice("已粘贴富文本HTML");
        return;
      }
    }
    new Notice("剪贴板中没有富文本数据");
  } catch (e) {
    new Notice("无法读取剪贴板");
    console.error(e);
  }
}
