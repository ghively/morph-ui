import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { GalleryGrid } from '../src/components/GalleryGrid';
describe('GalleryGrid',()=>{it('renders',()=>{render(<GalleryGrid items={[{src:"x"}]}/>);expect(screen.getByRole('button')).toBeTruthy();});});
