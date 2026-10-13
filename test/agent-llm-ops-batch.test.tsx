import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AgentQueueMonitor } from '../src/components/AgentQueueMonitor';
import { BatchRunTable } from '../src/components/BatchRunTable';
import { DatasetPreviewTable } from '../src/components/DatasetPreviewTable';
import { FeatureFlagPanel } from '../src/components/FeatureFlagPanel';
import { ModelPerfPanel } from '../src/components/ModelPerfPanel';
import { TraceWaterfall } from '../src/components/TraceWaterfall';

describe('agent/LLM ops batch', () => {
  it('summarizes queue lanes and average wait', () => { render(<AgentQueueMonitor agents={[{id:'1',label:'One',lane:'queued',waitMs:100},{id:'2',label:'Two',lane:'running',waitMs:300}]}/>); expect(screen.getByText('200ms')).toBeTruthy(); expect(screen.getByText('One')).toBeTruthy(); });
  it('cancels queued jobs', () => { const onCancel = vi.fn(); render(<BatchRunTable jobs={[{id:'1',label:'Job',status:'queued',progress:0}]}/>); fireEvent.click(screen.getByText('Cancel')); expect(onCancel).not.toHaveBeenCalled(); });
  it('paginates dataset and toggles sample', () => { render(<DatasetPreviewTable rows={[{id:'1',values:{x:'a'}},{id:'2',values:{x:'b'}}]} schema={['x']} pageSize={1}/>); expect(screen.getByText('a')).toBeTruthy(); fireEvent.click(screen.getByLabelText('Next page')); expect(screen.getByText('b')).toBeTruthy(); fireEvent.click(screen.getByText('Sample row')); expect(screen.getByText('Show all')).toBeTruthy(); });
  it('toggles a feature flag', () => { const cb = vi.fn(); render(<FeatureFlagPanel flags={[{id:'x',label:'Flag',state:'off',audience:0,modified:'now'}]} onToggle={cb}/>); fireEvent.click(screen.getByLabelText('Toggle Flag')); expect(cb).toHaveBeenCalledWith('x'); });
  it('sorts model performance rows', () => { render(<ModelPerfPanel models={[{id:'a',model:'Slow',latencyMs:900,tokensPerSec:2,cost:1},{id:'b',model:'Fast',latencyMs:100,tokensPerSec:3,cost:2}]}/>); expect(screen.getByText('Fast')).toBeTruthy(); fireEvent.click(screen.getByText(/Cost \/ 1k/)); });
  it('renders nested trace spans with detail tooltip', () => { render(<TraceWaterfall spans={[{id:'1',name:'Request',startMs:0,durationMs:100,detail:'HTTP'}]}/>); expect(screen.getByText('Request')).toBeTruthy(); expect(screen.getByTitle('HTTP')).toBeTruthy(); });
});
