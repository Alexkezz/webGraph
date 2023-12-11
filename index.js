const url = 'https://pbsapparel.com/';
const jsdom = require("jsdom");


async function getLinks(url) {

    let body = await fetch(url).then((res) => {
        return res.text();
    });

    const dom = new jsdom.JSDOM(body);

    let links = [];

    const paths = ['a', 'link'];

    paths.forEach((path) => {
        dom.window.document.querySelectorAll(path).forEach((el) => {
            links.push(el.href);
        });
    });ç


    console.log(links)
    return links;

}

getLinks(url)


