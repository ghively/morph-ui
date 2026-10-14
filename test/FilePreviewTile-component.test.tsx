import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { FilePreviewTile } from '../src/components/FilePreviewTile';
describe('FilePreviewTile',()=>{it('renders',()=>{render(<FilePreviewTile name="x.txt"/>);expect(screen.getByText('x.txt')).toBeTruthy();});});
