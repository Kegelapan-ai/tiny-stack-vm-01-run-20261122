import f from'node:fs';
const L=new Int8Array(256).fill(-1),P=new Uint8Array(256),Q=new Uint8Array(256);
for(let i=0;i<256;i++)if(!i||i>2&&i<8||i>15&&i<31||i>31&&i<35||i==52||i>63&&i<66||i>79&&i<84)L[i]=0;
L[1]=1;L[2]=4;L[48]=L[49]=L[50]=L[51]=2;
for(let i=16;i<35;i++)if(i-23&&i-27&&i-31){P[i]=2;Q[i]=1}
P[3]=P[4]=P[23]=P[27]=P[49]=P[50]=P[64]=P[80]=P[81]=P[83]=1;P[5]=P[6]=P[65]=2;P[7]=3;
Q[1]=Q[2]=Q[23]=Q[27]=Q[64]=Q[82]=1;Q[4]=Q[5]=2;Q[6]=Q[7]=3;
function run(p,g){
const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536),T=new Uint8Array(12);
let sp=0,cp=0,ip=0,pc=0,st=0,ol=0;
const e=c=>[O.slice(0,ol),c];
for(;;){
if(st===1e6)return e(10);
if(pc<0||pc>=p.length)return e(9);
const o=p[pc],l=L[o];
if(l<0)return e(5);
if(pc+l>=p.length)return e(9);
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
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
const b=D[sp-1],a=D[sp-2];
if(o>18&&o<23&&!b)return e(4);
const r=o==19?a===-2147483648&&b===-1?a:(a/b)|0:o==20?b===-1?0:a%b|0:o==21?Math.floor((a>>>0)/(b>>>0))|0:o==22?(a>>>0)%(b>>>0)|0:o==16?a+b|0:o==17?a-b|0:o==18?Math.imul(a,b):o==24?a&b:o==25?a|b:o==26?a^b:o==28?a<<(b&31):o==29?a>>(b&31):o==30?(a>>>(b&31))|0:o==32?a===b?1:0:o==33?a<b?1:0:(a>>>0)<(b>>>0)?1:0;
sp-=2;D[sp++]=r;break}
case 23:D[sp-1]=-D[sp-1]|0;break;
case 27:D[sp-1]=~D[sp-1];break;
case 48:case 49:case 50:{const r=(p[nx-2]|p[nx-1]<<8)<<16>>16,v=o>48?D[--sp]:0;if(o<49||o==49&&!v||o==50&&v)pc=nx+r;break}
case 51:if(cp==64)return e(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
case 52:if(!cp)return e(8);pc=C[--cp];break;
case 64:{const a=D[sp-1];if(a>>>0>255)return e(6);D[sp-1]=M[a];break}
case 65:{const a=D[sp-1],v=D[sp-2];if(a>>>0>255)return e(6);sp-=2;M[a]=v;break}
case 80:{let v=D[sp-1],n=0,ng=0;if(v<0)ng=1,v=-v;do{T[n++]=48+v%10;v=(v/10)|0}while(v>0);if(ol+n+ng>65536)return e(11);sp--;if(ng)O[ol++]=45;while(n)O[ol++]=T[--n];break}
case 81:if(ol>65535)return e(11);O[ol++]=D[--sp]&255;break;
case 82:D[sp++]=ip<g.length?g[ip++]:-1;break;
case 83:return e(D[--sp]&255);
}}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',J=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of f.readdirSync(I).sort()){
const r=run(f.readFileSync(`${I}/${d}/program.bin`),f.readFileSync(`${I}/${d}/input.bin`));
f.mkdirSync(`${J}/${d}`,{recursive:true});
f.writeFileSync(`${J}/${d}/stdout.bin`,r[0]);
f.writeFileSync(`${J}/${d}/exit.txt`,r[1]+'\n');
}
