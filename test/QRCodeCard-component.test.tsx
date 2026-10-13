import {render} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { QRCodeCard } from '../src/components/QRCodeCard';
describe('QRCodeCard',()=>{it('renders',()=>{const {container}=render(<QRCodeCard matrix={[[true]]}/>);expect(container.querySelector('svg')).toBeTruthy();});});
