/* HTTPS static fixture for Playwright. Local test certificate is temporary and never deployed. */
import {createServer} from "node:https";
import {createReadStream,readFileSync,existsSync,statSync} from "node:fs";
import path from "node:path";
const root=process.cwd();
const key=readFileSync(process.env.NTSS_TEST_TLS_KEY||"/tmp/ntss-test-key.pem");
const cert=readFileSync(process.env.NTSS_TEST_TLS_CERT||"/tmp/ntss-test-cert.pem");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".webp":"image/webp"};
createServer({key,cert},(req,res)=>{
 const name=new URL(req.url,"https://127.0.0.1").pathname;
 const file=path.resolve(root,"."+(name==="/"?"/index.html":name));
 if(!file.startsWith(root+path.sep)||!existsSync(file)||!statSync(file).isFile()){
  res.writeHead(404);res.end("Not found");return;
 }
 res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
 createReadStream(file).pipe(res);
}).listen(Number(process.env.NTSS_TEST_PORT||8765),"127.0.0.1",()=>console.log("EBDA HTTPS fixture ready"));
