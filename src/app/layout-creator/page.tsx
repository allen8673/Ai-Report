import Drawer from "@/components/drawer";
import TitlePane from "@/components/panes/title";

export default function Page() {
    return <div className="page-std">
        <TitlePane title='Layout Creator' />
        <Drawer></Drawer>
    </div>
}