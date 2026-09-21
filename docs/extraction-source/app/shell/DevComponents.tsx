import React from 'react';
import { AgentPresence } from '../../components/AgentPresence';
import { AgentActivityCapsule } from '../../components/AgentActivityCapsule';
import { MultimodalComposer } from '../../components/MultimodalComposer';
import { GenerativePlaceholder } from '../../components/GenerativePlaceholder';
import { ContextSwitcher } from '../../components/ContextSwitcher';

export function DevComponents() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Reference Lab</h1>
      <p>Component dev environment</p>
      
      <section>
        <h2>AgentPresence</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AgentPresence size="xs" state="idle" />
          <AgentPresence size="sm" state="listening" />
          <AgentPresence size="md" state="thinking" />
          <AgentPresence size="hero" state="speaking" />
        </div>
      </section>

      <section>
        <h2>AgentActivityCapsule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AgentActivityCapsule state="collapsed" agent="Claude" activity="Researching" count={3} />
          <AgentActivityCapsule state="expanded" agent="Gregory" activity="Editing 4 files" />
        </div>
      </section>

      <section>
        <h2>GenerativePlaceholder</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <GenerativePlaceholder variant="text" />
          <GenerativePlaceholder variant="card" />
        </div>
      </section>

      <section>
        <h2>ContextSwitcher</h2>
        <ContextSwitcher current="GPT-4" options={['GPT-4', 'Claude 3', 'Local Model']} />
      </section>

      <section style={{ maxWidth: '600px' }}>
        <h2>MultimodalComposer</h2>
        <MultimodalComposer />
      </section>
    </div>
  );
}
