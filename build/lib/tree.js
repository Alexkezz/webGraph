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
            this.queue.push(this.url.url);
            for (let i = 0; i < this.queue.length; i++) {
                let url = this.queue[i];
                // console.log(this.queue);
                let structure = new url_1.default(url).digest();
                let reqOption = {
                    url: url,
                    host: structure.host,
                    method: "GET",
                    path: (_a = structure.path) !== null && _a !== void 0 ? _a : "/",
                    headers: ""
                };
                //console.log("Extreient info url:" + reqOption.url);
                let content = yield this.getContent(reqOption);
                let urls = this.extract(content);
                this.check(urls);
            }
            let hostPathSchema = {
                paths: this.paths,
                hosts: this.hosts,
            };
            return hostPathSchema;
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
        while (content.indexOf("src=") !== -1 && content.indexOf("href=") !== -1) {
            let srcIndex = content.indexOf(pattern[0]) + pattern[0].length;
            let hrefIndex = content.indexOf(pattern[1]) + pattern[1].length;
            let start = srcIndex < hrefIndex ? srcIndex : hrefIndex;
            let url = "";
            if (content[start] === "'" || content[start] === '"') {
                content = content.slice(start + 1, content.length);
                let quoteIndex = (content.indexOf('"') < content.indexOf("'")) ? content.indexOf('"') : content.indexOf("'");
                url = content.substring(0, quoteIndex);
                content = content.slice(url.length + 1, content.length);
                urls.push(url);
            }
            else {
                content = content.slice(start, content.length);
            }
        }
        return urls;
    }
    check(urls) {
        for (let url of urls) {
            console.log(url);
            let urlDigest = new url_1.default(url).digest();
            let host = urlDigest.host;
            let path = urlDigest.path;
            console.log(host);
            let sameHost = this.url.compareHost(host);
            if (sameHost && this.queue.indexOf(url) !== -1) {
                this.queue.push(url);
                this.savePath(path !== null && path !== void 0 ? path : "/", this.url.digested.host);
            }
            else if (!sameHost) {
                if (host) {
                    if (host.indexOf(this.url.digested.host) !== -1 && this.queue.indexOf(url) !== -1) {
                        this.queue.push(url);
                        this.savePath(path !== null && path !== void 0 ? path : "/", this.url.digested.host);
                    }
                    else if (this.hosts.indexOf(host) !== -1) {
                        this.hosts.push(url);
                        this.savePath(path !== null && path !== void 0 ? path : "/", host);
                    }
                }
            }
        }
    }
    savePath(path, host) {
        this.paths.push({
            path: path,
            host: host,
        });
    }
    extendQueue(path = "", host = "") {
    }
}
exports.default = Tree;
