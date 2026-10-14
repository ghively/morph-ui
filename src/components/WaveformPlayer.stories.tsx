import { WaveformPlayer } from './WaveformPlayer';
export const Default=()=> <WaveformPlayer duration={180} />;
export const Custom=()=> <WaveformPlayer duration={240} waveform={[.2,.8,.4,.9]}/>;
