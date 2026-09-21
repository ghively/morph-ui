import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
};

export const Default = () => (
  <Breadcrumbs trail={[{ label: 'Corpora' }, { label: 'Support' }, { label: 'Ticket archive' }]} />
);

export const Collapsed = () => (
  <Breadcrumbs
    trail={[
      { label: 'Home' },
      { label: 'Corpora' },
      { label: 'Support' },
      { label: '2024' },
      { label: 'Q4' },
      { label: 'Ticket archive' },
    ]}
  />
);
