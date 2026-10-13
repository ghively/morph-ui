import {render,screen} from '@testing-library/react'; import {describe,it,expect} from 'vitest'; import { MediaPlayerPlaylist } from '../src/components/MediaPlayerPlaylist';
describe('MediaPlayerPlaylist',()=>{it('renders',()=>{render(<MediaPlayerPlaylist tracks={[{id:"1",title:"x",duration:1}]}/>);expect(screen.getByRole('list')).toBeTruthy();});});
