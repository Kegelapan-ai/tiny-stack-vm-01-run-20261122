import{readdirSync,readFileSync,writeFileSync,mkdirSync}from'node:fs';
import{join}from'node:path';
// Exact interpreter of make.fun's tiny stack ISA (generator/subject/ISA.md).
// Tables: L=immediate bytes (-1=unknown opcode), P=pops, Q=pushes, per opcode.
const L=new Int8Array(256).fill(-1),P=new Uint8Array(256),Q=new Uint8Array(256);
for(const o of[0,3,4,5,6,7,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,33,34,52,64,65,80,81,82,83])L[o]=0;
L[1]=1;L[2]=4;for(const o of[48,49,50,51])L[o]=2;
for(const o of[16,17,18,19,20,21,22,24,25,26,28,29,30,32,33,34]){P[o]=2;Q[o]=1}
P[3]=P[4]=P[23]=P[27]=P[49]=P[50]=P[64]=P[80]=P[81]=P[83]=1;P[5]=P[6]=P[65]=2;P[7]=3;
Q[1]=Q[2]=Q[23]=Q[27]=Q[64]=Q[82]=1;Q[4]=Q[5]=2;Q[6]=Q[7]=3;
function run(p,g){
const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536),T=new Uint8Array(12);
let sp=0,cp=0,ip=0,pc=0,st=0,ol=0;
const pl=p.length,gl=g.length;
const e=c=>[O.slice(0,ol),c];
for(;;){
if(st===1e6)return e(10);
if(pc<0||pc>=pl)return e(9);
const o=p[pc],l=L[o];
if(l<0)return e(5);
if(pc+l>=pl)return e(9);
st++;
const nx=pc+1+l;
if(sp<P[o])return e(2);
if(sp-P[o]+Q[o]>256)return e(3);
pc=nx;
switch(o){
case 0:return e(0);
case 1:D[sp++]=(p[nx-1]<<24)>>24;break;
case 2:D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
case 3:sp--;break;
case 4:D[sp]=D[sp-1];sp++;break;
case 5:{const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;break}
case 6:D[sp]=D[sp-2];sp++;break;
case 7:{const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;break}
case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:{
const b=D[sp-1],a=D[sp-2];let r;
if(o===0x13){if(!b)return e(4);r=a===-2147483648&&b===-1?a:(a/b)|0}
else if(o===0x14){if(!b)return e(4);r=b===-1?0:a%b|0}
else if(o===0x15){if(!b)return e(4);r=Math.floor((a>>>0)/(b>>>0))|0}
else if(o===0x16){if(!b)return e(4);r=(a>>>0)%(b>>>0)|0}
else if(o===0x10)r=a+b|0;
else if(o===0x11)r=a-b|0;
else if(o===0x12)r=Math.imul(a,b);
else if(o===0x18)r=a&b;
else if(o===0x19)r=a|b;
else if(o===0x1a)r=a^b;
else if(o===0x1c)r=a<<(b&31);
else if(o===0x1d)r=a>>(b&31);
else if(o===0x1e)r=(a>>>(b&31))|0;
else if(o===0x20)r=a===b?1:0;
else if(o===0x21)r=a<b?1:0;
else r=(a>>>0)<(b>>>0)?1:0;
sp-=2;D[sp++]=r;break}
case 0x17:D[sp-1]=-D[sp-1]|0;break;
case 0x1b:D[sp-1]=~D[sp-1];break;
case 0x30:case 0x31:case 0x32:{const r=(p[nx-2]|p[nx-1]<<8)<<16>>16;let t=1;if(o!==0x30){const v=D[--sp];t=o===0x31?v===0:v!==0}if(t)pc=nx+r;break}
case 0x33:if(cp===64)return e(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
case 0x34:if(!cp)return e(8);pc=C[--cp];break;
case 0x40:{const a=D[sp-1];if(a<0||a>255)return e(6);D[sp-1]=M[a];break}
case 0x41:{const a=D[sp-1],v=D[sp-2];if(a<0||a>255)return e(6);sp-=2;M[a]=v;break}
case 0x50:{let v=D[sp-1],n=0,ng=0;if(v<0){ng=1;v=-v}do{T[n++]=48+v%10;v=(v/10)|0}while(v>0);if(ol+n+ng>65536)return e(11);sp--;if(ng)O[ol++]=45;while(n)O[ol++]=T[--n];break}
case 0x51:if(ol+1>65536)return e(11);O[ol++]=D[--sp]&255;break;
case 0x52:D[sp++]=ip<gl?g[ip++]:-1;break;
case 0x53:return e(D[--sp]&255);
}}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
const r=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
mkdirSync(join(O,id),{recursive:true});
writeFileSync(join(O,id,'stdout.bin'),r[0]);
writeFileSync(join(O,id,'exit.txt'),r[1]+'\n');
}
