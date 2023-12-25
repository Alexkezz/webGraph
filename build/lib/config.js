"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.throwError = void 0;
const prcss = process.argv;
let CONFIG = getConfig();
exports.CONFIG = CONFIG;
function throwError(error) {
    console.log(error);
    process.exit();
}
exports.throwError = throwError;
function getURL() {
    let index = prcss.indexOf("-u");
    if (index != -1)
        return prcss[index + 1];
    else {
        throwError("Error -u option");
    }
}
function getConfig() {
    let conf = {
        url: getURL()
    };
    return conf;
}
