import { App, PluginSettingTab, Setting } from 'obsidian';
import { Settings } from './settings';
import type { IMyPlugin } from './types';

/**
 * 插件设置面板
 */
export class EditSettingsTab extends PluginSettingTab {
    plugin: IMyPlugin;
    settings: Settings;

    constructor(app: App, plugin: IMyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }

    display(): void {
        const containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: '增强编辑 0.5.0' });

        new Setting(containerEl)
            .setName('📣 转换内部链接「Alt+Z」 在选文两端添加或去除 [[ ]] 符号')
            .setDesc('支持批量转换用换行符分隔的多行文本或顿号分隔的多句文本。');

        const div0 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const linkText = document.createDocumentFragment();
        linkText.appendText('转换同义链接「Alt+Q」：将选文转换为 [[|选文]] 样式后再选择文档');
        linkText.appendChild(document.createElement('br'));
        div0.appendChild(linkText);

        new Setting(containerEl)
            .setName('📣 智能换行「Enter」 默认支持```代码块```内换行缩进效果')
            .setDesc('启用此项后，在非列表或代码块的文本中按下回车后补加一次换行；如想普通换行，可按下 Shift+Enter 键。')
            .addToggle(toggle => toggle.setValue(this.settings.twoEnter)
                .onChange((value) => {
                    this.settings.twoEnter = value;
                    this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('📣 键控游标「Alt+I +J +K +L」 使用主键盘控制编辑区内的游标位置')
            .setDesc('按下Alt+ I上 J左 K下 L右 U首 O尾 快捷键，控制游标移动位置。');

        new Setting(containerEl)
            .setName('📣 键控游标跳转「Alt+Shift+J +L」 控制游标在同类文本行或选区间跳转')
            .setDesc('控制游标在标题、列表项、待办项、代码块、引用等文本行或加粗、高亮、注释、删除、链接等MarkDown语法间前后跳转');

        new Setting(containerEl)
            .setName('📣 键控切换文件列表「Alt+Shift+I +K」 使用键盘控制切换文件列表中的文件显示')
            .setDesc('按下Alt+Shift+ I上 K下 快捷键，控制打开同文件夹内其它文件。');

        new Setting(containerEl)
            .setName('📣 智能语法「Alt+;」 自动转换、匹配或跳过各种类型的括号或代码块语法')
            .setDesc('可将[( (<  ([ "[ \'[等组合转为〖〈〔『「，或将dv、qy、mm、CSS、js、ja、ty等字符串转为代码块语法。');

        new Setting(containerEl)
            .setName('📣 智能粘贴「Ctrl+Alt+V」∶将复制的内容粘贴为Md语法样式')
            .setDesc('依据复制内容的类型，将表格、网址、本地路径或代码直接粘贴为MD表格、超链接或代码块格式。');

        new Setting(containerEl)
            .setName('📣 设置标题及粗、斜、删、亮等效果（MarkDown语法）功能。')
            .setDesc('启用后，当未选文本时按下Alt+C +G +S +U +N 等快捷键，即会开启或关闭 相应的MD语法「格式刷」功能。');

        const div1 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const mdText = document.createDocumentFragment();
        mdText.appendText('转换标题语法「Ctrl+1-6」∶指定或取消当前行文本为N级标题');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换粗体语法「Alt+C」∶将选文转为或去除 **粗体** 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换斜体语法「Alt+X」∶将选文转为或去除 *斜体* 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换行内代码「Alt+D」∶将选文转为或去除 `行内代码` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换删除线「Alt+S」∶将选文转为或去除 ~~删除线~~ 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换下划线「Alt+H」∶将选文转为或去除 <u>下划线</u> 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换代码块「未设置」∶将选文转为或去除 ```代码块``` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换无语法文本「Ctrl+Alt+Z」∶鼠标点击或划选文本的语法部分，可去除相应的MarkDown语法字符');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转为超链接语法「未设置」∶将选文转为[]()样式的MarkDown超链接语法');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('获取无语法文本「Ctrl+Alt+C」∶去除选文中的所有MarkDown语法字符，并写入剪贴板');
        mdText.appendChild(document.createElement('br'));
        div1.appendChild(mdText);

        new Setting(containerEl)
            .setName('📣 设置设置彩色文字及背景、上下标等效果（Html语法）功能。');

        const div2 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const htmlText = document.createDocumentFragment();
        htmlText.appendText('转换文字颜色「Ctrl+Shift+1-7」∶将选文转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换背景颜色「Ctrl+Alt+1-7」∶将选文背景转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换上标语法「未设置」∶将选文转为或去除 <sup>上标</sup> 效果');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换下标语法「未设置」∶将选文转为或去除 <sub>下标</sub> 效果');
        htmlText.appendChild(document.createElement('br'));
        div2.appendChild(htmlText);

        new Setting(containerEl)
            .setName('📣 设置字符、标点、状态等转换功能。');

        const div3 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const charText = document.createDocumentFragment();
        charText.appendText('英转中文标点「未设置」∶将笔记中的英文标点转换为中文标点，如,.?!"等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('中转英文标点「未设置」∶将笔记中的中文标点转换为英文标点，如，。？！"等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换路径语法「未设置」∶将 c:\\windows 与 [](file:///c:/windows) 路径语法相互转换');
        charText.appendChild(document.createElement('br'));
        charText.appendText('简体转为繁体「未设置」：将笔记中的简体汉字转换为繁体汉字');
        charText.appendChild(document.createElement('br'));
        charText.appendText('繁体转为简体「未设置」：将笔记中的繁体汉字转换为简体汉字');
        charText.appendChild(document.createElement('br'));
        charText.appendText('列表转为图示「未设置」：选中列表文本，转换为相应层级的MerMaid语法图示，支持修改列表后更新图示。');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换待办状态「未设置」：转换选文行首的待办状态，顺序为 -[ x-!?><+] 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换挖空「未设置」：将选文转为或去除 {{c1::选文}} 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('【选文】「未设置」：在选文两端添加或去除 【】符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('（选文）「未设置」：在选文两端添加或去除 （）符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('「选文」「未设置」：在选文两端添加或去除 「」符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('《选文》「未设置」：在选文两端添加或去除 《》符号');
        div3.appendChild(charText);

        new Setting(containerEl)
            .setName('📣 设置修复语法、选择段句、嵌入网页等功能。');

        const div4 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const toolText = document.createDocumentFragment();
        toolText.appendText('修复错误语法「未设置」∶修复错误的MD语法，如1。列表、【】（）链接、[[]]()回链等');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('修复意外断行「未设置」∶修复笔记中的意外断行（删除结尾不是句式标点的换行符）');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('搜索当前文本「未设置」：通过搜索面板在当前文档中搜索划选内容。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整段「未设置」：选择光标所在的当前整段文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整句「未设置」：选择光标所在的当前整句（中文）文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前语法「未设置」：选择光标所在的当前MrakDown语法（如加粗、高亮、删除、链接等效果）文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取标注文本「未设置」∶获取标题、高亮、注释及前缀(#标注\\批注\\反思)等文本内容');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('自动设置标题「未设置」∶将选文中的单行文本（末尾非标点或数字）转为标题');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('指定当前文件名「未设置」：划选文字后指定为当前笔记的文件名。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('嵌入当前网址页面「未设置」∶在行末插入iframe代码来嵌入所选网址页面');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取相对路径「未设置」：获取当前笔记在库目录内的相对路径。');
        toolText.appendChild(document.createElement('br'));
        div4.appendChild(toolText);

        new Setting(containerEl)
            .setName('📣 设置折叠标题、增减空行或空格等功能。');

        const div5 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const lineText = document.createDocumentFragment();
        lineText.appendText('折叠当前同级标题「Ctrl+Shift+Alt+D」∶判断当前行的标题层级，将正文中同级标题一次性折叠起来。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('删除当前段落「Ctrl+D」∶去除当前段落文本;若在[[]]内会先删除链接内容;当遇有序列表项时会正常调小后面序号。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量插入空行「Ctrl+Shift+L」∶在划选的文本行或全文中间批量插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量去除空行「Ctrl+Alt+L」∶批量去除划选文本或全文中的空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('上方插入空行「未设置」∶在当前文本行的上行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('下方插入空行「未设置」∶在当前文本行的下行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('末尾追加空格「未设置」∶在每行文本的末尾追加两个空格');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除末尾空格「未设置」∶批量去除每个文本行末尾的空格字符');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('添加中英间隔「未设置」：在正文的汉字与字母之间批量添加空格，如 china 中国。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除所有空格「未设置」：去除正文中所有的全、半角空格');
        lineText.appendChild(document.createElement('br'));
        div5.appendChild(lineText);

        const div6 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        const qqText = document.createDocumentFragment();
        qqText.appendText('🆗 欢迎向蚕子(QQ:312815311) 提出操作需求和建议，我们来共同增强Obsidian软件的编辑功能！');
        div6.appendChild(qqText);
    }
}
