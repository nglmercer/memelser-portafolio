// Burgers vortex: a steady incompressible Navier–Stokes vortex with axial strain.
// Coordinates use y as the axial direction. Illustrative parameters, not a CFD prediction.
export function velocity([x,y,z],strain=.8,circulation=8,core=.38){const r2=x*x+z*z;const omega=r2<1e-9?circulation/(2*Math.PI*core*core):circulation/(2*Math.PI*r2)*(1-Math.exp(-r2/(core*core)));return [-strain*x/2-omega*z,strain*y,-strain*z/2+omega*x];}
export function streamline(start,steps=250,dt=.022){let p=[...start];const points=[p];for(let i=0;i<steps;i++){const k1=velocity(p),k2=velocity(p.map((v,j)=>v+k1[j]*dt/2)),k3=velocity(p.map((v,j)=>v+k2[j]*dt/2)),k4=velocity(p.map((v,j)=>v+k3[j]*dt));p=p.map((v,j)=>v+dt*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);if(Math.abs(p[1])>2.5)break;points.push(p);}return points;}
