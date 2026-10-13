import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { Lightbox } from '../src/components/Lightbox';
describe('Lightbox',()=>{it('renders',()=>{render(<Lightbox items={[{src:"x"}]} onClose={()=>{}}/>);expect(screen.getByRole('dialog')).toBeTruthy();});});
