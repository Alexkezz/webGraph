import {EventEmitter} from "events";
import Url, { urlStruct } from "./url";

interface reqOptions {
    host : string;
    port : number | undefined;
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
    }

    public async tree() : Promise<string[]> {

        let tree : string[] = [];

        return tree;
    }





}