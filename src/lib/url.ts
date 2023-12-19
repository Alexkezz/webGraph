export interface urlStruct {
    host : string | undefined;
    port : number | undefined;
    path : string | undefined;
    protocol : number | undefined
}

export default class Url {

    public url : string;
    public digested : urlStruct = {
        host : undefined,
        port : undefined,
        path : undefined,
        protocol : undefined
    }

    constructor(url : string){
        this.url = url;
    }




}