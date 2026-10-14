import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { CropGuideOverlay } from '../src/components/CropGuideOverlay';
describe('CropGuideOverlay',()=>{it('renders',()=>{render(<CropGuideOverlay src="x"/>);expect(screen.getByAltText('')).toBeTruthy();});});
