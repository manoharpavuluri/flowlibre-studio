import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Settings, Database, FileText, Search, Target, Move, Copy, Save, ArrowRight, Link } from 'lucide-react';
import type { Agent } from '../../components/shared/types';

interface FileWorkflowDesignAgentProps {
  agent: Agent;
  onBackToDashboard: () => void;
}

interface Component {
  id: string;
  type: 'source' | 'destination' | 'parser' | 'matcher' | 'mapper';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  x: number;
  y: number;
  connections: string[];
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

const FileWorkflowDesignAgent: React.FC<FileWorkflowDesignAgentProps> = ({ 
  agent, 
  onBackToDashboard 
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sidebarComponents = [
    {
      type: 'source' as const,
      name: 'Source',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Data source component'
    },
    {
      type: 'destination' as const,
      name: 'Destination',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Output destination'
    },
    {
      type: 'parser' as const,
      name: 'Parser',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Data parsing component'
    },
    {
      type: 'matcher' as const,
      name: 'Matcher',
      icon: Search,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Data matching component'
    },
    {
      type: 'mapper' as const,
      name: 'Mapper',
      icon: Copy,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Data transformation component'
    }
  ];

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    const component = sidebarComponents.find(c => c.type === componentType);
    if (component) {
      setDraggedComponent({
        id: `temp-${Date.now()}`,
        type: component.type,
        name: component.name,
        icon: component.icon,
        color: component.color,
        bgColor: component.bgColor,
        x: 0,
        y: 0,
        connections: []
      });
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newComponent: Component = {
        ...draggedComponent,
        id: `${draggedComponent.type}-${Date.now()}`,
        x,
        y
      };

      setComponents(prev => [...prev, newComponent]);
      setDraggedComponent(null);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleComponentDragStart = (e: React.DragEvent, componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleComponentDrag = (e: React.DragEvent, componentId: string) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setComponents(prev => prev.map(comp => 
        comp.id === componentId ? { ...comp, x, y } : comp
      ));
    }
  };

  const handleComponentClick = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleDeleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== componentId && conn.to !== componentId
    ));
    setSelectedComponent(null);
  };

  const handleStartConnection = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const component = components.find(c => c.id === componentId);
    if (!component) return;
    
    console.log('Starting connection from:', componentId, component);
    setIsConnecting(true);
    setConnectionStart(componentId);
    
    // Calculate start position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = component.x + 140 - 20; // Right edge minus padding
      const y = component.y + 40; // Middle of component
      setStartPosition({ x, y });
      setMousePosition({ x, y });
    }
  };



  const handleComponentDrop = (componentId: string) => {
    if (isConnecting && connectionStart && connectionStart !== componentId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connectionStart,
        to: componentId,
        fromPort: 'output',
        toPort: 'input'
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setMousePosition(null);
    setStartPosition(null);
  };

  const handleSaveWorkflow = () => {
    // TODO: Implement save functionality
    console.log('Saving workflow:', { components, connections });
  };

  // Handle mouse up to reset connection state
  const handleMouseUp = () => {
    if (isConnecting) {
      console.log('Mouse up, resetting connection state');
      setIsConnecting(false);
      setConnectionStart(null);
      setMousePosition(null);
      setStartPosition(null);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <agent.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Design Agent</h1>
                  <p className="text-sm text-gray-500">{agent.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveWorkflow}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Workflow</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Components</h3>
          <div className="space-y-2">
            {sidebarComponents.map((component) => (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component.type)}
                className="group relative p-3 border border-gray-200 rounded-lg cursor-move hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${component.bgColor} group-hover:scale-110 transition-transform`}>
                    <component.icon className={`w-4 h-4 ${component.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{component.name}</p>
                    <p className="text-xs text-gray-500">{component.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connection Status */}
          {isConnecting && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  🔗 Dragging connection... Drop on target component
                </span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Connect Components</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-100 rounded">
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </div>
                <span>1. <strong>Click and drag</strong> the <strong>arrow icon</strong> (right side - output)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gray-100 rounded">
                  <Link className="w-3 h-3 text-gray-600" />
                </div>
                <span>2. <strong>Drag to</strong> the <strong>link icon</strong> (left side - input) of another component</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-green-100 rounded">
                  <ArrowRight className="w-3 h-3 text-green-600" />
                </div>
                <span>3. <strong>Release</strong> to create the connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className={`w-full h-full bg-gray-100 relative ${
              isConnecting ? 'cursor-crosshair' : ''
            }`}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseUp={handleMouseUp}
            onMouseMove={(e) => {
              if (isConnecting && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setMousePosition({ x, y });
              }
            }}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Components */}
            {components.map((component) => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleComponentDragStart(e, component.id)}
                onDrag={(e) => handleComponentDrag(e, component.id)}
                onClick={() => handleComponentClick(component.id)}
                className={`absolute transition-all duration-200 ${
                  selectedComponent === component.id
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:ring-1 hover:ring-gray-300'
                } ${isConnecting && connectionStart === component.id ? 'ring-2 ring-green-500' : ''}`}
                style={{
                  left: component.x,
                  top: component.y,
                  minWidth: '140px'
                }}
              >
                {/* Component Body */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-md ${component.bgColor}`}>
                        <component.icon className={`w-4 h-4 ${component.color}`} />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{component.name}</span>
                    </div>
                    {selectedComponent === component.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComponent(component.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <div className="text-xs text-gray-500 mb-2">Component ID: {component.id}</div>
                    
                    {/* Connection Points */}
                    <div className="flex items-center justify-between">
                      <div
                        onMouseEnter={() => {
                          if (isConnecting && connectionStart !== component.id) {
                            handleComponentDrop(component.id);
                          }
                        }}
                        className={`p-1.5 rounded-md transition-all duration-200 ${
                          isConnecting && connectionStart !== component.id
                            ? 'bg-green-100 text-green-600 scale-110 ring-2 ring-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="🎯 Drop connection here"
                      >
                        <Link className="w-3 h-3" />
                      </div>
                      <div className="text-xs text-gray-400">→</div>
                      <button
                        onMouseDown={(e) => handleStartConnection(e, component.id)}
                        className={`p-1.5 rounded-md transition-all duration-200 cursor-crosshair ${
                          isConnecting && connectionStart === component.id
                            ? 'bg-green-100 text-green-600 scale-110 ring-2 ring-green-300'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
                        }`}
                        title="🔗 Click and drag from here to connect"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Connection Line */}
            {isConnecting && startPosition && mousePosition && (
              <svg
                className="absolute pointer-events-none"
                style={{ zIndex: 20, width: '100%', height: '100%', top: 0, left: 0 }}
              >
                <defs>
                  <marker
                    id="connection-arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#059669" />
                  </marker>
                </defs>
                <path
                  d={`M ${startPosition.x} ${startPosition.y} L ${mousePosition.x} ${mousePosition.y}`}
                  stroke="#059669"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  markerEnd="url(#connection-arrowhead)"
                />
              </svg>
            )}

            {/* Connection Status Indicator */}
            {isConnecting && (
              <div className="absolute top-4 left-4 bg-green-100 border border-green-300 rounded-lg px-3 py-2 z-30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    🔗 Dragging connection... Drop on target component
                  </span>
                </div>
              </div>
            )}

            {/* Connections */}
            {connections.map((connection) => {
              const fromComponent = components.find(c => c.id === connection.from);
              const toComponent = components.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;
              
              const fromX = fromComponent.x + 140 - 20; // Right edge of component minus padding
              const fromY = fromComponent.y + 40; // Middle of component
              const toX = toComponent.x + 20; // Left edge of component plus padding
              const toY = toComponent.y + 40; // Middle of component
              
              return (
                <svg
                  key={connection.id}
                  className="absolute pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${connection.id}`}
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <path
                    d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${fromY} ${toX} ${toY}`}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    markerEnd={`url(#arrowhead-${connection.id})`}
                  />
                </svg>
              );
            })}
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Move className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileWorkflowDesignAgent; 