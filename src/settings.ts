/**
 * 插件设置类
 */
export class Settings {
    twoEnter: boolean;

    fileName: string;
    filePath: string;

    constructor() {
        this.twoEnter = false;
        this.fileName = "";
        this.filePath = "";
    }

    toJson(): string {
        return JSON.stringify(this);
    }

    fromJson(content: string): void {
        const obj = JSON.parse(content);
        this.twoEnter = obj['twoEnter'];
        if (obj['fileName']) this.fileName = obj['fileName'];
        if (obj['filePath']) this.filePath = obj['filePath'];
    }
}
