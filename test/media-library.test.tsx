import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  fromJellyfin,
  decodeBlurhash,
  legibleAccent,
  Art,
  type MediaItem,
} from '../src/components/mediaLibrary.shared';
import { PosterCard } from '../src/components/PosterCard';
import { LibraryGrid } from '../src/components/LibraryGrid';
import { EpisodeList } from '../src/components/EpisodeList';
import { PlayerScrubber } from '../src/components/PlayerScrubber';
import { TrackPicker, tracksFromItem } from '../src/components/TrackPicker';
import { ProfilePicker } from '../src/components/ProfilePicker';
import { DownloadQueue, type QueueItem } from '../src/components/DownloadQueue';
import { IndexerHealth, type Service } from '../src/components/IndexerHealth';
import { ActiveSessions, type Session } from '../src/components/ActiveSessions';
import { TOS, CAM_EPISODES, LIBRARY, USERS } from '../src/components/__fixtures__/mediaLibrary';

// Canvas mocks for blurhash and accent extraction in jsdom
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    createImageData: (w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
    }),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({
      data: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255]),
    }),
  } as unknown as CanvasRenderingContext2D);
  HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock');
}

describe('Media Library - Core & Primitives', () => {

  describe('fromJellyfin', () => {
    it('maps image tags to full URLs with maxWidth and api_key', () => {
      const raw = {
        Id: 'm123',
        Name: 'Test Movie',
        Type: 'Movie',
        ImageTags: { Primary: 'tag1' },
      };
      const item = fromJellyfin(raw, {
        server: 'http://jf:8096',
        apiKey: 'secret-key',
        maxWidth: { Primary: 900 },
      });
      expect(item.id).toBe('m123');
      expect(item.title).toBe('Test Movie');
      expect(item.art.Primary).toBe(
        'http://jf:8096/Items/m123/Images/Primary?tag=tag1&quality=90&maxWidth=900&api_key=secret-key'
      );
    });

    it('falls back to parent image tags when item lacks own tags', () => {
      const raw = {
        Id: 'ep1',
        Name: 'Episode 1',
        Type: 'Episode',
        SeriesId: 's1',
        SeriesPrimaryImageTag: 'stag',
        ParentBackdropItemId: 's1',
        ParentBackdropImageTags: ['btag1'],
        ParentLogoItemId: 's1',
        ParentLogoImageTag: 'ltag',
        ParentThumbItemId: 's1',
        ParentThumbImageTag: 'ttag',
      };
      const item = fromJellyfin(raw, 'http://jf:8096');
      expect(item.art.Primary).toContain('/Items/s1/Images/Primary?tag=stag');
      expect((item.art.Backdrop as string[])[0]).toContain('/Items/s1/Images/Backdrop/0?tag=btag1');
      expect(item.art.Logo).toContain('/Items/s1/Images/Logo?tag=ltag');
      expect(item.art.Thumb).toContain('/Items/s1/Images/Thumb?tag=ttag');
    });

    it('maps UserData to progress, played, favorite, unplayed', () => {
      const raw = {
        Id: 'm1',
        Name: 'Film',
        Type: 'Movie',
        RunTimeTicks: 10000000000, // 1000s
        UserData: {
          Played: true,
          PlayCount: 2,
          PlaybackPositionTicks: 5000000000, // 500s
          IsFavorite: true,
          UnplayedItemCount: 3,
        },
      };
      const item = fromJellyfin(raw, 'http://jf:8096');
      expect(item.played).toBe(true);
      expect(item.favorite).toBe(true);
      expect(item.unplayed).toBe(3);
      expect(item.progress).toBeCloseTo(0.5, 2);
    });

    it('maps MediaStreams to streams.video, streams.audio, streams.subtitles', () => {
      const raw = {
        Id: 'm1',
        Name: 'Film',
        Type: 'Movie',
        MediaStreams: [
          { Type: 'Video', VideoRange: 'HDR10', DisplayTitle: '4K HDR10' },
          { Type: 'Audio', DisplayTitle: 'English Dolby Atmos 7.1' },
          { Type: 'Subtitle', DisplayTitle: 'English (SDH)' },
        ],
      };
      const item = fromJellyfin(raw, 'http://jf:8096');
      expect(item.streams?.video?.range).toBe('HDR10');
      expect(item.streams?.audio?.[0]?.atmos).toBe(true);
      expect(item.streams?.subs?.[0]).toBe('ENGLISH (SDH)');
    });

    it('maps People to cast and crew with profile image URLs', () => {
      const raw = {
        Id: 'm1',
        Name: 'Film',
        Type: 'Movie',
        People: [
          { Id: 'p1', Name: 'Actor Jane', Role: 'Hero', Type: 'Actor', PrimaryImageTag: 'jtag' },
          { Id: 'p2', Name: 'Director Bob', Type: 'Director', PrimaryImageTag: 'btag' },
        ],
      };
      const item = fromJellyfin(raw, 'http://jf:8096');
      expect(item.people?.[0]?.name).toBe('Actor Jane');
      expect(item.people?.[0]?.role).toBe('Hero');
      expect(item.people?.[0]?.art?.Profile).toContain('/Items/p1/Images/Primary?tag=jtag');
      expect(item.people?.[1]?.name).toBe('Director Bob');
      expect(item.people?.[1]?.type).toBe('Director');
    });
  });

  describe('<Art>', () => {
    it('steps to the next candidate on error and invokes onResolve', () => {
      const onResolve = vi.fn();
      const item: MediaItem = {
        id: 'a1',
        type: 'Movie',
        title: 'Artwork Test',
        art: {
          Primary: 'http://broken.example.com/art.jpg',
          Backdrop: 'http://good.example.com/art.jpg',
        },
      };

      render(<Art item={item} type="Primary" fallback={['Backdrop']} onResolve={onResolve} />);

      const img = screen.getByRole('img') as HTMLImageElement;
      expect(img.src).toBe('http://broken.example.com/art.jpg');

      // Simulate load failure on the first image
      fireEvent.error(img);

      // Now it should step to the second image (new element mounted)
      const nextImg = screen.getByRole('img') as HTMLImageElement;
      expect(nextImg.src).toBe('http://good.example.com/art.jpg');
      expect(onResolve).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Backdrop',
          step: 1,
          url: 'http://good.example.com/art.jpg',
        })
      );
    });

    it('renders [ NO_ART ] fallback title tile when candidates are exhausted', () => {
      const item: MediaItem = {
        id: 'no-art',
        type: 'Movie',
        title: 'Empty Canvas',
        art: {},
      };

      const { container } = render(<Art item={item} type="Primary" fallback={[]} />);
      expect(container.textContent).toContain('NO_ART');
      expect(container.textContent).toContain('Empty Canvas');
    });
  });

  describe('decodeBlurhash and legibleAccent', () => {
    it('returns a data URL for a valid hash and null for an invalid one', () => {
      const valid = 'L87nJ69G_3M{00IU~qxa4nIU%2Rj';
      const result = decodeBlurhash(valid);
      expect(result).toMatch(/^data:image\/png;base64,/);

      expect(decodeBlurhash('')).toBeNull();
      expect(decodeBlurhash('bad')).toBeNull();
    });

    it('clamps lightness in legibleAccent', () => {
      // Extremely dark color should be boosted
      const boosted = legibleAccent('#010101');
      expect(boosted).toMatch(/^#[0-9a-f]{6}$/i);
      expect(boosted.toLowerCase()).not.toBe('#010101');

      // Extremely bright color should be softened
      const softened = legibleAccent('#ffffff');
      expect(softened).toMatch(/^#[0-9a-f]{6}$/i);
      expect(softened.toLowerCase()).not.toBe('#ffffff');
    });
  });
});

describe('Media Library - Components', () => {
  describe('PosterCard', () => {
    it('toggles played and favorite with callbacks', () => {
      const onPlayedToggle = vi.fn();
      const onFavorite = vi.fn();

      render(
        <PosterCard
          item={{ ...TOS, played: false, favorite: false, progress: 0.65 }}
          onPlayedChange={onPlayedToggle}
          onFavoriteChange={onFavorite}
        />
      );

      // Progress bar exists before marking as played
      expect(screen.getByRole('img', { name: /65% watched/i })).toBeDefined();

      const favBtn = screen.getByLabelText(/Add favorite/i);
      fireEvent.click(favBtn);
      expect(onFavorite).toHaveBeenCalledWith(true, expect.anything());

      const playedBtn = screen.getByLabelText(/Mark played/i);
      fireEvent.click(playedBtn);
      expect(onPlayedToggle).toHaveBeenCalledWith(true, expect.anything());
    });
  });

  describe('LibraryGrid', () => {
    it('supports filter, sort, disabled letters, and alpha jump', () => {
      render(
        <LibraryGrid
          items={LIBRARY}
          title="Films"
        />
      );

      // Check alpha strip while sorted by name (letters with no items are disabled)
      const zBtn = screen.getByRole('button', { name: /^Z$/i }) as HTMLButtonElement;
      expect(zBtn.disabled).toBe(true);

      // Letter 'T' has Tears of Steel, so it should be enabled
      const tBtn = screen.getByRole('button', { name: /^T$/i }) as HTMLButtonElement;
      expect(tBtn.disabled).toBe(false);
      fireEvent.click(tBtn);

      // Filter button
      const favFilter = screen.getByRole('button', { name: /^Favorites$/i });
      fireEvent.click(favFilter);
      expect(favFilter.getAttribute('aria-pressed')).toBe('true');

      // Reset to all
      fireEvent.click(screen.getByRole('button', { name: /^All$/i }));

      // Sort select
      const sortSelect = screen.getByLabelText(/Sort/i) as HTMLSelectElement;
      fireEvent.change(sortSelect, { target: { value: 'year' } });
      expect(sortSelect.value).toBe('year');
    });
  });

  describe('EpisodeList', () => {
    it('defaults nextUp to the first unplayed episode and switches seasons', () => {
      const episodes = [
        { ...CAM_EPISODES[0]!, played: true },
        { ...CAM_EPISODES[1]!, played: false, progress: undefined },
        { ...CAM_EPISODES[2]!, played: false, progress: undefined },
      ];

      render(
        <EpisodeList
          seasons={[
            { id: 'season-1', name: 'Season 1', episodes },
            { id: 'season-2', name: 'Season 2', episodes: [CAM_EPISODES[0]!] },
          ]}
        />
      );

      // Next up card should highlight Episode 2 (first unplayed)
      expect(screen.getByText(/Next up/i)).toBeDefined();
      expect(screen.getByText(/Gran Dillama/i)).toBeDefined();

      // Switch to Season 2 tab
      const s2Tab = screen.getByRole('tab', { name: /Season 2/i });
      fireEvent.click(s2Tab);
      expect(s2Tab.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('PlayerScrubber', () => {
    it('handles keyboard seeks and skip segment callback', () => {
      const onSeek = vi.fn();
      const onSkip = vi.fn();
      const seg = { id: 'seg1', type: 'Intro' as const, start: 50, end: 100 };

      render(
        <PlayerScrubber
          position={60}
          duration={300}
          segments={[seg]}
          onSeek={onSeek}
          onSkip={onSkip}
        />
      );

      const scrubber = screen.getByRole('slider');

      // Right arrow seeks +10s
      fireEvent.keyDown(scrubber, { key: 'ArrowRight' });
      expect(onSeek).toHaveBeenCalledWith(70);

      // Left arrow seeks -10s
      fireEvent.keyDown(scrubber, { key: 'ArrowLeft' });
      expect(onSeek).toHaveBeenCalledWith(50);

      // Home seeks to 0
      fireEvent.keyDown(scrubber, { key: 'Home' });
      expect(onSeek).toHaveBeenCalledWith(0);

      // End seeks to duration
      fireEvent.keyDown(scrubber, { key: 'End' });
      expect(onSeek).toHaveBeenCalledWith(300);

      // Inside segment 50..100 at position 60 -> skip button should be visible
      const skipBtn = screen.getByRole('button', { name: /Skip intro/i });
      expect(skipBtn).toBeDefined();
      fireEvent.click(skipBtn);
      expect(onSkip).toHaveBeenCalledWith(seg);
    });
  });

  describe('TrackPicker', () => {
    it('shows transcode verdict and PGS subtitle burn-in warning', () => {
      const tracks = tracksFromItem(TOS);
      const pgsSub = tracks.subtitles.find(s => s.codec?.toLowerCase().includes('pgs')) ?? {
        index: 12,
        label: 'English (PGS)',
        codec: 'pgssub',
      };

      render(
        <TrackPicker
          audio={tracks.audio}
          subtitles={tracks.subtitles}
          source={{ bitrate: 20e6, height: 2160 }}
          value={{
            quality: '1080p10',
            audio: tracks.audio[0]?.index ?? 1,
            subtitle: pgsSub.index,
          }}
          onChange={() => {}}
        />
      );

      // 1080p10 (10 Mbps) is less than source 20Mbps -> Transcoding chip
      expect(screen.getByText(/^Transcoding$/)).toBeDefined();

      // PGS subtitle with transcode yields burn-in warning
      expect(screen.getByText(/burned in while transcoding/i)).toBeDefined();
    });
  });

  describe('ProfilePicker', () => {
    it('signs in without pin, and handles pin verification success/failure', async () => {
      const onSelect = vi.fn();
      const onVerifyPin = vi.fn((_user, pin) => pin === '1234');

      render(
        <ProfilePicker
          users={USERS}
          onSelect={onSelect}
          onVerifyPin={onVerifyPin}
        />
      );

      // Gene has no PIN -> immediate select
      const geneBtn = screen.getByRole('button', { name: /Gene/i });
      fireEvent.click(geneBtn);
      expect(onSelect).toHaveBeenCalledWith(USERS[0]);

      // Sam has a PIN -> opens PIN dialog
      const samBtn = screen.getByRole('button', { name: /Sam/i });
      fireEvent.click(samBtn);

      expect(screen.getByRole('dialog')).toBeDefined();

      // Type correct PIN: 1234
      for (const digit of ['1', '2', '3', '4']) {
        const keyBtn = screen.getByRole('button', { name: digit });
        fireEvent.click(keyBtn);
      }

      await act(async () => {
        await Promise.resolve();
      });

      expect(onVerifyPin).toHaveBeenCalledWith(USERS[1], '1234');
      expect(onSelect).toHaveBeenCalledWith(USERS[1]);
    });
  });

  describe('Action callbacks on DownloadQueue, IndexerHealth, ActiveSessions', () => {
    it('DownloadQueue calls pause, resume, retry, remove', () => {
      const onPause = vi.fn();
      const onResume = vi.fn();
      const onRetry = vi.fn();
      const onRemove = vi.fn();

      const items: QueueItem[] = [
        {
          id: 'q1',
          name: 'Item 1',
          client: 'SABnzbd',
          protocol: 'usenet',
          state: 'downloading',
          progress: 0.5,
          size: 1e9,
        },
        {
          id: 'q2',
          name: 'Item 2',
          client: 'qBittorrent',
          protocol: 'torrent',
          state: 'paused',
          progress: 0.2,
          size: 1e9,
        },
        {
          id: 'q3',
          name: 'Item 3',
          client: 'SABnzbd',
          protocol: 'usenet',
          state: 'failed',
          progress: 0.1,
          size: 1e9,
        },
      ];

      render(
        <DownloadQueue
          items={items}
          onPause={onPause}
          onResume={onResume}
          onRetry={onRetry}
          onRemove={onRemove}
        />
      );

      // Pause q1
      const pauseBtn = screen.getByLabelText(/Pause Item 1/i);
      fireEvent.click(pauseBtn);
      expect(onPause).toHaveBeenCalledWith(items[0]);

      // Resume q2
      const resumeBtn = screen.getByLabelText(/Resume Item 2/i);
      fireEvent.click(resumeBtn);
      expect(onResume).toHaveBeenCalledWith(items[1]);

      // Retry q3
      const retryBtn = screen.getByLabelText(/Retry Item 3/i);
      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalledWith(items[2]);

      // Remove q1
      const removeBtn = screen.getByLabelText(/Remove Item 1/i);
      fireEvent.click(removeBtn);
      expect(onRemove).toHaveBeenCalledWith(items[0]);
    });

    it('IndexerHealth calls onTest and onOpen', () => {
      const onTest = vi.fn();
      const onOpen = vi.fn();

      const services: Service[] = [
        {
          id: 's1',
          name: 'NZB Planet',
          kind: 'indexer',
          status: 'ok',
        },
      ];

      render(
        <IndexerHealth
          services={services}
          onTest={onTest}
          onOpen={onOpen}
        />
      );

      const testBtn = screen.getByRole('button', { name: /^Test$/i });
      fireEvent.click(testBtn);
      expect(onTest).toHaveBeenCalledWith(services[0]);

      const openBtn = screen.getByRole('button', { name: /NZB Planet/i });
      fireEvent.click(openBtn);
      expect(onOpen).toHaveBeenCalledWith(services[0]);
    });

    it('ActiveSessions calls onStop, onMessage, onOpen', () => {
      const onStop = vi.fn();
      const onMessage = vi.fn();
      const onOpen = vi.fn();

      const sessions: Session[] = [
        {
          id: 'se1',
          user: USERS[0]!,
          client: 'Jellyfin Web',
          device: 'Desktop',
          item: TOS,
          position: 100,
          duration: 700,
          method: 'DirectPlay',
          bitrate: 10e6,
        },
      ];

      render(
        <ActiveSessions
          sessions={sessions}
          onStop={onStop}
          onMessage={onMessage}
          onOpen={onOpen}
        />
      );

      const titleBtn = screen.getByRole('button', { name: /Tears of Steel/i });
      fireEvent.click(titleBtn);
      expect(onOpen).toHaveBeenCalledWith(sessions[0]);

      const msgBtn = screen.getByLabelText(/Message Gene/i);
      fireEvent.click(msgBtn);
      expect(onMessage).toHaveBeenCalledWith(sessions[0]);

      const stopBtn = screen.getByLabelText(/Stop Gene's stream/i);
      fireEvent.click(stopBtn);
      expect(onStop).toHaveBeenCalledWith(sessions[0]);
    });
  });
});
