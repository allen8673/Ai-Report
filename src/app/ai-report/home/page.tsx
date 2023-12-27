import MatrixAnimationPanel from "@/components/panes/matrix-animation";

export default function Home() {
    return (
        <div className="flex-center w-full h-full text-light" >
            <h1 className={`
        position: absolute
        text-7xl
        text-turbo-deep-strong
        text-shadow-center
        shadow-turbo-deep
        `}>Welcome to AI Report</h1>
            <MatrixAnimationPanel
                text="NATIONAL INSTITUTE FOR CYBER SECURITY "
                randomPermutaion={false} fontColor="#95679e" />
        </div>
    )
}
