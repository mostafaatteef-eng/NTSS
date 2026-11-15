/* SQL.js uses SQLite WASM in an isolated Web Worker; each run uses fresh sample data. */
let SQL;
self.onmessage=async ({data})=>{
 let db;try{
  if(!SQL){importScripts("https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js");SQL=await initSqlJs({locateFile:f=>"https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/"+f})}
  db=new SQL.Database();
  db.run("CREATE TABLE students(id INTEGER,name TEXT,grade INTEGER,city TEXT); INSERT INTO students VALUES (1,'Mona',91,'Cairo'),(2,'Omar',75,'Giza'),(3,'Salma',88,'Cairo'),(4,'Ali',64,'Alexandria'),(5,'Nour',95,'Giza'); CREATE TABLE projects(id INTEGER,student_id INTEGER,topic TEXT); INSERT INTO projects VALUES (1,1,'Python'),(2,3,'SQL'),(3,5,'AI');");
  const results=db.exec(String(data.code).slice(0,10000));
  self.postMessage({ok:true,results:results.slice(0,12).map(x=>({columns:x.columns,values:x.values.slice(0,100)})),output:results.length?"": "Query executed successfully (no result rows)."});
 }catch(e){self.postMessage({ok:false,output:String(e).slice(0,1000)})}finally{if(db)db.close()}
};