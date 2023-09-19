const fs = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');
const slugify = require('slugify');
/////////////////////////////////////
// files
//blocking ,synchronous way
// const text = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);
// const textout = `this is what we know about the avocado ${text}\n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textout);
// console.log("file written");
// non-blocking , asynchronous way
// fs.readFile("./txt/startss.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your data has been written😊 ");
//       });
//     });
//   });
// });
// console.log("will read file!");
/////////////////////////////
//server
// const replaceTemp = (temp, product) => {
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = temp.replace(/{%%}/g, product.);
//   output = temp.replace(/{%%}/g, product.);
//   output = temp.replace(/{%%}/g, product.);
//   output = temp.replace(/{%%}/g, product.);
//   output = temp.replace(/{%%}/g, product.);
// };
const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf-8'
);

const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/product.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataobj = JSON.parse(data);
const slugs = dataobj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const replaceTemplate = require('./modules/replaceTemplate');
const server = http.createServer((req, res) => {
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);

  const cardHtml = dataobj.map((el) => replaceTemplate(tempCard, el)).join('');
  if (pathname == '/' || pathname == '/overview') {
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);
  } else if (pathname == '/product') {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    const product = dataobj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname == '/api') {
    console.log(tempCard);
  } else {
    console.log(pathname);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`<h1>this page not found</h1>`);
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listening to request on port 8000');
});
