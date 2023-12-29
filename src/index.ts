import { CONFIG, strUndf, throwError } from "./lib/config.js";
import Tree , {PathParams, HostPathSchema} from "./lib/tree.js";

let URL : string = <string> CONFIG.url;
let tree : Tree = new Tree(URL)

tree.on("error", (err : string) => throwError(err));
// tree.on("done", (url : string) => {console.log(url)});

tree.tree().then((schema : HostPathSchema) => {
    console.log(schema)
});