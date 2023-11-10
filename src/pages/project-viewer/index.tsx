import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export default function ProjectViewer() {
    return <div className="flex h-full flex-col gap-std items-stretch text-std-light">
        <div className="rounded-std std-title-pane">
            Project List
            <div className="act-pane">
                <Button icon={<FontAwesomeIcon icon={faAdd} />}
                    severity="success"
                    tooltip="Save as template"
                    tooltipOptions={{ position: 'left' }} />
            </div>
        </div>

        <DataTable value={[]} selectionMode="single" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
            <Column field="code" header="Code" />
            <Column field="name" header="Name" />
            <Column field="category" header="Category" />
            <Column field="quantity" header="Quantity" />
        </DataTable>


    </div>
}