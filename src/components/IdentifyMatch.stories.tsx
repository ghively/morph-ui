import { useState } from 'react';
import { IdentifyMatch, type MatchResult } from './IdentifyMatch';
import { TOS, SINTEL, BBB, LIBRARY, credit } from './__fixtures__/mediaLibrary';

const R: MatchResult[] = [
  { id: 'm1', item: TOS, provider: 'TheMovieDb', providerIds: { tmdb: '133701', imdb: 'tt2285752' }, score: 0.96 },
  {
    id: 'm2',
    item: { ...LIBRARY[4]!, overview: 'Two strange characters explore a capricious and seemingly infinite machine.' },
    provider: 'TheMovieDb',
    providerIds: { tmdb: '9761' },
    score: 0.41,
  },
  { id: 'm3', item: SINTEL, provider: 'TheTVDB', score: 0.22 },
];

export const Default = () => {
  const [res, setRes] = useState(R);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('> search runs a simulated provider lookup');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <IdentifyMatch
        item={{ ...BBB, title: 'tears.of.steel', year: 2012 }}
        path="/media/films/tears.of.steel.2012.2160p.mkv"
        results={res}
        searching={busy}
        onSearch={q => {
          setBusy(true);
          setMsg('> searching "' + q.name + '"');
          setTimeout(() => {
            setBusy(false);
            setRes(q.name.toLowerCase().includes('xyz') ? [] : R);
            setMsg('> ' + R.length + ' results');
          }, 900);
        }}
        onApply={(r, o) =>
          setMsg(
            '> matched ' + r.item.title + ' (' + r.provider + ')' + (o.replaceImages ? ', replacing images' : '')
          )
        }
        onCancel={() => setMsg('> cancelled')}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        {msg}. Provider ids and scores are demo values.
      </div>
      {credit}
    </div>
  );
};
