interface layout {
    name : string,
    children : layout[] | undefined;
}

export default class Scheme {

    layout : layout;

    constructor(host : string) {

        this.layout = {
            name : host,
            children : undefined
        }

    }

    

}
