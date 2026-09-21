import { useState } from 'react';
import { Pagination } from './Pagination';

export default {
  title: 'Pagination',
  component: Pagination,
};

export const Default = () => {
  const [page, setPage] = useState(4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ margin: 0, fontSize: 13 }}>Showing results {(page - 1) * 10 + 1}–{page * 10} of 128</p>
      <Pagination page={page} totalPages={13} onPageChange={setPage} />
    </div>
  );
};
