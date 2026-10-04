import { FormField } from '../../src/components/FormField';

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
    <FormField id="workspace-name" label="Workspace name" hint="Shown to everyone you invite.">
      <input id="workspace-name" data-field="" defaultValue="Support Ops" />
    </FormField>
    <FormField
      id="homeserver"
      label="Homeserver"
      probe="ok"
      hint={<>Connecting to <span data-num="">matrix.example.com</span></>}
    >
      <input id="homeserver" data-field="" defaultValue="example.com" />
    </FormField>
    <FormField
      id="homeserver-bad"
      label="Homeserver"
      probe="fail"
      invalid
      hint="Your Matrix server address."
    >
      <input id="homeserver-bad" data-field="" defaultValue="exmaple.co" aria-invalid="true" aria-describedby="homeserver-bad-error" />
      <div id="homeserver-bad-error" data-error="" role="alert">
        Couldn't reach <span data-num="">exmaple.co</span> — check the address.
      </div>
    </FormField>
  </div>
);
