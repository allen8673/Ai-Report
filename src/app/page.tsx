import AatrixAnimationPanel from "@/components/matrix-animation-panel";

export default function Home() {
  return (
    <div className="flex-center w-full h-full text-light" >
      <h1 className={`
      position: absolute
      text-7xl
      text-turbo-deep-strong
      text-shadow-center
      shadow-turbo-deep
      `}>Welcome AI Report</h1>
      <AatrixAnimationPanel
        text="NATIONAL INSTITUTE FOR CYBER SECURITY "
        randomPermutaion={false} fontColor="#95679e" />
    </div>
  )
}
