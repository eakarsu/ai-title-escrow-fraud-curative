import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import jwt from 'jsonwebtoken';
import pg from 'pg';
process.env.DOTENV_CONFIG_PATH='/tmp/nonexistent-fixture-env';
process.env.NODE_ENV='production';
process.env.SESSION_SECRET='fixture-random-signing-key-012345678901234567890';
process.env.OPENROUTER_API_KEY='fixture-only';
process.env.OPENROUTER_BASE_URL='https://openrouter.ai/api/v1';
const config=JSON.parse(fs.readFileSync(new URL('../../app.json',import.meta.url),'utf8'));
const writes=[];
let currentRole='reviewer';
pg.Pool.prototype.query=async(sql,values)=>{
  if(sql.startsWith('SELECT id,email,name,role FROM app_users'))return {rows:[{id:1,email:'fixture@example.invalid',name:'Fixture',role:currentRole}],rowCount:1};
  if(/INSERT|UPDATE|DELETE/i.test(sql))writes.push(sql);
  return {rows:[],rowCount:0};
};
const backend=await import('../server.mjs');
const originalFetch=globalThis.fetch;
const server=backend.createApp().listen(0,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const token=jwt.sign({id:1},process.env.SESSION_SECRET,{algorithm:'HS256',issuer:config.id,audience:config.id});
async function request(path,body,auth=token){return originalFetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${auth}`}:{})},...(body?{body:JSON.stringify(body)}:{})});}
await test('credentials, role restrictions, fake completions and invented AI receipts are rejected',async()=>{
 assert.equal((await request('/api/auth/demo-credentials',undefined,null)).status,404);
 assert.equal((await request('/api/records',{workflowId:config.workflows[0].id})).status,403);
 const forged=jwt.sign({id:1},'local-demo-session-secret-change-before-production');
 assert.equal((await request('/api/app',undefined,forged)).status,401);
 currentRole='operator';
 assert.equal((await request('/api/integrations/test',{id:1})).status,503);
 const feature=config.domainProduct.features[0];
 assert.equal((await request(`/api/domain/${feature.id}/actions/${feature.actions[0].id}`,{recordId:1,moduleId:feature.modules[0]})).status,409);
 assert.equal((await request('/api/ai/save',{workflowId:config.workflows[0].id,result:{}})).status,422);
 assert.equal(writes.length,0);
});
await test('unstructured provider refusal does not become 82 percent confidence',async()=>{
 globalThis.fetch=async()=>Response.json({id:'fixture',choices:[{message:{content:'I cannot perform this analysis'}}]});
 await assert.rejects(backend.callOpenRouter(config.workflows[0],{},'assess'),/not a valid/);
 globalThis.fetch=async()=>Response.json({id:'fixture',choices:[{message:{content:JSON.stringify({executiveSummary:'Draft from supplied inputs',metrics:[],sections:[{title:'Evidence',detail:'Input supplied'}],actions:[]})}}]});
 const result=await backend.callOpenRouter(config.workflows[0],{},'assess');assert.equal(result.confidence,null);assert.equal(result.risk,null);
 globalThis.fetch=originalFetch;
});
await test('backend refuses startup without a strong signing secret',()=>{
 const env={...process.env,SESSION_SECRET:'',DOTENV_CONFIG_PATH:'/tmp/nonexistent-fixture-env'};
 const child=spawnSync(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env,encoding:'utf8'});
 assert.notEqual(child.status,0);assert.match(child.stderr,/Configure SESSION_SECRET/);
});
after(async () => { globalThis.fetch=originalFetch; server.closeAllConnections();await new Promise(resolve=>server.close(resolve)); });
