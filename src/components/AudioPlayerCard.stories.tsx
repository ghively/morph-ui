import { AudioPlayerCard } from './AudioPlayerCard';
export const Default=()=> <AudioPlayerCard src="audio.mp3" title="Track" duration={180} />;
export const WithArtist=()=> <AudioPlayerCard src="audio.mp3" artist="Artist"/>;
