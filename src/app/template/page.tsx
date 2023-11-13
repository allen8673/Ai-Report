import TemplateList from "@/containers/template-list";
import { mock_template } from "@/mock-data/mock";

export default function Page() {
    return (
        <TemplateList templates={mock_template} />
    );
}
