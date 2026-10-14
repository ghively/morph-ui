import { render, screen } from '@testing-library/react'; import { describe,it,expect } from 'vitest'; import { TokenUsageChart } from '../src/components/TokenUsageChart';
describe('TokenUsageChart',()=>it('renders accessible chart',()=>{render(<TokenUsageChart points={[{label:'10:00',prompt:1,completion:2}]}/>);expect(screen.getByRole('img',{name:/stacked/i})).toBeTruthy();}));
