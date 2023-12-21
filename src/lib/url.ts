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
        return false;
    }

    public isValidHost() : boolean {
        return false;
    }

    public getHost(url : string = this.url) : undefinedStr {

        let start : number = 0;
        let host : string = "";

        if(url.indexOf("https")) start = "https://".length;
        else if(url.indexOf("http")) start = "http://".length;

        let fullURL = url.substring(start, url.length);

        if(fullURL[0] !== "/") host = fullURL.split("/")[0];
        
        if(host.indexOf(":")) host = host.slice(0, host.indexOf(":"));

        return ""
    }

    public getPath(url : string = this.url) : undefinedStr {
        return ""
    }
}