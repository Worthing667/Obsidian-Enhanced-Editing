/* *****************************************************************************
使用声明
本插件基于`蚕子`的`ZH增强编辑插件`二次开发而成，蚕子 QQ：312815311。
二次开发中的主要更改包括：
1. 精简了与 `Editing Toolbar` 插件重合的功能'
2. 添加了我需要的功能
***************************************************************************** */

import { Plugin, Notice, MarkdownView, Editor, TFile } from 'obsidian';
import { Settings } from './settings';
import { EditSettingsTab } from './settings-tab';
import * as allFeatures from './features/all-features';

export default class MyPlugin extends Plugin {
    settings: Settings = new Settings();
    SETTINGS_PATH: string = '.obsidian/plugins/ZH增强编辑/data.json';

    override async onload() {
        console.log('加载增强编辑插件');

        // 初始化全局变量
        allFeatures.setGlobals({ app: this.app, settings: this.settings });

        // 链接转换命令
        this.addCommand({
            id: 'internal-link',
            name: '[[链接]]语法',
            callback: () => allFeatures.转换内部链接(),
            hotkeys: [{ modifiers: ["Alt"], key: "Z" }]
        });

        this.addCommand({
            id: 'internal-link2',
            name: '[[链接|同名]]语法',
            callback: () => allFeatures.转换同义链接(),
            hotkeys: [{ modifiers: ["Alt"], key: "Q" }]
        });

        this.addCommand({
            id: 'auto-text',
            name: '智能符号',
            callback: () => allFeatures.智能符号(),
            hotkeys: [{ modifiers: ["Alt"], key: ";" }]
        });

        // 文件切换命令
        this.addCommand({
            id: 'open-up',
            name: '查看同级上方文件',
            callback: () => allFeatures.切换文件列表(-1, this.app),
            hotkeys: [{ modifiers: ["Alt", "Shift"], key: "I" }]
        });

        this.addCommand({
            id: 'open-down',
            name: '查看同级下方文件',
            callback: () => allFeatures.切换文件列表(1, this.app),
            hotkeys: [{ modifiers: ["Alt", "Shift"], key: "K" }]
        });

        // 游标控制命令
        this.addCommand({
            id: 'mouse-up',
            name: '游标上移',
            callback: () => allFeatures.游标上移(),
            hotkeys: [{ modifiers: ["Alt"], key: "I" }]
        });

        this.addCommand({
            id: 'mouse-down',
            name: '游标下移',
            callback: () => allFeatures.游标下移(),
            hotkeys: [{ modifiers: ["Alt"], key: "K" }]
        });

        this.addCommand({
            id: 'mouse-left',
            name: '游标左移',
            callback: () => allFeatures.游标左移(),
            hotkeys: [{ modifiers: ["Alt"], key: "J" }]
        });

        this.addCommand({
            id: 'mouse-right',
            name: '游标右移',
            callback: () => allFeatures.游标右移(),
            hotkeys: [{ modifiers: ["Alt"], key: "L" }]
        });

        this.addCommand({
            id: 'mouse-start',
            name: '游标置首',
            callback: () => allFeatures.游标置首(),
            hotkeys: [{ modifiers: ["Alt"], key: "U" }]
        });

        this.addCommand({
            id: 'mouse-end',
            name: '游标置尾',
            callback: () => allFeatures.游标置尾(),
            hotkeys: [{ modifiers: ["Alt"], key: "O" }]
        });

        // 标题命令
        this.addCommand({
            id: 'biaoti0-text',
            name: '取消标题',
            callback: () => allFeatures.标题语法(""),
            hotkeys: [{ modifiers: ["Mod"], key: "`" }]
        });

        this.addCommand({
            id: 'biaoti1-text',
            name: 'H1标题',
            callback: () => allFeatures.标题语法("#"),
            hotkeys: [{ modifiers: ["Mod"], key: "1" }]
        });

        this.addCommand({
            id: 'biaoti2-text',
            name: 'H2标题',
            callback: () => allFeatures.标题语法("##"),
            hotkeys: [{ modifiers: ["Mod"], key: "2" }]
        });

        this.addCommand({
            id: 'biaoti3-text',
            name: 'H3标题',
            callback: () => allFeatures.标题语法("###"),
            hotkeys: [{ modifiers: ["Mod"], key: "3" }]
        });

        this.addCommand({
            id: 'biaoti4-text',
            name: 'H4标题',
            callback: () => allFeatures.标题语法("####"),
            hotkeys: [{ modifiers: ["Mod"], key: "4" }]
        });

        this.addCommand({
            id: 'biaoti5-text',
            name: 'H5标题',
            callback: () => allFeatures.标题语法("#####"),
            hotkeys: [{ modifiers: ["Mod"], key: "5" }]
        });

        this.addCommand({
            id: 'biaoti6-text',
            name: 'H6标题',
            callback: () => allFeatures.标题语法("######"),
            hotkeys: [{ modifiers: ["Mod"], key: "6" }]
        });

        this.addCommand({
            id: 'auto-texts',
            name: '自动设置标题',
            callback: () => allFeatures.自动设置标题()
        });

        // 格式转换命令
        this.addCommand({
            id: 'cuti-text',
            name: '**粗体**',
            callback: () => allFeatures.转换粗体(),
            hotkeys: [{ modifiers: ["Alt"], key: "C" }]
        });

        this.addCommand({
            id: 'gaoliang-text',
            name: '==高亮==',
            callback: () => allFeatures.转换高亮(),
            hotkeys: [{ modifiers: ["Alt"], key: "G" }]
        });

        this.addCommand({
            id: 'xieti-text',
            name: '*斜体*',
            callback: () => allFeatures.转换斜体(),
            hotkeys: [{ modifiers: ["Alt"], key: "X" }]
        });

        this.addCommand({
            id: 'shanchu-text',
            name: '~~删除线~~',
            callback: () => allFeatures.转换删除线(),
            hotkeys: [{ modifiers: ["Alt"], key: "S" }]
        });

        this.addCommand({
            id: 'xiahua-text',
            name: '_下划线_',
            callback: () => allFeatures.转换下划线(),
            hotkeys: [{ modifiers: ["Alt"], key: "H" }]
        });

        this.addCommand({
            id: 'zhuozhong-text',
            name: '`行内代码`',
            callback: () => allFeatures.转换行内代码(),
            hotkeys: [{ modifiers: ["Alt"], key: "D" }]
        });

        this.addCommand({
            id: 'add-daima',
            name: '```代码块```',
            callback: () => allFeatures.转换代码块()
        });

        this.addCommand({
            id: 'add-langxian',
            name: '~~~三浪线~~~',
            callback: () => allFeatures.转换三浪线()
        });

        this.addCommand({
            id: 'common-text',
            name: '转换无语法文本',
            callback: () => allFeatures.转换无语法文本(),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "Z" }]
        });

        this.addCommand({
            id: 'common-link',
            name: '转为超链接语法',
            callback: () => allFeatures.转为超链接语法(),
            hotkeys: [{ modifiers: ["Mod", "Shift", "Alt"], key: "Z" }]
        });

        this.addCommand({
            id: 'copy-text',
            name: '获取无语法文本',
            callback: () => allFeatures.获取无语法文本(),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "C" }]
        });

        this.addCommand({
            id: 'add-up',
            name: '上标语法',
            callback: () => allFeatures.转换上标()
        });

        this.addCommand({
            id: 'add-ub',
            name: '下标语法',
            callback: () => allFeatures.转换下标()
        });

        // 颜色转换命令
        this.addCommand({
            id: 'text-Color1',
            name: '转换红色文字',
            callback: () => allFeatures.转换文字颜色("#ff0000"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "1" }]
        });

        this.addCommand({
            id: 'text-Color2',
            name: '转换橙色文字',
            callback: () => allFeatures.转换文字颜色("#ff9900"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "2" }]
        });

        this.addCommand({
            id: 'text-Color3',
            name: '转换黄色文字',
            callback: () => allFeatures.转换文字颜色("#ffff00"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "3" }]
        });

        this.addCommand({
            id: 'text-Color4',
            name: '转换绿色文字',
            callback: () => allFeatures.转换文字颜色("#00ff00"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "4" }]
        });

        this.addCommand({
            id: 'text-Color5',
            name: '转换青色文字',
            callback: () => allFeatures.转换文字颜色("#6495ED"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "5" }]
        });

        this.addCommand({
            id: 'text-Color6',
            name: '转换蓝色文字',
            callback: () => allFeatures.转换文字颜色("#7B68EE"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "6" }]
        });

        this.addCommand({
            id: 'text-Color7',
            name: '转换紫色文字',
            callback: () => allFeatures.转换文字颜色("#ff00ff"),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "7" }]
        });

        this.addCommand({
            id: 'text-background1',
            name: '转换红色背景',
            callback: () => allFeatures.转换背景颜色("#ff0000"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "1" }]
        });

        this.addCommand({
            id: 'text-background2',
            name: '转换橙色背景',
            callback: () => allFeatures.转换背景颜色("#ff9900"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "2" }]
        });

        this.addCommand({
            id: 'text-background3',
            name: '转换黄色背景',
            callback: () => allFeatures.转换背景颜色("#ffff00"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "3" }]
        });

        this.addCommand({
            id: 'text-background4',
            name: '转换绿色背景',
            callback: () => allFeatures.转换背景颜色("#00ff00"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "4" }]
        });

        this.addCommand({
            id: 'text-background5',
            name: '转换青色背景',
            callback: () => allFeatures.转换背景颜色("#6495ED"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "5" }]
        });

        this.addCommand({
            id: 'text-background6',
            name: '转换蓝色背景',
            callback: () => allFeatures.转换背景颜色("#7B68EE"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "6" }]
        });

        this.addCommand({
            id: 'text-background7',
            name: '转换紫色背景',
            callback: () => allFeatures.转换背景颜色("#ff00ff"),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "7" }]
        });

        // 其他转换命令
        this.addCommand({
            id: 'add-todo',
            name: '转换待办状态',
            callback: () => allFeatures.转换待办列表()
        });

        this.addCommand({
            id: 'add-tiankong',
            name: '转换挖空',
            callback: () => allFeatures.转换挖空()
        });

        this.addCommand({
            id: 'ying-zhong',
            name: '英转中文标点',
            callback: () => allFeatures.英转中文标点()
        });

        this.addCommand({
            id: 'zhong-ying',
            name: '中转英文标点',
            callback: () => allFeatures.中转英文标点()
        });

        this.addCommand({
            id: 'list-mermaid',
            name: '列表转为图示',
            callback: () => allFeatures.列表转为图示()
        });

        this.addCommand({
            id: 'file-path',
            name: '转换路径',
            callback: () => allFeatures.转换路径()
        });

        this.addCommand({
            id: 'jian-fan',
            name: '简体转繁',
            callback: () => allFeatures.简体转繁()
        });

        this.addCommand({
            id: 'fan-jian',
            name: '繁体转简',
            callback: () => allFeatures.繁体转简()
        });

        this.addCommand({
            id: 'add-kh1',
            name: '【选文】',
            callback: () => allFeatures.括选文本1()
        });

        this.addCommand({
            id: 'add-kh2',
            name: '（选文）',
            callback: () => allFeatures.括选文本2()
        });

        this.addCommand({
            id: 'add-kh3',
            name: '「选文」',
            callback: () => allFeatures.括选文本3()
        });

        this.addCommand({
            id: 'add-kh4',
            name: '《选文》',
            callback: () => allFeatures.括选文本4()
        });

        this.addCommand({
            id: 'paste-html',
            name: '获取富文本',
            callback: () => allFeatures.获取富文本(),
            hotkeys: [{ modifiers: ["Mod", "Shift", "Alt"], key: "V" }]
        });

        this.addCommand({
            id: 'paste-form',
            name: '智能粘贴',
            callback: () => allFeatures.智能粘贴(),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "V" }]
        });

        this.addCommand({
            id: 'edit-jiucuo',
            name: '修复错误语法',
            callback: () => allFeatures.修复错误语法()
        });

        this.addCommand({
            id: 'del-line2',
            name: '修复意外断行',
            callback: () => allFeatures.修复意外断行()
        });

        this.addCommand({
            id: 'search-text',
            name: '搜索当前文本',
            callback: () => allFeatures.搜索当前文本()
        });

        this.addCommand({
            id: 'delete-list',
            name: '删除当前段落',
            callback: () => allFeatures.删除当前段落()
        });

        this.addCommand({
            id: 'parent-biaozhu',
            name: '光标向上跳转',
            callback: () => allFeatures.光标跳转("上"),
            hotkeys: [{ modifiers: ["Alt", "Shift"], key: "J" }]
        });

        this.addCommand({
            id: 'next-biaozhu',
            name: '光标向下跳转',
            callback: () => allFeatures.光标跳转("下"),
            hotkeys: [{ modifiers: ["Alt", "Shift"], key: "L" }]
        });

        this.addCommand({
            id: 'Selection-text',
            name: '选择当前整段',
            callback: () => allFeatures.选择当前整段()
        });

        this.addCommand({
            id: 'Selection-juzi',
            name: '选择当前整句',
            callback: () => allFeatures.选择当前整句()
        });

        this.addCommand({
            id: 'Selection-markdown',
            name: '选择当前语法',
            callback: () => allFeatures.选择当前语法()
        });

        this.addCommand({
            id: 'tiqu-text',
            name: '获取标注文本',
            callback: () => allFeatures.获取标注文本()
        });

        this.addCommand({
            id: 'copy-filePath',
            name: '获取相对路径',
            callback: () => allFeatures.获取相对路径()
        });

        this.addCommand({
            id: 'modify-fileName',
            name: '指定当前文件名',
            callback: () => allFeatures.指定当前文件名()
        });

        this.addCommand({
            id: 'iframe-URL',
            name: '嵌入当前网址页面',
            callback: () => allFeatures.嵌入当前网址页面()
        });

        this.addCommand({
            id: 'zhe-lines',
            name: '折叠当前同级标题',
            callback: () => allFeatures.折叠当前同级标题(),
            hotkeys: [{ modifiers: ["Mod", "Shift", "Alt"], key: "D" }]
        });

        this.addCommand({
            id: 'add-lines',
            name: '批量插入空行',
            callback: () => allFeatures.批量插入空行(),
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "L" }]
        });

        this.addCommand({
            id: 'add-line1',
            name: '上方插入空行',
            callback: () => allFeatures.上方插入空行()
        });

        this.addCommand({
            id: 'add-line2',
            name: '下方插入空行',
            callback: () => allFeatures.下方插入空行()
        });

        this.addCommand({
            id: 'del-lines',
            name: '批量去除空行',
            callback: () => allFeatures.批量去除空行(),
            hotkeys: [{ modifiers: ["Mod", "Alt"], key: "l" }]
        });

        this.addCommand({
            id: 'add-twoSpace',
            name: '首行缩进两字符',
            callback: () => allFeatures.首行缩进两字符()
        });

        this.addCommand({
            id: 'add-space',
            name: '末尾追加空格',
            callback: () => allFeatures.末尾追加空格()
        });

        this.addCommand({
            id: 'del-space',
            name: '去除末尾空格',
            callback: () => allFeatures.去除末尾空格()
        });

        this.addCommand({
            id: 'add-allSpspace',
            name: '添加中英间隔',
            callback: () => allFeatures.添加中英间隔()
        });

        this.addCommand({
            id: 'del-allSpspace',
            name: '去除所有空格',
            callback: () => allFeatures.去除所有空格()
        });

        this.addSettingTab(new EditSettingsTab(this.app, this));
        this.loadSettings();

        // 编辑器变化事件
        this.registerEvent(this.app.workspace.on('editor-change', () => {
            allFeatures.handleEditorChange();
        }));

        // 鼠标事件
        this.registerDomEvent(document, 'mouseup', (evt: MouseEvent) => {
            allFeatures.handleMouseUp();
        });

        // 键盘事件
        this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
            allFeatures.handleKeyDown(evt);
        });
    }

    onunload() {
        console.log('卸载插件');
    }

    saveSettings() {
        const settings = this.settings.toJson();
        this.app.vault.adapter.write(this.SETTINGS_PATH, settings);
    }

    loadSettings() {
        this.app.vault.adapter.read(this.SETTINGS_PATH)
            .then((content) => this.settings.fromJson(content))
            .catch(() => { console.log("未发现增强插件配置文件"); });
    }
}
