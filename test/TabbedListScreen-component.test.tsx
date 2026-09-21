import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabbedListScreen } from '../src/components/TabbedListScreen';

describe('TabbedListScreen', () => {
  it('renders tabs and aria-selected correctly', () => {
    const { getByRole, getAllByRole } = render(
      <TabbedListScreen
        tabs={[
          { id: '1', label: 'Tab 1' },
          { id: '2', label: 'Tab 2', count: 5 }
        ]}
        activeTab="1"
        onTabChange={() => {}}
        tablistLabel="My Tabs"
      >
        Content
      </TabbedListScreen>
    );

    const tablist = getByRole('tablist');
    expect(tablist.getAttribute('aria-label')).toBe('My Tabs');

    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');

    // Check count rendering
    expect(tabs[1].textContent).toContain('5');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn();
    const { getAllByRole } = render(
      <TabbedListScreen
        tabs={[
          { id: '1', label: 'Tab 1' },
          { id: '2', label: 'Tab 2' }
        ]}
        activeTab="1"
        onTabChange={onTabChange}
        tablistLabel="Tabs"
      >
        Content
      </TabbedListScreen>
    );

    const tabs = getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(onTabChange).toHaveBeenCalledWith('2');
  });

  it('supports arrow key navigation', () => {
    const onTabChange = vi.fn();
    const { getAllByRole } = render(
      <TabbedListScreen
        tabs={[
          { id: '1', label: 'Tab 1' },
          { id: '2', label: 'Tab 2' },
          { id: '3', label: 'Tab 3' }
        ]}
        activeTab="2"
        onTabChange={onTabChange}
        tablistLabel="Tabs"
      >
        Content
      </TabbedListScreen>
    );

    const tabs = getAllByRole('tab');
    
    // Test Right Arrow
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith('3');

    // Test Left Arrow
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith('1');

    // Test Right Arrow Loop
    fireEvent.keyDown(tabs[2], { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith('1');

    // Test Left Arrow Loop
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith('3');
  });

  it('renders search and toolbarEnd when provided', () => {
    const onSearchChange = vi.fn();
    const { getByPlaceholderText, getByText } = render(
      <TabbedListScreen
        tabs={[{ id: '1', label: 'Tab 1' }]}
        activeTab="1"
        onTabChange={() => {}}
        tablistLabel="Tabs"
        search={{
          value: '',
          onChange: onSearchChange,
          placeholder: 'Search here',
          ariaLabel: 'Search'
        }}
        toolbarEnd={<button>Action</button>}
      >
        Content
      </TabbedListScreen>
    );

    const input = getByPlaceholderText('Search here');
    expect(input).toBeTruthy();
    
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onSearchChange).toHaveBeenCalledWith('test');

    const btn = getByText('Action');
    expect(btn).toBeTruthy();
  });

  it('renders empty-panel structure when tabs is empty', () => {
    const { queryByRole, getByText } = render(
      <TabbedListScreen
        tabs={[]}
        activeTab="none"
        onTabChange={() => {}}
        tablistLabel="Tabs"
      >
        Empty State
      </TabbedListScreen>
    );

    // Tablist shouldn't be rendered if there are no tabs
    expect(queryByRole('tablist')).toBeNull();

    // Content should still be rendered
    const content = getByText('Empty State');
    expect(content).toBeTruthy();
    
    // Tabpanel role should still be there by default
    expect(content.closest('[role="tabpanel"]')).toBeTruthy();
  });
});
