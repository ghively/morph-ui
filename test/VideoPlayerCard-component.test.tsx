import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { VideoPlayerCard } from '../src/components/VideoPlayerCard';
describe('VideoPlayerCard',()=>{it('renders',()=>{render(<VideoPlayerCard src="x"/>);expect(screen.getByRole('button',{name:'Play'})).toBeTruthy();});});
