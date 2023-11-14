import TemplateOverview from "@/containers/template-overview";
import { mock_template } from "@/mock-data/mock";

export default function Page() {
    return (
        <TemplateOverview templates={mock_template} />
    );
}
