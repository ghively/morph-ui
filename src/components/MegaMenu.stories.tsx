import { MegaMenu } from './MegaMenu';
export default {title:'MegaMenu'};
const sections=[{id:'product',label:'Product',links:[{id:'chat',label:'Chat',description:'Work with your team'},{id:'canvas',label:'Canvas'}]},{id:'resources',label:'Resources',links:[{id:'docs',label:'Documentation'},{id:'help',label:'Help center'}]}];
export const Default=()=> <MegaMenu label="Explore" sections={sections} defaultOpen/>;
export const Closed=()=> <MegaMenu label="Product" sections={sections}/>;
