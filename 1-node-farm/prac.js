const fs = require('fs');
const http = require('http');
const url = require('url');
////////////////////////////
// Files 


// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!')

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('ERROR!! 🤬')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//         console.log(data3)

//           fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', err => {
//             console.log('Your file has been written 😃')
//           })  

//         });
//     });
// });
// console.log('Will read file...')

///////////////////////////////////
//// Server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output.replace(/{%IMAGE%}/g, product.image);
    output.replace(/{%PRICE%}/g, product.price);
    output.replace(/{%FROM%}/g, product.from);
    output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output.replace(/{%QUANTITY%}/g, product.quantity);
    output.replace(/{%DESCRIPTION%}/g, product.description);
    output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);   

const server = http.createServer((req, res) => {
    const pathName = req.url;
    
    //OVERVIEW page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

    //PRODUCT page
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');

    //API
    } else if (pathName === '/api') {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);

    //NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});