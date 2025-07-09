import React from 'react';
import { Folder, ArrowRight, Trash2 } from 'lucide-react';

interface NodePort {
  id: string;
  type: 'input' | 'output';
  name: string;
}

interface LocalFolderSourceNodeProps {
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
  onNodeMouseDown?: (e: React.MouseEvent) => void;
}

const LocalFolderSourceNode: React.FC<LocalFolderSourceNodeProps> = ({
  id,
  ports,
  portRefs,
  onPortMouseEnter,
  onPortMouseLeave,
  onPortMouseUp,
  onPortClick,
  onPortMouseDown,
  x,
  y,
  canDelete,
  onDelete,
  onNodeMouseDown,
}) => {
  const hasContent = false; // No label or extra content, only ports
  const hasPorts = ports && ports.length > 0;
  if (!hasContent && !hasPorts) return null;

  return (
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
        pointerEvents: 'auto',
        cursor: 'grab',
      }}
      onMouseDown={e => {
        if ((e.target as HTMLElement).closest('.node-port, .node-trash')) return;
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (onNodeMouseDown) onNodeMouseDown(e);
      }}
    >
      {canDelete && (
        <button
          className="absolute top-1 right-1 p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-all duration-200 node-trash"
          style={{ zIndex: 10, pointerEvents: 'auto' }}
          title="Delete node"
          onMouseDown={e => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ pointerEvents: 'none' }}>
        <Folder className="w-7 h-7" />
      </div>
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

export default LocalFolderSourceNode; 