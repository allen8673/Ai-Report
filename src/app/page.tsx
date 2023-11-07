'use client'
import { Node, Edge } from "reactflow";

import DndList from "@/components/dnd-list";
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
    <main className="flex min-h-screen flex-row p-12 gap-4 items-stretch">
      <div className="w-60 ">
        <DndList items={[{ name: '1' }, { name: '2' }]} renderContent={(prop) => <div className=" bg-stone-400">{prop.name}</div>} />
      </div>
      <div className="shrink grow">
        <Grapth className="" initialNodes={initialNodes} initialEdges={initialEdges} />
      </div>
    </main>
  );
}
