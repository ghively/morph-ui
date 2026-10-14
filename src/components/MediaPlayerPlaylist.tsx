import './MediaPlayerPlaylist.css';
export interface PlaylistTrack{id:string;title:string;artist?:string;duration:number}
export interface MediaPlayerPlaylistProps{tracks:PlaylistTrack[];activeId?:string;playing?:boolean;onSelect?:(track:PlaylistTrack,index:number)=>void;className?:string}
const fmt=(n:number)=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
export function MediaPlayerPlaylist({tracks,activeId,playing=false,onSelect,className=''}:MediaPlayerPlaylistProps){return <div className={'ml mpl '+className} role="list" aria-label="Playlist" data-playlist>{tracks.map((t,i)=><div role="listitem" key={t.id}><button type="button" className="mpl-row" data-active={t.id===activeId?'':undefined} aria-current={t.id===activeId?'true':undefined} onClick={()=>onSelect?.(t,i)}><span>{t.id===activeId&&playing?'❚❚':'▶'}</span><span><b>{t.title}</b>{t.artist&&<small> · {t.artist}</small>}</span><time>{fmt(t.duration)}</time></button></div>)}</div>}
