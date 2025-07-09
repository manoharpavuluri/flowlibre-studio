import React from 'react';
import { Copy, Link, ArrowRight, Trash2 } from 'lucide-react';

interface NodePort {
  id: string;
  type: 'input' | 'output';
  name: string;
}

interface DataMapperNodeProps {
  id: string;
  ports: NodePort[];
  portRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | HTMLButtonElement | null }>;
  onPortMouseEnter: (portId: string) => void;
  onPortMouseLeave: () => void;
  onPortMouseUp: (portId: string) => void;
  onPortClick: (portId: string) => void;
  onPortMouseDown: (portId: string, e: React.MouseEvent) => void;
  canDelete: boolean;
  onDelete: () => void;
  x: number;
  y: number;
}

const DataMapperNode: React.FC<DataMapperNodeProps> = ({
  id,
  ports,
  portRefs,
  onPortMouseEnter,
  onPortMouseLeave,
  onPortMouseUp,
  onPortClick,
  onPortMouseDown,
  canDelete,
  onDelete,
  x,
  y,
}) => (
  <div
    style={{
      left: x,
      top: y,
      minWidth: 80,
      minHeight: 80,
      width: 88,
      height: 88,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      zIndex: 1,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    }}
  >
    {/* Trash icon at top right */}
    {canDelete && (
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-all duration-200"
        style={{ zIndex: 10 }}
        title="Delete node"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
    {/* Main node icon centered */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Copy className="w-7 h-7" />
    </div>
    {/* Input port (chain link) at bottom left */}
    {ports.filter(p => p.type === 'input').map((port) => (
      <div
        key={port.id}
        ref={el => { portRefs.current[`${id}-${port.id}`] = el; }}
        onMouseEnter={() => onPortMouseEnter(port.id)}
        onMouseLeave={onPortMouseLeave}
        onMouseUp={() => onPortMouseUp(port.id)}
        onClick={() => onPortClick(port.id)}
        className="absolute left-2 bottom-2 p-1 rounded-md transition-all duration-200 cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
        style={{ minWidth: 22, minHeight: 22 }}
        title={`Input: ${port.name}`}
      >
        <Link className="w-4 h-4" />
      </div>
    ))}
    {/* Output port (arrow) at bottom right */}
    {ports.filter(p => p.type === 'output').map((port) => (
      <button
        key={port.id}
        ref={el => { portRefs.current[`${id}-${port.id}`] = el; }}
        onMouseDown={e => onPortMouseDown(port.id, e)}
        className="absolute right-2 bottom-2 p-1 rounded-md transition-all duration-200 cursor-crosshair bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105"
        style={{ minWidth: 22, minHeight: 22 }}
        title={`Output: ${port.name}`}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    ))}
  </div>
);

export default DataMapperNode; 