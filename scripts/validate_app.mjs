import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
for (const [cwd,args] of [[root,["run","typecheck"]],[root,["run","lint"]],[root,["test"]],[root+"backend",["run","test:security"]],[root+"frontend",["run","build"]]]) {
  const result=spawnSync("npm",args,{cwd,stdio:"inherit"});
  if (result.error || result.status!==0) process.exit(result.status || 1);
}
console.log("Code and security checks passed. Domain integrations require separately configured services; no live execution was tested.");
