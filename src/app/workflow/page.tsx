import FlowOverview from "@/containers/flow-overview";
import { mock_projects } from "@/mock-data/mock";

export default function Page() {
    return (
        <FlowOverview workflows={mock_projects} />
    );
}
