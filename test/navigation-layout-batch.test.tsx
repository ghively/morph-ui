import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MegaMenu } from '../src/components/MegaMenu';
import { TabBar } from '../src/components/TabBar';
import { CommandBar } from '../src/components/CommandBar';
import { Omnibar } from '../src/components/Omnibar';
import { KeyKbd } from '../src/components/KeyKbd';
import { PanelGrid } from '../src/components/PanelGrid';

describe('navigation/layout batch', () => {
  it('opens MegaMenu and exposes menu semantics', () => { const { getByRole } = render(<MegaMenu label="Explore" sections={[{id:'one',label:'One',links:[{id:'a',label:'Alpha'}]}]} />); const trigger=getByRole('button'); expect(trigger.getAttribute('aria-expanded')).toBe('false'); fireEvent.click(trigger); expect(getByRole('menu')).toBeTruthy(); expect(trigger.getAttribute('aria-expanded')).toBe('true'); });
  it('supports TabBar selection and roving arrows', () => { const change=vi.fn(); const {getAllByRole}=render(<TabBar tabs={[{id:'a',label:'A'},{id:'b',label:'B'}]} activeId="a" onTabChange={change}/>); fireEvent.keyDown(getAllByRole('tab')[0]!,{key:'ArrowRight'}); expect(change).toHaveBeenCalledWith('b'); });
  it('submits CommandBar and renders keyboard hints', () => { const submit=vi.fn(); const {getByRole,getByText}=render(<CommandBar onSubmit={submit} actions={[{id:'run',label:'Run',shortcut:'⌘↵',onSelect:()=>{}}]}/>); fireEvent.change(getByRole('textbox'),{target:{value:'build'}}); fireEvent.keyDown(getByRole('textbox'),{key:'Enter'}); expect(submit).toHaveBeenCalledWith('build'); expect(getByText('⌘↵')).toBeTruthy(); });
  it('reveals Omnibar suggestions on focus', () => { const {getByRole}=render(<Omnibar suggestions={[{id:'doc',label:'Docs'}]}/>); fireEvent.focus(getByRole('combobox')); expect(getByRole('listbox')).toBeTruthy(); });
  it('renders KeyKbd combos and PanelGrid spans', () => { const {container}=render(<><KeyKbd keys={['⌘','K']}/><PanelGrid items={[{id:'a',content:'A',span:2}]}/></>); expect(container.querySelectorAll('kbd')).toHaveLength(2); expect(container.querySelector('[data-span="2"]')).toBeTruthy(); });
});
