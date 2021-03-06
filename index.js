const fs = require('fs');
const http = require('http');
const url = require('url')
//lsof -Pi | grep LISTEN


const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8')
const laptopData = JSON.parse(json);


const server = http.createServer((req,res) => {
     const pathName = url.parse(req.url,true).pathname;
     const id = url.parse(req.url,true).query.id;
     

     if(pathName === "/products" || pathName === "/"){
            res.writeHead(200,{'Content-type':"text/html"})
            fs.readFile(`${__dirname}/tamplates/overview.html`,'utf-8',(error,data) => {
                let overviewOutput = data;
                fs.readFile(`${__dirname}/tamplates/card.html`,'utf-8',(error,data) => {
                   const cardOutput = laptopData.map(el => replaceTemplate(data,el)).join(" ");
                   overviewOutput = overviewOutput.replace('{%CARD%}',cardOutput)
                   res.end(overviewOutput);
                })
            })
     }
     else if (pathName === '/laptop' && id < laptopData.length) {
            res.writeHead(200,{'Content-type':"text/html"})
            
            fs.readFile(`${__dirname}/tamplates/laptop.html`,'utf-8',(error,data) => {
                const laptop = laptopData[id];
                const output = replaceTemplate(data, laptop);
                res.end(output);
            })
     }
     else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
    });
    }
    else if(pathName === "/api/home/"){
        //res.statusCode(200);
        const data = {
            status:true,
            message:"test",
            data:laptopData
        }
        res.writeHead(200,{'Content-type':"application/json"})
        res.end(JSON.stringify(data))

    }

     else {
        res.writeHead(400,{'Content-type':"text/html"})
        res.end("URl is not on server")
     }


    
})

server.listen(1200,'127.0.0.1',() => {
    console.log('listening serer')
})

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
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

