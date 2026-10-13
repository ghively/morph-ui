import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { WaveformPlayer } from '../src/components/WaveformPlayer';
describe('WaveformPlayer',()=>{it('renders',()=>{render(<WaveformPlayer duration={10}/>);expect(screen.getByRole('slider')).toBeTruthy();});});
