import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { AudioPlayerCard } from '../src/components/AudioPlayerCard';
describe('AudioPlayerCard',()=>{it('renders',()=>{render(<AudioPlayerCard src="x"/>);expect(screen.getByRole('button',{name:'Play'})).toBeTruthy();});});
