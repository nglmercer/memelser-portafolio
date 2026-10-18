import assert from 'node:assert/strict';
import {Fluid} from './src/fluid-core.js';
const f=new Fluid(48);f.inject(22,24,20,-10,1);const before=f.divergence();f.project();assert(f.divergence()<before,'Pressure projection must reduce divergence');for(let i=0;i<200;i++)f.step(.033);for(const k of ['u','v','d'])assert(f[k].every(Number.isFinite));assert(f.d.some(x=>x>0));f.reset();assert(f.d.every(x=>x===0));console.log('Verified fluid projection reduces divergence, long-run numerical stability, dye advection and reset.');
