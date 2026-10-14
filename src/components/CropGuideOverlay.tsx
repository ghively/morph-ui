import './CropGuideOverlay.css';
export interface CropGuideOverlayProps{src:string;alt?:string;visible?:boolean;label?:string;className?:string}
export function CropGuideOverlay({src,alt='',visible=true,label='Rule of thirds',className=''}:CropGuideOverlayProps){return <div className={'ml cgo '+className} data-crop-guide><img src={src} alt={alt}/>{visible&&<><div className="cgo-grid" aria-hidden="true"/><span className="cgo-label">{label}</span></>}</div>}
