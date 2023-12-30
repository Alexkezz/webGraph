"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Url {
    constructor(url) {
        this.digested = {
            host: undefined,
            path: undefined,
        };
        this.url = url;
    }
    digest() {
        this.digested.host = this.getHost();
        this.digested.path = this.getPath();
        return this.digested;
    }
    isValid() {
        return (this.digested.host) ? true : false;
    }
    isValidHost(host) {
        let separatedHost = host.split('.').join('');
        if (isNaN(parseFloat(separatedHost))) {
            let pattern = /^[a-zA-Z0-9-]+$/;
            if (pattern.test(separatedHost))
                return true;
        }
        return false;
    }
    getHost(url = this.url) {
        let start = 0;
        let host = "";
        if (url.indexOf("https") !== -1)
            start = "https://".length;
        else if (url.indexOf("http") !== -1)
            start = "http://".length;
        let fullURL = url.substring(start, url.length);
        if (fullURL[0] !== "/")
            host = fullURL.split("/")[0];
        if (host.indexOf(":") !== -1)
            host = host.slice(0, host.indexOf(":"));
        return (this.isValidHost(host)) ? host : undefined;
    }
    getPath(url = this.url) {
        let path;
        if (url[0] === "/") {
            path = url;
            this.digested.host = "/";
        }
        else {
            let host = this.getHost(url);
            if (host)
                path = url.split(host)[1];
        }
        return path;
    }
    compareHost(host) {
        return (this.digested.host === host);
    }
}
exports.default = Url;
