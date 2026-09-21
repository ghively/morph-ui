import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedMediaTabs } from '../src/components/AnimatedMediaTabs';

describe('AnimatedMediaTabs', () => {
  const mockItems = [
    {
      id: 'tab1',
      tabLabel: 'Tab 1',
      imageUrl: 'image1.jpg',
      title: 'Title 1',
      description: 'Desc 1'
    },
    {
      id: 'tab2',
      tabLabel: 'Tab 2',
      imageUrl: 'image2.jpg',
      title: 'Title 2',
      description: 'Desc 2'
    }
  ];

  it('renders tabs and cards correctly', () => {
    const { getByRole, getAllByRole } = render(<AnimatedMediaTabs items={mockItems} />);
    
    expect(getByRole('tablist')).toBeTruthy();
    
    const tabs = getAllByRole('tab');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toBe('Tab 1');
    expect(tabs[1].textContent).toBe('Tab 2');

    const panels = getAllByRole('tabpanel');
    expect(panels.length).toBe(2);
    
    // Default selection is first tab
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('changes selected tab on click', () => {
    const { getAllByRole } = render(<AnimatedMediaTabs items={mockItems} />);
    const tabs = getAllByRole('tab');
    
    fireEvent.click(tabs[1]);
    
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('respects defaultSelectedId', () => {
    const { getAllByRole } = render(<AnimatedMediaTabs items={mockItems} defaultSelectedId="tab2" />);
    const tabs = getAllByRole('tab');
    
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });
});
