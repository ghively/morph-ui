import { FilePreviewTile } from './FilePreviewTile';
export const Default=()=> <FilePreviewTile name="report.pdf" size={12345} mimeType="application/pdf" />;
export const Actions=()=> <FilePreviewTile name="image.png" onOpen={()=>{}} onDownload={()=>{}}/>;
