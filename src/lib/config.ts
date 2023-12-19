type strUndf = string | undefined;

interface Config {
    url : strUndf
}

const prcss = process.argv;
let CONFIG : Config = getConfig()

function throwError( error : string ) {
    
    console.log(error)
    process.exit()

}

function getURL() : strUndf {
    
    let index : number = prcss.indexOf("-u");

    if(index != - 1) return prcss[index + 1];
    else{
        throwError("Error -u option");
    }

}

function getConfig() : Config {

    let conf : Config = {
        url : getURL()
    }

    return conf;

}

export { CONFIG, strUndf };