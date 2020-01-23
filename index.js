const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopjson = JSON.parse(json)

const server = http.createServer((req,res) => {

    const pathName = url.parse(req.url, true).pathname;    
    const id = url.parse(req.url, true).query.id;    
    
    console.log(pathName , id)

    if( pathName === '/products' ||  pathName === '/'){
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err,data) =>{
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8',(err ,data) =>{
                let cardOutput = laptopjson.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARD%', cardOutput);
                res.end(overviewOutput);
            })      
        });
    }
    
    else if ( pathName === '/laptop' && id<laptopjson.length ) {
        res.writeHead(200, {'Content-type': 'text/html'}); 
        // res.end('this is laptop page');
        
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err,data) =>{
            const laptop =  laptopjson[id];
            const output = replaceTemplate(data, laptop)
            res.end(output);
        });
    }

    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img/${pathName}`,(err, data) =>{
            res.writeHead(200, {'Content-type':'image/jpg'});
            res.end(data)
        })
    }

    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('This is Error Page');
    }

})

server.listen(1337, 'localhost', () =>{
    console.log('server listening to request');
})
 
function replaceTemplate(originalHTML,laptop){
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    
    return output;
}