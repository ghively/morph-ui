import { FormField } from './FormField';

export default {
  title: 'FormField',
  component: FormField,
};

export const Default = () => (
  <FormField id="demo" label="Demo Field">
    <input id="demo" />
  </FormField>
);
