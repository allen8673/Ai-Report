import { Node, Edge } from "reactflow";

import Grapth from "@/components/graph";

export default function Home() {

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 400, y: 100 },
    },
    {
      id: '4',
      data: { label: 'Node 4' },
      position: { x: 400, y: 200 },
      type: 'custom',
    },
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <Grapth className="w-full" initialNodes={initialNodes} initialEdges={initialEdges} />
    </main>
  );
}
