import {EventEmitter} from "events";
import Url, { urlStruct } from "./url";
import axios from "axios";

interface reqOptions {
    url : string;
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

            let url : string = this.queue[i];
            let structure : urlStruct = new Url(this.queue[i]).digest();
            
            let reqOption : reqOptions = {
                url :  url,
                host : <string> structure.host,
                method : "GET",
                path : <string> structure.path ?? "/"
            }

            let content : string = await this.getContent(reqOption)

            this.emit("done", url)
            let urls : string[] = this.extract(content);
        }

        return tree;
    }


    public async getContent(reqOtion : reqOptions) : Promise<string> {
        
        const body = await axios.get(reqOtion.url).then( (res) => {
            return res.data;
        })

        return body;

    }

    public extract(content : string) : string[]{

        content = content.replace(/\s/g, "");
        let urls : string[] = [];
        let pattern : string[] = ["src", "href"]
        let use : number;
        let start : number;
        let url : string;

        for(let i = 0; i < content.length; i++){

            if(content.indexOf("src") === -1 && content.indexOf("href") === -1) break;

            if(content.indexOf("src") < content.indexOf("href")){
                start = content.indexOf("src");
                use = 0;
            }else{
                start = content.indexOf("href");
                use = 1;
            }

            content = content.slice(content.indexOf(pattern[use]) + pattern[use].length + 2, content.length);
            
            url = content.substring(0, content.indexOf('"'));

            content = content.slice(url.length, content.length);

            urls.push(url);
        }

        return urls;

    }

    public check(urls : string[]){

    }

    





}