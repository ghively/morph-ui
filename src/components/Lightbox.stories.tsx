import { Lightbox } from './Lightbox';
export const Default=()=> <Lightbox items={[{src:"https://example.com/image.jpg",alt:"Sample",caption:"Caption"}]} onClose={()=>{}} />;
export const Closed=()=>null;
