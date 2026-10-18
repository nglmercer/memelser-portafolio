import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const d=JSON.parse(readFileSync('public/github-data.json','utf8'));
assert.equal(d.repos.length,d.stats.publicRepos);assert.equal(new Set(d.repos.map(r=>r.id)).size,d.repos.length);
assert.equal(d.stats.stars,d.repos.filter(r=>!r.isFork).reduce((s,r)=>s+r.stars,0));
assert.equal(d.days.length,365);assert.equal(d.stats.contributions,d.days.reduce((s,x)=>s+x.count,0));
for(let i=0;i<d.days.length;i++){assert(Number.isInteger(d.days[i].count)&&d.days[i].count>=0);assert(d.days[i].level>=0&&d.days[i].level<=4);if(i)assert.equal(new Date(d.days[i].date)-new Date(d.days[i-1].date),86400000);}
for(const r of d.repos){assert(r.url.startsWith('https://github.com/nglmercer/'));if(r.demo)assert(r.demo.startsWith('https://'));}
for(const c of d.commits){assert(c.sha.match(/^[a-f0-9]{40}$/));assert(c.url.startsWith('https://github.com/'));}
console.log(`Verified ${d.repos.length} repository previews, 365 consecutive contribution days, ${d.commits.length} commit records, and matching aggregate statistics.`);
