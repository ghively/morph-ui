import { MediaPlayerPlaylist } from './MediaPlayerPlaylist';
export const Default=()=> <MediaPlayerPlaylist tracks={[{id:"1",title:"First",duration:120},{id:"2",title:"Second",duration:180}]} activeId="1" />;
export const Playing=()=> <MediaPlayerPlaylist tracks={[{id:"1",title:"First",duration:120}]} activeId="1" playing/>;
