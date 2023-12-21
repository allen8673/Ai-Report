import LayoutDrawer from "@/components/layout-drawer";
import TitlePane from "@/components/panes/title";

export default function Page() {
    return <div className="page-std">
        <TitlePane title='Layout Creator' />
        <LayoutDrawer />
    </div>
}