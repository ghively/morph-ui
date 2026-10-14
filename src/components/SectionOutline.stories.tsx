import { SectionOutline } from './SectionOutline';

const sections = [
  { id: 's1', title: 'Overview', level: 0 },
  { id: 's2', title: 'Positioning', level: 0 },
  { id: 's3', title: 'Audience', level: 1 },
  { id: 's4', title: 'Competitors', level: 1 },
  { id: 's5', title: 'Risks', level: 0 },
  { id: 's6', title: 'Appendix: retention study', level: 0 },
];

export default { title: 'SectionOutline', component: SectionOutline };

export const Default = () => (
  <div style={{ width: 260 }}>
    <SectionOutline sections={sections} activeId="s3" />
  </div>
);

export const Collapsed = () => (
  <div style={{ width: 260 }}>
    <SectionOutline sections={sections} defaultCollapsed />
  </div>
);
