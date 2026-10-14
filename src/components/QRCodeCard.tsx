import './QRCodeCard.css';
export interface QRCodeCardProps{matrix:boolean[][];label?:string;size?:number;className?:string}
export function QRCodeCard({matrix,label,size=240,className=''}:QRCodeCardProps){const n=matrix.length,cell=size/n;return <div className={'ml qr '+className} data-qr-code><svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label||'QR code'}>{matrix.map((row,y)=>row.map((on,x)=>on?<rect key={`${x}-${y}`} x={x*cell} y={y*cell} width={cell+0.1} height={cell+0.1} fill="var(--app-bg)"/>:null))}</svg>{label&&<span>{label}</span>}</div>}
