import {EventEmitter} from "events";
import Url, { urlStruct } from "./url";
import axios from "axios";

interface reqOptions {
    baseURL : string;
    host : string;
    method : string
    path : string | undefined
}


export default class Tree extends EventEmitter {

    url : Url;
    queue : string[] = [];
    done : string [] = [];
    urls : string[] = [];

    constructor(url : string){
        super();
        this.url = new Url(url);
        this.url.digest();
        
        if(!this.url.isValid()) this.throwError("Invalid url")
    }

    private throwError(err : string) : void {

        this.emit("error", err);

    };

    public async tree() : Promise<string[]> {

        let tree : string[] = [];
        this.queue.push(this.url.url);

        for(let i = 0; i < this.queue.length; i++){

            let url : urlStruct = new Url(this.queue[i]).digest();
            let reqOption : reqOptions = {
                baseURL : <string> url.baseURL,
                host : <string> url.host,
                method : "GET",
                path : <string> url.path ?? "/"
            }

            let content = await this.getContent(reqOption)
            let extracted = this.extract(content);
        }

        return tree;
    }


    public async getContent(reqOtion : reqOptions) : Promise<string> {
        
        const body = await axios.get(reqOtion.baseURL).then( (res) => {
            return res.data;
        })

        return body;

    }

    public extract(content : string) : string[]{

        let extracted : string[] = [];

        return extracted;

    }

    





}