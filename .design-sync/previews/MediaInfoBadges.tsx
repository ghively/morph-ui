import { MediaInfoBadges } from '../../src/components/MediaInfoBadges';
import { cap, TOS, BBB } from '../../src/components/__fixtures__/mediaLibrary';

export const Default = () => {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {cap('Inline · Tears of Steel')}
      <MediaInfoBadges item={TOS} />
      {cap('Inline · Big Buck Bunny')}
      <MediaInfoBadges item={BBB} />
      {cap('Sheet')}
      <MediaInfoBadges item={TOS} variant="sheet" showRatings={false} />
    </div>
  );
};
