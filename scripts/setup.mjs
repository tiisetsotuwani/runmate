import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const [major,minor]=process.versions.node.split('.').map(Number);
if (major<22 || (major===22 && minor<14)) {
  console.error('Use Node.js 22.14 or newer.'); process.exit(1);
}
const npm=process.platform==='win32'?'npm.cmd':'npm';
for (const args of [[existsSync('package-lock.json')?'ci':'install'],['run','check']]) {
  const result=spawnSync(npm,args,{stdio:'inherit',shell:process.platform==='win32'});
  if (result.error) {console.error(result.error.message);process.exit(1);}
  if (result.status!==0) process.exit(result.status ?? 1);
}
console.log('Development dependencies and checks ready. Native builds need Expo or platform SDK setup.');
