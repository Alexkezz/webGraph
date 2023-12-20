export interface urlStruct {
    baseURL : string | undefined;
    host : string | undefined;
    path : string | undefined;
    protocol : number | undefined
}

export default class Url {

    public url : string;
    public digested : urlStruct = {
        baseURL : undefined,
        host : undefined,
        path : undefined,
        protocol : undefined
    }

    constructor(url : string){
        this.url = url;
    }

    public digest() : urlStruct {
        return this.digested;
    }

    public isValid() : boolean {
        return false;
    }

    public getHost() {

    }

    public getPath() {

    }

    public getProtocol() {

    }
}