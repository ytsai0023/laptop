const fs = require('fs')
const http = require('http') 
const url = require('url')

const json = fs.readFileSync(`${__dirname}/data/data.json`,`utf-8`)
const laptopData = JSON.parse(json)


// //Create Server
const server = http.createServer((req,res)=>{
    //console.log( url.parse(req.url,true))
    const pathName = url.parse(req.url,true).pathname //url => object
    const id = url.parse(req.url,true).query.id

    if(pathName === '/products' || pathName ==='/'){
        res.writeHead(202,{'Content-type':'text/html'})
        fs.readFile(`${__dirname}/templates/template-overview.html`,`utf-8`,(err,data)=>{
            let overviewOutput = data
            fs.readFile(`${__dirname}/templates/template-card.html`,`utf-8`,(err,data)=>{
                const cardOutput = laptopData.map(el => replaceTemplate(data,el)).join('')
                overviewOutput = overviewOutput.replace(/{%CARDS%}/g,cardOutput)
                res.end(overviewOutput)
            })

        })
    }else if(pathName === '/laptop' && id < laptopData.length){
        res.writeHead(202,{'Content-type':'text/html'})
        //res.end(`This is the Laptop page for laptop ${id}'`) 

        //syns => block entire thread
        //always use async 
        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8',(err,data)=>{
            const laptop = laptopData[id]
            //console.log(laptop)
            let output = replaceTemplate(data,laptop)
            res.end(output)
        })
    }
    //IMAGAES
    else if((/\.(jpg|jpeg|png)$/i).test(pathName))
    {
        fs.readFile(`${__dirname}/data/img${pathName}`,(err,data)=>{
            res.writeHead(200,{'Content-type':'image/jpg'})
            res.end(data)
        })
    }
    else{
        res.writeHead(404,{'Content-type':'text/html'})
        res.end('URL was not ground on the server')
    }


    function replaceTemplate(originalHTML,laptop){
        let output = originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName)
        output = output.replace(/{%PRICE%}/g,laptop.price)
        output = output.replace(/{%SCREEN%}/g,laptop.screen)
        output = output.replace(/{%IMAGE%}/g,laptop.image)
        output = output.replace(/{%CPU%}/g,laptop.cpu)
        output = output.replace(/{%RAM%}/g,laptop.ram)
        output = output.replace(/{%STORAGE%}/g,laptop.storage)
        output = output.replace(/{%DESCRIPTION%}/g,laptop.description)
        output = output.replace(/{%ID%}/g,laptop.id)
        return output        
     }

})
//Server keep listening the port
server.listen(1337,'127.0.0.1',()=>{

    console.log('Listening for requests now')
}) 


