/* NTSS SQL laboratory: in-memory demo data only; read-only single SELECT.
   SQL text is untrusted. The worker and parent impose independent limits.
   This is an educational guard, not a security boundary for arbitrary native SQL engines. */
let SQL;
const BASE="https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/";
const MAX_SQL=2000;
function safeQuery(input){
  if(typeof input!=="string"||input.length>MAX_SQL)throw Error("SQL must contain at most 2,000 characters.");
  const q=input.trim();
  if(!/^SELECT\b/i.test(q))throw Error("Only SELECT queries are allowed in this training lab.");
  // Reject multiple statements and SQL comments. SQL grammar is broader than this intentionally limited lab.
  const cleaned=q.endsWith(";")?q.slice(0,-1):q;
  if(/[;]|--|\/\*|\*\//.test(cleaned))throw Error("Multiple statements and SQL comments are disabled.");
  if(/\b(?:ATTACH|DETACH|PRAGMA|VACUUM|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|REINDEX|ANALYZE|EXPLAIN|LOAD_EXTENSION)\b/i.test(cleaned))throw Error("This lab accepts SELECT queries only.");
  if(!cleaned||cleaned.length<7)throw Error("Enter a SELECT query.");
  return cleaned;
}
self.onmessage=async ({data})=>{
  let db;
  try{
    const code=safeQuery(data?.code);
    if(!SQL){
      importScripts(BASE+"sql-wasm.js");
      SQL=await initSqlJs({locateFile:f=>BASE+f});
    }
    db=new SQL.Database();
    db.run("CREATE TABLE students(id INTEGER,name TEXT,grade INTEGER,city TEXT); INSERT INTO students VALUES (1,'Mona',91,'Cairo'),(2,'Omar',75,'Giza'),(3,'Salma',88,'Cairo'),(4,'Ali',64,'Alexandria'),(5,'Nour',95,'Giza'); CREATE TABLE projects(id INTEGER,student_id INTEGER,topic TEXT); INSERT INTO projects VALUES (1,1,'Python'),(2,3,'SQL'),(3,5,'AI');");
    db.run("PRAGMA query_only=ON");
    const results=db.exec(code);
    if(data?.assessment===true){
      let other;
      try{
        other=new SQL.Database();
        other.run("CREATE TABLE students(id INTEGER,name TEXT,grade INTEGER,city TEXT); INSERT INTO students VALUES (1,'Mona',76,'Cairo'),(2,'Omar',90,'Giza'),(3,'Salma',87,'Cairo'),(4,'Ali',98,'Alexandria'),(5,'Nour',60,'Giza');CREATE TABLE projects(id INTEGER,student_id INTEGER,topic TEXT);INSERT INTO projects VALUES (1,1,'Python'),(2,3,'SQL'),(3,4,'AI');");
        other.run("PRAGMA query_only=ON");
        const second=other.exec(code);
        self.postMessage({ok:true,assessmentCases:[results[0]?.values||[],second[0]?.values||[]]});
      }finally{other?.close()}
      return;
    }
    self.postMessage({ok:true,results:results.slice(0,4).map(x=>({columns:x.columns.slice(0,16),values:x.values.slice(0,100).map(row=>row.slice(0,16).map(value=>typeof value==="string"?value.slice(0,300):value))})),output:results.length?"":"Query completed (no result rows)."});
  }catch(e){
    self.postMessage({ok:false,output:String(e?.message||e).slice(0,750)});
  }finally{if(db)db.close()}
};
