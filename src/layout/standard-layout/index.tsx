import HelloComp from "@/components/helloComp"

export default function StandarLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="standar-layout">
        <HelloComp />
        {children}
    </div>
}