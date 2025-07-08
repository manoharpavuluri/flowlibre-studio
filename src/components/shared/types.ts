export interface Agent {
    id: number;
    name: string;
    type: 'File Workflow' | 'Image Workflow' | 'Batch Workflow' | 'Design Agent';
    status: 'active' | 'inactive' | 'in-development' | 'error';
    description: string;
    icon: React.ComponentType<any>;
    lastModified: string;
  }
  
  export interface DateRange {
    start: string;
    end: string;
  }
  
  export type DateFilter = 'today' | 'last-7-days' | 'date-range';
  export type ViewType = 'home' | 'dashboard' | 'tile-detail';
  
  export interface DashboardProps {
    agent: Agent;
    onBack: () => void;
    onTileClick: (tileType: string) => void;
  }
  
  export interface TileDetailProps {
    tileType: string;
    agent: Agent;
    onBack: () => void;
  }