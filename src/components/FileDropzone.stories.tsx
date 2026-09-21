import { useState } from 'react';
import { FileDropzone } from './FileDropzone';

export default {
  title: 'FileDropzone',
  component: FileDropzone,
};

export const Default = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{ maxWidth: 480 }}>
      <FileDropzone
        id="rag-upload"
        accept=".pdf,.docx,.txt,.md"
        maxSizeBytes={25 * 1024 * 1024}
        onFiles={(files) => setCount((c) => c + files.length)}
      />
      {count > 0 && <p style={{ fontSize: 12, opacity: 0.7 }}>{count} file(s) accepted this session.</p>}
    </div>
  );
};
