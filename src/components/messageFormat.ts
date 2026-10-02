/** Formatting helpers shared by the message components. Lives outside
 *  MessageTimeline so MessageTile / AttachmentPreviewPanel don't import back into it. */

export function formatTimeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatBytes(bytes: number | undefined | null): string {
  if (bytes == null) return '';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
