import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { ImageViewer } from '../src/components/ImageViewer';
describe('ImageViewer',()=>{it('renders',()=>{render(<ImageViewer src="x"/>);expect(screen.getByAltText('')).toBeTruthy();});});
