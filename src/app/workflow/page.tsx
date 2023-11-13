import WorkflowList from "@/containers/flow-list";
import { mock_projects } from "@/mock-data/mock";

export default function Page() {
    return (
        <WorkflowList workflows={mock_projects} />
    );
}
