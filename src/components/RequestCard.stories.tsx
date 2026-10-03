import { useState } from 'react';
import { RequestCard, type ReqStatus } from './RequestCard';
import { REQUESTS, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [list, setList] = useState(REQUESTS);
  const [msg, setMsg] = useState('> admin view: approve or decline pending requests');

  const set = (id: string, status: ReqStatus) =>
    setList(l =>
      l.map(x =>
        x.id === id ? { ...x, status, progress: status === 'Processing' ? 0 : x.progress } : x
      )
    );

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        {list.map(r => (
          <RequestCard
            key={r.id}
            request={r}
            canManage
            onApprove={x => {
              set(x.id, 'Processing');
              setMsg('> approved ' + x.item.title + ', sent to Radarr');
            }}
            onDecline={x => {
              set(x.id, 'Declined');
              setMsg('> declined ' + x.item.title);
            }}
            onOpen={x => setMsg('> open ' + x.item.title)}
          />
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}</div>
      {credit}
    </div>
  );
};
