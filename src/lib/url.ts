type undefinedStr = string | undefined;

export interface urlStruct {
    host : undefinedStr;
    path : undefinedStr;
}

export default class Url {

    url : string;

    public digested : urlStruct = {
        host : undefined,
        path : undefined,
    }

    constructor(url : string){
        this.url = url;
    }

    public digest() : urlStruct {

        this.digested.host = this.getHost();
        this.digested.path = this.getPath();

        return this.digested;
    }

    public isValid() : boolean {
        return (this.digested.host) ? true : false;
    }

    public isValidHost(host : string) : boolean {
        
        let separatedHost : string = host.split('.').join('');
        
        if(isNaN(parseFloat(separatedHost))){
            
            let pattern : RegExp = /^[a-zA-Z0-9]+$/

            if(pattern.test(separatedHost)) return true;
        }
        
        return false;
    }

    public getHost(url : string = this.url) : undefinedStr {

        let start : number = 0;
        let host : string = "";

        if(url.indexOf("https") !== -1) start = "https://".length;
        else if(url.indexOf("http") !== -1) start = "http://".length;

        let fullURL = url.substring(start, url.length);

        if(fullURL[0] !== "/") host = fullURL.split("/")[0];
        
        if(host.indexOf(":") !== -1) host = host.slice(0, host.indexOf(":"));

        return (this.isValidHost(host)) ? host : undefined;
    }

    public getPath(url : string = this.url) : undefinedStr {
        
        let path : undefinedStr;

        if(url[0] === "/") path = url;
        else{

            let host : undefinedStr = this.getHost(url);
            if(host) path = url.split(host)[1];

        }

        return path;

    }

    public compareHost(url : string) {

        let host = this.getHost(url);
        return (this.digested.host === host) ? true : false;

    }
}