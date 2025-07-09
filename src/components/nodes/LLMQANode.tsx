import React from 'react';
import { Bot, Trash2, Link, ArrowRight } from 'lucide-react';

interface NodePort {
  id: string;
  type: 'input' | 'output';
  name: string;
}

interface LLMQANodeProps {
  id: string;
  ports: NodePort[];
  portRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | HTMLButtonElement | null }>;
  onPortMouseEnter: (portId: string) => void;
  onPortMouseLeave: () => void;
  onPortMouseUp: (portId: string) => void;
  onPortClick: (portId: string) => void;
  onPortMouseDown: (portId: string, e: React.MouseEvent) => void;
  x: number;
  y: number;
  canDelete: boolean;
  onDelete: () => void;
  onDoubleClick?: () => void;
  onNodeMouseDown?: (e: React.MouseEvent) => void;
}

const LLMQANode: React.FC<LLMQANodeProps> = ({ id, ports, portRefs, onPortMouseEnter, onPortMouseLeave, onPortMouseUp, onPortClick, onPortMouseDown, x, y, canDelete, onDelete, onDoubleClick, onNodeMouseDown }) => {
  const hasPorts = ports && ports.length > 0;
  if (!hasPorts) return null;

  return (
  <div
    style={{
      left: x,
      top: y,
      minWidth: 80,
      minHeight: 80,
      width: 88,
      height: 88,
      background: '#fdf4ff',
      border: '1px solid #c084fc',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      zIndex: 1,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      pointerEvents: 'auto',
      cursor: 'grab',
    }}
    onMouseDown={e => {
      if ((e.target as HTMLElement).closest('.node-port, .node-trash')) return;
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
      if (onNodeMouseDown) onNodeMouseDown(e);
    }}
    onDoubleClick={onDoubleClick}
  >
    {canDelete && (
      <button
        className="absolute top-1 right-1 p-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-500 hover:text-purple-700 transition-all duration-200 node-trash"
        style={{ zIndex: 10, pointerEvents: 'auto' }}
        title="Delete node"
        onMouseDown={e => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ pointerEvents: 'none' }}>
      <Bot className="w-7 h-7 text-purple-600" />
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
        className="absolute left-2 bottom-2 p-1 rounded-md transition-all duration-200 cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 node-port"
        style={{ minWidth: 22, minHeight: 22, pointerEvents: 'auto' }}
        title={`Input: ${port.name}`}
        onMouseDown={e => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
      >
        <Link className="w-4 h-4" />
      </div>
    ))}
    {/* Output port (arrow) at bottom right */}
    {ports.filter(p => p.type === 'output').map((port) => (
      <button
        key={port.id}
        ref={el => { portRefs.current[`${id}-${port.id}`] = el; }}
        onMouseDown={e => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); if (onPortMouseDown) onPortMouseDown(port.id, e); }}
        className="absolute right-2 bottom-2 p-1 rounded-md transition-all duration-200 cursor-crosshair bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 node-port"
        style={{ minWidth: 22, minHeight: 22, pointerEvents: 'auto' }}
        title={`Output: ${port.name}`}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    ))}
  </div>
  );
};

export default LLMQANode; 