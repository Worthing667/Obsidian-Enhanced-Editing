// 测试批量插入空行的逻辑

const testContent = `# 标题

这是普通段落
这是第二行

## 代码块测试

\`\`\`javascript
const a = 1;
const b = 2;
\`\`\`

## 表格测试

| 列1 | 列2 |
|-----|-----|
| a   | b   |
| c   | d   |

## 引用测试

> 这是引用
> 这是第二行引用

## 列表测试

- 列表项1
- 列表项2
`;

function 是特殊行(行内容) {
    const 去除空格的行 = 行内容.trim();
    if (去除空格的行.startsWith('|') || 去除空格的行.endsWith('|')) {
        return true;
    }
    if (/^\|?[\s\-:]+\|/.test(去除空格的行)) {
        return true;
    }
    if (/^\s*>/.test(行内容)) {
        return true;
    }
    return false;
}

function 是代码块边界(行内容) {
    return /^\s*```/.test(行内容);
}

function 是列表行(行内容) {
    return /^\s*(\-|\+|\*|\d+\.)\s/.test(行内容);
}

function 是空行(行内容) {
    return /^\s*$/.test(行内容);
}

function 批量插入空行(笔记正文) {
    const 行列表 = 笔记正文.split(/\r?\n/);
    const 结果行 = [];
    let 在代码块内 = false;
    
    for (let i = 0; i < 行列表.length; i++) {
        const 当前行 = 行列表[i];
        const 上一行 = i > 0 ? 行列表[i - 1] : '';
        
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
            结果行.push('');
        }
        
        结果行.push(当前行);
    }
    
    return 结果行.join('\n');
}

const result = 批量插入空行(testContent);
console.log("=== 处理后的内容 ===");
console.log(result);
console.log("\n=== 原始行数:", testContent.split('\n').length);
console.log("=== 处理后行数:", result.split('\n').length);
