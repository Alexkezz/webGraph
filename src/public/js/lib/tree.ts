import {EventEmitter} from "events";
import Url, { urlStruct } from "./url";
import axios from "axios";

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

interface ReqOptions {
    url : string;
    host : string;
    method : string;
    path : string | undefined;
    headers : string | undefined;
}

export interface PathParams {
    path : string;
    host : string;
}

export interface HostPathSchema {
    paths : PathParams[];
    hosts : string[];
}

export default class Tree extends EventEmitter {

    url : Url;
    queue : string[] = [];
    paths : PathParams[] = []
    hosts: string[] = [];

    constructor(url : string){
        super();
        
        this.url = new Url(url);
        this.url.digest();

        if(!this.url.isValid()) this.throwError("Invalid url")
    }

    private throwError(err : string) : void {

        this.emit("error", err);

    };

    public async tree() : Promise<HostPathSchema> {

        this.queue.push(this.url.url);

        for(let i = 0; i < this.queue.length; i++){

            let url : string = this.queue[i];
            let structure : urlStruct = new Url(url).digest();
            
            let reqOption : ReqOptions = {
                url :  url,
                host : <string> structure.host,
                method : "GET",
                path : <string> structure.path ?? "/",
                headers : ""
            }

            let content : string = await this.getContent(reqOption)
            
            this.emit("done", url);

            let urls : string[] = this.extract(content);
            this.check(urls);
        }

        let hostPathSchema : HostPathSchema = {
            paths : this.paths,
            hosts : this.hosts,
        }

        return hostPathSchema;
    }


    public async getContent(reqOtion : ReqOptions) : Promise<string> {
        
        const body = await axios.get(reqOtion.url).then( (res) => {
            return res.data;
        }).catch(() => {
            return "";
        })

        return body;

    }

    public extract(content : string) : string[]{

        content = content.replace(/\s/g, "");
        
        let urls : string[] = [];
        let pattern : string[] = ["src=", "href="]

        while(content.indexOf("src=") !== -1 && content.indexOf("href=") !== -1){

            let srcIndex = content.indexOf(pattern[0]) + pattern[0].length;
            let hrefIndex = content.indexOf(pattern[1]) + pattern[1].length;
            let start : number = srcIndex < hrefIndex ? srcIndex : hrefIndex;
            let url : string = "";
            
            if(content[start] === "'" || content[start] === '"'){
                
                content = content.slice(start + 1, content.length);

                let quoteIndex = (content.indexOf('"') < content.indexOf("'")) ? content.indexOf('"') : content.indexOf("'")
                url = content.substring(0, quoteIndex);
                
                content = content.slice(url.length + 1, content.length);
    
                urls.push(url);

            }else{
                content = content.slice(start, content.length);
            }

        }
        
        return urls;

    }

    public check(urls : string[]) : void {

        for(let url of urls){

            let urlDigest : urlStruct = new Url(url).digest();
            let host : string | undefined = urlDigest.host;
            let path : string | undefined = urlDigest.path;
            
            let sameHost = this.url.compareHost(host);

            if((sameHost || host === "/") && this.queue.indexOf(url) === -1) {
                
                this.queue.push(url);
                this.savePath(path ?? "/", <string> this.url.digested.host)
            
            } 
            else if(!sameHost){

                if(host && host !== "/"){

                    if(host.indexOf(this.url.digested.host!) !== -1 && this.queue.indexOf(url) === -1){
                        
                        this.queue.push(url);
                        this.savePath(path ?? "/", <string> this.url.digested.host)
                    
                    }
                    else if(this.hosts.indexOf(host) === -1){

                        this.hosts.push(host);
                        this.savePath(path ?? "/", host)

                    } 

                }
                else if(host === "/"){
                    this.savePath(path ?? "/", <string> this.url.digested.host)
                }
                
            }
            
        }    

    }

    public savePath(path: string, host : string) : void {

        this.paths.push({
            path : path,
            host : host,
        });

    }

}