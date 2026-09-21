import { useState, type FormEvent } from "react";
import { EventType, Preset, Visibility } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { Sheet, SheetHead, Switch, useToast } from "../../components/primitives";
import { groupRooms } from "../../matrix/rooms";
import { AGENT_PROFILE_EVENT } from "../../agent/profile";

export function CreateRoomDialog({ spaceId: initialSpace, space, onClose }: { spaceId?: string | null; space?: boolean; onClose: () => void }) {
  const client = useClient();
  const shell = useShell();
  const toast = useToast();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [isSpace, setIsSpace] = useState(!!space);
  const [publicRoom, setPublicRoom] = useState(false);
  const [encrypted, setEncrypted] = useState(false);
  const [spaceId, setSpaceId] = useState<string>(initialSpace ?? "");
  const [invites, setInvites] = useState("");
  const [busy, setBusy] = useState(false);
  const spaces = groupRooms(client).spaces;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const invite = invites.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    const bad = invite.find((u) => !/^@[^:]+:.+$/.test(u));
    if (bad) return toast("Not a Matrix ID", bad, "danger");
    setBusy(true);
    try {
      const server = client.getDomain();
      const { room_id } = await client.createRoom({
        name: name.trim(),
        topic: topic.trim() || undefined,
        preset: publicRoom ? Preset.PublicChat : Preset.PrivateChat,
        visibility: publicRoom ? Visibility.Public : Visibility.Private,
        invite,
        creation_content: isSpace ? { type: "m.space" } : undefined,
        // Agents publish their own presentation metadata into rooms they join (spec §12).
        power_level_content_override: { events: { [AGENT_PROFILE_EVENT]: 0 } },
        initial_state: [
          ...(encrypted && !isSpace ? [{ type: EventType.RoomEncryption, state_key: "", content: { algorithm: "m.megolm.v1.aes-sha2" } }] : []),
          ...(spaceId && server ? [{ type: EventType.SpaceParent, state_key: spaceId, content: { via: [server], canonical: true } }] : []),
        ],
      });
      if (spaceId && server) await client.sendStateEvent(spaceId, EventType.SpaceChild, { via: [server] }, room_id);
      toast(isSpace ? "Space created" : "Room created", name);
      onClose();
      if (!isSpace) shell.openRoom(room_id);
    } catch (err) {
      toast("Couldn't create", (err as Error).message, "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet label={isSpace ? "New space" : "New room"} onClose={onClose} width={520}>
      <SheetHead title={isSpace ? "New space" : "New room"} onClose={onClose} />
      <form onSubmit={submit} style={{ padding: "0 var(--s6) var(--s6)", display: "flex", flexDirection: "column", gap: "var(--s4)", overflow: "auto" }}>
        <div data-formfield="">
          <label htmlFor="cr-name">Name</label>
          <input id="cr-name" data-field="" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} placeholder={isSpace ? "AI Team" : "agents"} />
        </div>
        <div data-formfield="">
          <label htmlFor="cr-topic">Topic</label>
          <input id="cr-topic" data-field="" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={300} />
        </div>
        <div data-setrow="">
          <div>
            <h4>Space</h4>
            <p>A space groups rooms in the dock</p>
          </div>
          <Switch on={isSpace} onChange={setIsSpace} label="Create a space instead of a room" />
        </div>
        {!isSpace && spaces.length ? (
          <div data-formfield="">
            <label htmlFor="cr-space">Add to space</label>
            <select id="cr-space" data-field="" value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
              <option value="">No space</option>
              {spaces.map((s) => (
                <option key={s.roomId} value={s.roomId}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div data-setrow="">
          <div>
            <h4>Public</h4>
            <p>Anyone on the server can find and join</p>
          </div>
          <Switch on={publicRoom} onChange={setPublicRoom} label="Public room" />
        </div>
        {!isSpace ? (
          <div data-setrow="">
            <div>
              <h4>End-to-end encryption</h4>
              <p>{encrypted ? "Gateway agents will not be able to read this room." : "Off, so Agent Gateway agents can take part."}</p>
            </div>
            <Switch on={encrypted} onChange={setEncrypted} label="End-to-end encryption" />
          </div>
        ) : null}
        <div data-formfield="">
          <label htmlFor="cr-invite">Invite</label>
          <input id="cr-invite" data-field="" value={invites} onChange={(e) => setInvites(e.target.value)} placeholder="@agent_music:example.org, @gregory:example.org" />
        </div>
        <button type="submit" data-btn="fill" data-state="" data-busy={String(busy)} disabled={busy || !name.trim()} style={{ position: "relative" }}>
          Create
          <i data-spin="" aria-hidden="true" />
        </button>
      </form>
    </Sheet>
  );
}
