"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const url_1 = __importDefault(require("./url"));
const axios_1 = __importDefault(require("axios"));
class Tree extends events_1.EventEmitter {
    constructor(url) {
        super();
        this.queue = [];
        this.paths = [];
        this.hosts = [];
        this.url = new url_1.default(url);
        this.url.digest();
        if (!this.url.isValid())
            this.throwError("Invalid url");
    }
    throwError(err) {
        this.emit("error", err);
    }
    ;
    tree() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let tree = [];
            this.queue.push(this.url.url);
            for (let i = 0; i < this.queue.length; i++) {
                let url = this.queue[i];
                let structure = new url_1.default(url).digest();
                let reqOption = {
                    url: url,
                    host: structure.host,
                    method: "GET",
                    path: (_a = structure.path) !== null && _a !== void 0 ? _a : "/",
                    headers: ""
                };
                let content = yield this.getContent(reqOption);
                // this.emit("done", url)
                let urls = this.extract(content);
                // urls.forEach(url => {
                //     console.log(url);
                // });
                //this.queue = this.check(urls);
            }
            return tree;
        });
    }
    getContent(reqOtion) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield axios_1.default.get(reqOtion.url).then((res) => {
                return res.data;
            });
            return body;
        });
    }
    extract(content) {
        content = content.replace(/\s/g, "");
        let urls = [];
        let pattern = ["src=", "href="];
        let use;
        let start;
        let url;
        while (true) {
            if (content.indexOf("src=") === -1 && content.indexOf("href=") === -1)
                break;
            let srcIndex = content.indexOf("src=");
            let hrefIndex = content.indexOf("href=");
            start = srcIndex < hrefIndex ? srcIndex : hrefIndex;
            use = srcIndex < hrefIndex ? 0 : 1;
            content = content.slice(content.indexOf(pattern[use]) + pattern[use].length + 1, content.length);
            let quoteIndex = (content.indexOf('"') < content.indexOf("'")) ? content.indexOf('"') : content.indexOf("'");
            url = content.substring(0, quoteIndex);
            content = content.slice(url.length, content.length);
            urls.push(url);
            console.log(url);
        }
        return urls;
    }
    check(urls) {
        return [];
    }
}
exports.default = Tree;
