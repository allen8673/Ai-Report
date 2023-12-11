import WorkflowLayout from "@/layout/workflow-layout";



export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WorkflowLayout>
            {children}
        </WorkflowLayout>
    );
}
