import { PageHeader } from './PageHeader'; import { Button } from './Button'; export default {title:'PageHeader'};
export const Default=()=> <PageHeader title="Workspace" breadcrumbs={<span>Home / Workspace</span>} actions={<Button>New project</Button>}/>; export const WithTabs=()=> <PageHeader title="Analytics" tabs={<span>Overview&nbsp;&nbsp; Trends&nbsp;&nbsp; Reports</span>}/>;
