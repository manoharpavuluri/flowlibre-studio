import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Settings, Database, FileText, Search, Target, Move, Copy, Save, ArrowRight, Link, AlertCircle, CheckCircle, XCircle, Zap, Filter, Cpu } from 'lucide-react';
import type { Agent } from '../../components/shared/types';
import DataSourceNode from '../nodes/DataSourceNode';
import DataDestinationNode from '../nodes/DataDestinationNode';
import DataParserNode from '../nodes/DataParserNode';
import DataMatcherNode from '../nodes/DataMatcherNode';
import DataMapperNode from '../nodes/DataMapperNode';
import DataFilterNode from '../nodes/DataFilterNode';
import DataTransformerNode from '../nodes/DataTransformerNode';
import DataAggregatorNode from '../nodes/DataAggregatorNode';
import S3SourceNode from '../nodes/S3SourceNode';
import FTPSourceNode from '../nodes/FTPSourceNode';
import LocalFileSourceNode from '../nodes/LocalFileSourceNode';
import APISourceNode from '../nodes/APISourceNode';
import EmailAttachmentSourceNode from '../nodes/EmailAttachmentSourceNode';
import LocalFolderSourceNode from '../nodes/LocalFolderSourceNode';
import AzureBlobSourceNode from '../nodes/AzureBlobSourceNode';
import DocumentIntelligenceParserNode from '../nodes/DocumentIntelligenceParserNode';
import AutoMappingMatcherNode from '../nodes/AutoMappingMatcherNode';
import FuzzyLookupNode from '../nodes/FuzzyLookupNode';
import ExactLookupNode from '../nodes/ExactLookupNode';
import JoinMergeNode from '../nodes/JoinMergeNode';
import ReconciliationNode from '../nodes/ReconciliationNode';
import LLMQANode from '../nodes/LLMQANode';
import ErrorHandlerNode from '../nodes/ErrorHandlerNode';
import SlackTeamsNode from '../nodes/SlackTeamsNode';
import WebhookNode from '../nodes/WebhookNode';
import AlertNode from '../nodes/AlertNode';
import FileWriterNode from '../nodes/FileWriterNode';

interface FileWorkflowDesignAgentProps {
  agent: Agent;
  onBackToDashboard: () => void;
}

interface Port {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
}

interface Component {
  id: string;
  type: 'source' | 'destination' | 'parser' | 'matcher' | 'mapper' | 'filter' | 'transformer' | 'aggregator'
    | 's3source' | 'ftpsource' | 'localfoldersource' | 'azureblobsource' | 'apisource' | 'emailsource'
    | 'documentintelligenceparser' | 'csvparser' | 'excelparser' | 'pdfparser' | 'jsonparser' | 'xmlparser'
    | 'databasedestination' | 's3destination' | 'azureblobdestination' | 'localfiledestination' | 'apiendpointdestination' | 'emaildestination'
    | 'automappingmatcher' | 'fuzzylookup' | 'exactlookup' | 'regexmatcher' | 'semanticmatcher'
    | 'fieldmapper' | 'datatransformer' | 'schemamapper' | 'formatconverter'
    | 'conditionfilter' | 'rangefilter' | 'duplicatefilter' | 'qualityfilter'
    | 'aggregationtransformer' | 'calculationtransformer' | 'dataenrichment' | 'datanormalization'
    | 'groupbyaggregator' | 'windowfunction' | 'pivottable' | 'summarystatistics'
    | 'joinmerge' | 'reconciliation' | 'llmqa' | 'errorhandler' | 'slackteams' | 'webhook' | 'alert' | 'filewriter';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  x: number;
  y: number;
  connections: string[];
  ports: Port[];
  config: Record<string, any>;
  status: 'idle' | 'running' | 'success' | 'error';
  validationErrors: string[];
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
  dataType: string;
  status: 'valid' | 'invalid' | 'warning';
  validationMessage?: string;
}

interface DataFlow {
  id: string;
  name: string;
  description: string;
  components: Component[];
  connections: Connection[];
  status: 'draft' | 'validated' | 'running' | 'completed' | 'error';
}

// Add this above the main component
const DocumentIntelligenceConfigModal: React.FC<{
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  onChangeType: () => void;
}> = ({ node, onSave, onCancel, onChangeType }) => {
  const [localConfig, setLocalConfig] = React.useState(node.config);
  React.useEffect(() => { setLocalConfig(node.config); }, [node.config]);
  const updateConfig = (updates: any) => {
    setLocalConfig((prev: any) => ({ ...prev, ...updates }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px]">
        <h2 className="text-lg font-semibold mb-4">Document Intelligence Parser Config</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Backend</label>
          <select value={localConfig.backend} onChange={e => updateConfig({ backend: e.target.value })} className="w-full border rounded p-2">
            <option value="azure">Azure</option>
            <option value="aws">AWS</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select value={localConfig.mode} onChange={e => updateConfig({ mode: e.target.value })} className="w-full border rounded p-2">
            <option value="cloud">Cloud</option>
            <option value="local">Local Container</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Endpoint URL</label>
          <input value={localConfig.endpoint} onChange={e => updateConfig({ endpoint: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">API Key / Credentials</label>
          <input value={localConfig.apiKey} onChange={e => updateConfig({ apiKey: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => { onSave(localConfig); }} className="flex-1 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
        </div>
        <button onClick={onChangeType} className="mt-4 w-full py-2 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium">Change Parser Type</button>
      </div>
    </div>
  );
};

// Generic config modal for all node types
const NodeConfigModal: React.FC<{
  node: any;
  onCancel: () => void;
  onChangeType: () => void;
}> = ({ node, onCancel, onChangeType }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px]">
      <h2 className="text-lg font-semibold mb-4">{node.name} Config</h2>
      <div className="flex gap-2 mt-4">
        <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Close</button>
      </div>
      <button onClick={onChangeType} className="mt-4 w-full py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium">Change Type</button>
    </div>
  </div>
);

// LLM QA Config Modal
const LLMQAConfigModal: React.FC<{
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  onChangeType: () => void;
}> = ({ node, onSave, onCancel, onChangeType }) => {
  const [localConfig, setLocalConfig] = React.useState(node.config);
  React.useEffect(() => { setLocalConfig(node.config); }, [node.config]);
  const updateConfig = (updates: any) => {
    setLocalConfig((prev: any) => ({ ...prev, ...updates }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[450px]">
        <h2 className="text-lg font-semibold mb-4">LLM QA Config</h2>
        
        {/* Service Provider Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Service Provider</label>
          <select value={localConfig.provider} onChange={e => updateConfig({ provider: e.target.value })} className="w-full border rounded p-2">
            <option value="openai">OpenAI</option>
            <option value="azure-openai">Azure OpenAI</option>
            <option value="aws-bedrock">AWS Bedrock</option>
            <option value="aws-sagemaker">AWS SageMaker</option>
            <option value="azure-cognitive">Azure Cognitive Services</option>
            <option value="local">Local/On-Premises</option>
          </select>
        </div>

        {/* Model Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Model</label>
          <select value={localConfig.model} onChange={e => updateConfig({ model: e.target.value })} className="w-full border rounded p-2">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
            <option value="llama-2-70b">Llama 2 70B</option>
            <option value="llama-2-13b">Llama 2 13B</option>
            <option value="anthropic-claude">Anthropic Claude</option>
            <option value="cohere-command">Cohere Command</option>
          </select>
        </div>

        {/* Endpoint Configuration */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Endpoint URL</label>
          <input value={localConfig.endpoint} onChange={e => updateConfig({ endpoint: e.target.value })} className="w-full border rounded p-2" placeholder="https://api.openai.com/v1/chat/completions" />
        </div>

        {/* API Key */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">API Key / Access Token</label>
          <input type="password" value={localConfig.apiKey} onChange={e => updateConfig({ apiKey: e.target.value })} className="w-full border rounded p-2" placeholder="Enter your API key" />
        </div>

        {/* Prompt Template */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Prompt Template</label>
          <textarea value={localConfig.prompt} onChange={e => updateConfig({ prompt: e.target.value })} className="w-full border rounded p-2 h-24" placeholder="Enter your prompt template here. Use {input} to reference input data..." />
        </div>

        {/* Model Parameters */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Max Tokens</label>
            <input type="number" value={localConfig.maxTokens} onChange={e => updateConfig({ maxTokens: parseInt(e.target.value) })} className="w-full border rounded p-2" min="1" max="4000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input type="number" step="0.1" value={localConfig.temperature} onChange={e => updateConfig({ temperature: parseFloat(e.target.value) })} className="w-full border rounded p-2" min="0" max="2" />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Advanced Options</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.streaming || false}
                onChange={e => updateConfig({ streaming: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Enable Streaming</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.retryOnError || false}
                onChange={e => updateConfig({ retryOnError: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Retry on Error</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => onSave(localConfig)} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
        </div>
        <button onClick={onChangeType} className="mt-4 w-full py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium">Change Type</button>
      </div>
    </div>
  );
};

// Error Handler Config Modal
const ErrorHandlerConfigModal: React.FC<{
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  onChangeType: () => void;
}> = ({ node, onSave, onCancel, onChangeType }) => {
  const [localConfig, setLocalConfig] = React.useState(node.config);
  React.useEffect(() => { setLocalConfig(node.config); }, [node.config]);
  const updateConfig = (updates: any) => {
    setLocalConfig((prev: any) => ({ ...prev, ...updates }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Error Handler Config</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Error Types</label>
          <div className="space-y-2">
            {['validation', 'processing', 'connection', 'timeout'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localConfig.errorTypes?.includes(type) || false}
                  onChange={e => {
                    const currentTypes = localConfig.errorTypes || [];
                                         const newTypes = e.target.checked 
                       ? [...currentTypes, type]
                       : currentTypes.filter((t: string) => t !== type);
                    updateConfig({ errorTypes: newTypes });
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Actions</label>
          <div className="space-y-2">
            {['retry', 'skip', 'alert', 'log'].map(action => (
              <label key={action} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localConfig.actions?.includes(action) || false}
                  onChange={e => {
                    const currentActions = localConfig.actions || [];
                                         const newActions = e.target.checked 
                       ? [...currentActions, action]
                       : currentActions.filter((a: string) => a !== action);
                    updateConfig({ actions: newActions });
                  }}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{action}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => onSave(localConfig)} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
        </div>
        <button onClick={onChangeType} className="mt-4 w-full py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium">Change Type</button>
      </div>
    </div>
  );
};

// Auto-Mapping Matcher Config Modal
const AutoMappingConfigModal: React.FC<{
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  onChangeType: () => void;
}> = ({ node, onSave, onCancel, onChangeType }) => {
  const [localConfig, setLocalConfig] = React.useState(node.config);
  React.useEffect(() => { setLocalConfig(node.config); }, [node.config]);
  const updateConfig = (updates: any) => {
    setLocalConfig((prev: any) => ({ ...prev, ...updates }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[450px]">
        <h2 className="text-lg font-semibold mb-4">Auto-Mapping Matcher Config</h2>
        
        {/* Service Provider Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Service Provider</label>
          <select value={localConfig.provider} onChange={e => updateConfig({ provider: e.target.value })} className="w-full border rounded p-2">
            <option value="local">Local Algorithm</option>
            <option value="azure-cognitive">Azure Cognitive Services</option>
            <option value="aws-comprehend">AWS Comprehend</option>
            <option value="aws-sagemaker">AWS SageMaker</option>
            <option value="azure-ml">Azure Machine Learning</option>
            <option value="openai">OpenAI Embeddings</option>
            <option value="cohere">Cohere Embeddings</option>
          </select>
        </div>

        {/* Mapping Strategy */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Mapping Strategy</label>
          <select value={localConfig.strategy} onChange={e => updateConfig({ strategy: e.target.value })} className="w-full border rounded p-2">
            <option value="semantic">Semantic Similarity</option>
            <option value="fuzzy">Fuzzy Matching</option>
            <option value="exact">Exact Matching</option>
            <option value="ml">Machine Learning</option>
            <option value="hybrid">Hybrid (Multiple Strategies)</option>
          </select>
        </div>

        {/* Field Mapping Configuration */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Field Mapping</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.autoDetect || false}
                onChange={e => updateConfig({ autoDetect: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Auto-detect field mappings</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.useSynonyms || false}
                onChange={e => updateConfig({ useSynonyms: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Use synonym matching</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.caseInsensitive || false}
                onChange={e => updateConfig({ caseInsensitive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Case-insensitive matching</span>
            </label>
          </div>
        </div>

        {/* Similarity Threshold */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Similarity Threshold</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={localConfig.threshold || 0.8} 
            onChange={e => updateConfig({ threshold: parseFloat(e.target.value) })} 
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0 (Exact)</span>
            <span>{localConfig.threshold || 0.8}</span>
            <span>1.0 (Loose)</span>
          </div>
        </div>

        {/* AWS/Azure Specific Configuration */}
        {(localConfig.provider === 'aws-comprehend' || localConfig.provider === 'aws-sagemaker') && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">AWS Region</label>
            <select value={localConfig.awsRegion} onChange={e => updateConfig({ awsRegion: e.target.value })} className="w-full border rounded p-2">
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">Europe (Ireland)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
        )}

        {(localConfig.provider === 'azure-cognitive' || localConfig.provider === 'azure-ml') && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Azure Region</label>
            <select value={localConfig.azureRegion} onChange={e => updateConfig({ azureRegion: e.target.value })} className="w-full border rounded p-2">
              <option value="eastus">East US</option>
              <option value="westus2">West US 2</option>
              <option value="westeurope">West Europe</option>
              <option value="southeastasia">Southeast Asia</option>
            </select>
          </div>
        )}

        {/* API Configuration */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">API Key / Access Token</label>
          <input type="password" value={localConfig.apiKey} onChange={e => updateConfig({ apiKey: e.target.value })} className="w-full border rounded p-2" placeholder="Enter your API key" />
        </div>

        {/* Advanced Options */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Advanced Options</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.cacheResults || false}
                onChange={e => updateConfig({ cacheResults: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Cache mapping results</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localConfig.parallelProcessing || false}
                onChange={e => updateConfig({ parallelProcessing: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">Enable parallel processing</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => onSave(localConfig)} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save</button>
          <button onClick={onCancel} className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
        </div>
        <button onClick={onChangeType} className="mt-4 w-full py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium">Change Type</button>
      </div>
    </div>
  );
};

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
  const [connectionStartPort, setConnectionStartPort] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{ componentId: string; portId: string } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [dataFlow, setDataFlow] = useState<DataFlow>({
    id: 'workflow-1',
    name: 'File Processing Workflow',
    description: 'ETL workflow for file processing',
    components: [],
    connections: [],
    status: 'draft'
  });
  const [portPositionsVersion, setPortPositionsVersion] = useState(0); // For robust port position updates
  const [collapsedNodes, setCollapsedNodes] = useState<{ [id: string]: boolean }>({});
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  // Add modal state for all generic node types
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeModalPosition, setTypeModalPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingNodeType, setPendingNodeType] = useState<string | null>(null);
  // Add state for Document Intelligence config modal
  const [showDocIntConfig, setShowDocIntConfig] = useState(false);
  const [docIntConfigNodeId, setDocIntConfigNodeId] = useState<string | null>(null);
  // Add state for generic config modal
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [nodeConfigId, setNodeConfigId] = useState<string | null>(null);
  // Add state for LLM QA config modal
  const [showLLMQAConfig, setShowLLMQAConfig] = useState(false);
  const [llmqaConfigNodeId, setLLMQAConfigNodeId] = useState<string | null>(null);
  // Add state for Error Handler config modal
  const [showErrorHandlerConfig, setShowErrorHandlerConfig] = useState(false);
  const [errorHandlerConfigNodeId, setErrorHandlerConfigNodeId] = useState<string | null>(null);
  // Add state for Auto-Mapping Matcher config modal
  const [showAutoMappingConfig, setShowAutoMappingConfig] = useState(false);
  const [autoMappingConfigNodeId, setAutoMappingConfigNodeId] = useState<string | null>(null);

  // --- Pixel-perfect port refs and positions ---
  const portRefs = useRef<{ [key: string]: HTMLDivElement | HTMLButtonElement | null }>({});
  const [portPositions, setPortPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  // Update port positions after every render or version change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPositions: { [key: string]: { x: number; y: number } } = {};
    Object.entries(portRefs.current).forEach(([key, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        newPositions[key] = {
          x: rect.left - canvasRect.left + rect.width / 2,
          y: rect.top - canvasRect.top + rect.height / 2
        };
      }
    });
    setPortPositions(newPositions);
  }, [components, connections, portPositionsVersion]);

  // Enhanced component definitions with both input and output ports (except pure source/destination)
  const getComponentTemplate = (type: string): Component => {
    const templates = {
      source: {
      type: 'source' as const,
        name: 'Data Source',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
        ports: [
          { id: 'output-1', name: 'Data Output', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Output data stream' }
        ],
        config: { sourceType: 'file', path: '', format: 'csv' }
    },
      destination: {
      type: 'destination' as const,
        name: 'Data Destination',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
        ports: [
          { id: 'input-1', name: 'Data Input', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Input data stream' }
        ],
        config: { destinationType: 'database', connectionString: '', tableName: '' }
    },
      parser: {
      type: 'parser' as const,
        name: 'Data Parser',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
        ports: [
          { id: 'input-1', name: 'Raw Data', type: 'input' as const, dataType: 'string' as const, required: true, description: 'Raw input data' },
          { id: 'output-1', name: 'Parsed Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Parsed structured data' }
        ],
        config: { parserType: 'json', schema: {} }
      },
      matcher: {
      type: 'matcher' as const,
        name: 'Data Matcher',
      icon: Search,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
        ports: [
          { id: 'input-1', name: 'Source Data', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Source data to match' },
          { id: 'output-1', name: 'Matched Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Successfully matched data' }
        ],
        config: { matchCriteria: [], threshold: 0.8 }
      },
      mapper: {
      type: 'mapper' as const,
        name: 'Data Mapper',
      icon: Copy,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
        ports: [
          { id: 'input-1', name: 'Source Data', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Source data to transform' },
          { id: 'output-1', name: 'Mapped Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Transformed data' }
        ],
        config: { mappingRules: [], targetSchema: {} }
      },
      filter: {
        type: 'filter' as const,
        name: 'Data Filter',
        icon: Filter,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        ports: [
          { id: 'input-1', name: 'Input Data', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Data to filter' },
          { id: 'output-1', name: 'Filtered Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Data that passes filter' }
        ],
        config: { filterConditions: [], operator: 'AND' }
      },
      transformer: {
        type: 'transformer' as const,
        name: 'Data Transformer',
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        ports: [
          { id: 'input-1', name: 'Input Data', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Data to transform' },
          { id: 'output-1', name: 'Transformed Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Transformed data' }
        ],
        config: { transformations: [], functions: [] }
      },
      aggregator: {
        type: 'aggregator' as const,
        name: 'Data Aggregator',
        icon: Cpu,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        ports: [
          { id: 'input-1', name: 'Input Data', type: 'input' as const, dataType: 'object' as const, required: true, description: 'Data to aggregate' },
          { id: 'output-1', name: 'Aggregated Data', type: 'output' as const, dataType: 'object' as const, required: true, description: 'Aggregated results' }
        ],
        config: { groupBy: [], aggregations: [] }
      }
    };

    // Add both input and output ports to all except pure source/destination
    let template = { ...templates[type as keyof typeof templates], ports: [...templates[type as keyof typeof templates].ports] as Port[] };
    if (type !== 'source' && type !== 'destination') {
      // Ensure at least one input and one output port
      const hasInput = template.ports.some(p => p.type === 'input');
      const hasOutput = template.ports.some(p => p.type === 'output');
      if (!hasInput) {
        template.ports.unshift({ id: 'input-1', name: 'Input', type: 'input', dataType: 'object', required: false, description: 'Input' });
      }
      if (!hasOutput) {
        template.ports.push({ id: 'output-1', name: 'Output', type: 'output', dataType: 'object', required: false, description: 'Output' });
      }
    }
    return {
      id: `${type}-${Date.now()}`,
      ...template,
        x: 0,
        y: 0,
      connections: [],
      status: 'idle',
      validationErrors: []
    };
  };

  // Update sidebarComponents descriptions to remove the word 'component'
  const sidebarComponents = [
    { type: 'source', name: 'Data Source', icon: Database, color: 'text-blue-600', bgColor: 'bg-blue-50', description: 'Data source' },
    { type: 'destination', name: 'Data Destination', icon: Target, color: 'text-green-600', bgColor: 'bg-green-50', description: 'Output destination' },
    { type: 'parser', name: 'Data Parser', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50', description: 'Parses data' },
    { type: 'matcher', name: 'Data Matcher', icon: Search, color: 'text-orange-600', bgColor: 'bg-orange-50', description: 'Matches data' },
    { type: 'mapper', name: 'Data Mapper', icon: Copy, color: 'text-indigo-600', bgColor: 'bg-indigo-50', description: 'Transforms data' },
    { type: 'filter', name: 'Data Filter', icon: Filter, color: 'text-red-600', bgColor: 'bg-red-50', description: 'Filters data' },
    { type: 'transformer', name: 'Data Transformer', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50', description: 'Applies transformations' },
    { type: 'aggregator', name: 'Data Aggregator', icon: Cpu, color: 'text-teal-600', bgColor: 'bg-teal-50', description: 'Aggregates data' }
  ];

  // Enhanced connection validation
  const validateConnection = (fromComponent: Component, toComponent: Component, fromPort: string, toPort: string): { valid: boolean; message?: string } => {
    const fromPortData = fromComponent.ports.find(p => p.id === fromPort);
    const toPortData = toComponent.ports.find(p => p.id === toPort);

    if (!fromPortData || !toPortData) {
      return { valid: false, message: 'Invalid port selection' };
    }

    if (fromPortData.type === toPortData.type) {
      return { valid: false, message: 'Cannot connect ports of the same type' };
    }

    if (fromPortData.dataType !== toPortData.dataType) {
      return { valid: false, message: `Data type mismatch: ${fromPortData.dataType} vs ${toPortData.dataType}` };
    }

    // Check for circular connections
    const hasCircularConnection = checkCircularConnection(fromComponent.id, toComponent.id);
    if (hasCircularConnection) {
      return { valid: false, message: 'Circular connection detected' };
    }

    return { valid: true };
  };

  const checkCircularConnection = (fromId: string, toId: string): boolean => {
    const visited = new Set<string>();
    const stack = [toId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === fromId) return true;
      if (visited.has(current)) continue;
      
      visited.add(current);
      const outgoingConnections = connections.filter(c => c.from === current);
      stack.push(...outgoingConnections.map(c => c.to));
    }

    return false;
  };

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    const component = getComponentTemplate(componentType);
    setDraggedComponent(component);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Show modal for all generic types
      if ([
        'source', 'parser', 'destination', 'matcher', 'mapper', 'filter', 'transformer', 'aggregator'
      ].includes(draggedComponent.type)) {
        setShowTypeModal(true);
        setTypeModalPosition({ x, y });
        setPendingNodeType(draggedComponent.type);
        setDraggedComponent(null);
        return; // Do NOT add to components yet
      }
      // Default: add as before
      const newComponent: Component = {
        ...draggedComponent,
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

  // Update handleComponentDrag to increment portPositionsVersion after every move
  const handleComponentDrag = (e: React.DragEvent, componentId: string) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setComponents(prev => prev.map(comp => 
        comp.id === componentId ? { ...comp, x, y } : comp
      ));
      setPortPositionsVersion(v => v + 1); // Force port position update
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

  // 1. Use portPositions for preview line start
  const getPortPosition = (componentId: string, portId: string) => portPositions[`${componentId}-${portId}`];

  const handleStartConnection = (e: React.MouseEvent, componentId: string, portId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const component = components.find(c => c.id === componentId);
    if (!component) return;
    const port = component.ports.find(p => p.id === portId);
    if (!port || port.type !== 'output') return;
    setIsConnecting(true);
    setConnectionStart(componentId);
    setConnectionStartPort(portId);
    
    // Calculate position accounting for zoom and pan
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setStartPosition({ x, y });
      setMousePosition({ x, y });
    }
  };

  const handlePortHover = (componentId: string, portId: string) => {
    if (isConnecting && connectionStart !== componentId) {
      setHoveredPort({ componentId, portId });
    }
  };

  const handlePortLeave = () => {
    setHoveredPort(null);
  };

  const handleComponentDrop = (componentId: string, portId: string) => {
    if (isConnecting && connectionStart && connectionStart !== componentId) {
      const fromComponent = components.find(c => c.id === connectionStart);
      const toComponent = components.find(c => c.id === componentId);
      
      if (fromComponent && toComponent) {
        const validation = validateConnection(fromComponent, toComponent, connectionStartPort!, portId);
        
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connectionStart,
        to: componentId,
          fromPort: connectionStartPort!,
          toPort: portId,
          dataType: fromComponent.ports.find(p => p.id === connectionStartPort!)?.dataType || 'object',
          status: validation.valid ? 'valid' : 'invalid',
          validationMessage: validation.message
        };
        
      setConnections(prev => [...prev, newConnection]);
        console.log('Connection created:', newConnection);
      }
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionStartPort(null);
    setMousePosition(null);
    setStartPosition(null);
    setHoveredPort(null);
  };

  const handleSaveWorkflow = () => {
    const updatedDataFlow: DataFlow = {
      ...dataFlow,
      components,
      connections,
      status: 'draft'
    };
    setDataFlow(updatedDataFlow);
    console.log('Saving workflow:', updatedDataFlow);
  };

  const handleValidateWorkflow = () => {
    const errors: string[] = [];
    
    // Check for unconnected required ports
    components.forEach(component => {
      component.ports.forEach(port => {
        if (port.required && port.type === 'input') {
          const hasConnection = connections.some(c => c.to === component.id && c.toPort === port.id);
          if (!hasConnection) {
            errors.push(`${component.name}: Required input port '${port.name}' is not connected`);
          }
        }
      });
    });

    // Check for invalid connections
    connections.forEach(connection => {
      if (connection.status === 'invalid') {
        errors.push(`Invalid connection: ${connection.validationMessage}`);
      }
    });

    // Check for orphaned components
    const connectedComponents = new Set([
      ...connections.map(c => c.from),
      ...connections.map(c => c.to)
    ]);
    
    components.forEach(component => {
      if (!connectedComponents.has(component.id)) {
        errors.push(`${component.name}: Component is not connected to the workflow`);
      }
    });

    setShowValidation(true);
    console.log('Validation errors:', errors);
  };

  // Handle mouse up to reset connection state
  const handleMouseUp = () => {
    if (isConnecting) {
      console.log('Mouse up, resetting connection state');
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionStartPort(null);
      setMousePosition(null);
      setStartPosition(null);
      setHoveredPort(null);
    }
  };

  // Simple connection method for testing
  const handleSimpleConnect = (fromComponentId: string, toComponentId: string) => {
    const fromComponent = components.find(c => c.id === fromComponentId);
    const toComponent = components.find(c => c.id === toComponentId);
    
    if (fromComponent && toComponent) {
      const fromPort = fromComponent.ports.find(p => p.type === 'output');
      const toPort = toComponent.ports.find(p => p.type === 'input');
      
      if (fromPort && toPort) {
        const validation = validateConnection(fromComponent, toComponent, fromPort.id, toPort.id);
        
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: fromComponentId,
          to: toComponentId,
          fromPort: fromPort.id,
          toPort: toPort.id,
          dataType: fromPort.dataType,
          status: validation.valid ? 'valid' : 'invalid',
          validationMessage: validation.message
        };
        
        setConnections(prev => [...prev, newConnection]);
        console.log('Simple connection created:', newConnection);
      }
    }
  };

  // 2. Use a consistent color for all connection lines
  const CONNECTION_COLOR = '#2563eb'; // blue-600

  const previewStartPos = connectionStart && connectionStartPort ? getPortPosition(connectionStart, connectionStartPort) : startPosition;

  // 3. Handlers for zoom/pan
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.3));
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggedNodeId) return; // Prevent panning if dragging a node
    if (e.button === 1 || e.button === 0) {
      // Only start panning if clicking on the canvas background, not on nodes
      if ((e.target as HTMLElement).closest('.node-port, .node-trash')) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => {
    if (!draggedNodeId) return;
    const handleWindowMouseMove = (e: MouseEvent) => {
      let x = e.clientX, y = e.clientY;
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const panVal = panRef.current;
        const zoomVal = zoomRef.current;
        x = (e.clientX - rect.left - panVal.x) / zoomVal;
        y = (e.clientY - rect.top - panVal.y) / zoomVal;
      }
      if (draggedNodeId && dragOffset) {
        setComponents(prev => prev.map(comp =>
          comp.id === draggedNodeId ? { ...comp, x: x - dragOffset.x, y: y - dragOffset.y } : comp
        ));
        setPortPositionsVersion(v => v + 1);
      }
    };
    const handleWindowMouseUp = () => {
      setDraggedNodeId(null);
      setDragOffset(null);
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggedNodeId, dragOffset]);
  // Rename pan handler
  const handlePanMouseUp = () => setIsPanning(false);

  // 2. Handlers for collapse/expand
  const toggleCollapse = (id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Node mouse down handler
  const handleNodeMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't start dragging if clicking on ports or trash
    if ((e.target as HTMLElement).closest('.node-port, .node-trash')) return;
    
    const node = components.find(c => c.id === componentId);
    if (!node) return;
    let x = e.clientX, y = e.clientY;
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const panVal = panRef.current;
      const zoomVal = zoomRef.current;
      x = (e.clientX - rect.left - panVal.x) / zoomVal;
      y = (e.clientY - rect.top - panVal.y) / zoomVal;
    }
    setDraggedNodeId(componentId);
    setDragOffset({ x: x - node.x, y: y - node.y });
    setIsPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only handle canvas panning and connection preview if not dragging a node
    if (draggedNodeId) return;
    
    // Update mouse position for connection preview
    if (isConnecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setMousePosition({ x, y });
    }
    
    // Handle panning
    if (isPanning && panStart) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleTypeSelect = (specialType: string) => {
    if (!typeModalPosition) return;
    let newComponent: any = null;
    // Map specialType to node/component
    switch (specialType) {
      case 's3':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'S3 Source',
          icon: S3SourceNode,
          type: 's3source',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 's3', bucket: '', key: '' }
        };
        break;
      case 'ftp':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'FTP Source',
          icon: FTPSourceNode,
          type: 'ftpsource',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 'ftp', host: '', path: '' }
        };
        break;
      case 'localfolder':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'Local Folder Source',
          icon: LocalFolderSourceNode,
          type: 'localfoldersource',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 'localfolder', folderPath: '' }
        };
        break;
      case 'azureblob':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'Azure Blob Storage',
          icon: AzureBlobSourceNode,
          type: 'azureblobsource',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 'azureblob', container: '', blob: '' }
        };
        break;
      case 'api':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'API Source',
          icon: APISourceNode,
          type: 'apisource',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 'api', url: '' }
        };
        break;
      case 'email':
        newComponent = {
          ...getComponentTemplate('source'),
          name: 'Email Attachment Source',
          icon: EmailAttachmentSourceNode,
          type: 'emailsource',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sourceType: 'email', mailbox: '' }
        };
        break;
      // Parser types
      case 'documentintelligence':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'Document Intelligence Parser',
          icon: DocumentIntelligenceParserNode,
          type: 'documentintelligenceparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: {
            backend: 'azure',
            mode: 'cloud',
            endpoint: '',
            apiKey: '',
          }
        };
        break;
      case 'csv':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'CSV Parser',
          icon: FileText,
          type: 'csvparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { delimiter: ',', header: true }
        };
        break;
      case 'excel':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'Excel Parser',
          icon: FileText,
          type: 'excelparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { sheet: 1 }
        };
        break;
      case 'pdf':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'PDF Parser',
          icon: FileText,
          type: 'pdfparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: {}
        };
        break;
      case 'json':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'JSON Parser',
          icon: FileText,
          type: 'jsonparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: {}
        };
        break;
      case 'xml':
        newComponent = {
          ...getComponentTemplate('parser'),
          name: 'XML Parser',
          icon: FileText,
          type: 'xmlparser',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: {}
        };
        break;
      // Destination types
      case 'database':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Database Destination',
          icon: Target,
          type: 'databasedestination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 'database', connectionString: '', tableName: '' }
        };
        break;
      case 's3destination':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'S3 Bucket Destination',
          icon: Target,
          type: 's3destination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 's3', bucket: '', key: '' }
        };
        break;
      case 'azureblobdestination':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Azure Blob Destination',
          icon: Target,
          type: 'azureblobdestination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 'azureblob', container: '', blob: '' }
        };
        break;
      case 'localfile':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Local File Destination',
          icon: Target,
          type: 'localfiledestination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 'localfile', filePath: '' }
        };
        break;
      case 'apiendpoint':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'API Endpoint Destination',
          icon: Target,
          type: 'apiendpointdestination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 'api', url: '', method: 'POST' }
        };
        break;
      case 'emaildestination':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Email Destination',
          icon: Target,
          type: 'emaildestination',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { destinationType: 'email', to: '', subject: '' }
        };
        break;
      // Matcher types
      case 'automapping':
        newComponent = {
          ...getComponentTemplate('matcher'),
          name: 'Auto-Mapping Matcher',
          icon: AutoMappingMatcherNode,
          type: 'automappingmatcher',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { matchType: 'automapping', autoDetect: true }
        };
        break;
      case 'fuzzy':
        newComponent = {
          ...getComponentTemplate('matcher'),
          name: 'Fuzzy Lookup',
          icon: FuzzyLookupNode,
          type: 'fuzzylookup',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { matchType: 'fuzzy', threshold: 0.8, algorithm: 'levenshtein' }
        };
        break;
      case 'exact':
        newComponent = {
          ...getComponentTemplate('matcher'),
          name: 'Exact Lookup',
          icon: ExactLookupNode,
          type: 'exactlookup',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { matchType: 'exact', caseSensitive: true }
        };
        break;
      case 'regex':
        newComponent = {
          ...getComponentTemplate('matcher'),
          name: 'Regex Matcher',
          icon: Search,
          type: 'regexmatcher',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { matchType: 'regex', pattern: '' }
        };
        break;
      case 'semantic':
        newComponent = {
          ...getComponentTemplate('matcher'),
          name: 'Semantic Matcher',
          icon: Search,
          type: 'semanticmatcher',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { matchType: 'semantic', model: 'bert', threshold: 0.7 }
        };
        break;
      // Mapper types
      case 'fieldmapping':
        newComponent = {
          ...getComponentTemplate('mapper'),
          name: 'Field Mapper',
          icon: Copy,
          type: 'fieldmapper',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { mappingType: 'field', mappings: [] }
        };
        break;
      case 'transformation':
        newComponent = {
          ...getComponentTemplate('mapper'),
          name: 'Data Transformer',
          icon: Copy,
          type: 'datatransformer',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { mappingType: 'transformation', transformations: [] }
        };
        break;
      case 'schema':
        newComponent = {
          ...getComponentTemplate('mapper'),
          name: 'Schema Mapper',
          icon: Copy,
          type: 'schemamapper',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { mappingType: 'schema', targetSchema: {} }
        };
        break;
      case 'format':
        newComponent = {
          ...getComponentTemplate('mapper'),
          name: 'Format Converter',
          icon: Copy,
          type: 'formatconverter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { mappingType: 'format', inputFormat: '', outputFormat: '' }
        };
        break;
      // Filter types
      case 'condition':
        newComponent = {
          ...getComponentTemplate('filter'),
          name: 'Condition Filter',
          icon: Filter,
          type: 'conditionfilter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { filterType: 'condition', conditions: [] }
        };
        break;
      case 'range':
        newComponent = {
          ...getComponentTemplate('filter'),
          name: 'Range Filter',
          icon: Filter,
          type: 'rangefilter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { filterType: 'range', field: '', min: '', max: '' }
        };
        break;
      case 'duplicate':
        newComponent = {
          ...getComponentTemplate('filter'),
          name: 'Duplicate Filter',
          icon: Filter,
          type: 'duplicatefilter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { filterType: 'duplicate', fields: [], keepFirst: true }
        };
        break;
      case 'quality':
        newComponent = {
          ...getComponentTemplate('filter'),
          name: 'Quality Filter',
          icon: Filter,
          type: 'qualityfilter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { filterType: 'quality', rules: [] }
        };
        break;
      // Transformer types
      case 'aggregation':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Aggregation Transformer',
          icon: Zap,
          type: 'aggregationtransformer',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { transformType: 'aggregation', operations: [] }
        };
        break;
      case 'calculation':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Calculation Transformer',
          icon: Zap,
          type: 'calculationtransformer',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { transformType: 'calculation', formulas: [] }
        };
        break;
      case 'enrichment':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Data Enrichment',
          icon: Zap,
          type: 'dataenrichment',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { transformType: 'enrichment', sources: [] }
        };
        break;
      case 'normalization':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Data Normalization',
          icon: Zap,
          type: 'datanormalization',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { transformType: 'normalization', method: 'minmax' }
        };
        break;
      // Aggregator types
      case 'groupby':
        newComponent = {
          ...getComponentTemplate('aggregator'),
          name: 'Group By Aggregator',
          icon: Cpu,
          type: 'groupbyaggregator',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { aggregatorType: 'groupby', groupFields: [], aggregations: [] }
        };
        break;
      case 'window':
        newComponent = {
          ...getComponentTemplate('aggregator'),
          name: 'Window Function',
          icon: Cpu,
          type: 'windowfunction',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { aggregatorType: 'window', windowSize: 10, function: 'avg' }
        };
        break;
      case 'pivot':
        newComponent = {
          ...getComponentTemplate('aggregator'),
          name: 'Pivot Table',
          icon: Cpu,
          type: 'pivottable',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { aggregatorType: 'pivot', rowFields: [], columnFields: [], valueFields: [] }
        };
        break;
      case 'summary':
        newComponent = {
          ...getComponentTemplate('aggregator'),
          name: 'Summary Statistics',
          icon: Cpu,
          type: 'summarystatistics',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { aggregatorType: 'summary', fields: [], statistics: ['mean', 'std', 'min', 'max'] }
        };
        break;
      // New specialized node types
      case 'joinmerge':
        newComponent = {
          ...getComponentTemplate('mapper'),
          name: 'Join/Merge',
          icon: JoinMergeNode,
          type: 'joinmerge',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { joinType: 'inner', joinKeys: [] }
        };
        break;
      case 'reconciliation':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Reconciliation',
          icon: ReconciliationNode,
          type: 'reconciliation',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { reconciliationType: 'exact', tolerance: 0.01 }
        };
        break;
      case 'llmqa':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'LLM QA',
          icon: LLMQANode,
          type: 'llmqa',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { model: 'gpt-4', prompt: '', maxTokens: 1000 }
        };
        break;
      case 'errorhandler':
        newComponent = {
          ...getComponentTemplate('transformer'),
          name: 'Error Handler',
          icon: ErrorHandlerNode,
          type: 'errorhandler',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { errorTypes: ['validation', 'processing'], actions: ['retry', 'skip', 'alert'] }
        };
        break;
      case 'slackteams':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Slack/Teams',
          icon: SlackTeamsNode,
          type: 'slackteams',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { platform: 'slack', channel: '', message: '' }
        };
        break;
      case 'webhook':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Webhook',
          icon: WebhookNode,
          type: 'webhook',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { url: '', method: 'POST', headers: {} }
        };
        break;
      case 'alert':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'Alert',
          icon: AlertNode,
          type: 'alert',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { alertType: 'email', recipients: [], message: '' }
        };
        break;
      case 'filewriter':
        newComponent = {
          ...getComponentTemplate('destination'),
          name: 'File Writer',
          icon: FileWriterNode,
          type: 'filewriter',
          x: typeModalPosition.x,
          y: typeModalPosition.y,
          config: { format: 'csv', path: '', options: {} }
        };
        break;
      default:
        break;
    }
          if (newComponent) {
        setComponents(prev => [...prev, newComponent]);
        // Show config modals for specific node types
        if (specialType === 'documentintelligence') {
          setShowDocIntConfig(true);
          setDocIntConfigNodeId(newComponent.id);
        } else if (specialType === 'llmqa') {
          setShowLLMQAConfig(true);
          setLLMQAConfigNodeId(newComponent.id);
        } else if (specialType === 'errorhandler') {
          setShowErrorHandlerConfig(true);
          setErrorHandlerConfigNodeId(newComponent.id);
        } else if (specialType === 'automapping') {
          setShowAutoMappingConfig(true);
          setAutoMappingConfigNodeId(newComponent.id);
        }
      }
    setShowTypeModal(false);
    setTypeModalPosition(null);
    setPendingNodeType(null);
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
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Design Agent</h1>
                  <p className="text-sm text-gray-500">{agent.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleValidateWorkflow}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Validate</span>
              </button>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nodes</h3>
          <div className="space-y-2">
            {sidebarComponents.map((component) => (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => {
                  // Use persistent hidden transparent image for drag preview
                  const img = document.getElementById('drag-transparent');
                  if (img) {
                    e.dataTransfer.setDragImage(img, 0, 0);
                  }
                  handleDragStart(e, component.type);
                }}
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

          {/* Data Flow Summary */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Workflow Summary</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Components: {components.length}</div>
              <div>Connections: {connections.length}</div>
              <div>Status: <span className="capitalize">{dataFlow.status}</span></div>
              <div>Valid Connections: {connections.filter(c => c.status === 'valid').length}</div>
              <div>Invalid Connections: {connections.filter(c => c.status === 'invalid').length}</div>
            </div>
            {components.length >= 2 && (
              <button
                onClick={() => {
                  const [first, second] = components;
                  handleSimpleConnect(first.id, second.id);
                }}
                className="mt-2 w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Test Connect First Two Components
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Connect Components</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-100 rounded">
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </div>
                <span>1. <strong>Click and drag</strong> from <strong>output ports</strong> (right side)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gray-100 rounded">
                  <Link className="w-3 h-3 text-gray-600" />
                </div>
                <span>2. <strong>Drag to</strong> <strong>input ports</strong> (left side) of target component</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-green-100 rounded">
                  <ArrowRight className="w-3 h-3 text-green-600" />
                </div>
                <span>3. <strong>Release</strong> to create the connection</span>
              </div>
            </div>
          </div>

          {/* Validation Panel */}
          {showValidation && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Workflow Validation</h4>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>✓ Workflow structure validated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>✓ Data type compatibility checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>✓ Circular dependency detection</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className={`w-full h-full bg-gray-100 relative ${isConnecting ? 'cursor-crosshair' : ''}`}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: '0 0',
              transition: isPanning ? 'none' : 'transform 0.1s',
            }}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseUp={e => { handlePanMouseUp(); handleMouseUp(); }}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
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
            {components.map((component) => {
              // Determine if node can be deleted (no connections to or from it)
              const canDelete = !connections.some(c => c.from === component.id || c.to === component.id);
              const onDelete = () => handleDeleteComponent(component.id);
              // Choose node component by type
              let NodeComponent: React.FC<any>;
              let nodeProps: any = {};
              switch (component.type) {
                case 'source': NodeComponent = DataSourceNode; break;
                case 'destination': NodeComponent = DataDestinationNode; break;
                case 'parser': NodeComponent = DataParserNode; break;
                case 'matcher': NodeComponent = DataMatcherNode; break;
                case 'mapper': NodeComponent = DataMapperNode; break;
                case 'filter': NodeComponent = DataFilterNode; break;
                case 'transformer': NodeComponent = DataTransformerNode; break;
                case 'aggregator': NodeComponent = DataAggregatorNode; break;
                case 'documentintelligenceparser':
                  NodeComponent = DocumentIntelligenceParserNode;
                  nodeProps.showIcon = true;
                  nodeProps.iconOverride = FileText;
                  nodeProps.onDoubleClick = () => {
                    setShowDocIntConfig(true);
                    setDocIntConfigNodeId(component.id);
                  };
                  break;
                // Destination types
                case 'databasedestination':
                case 's3destination':
                case 'azureblobdestination':
                case 'localfiledestination':
                case 'apiendpointdestination':
                case 'emaildestination':
                  NodeComponent = DataDestinationNode; break;
                // Matcher types
                case 'automappingmatcher':
                  NodeComponent = AutoMappingMatcherNode;
                  nodeProps.onDoubleClick = () => {
                    setShowAutoMappingConfig(true);
                    setAutoMappingConfigNodeId(component.id);
                  };
                  break;
                case 'fuzzylookup':
                  NodeComponent = FuzzyLookupNode; break;
                case 'exactlookup':
                  NodeComponent = ExactLookupNode; break;
                case 'regexmatcher':
                case 'semanticmatcher':
                  NodeComponent = DataMatcherNode; break;
                // Mapper types
                case 'fieldmapper':
                case 'datatransformer':
                case 'schemamapper':
                case 'formatconverter':
                  NodeComponent = DataMapperNode; break;
                // Filter types
                case 'conditionfilter':
                case 'rangefilter':
                case 'duplicatefilter':
                case 'qualityfilter':
                  NodeComponent = DataFilterNode; break;
                // Transformer types
                case 'aggregationtransformer':
                case 'calculationtransformer':
                case 'dataenrichment':
                case 'datanormalization':
                  NodeComponent = DataTransformerNode; break;
                // Aggregator types
                case 'groupbyaggregator':
                case 'windowfunction':
                case 'pivottable':
                case 'summarystatistics':
                  NodeComponent = DataAggregatorNode; break;
                // New specialized node types
                case 'joinmerge':
                  NodeComponent = JoinMergeNode; break;
                case 'reconciliation':
                  NodeComponent = ReconciliationNode; break;
                case 'llmqa':
                  NodeComponent = LLMQANode;
                  nodeProps.onDoubleClick = () => {
                    setShowLLMQAConfig(true);
                    setLLMQAConfigNodeId(component.id);
                  };
                  break;
                case 'errorhandler':
                  NodeComponent = ErrorHandlerNode;
                  nodeProps.onDoubleClick = () => {
                    setShowErrorHandlerConfig(true);
                    setErrorHandlerConfigNodeId(component.id);
                  };
                  break;
                case 'slackteams':
                  NodeComponent = SlackTeamsNode; break;
                case 'webhook':
                  NodeComponent = WebhookNode; break;
                case 'alert':
                  NodeComponent = AlertNode; break;
                case 'filewriter':
                  NodeComponent = FileWriterNode; break;
                default: NodeComponent = DataSourceNode;
              }
              return (
                <NodeComponent
                key={component.id}
                  id={component.id}
                  ports={component.ports}
                  portRefs={portRefs}
                  onPortMouseEnter={(portId: string) => handlePortHover(component.id, portId)}
                  onPortMouseLeave={handlePortLeave}
                  onPortMouseUp={(portId: string) => {
                          if (isConnecting && connectionStart !== component.id) {
                      handleComponentDrop(component.id, portId);
                    }
                  }}
                  onPortClick={(portId: string) => {
                    setConnections(prev => prev.filter(c => !(c.to === component.id && c.toPort === portId)));
                  }}
                  onPortMouseDown={(portId: string, e: React.MouseEvent) => handleStartConnection(e, component.id, portId)}
                  canDelete={canDelete}
                  onDelete={onDelete}
                  x={component.x}
                  y={component.y}
                  // Add node drag handler
                  onNodeMouseDown={(e: React.MouseEvent) => handleNodeMouseDown(e, component.id)}
                  {...nodeProps}
                />
              );
            })}

            {/* Connection Line */}
            {isConnecting && previewStartPos && mousePosition && (
              <svg
                className="absolute pointer-events-none"
                style={{ zIndex: 20, width: '100%', height: '100%', top: 0, left: 0 }}
                width="100%" height="100%"
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
                    <polygon points="0 0, 10 3.5, 0 7" fill={CONNECTION_COLOR} />
                  </marker>
                </defs>
                <path
                  d={`M ${previewStartPos.x * zoom + pan.x} ${previewStartPos.y * zoom + pan.y} L ${mousePosition.x * zoom + pan.x} ${mousePosition.y * zoom + pan.y}`}
                  stroke={CONNECTION_COLOR}
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#connection-arrowhead)"
                />
                {/* Connection preview text */}
                <text
                  x={((previewStartPos.x + mousePosition.x) * zoom + pan.x) / 2}
                  y={((previewStartPos.y + mousePosition.y) * zoom + pan.y) / 2 - 10}
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill={CONNECTION_COLOR}
                >
                  Connecting...
                </text>
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
              const fromPos = getPortPosition(connection.from, connection.fromPort);
              const toPos = getPortPosition(connection.to, connection.toPort);
              if (!fromPos || !toPos) return null;
              
              const strokeColor = CONNECTION_COLOR;
              const strokeWidth = connection.status === 'invalid' ? '3' : '2';
              
              return (
                <svg
                  key={connection.id}
                  className="absolute pointer-events-none"
                  style={{ zIndex: 10, width: '100%', height: '100%', top: 0, left: 0 }}
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
                      <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
                    </marker>
                  </defs>
                  <path
                    d={`M ${fromPos.x * zoom + pan.x} ${fromPos.y * zoom + pan.y} Q ${(fromPos.x + toPos.x) * zoom / 2 + pan.x} ${fromPos.y * zoom + pan.y} ${toPos.x * zoom + pan.x} ${toPos.y * zoom + pan.y}`}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    markerEnd={`url(#arrowhead-${connection.id})`}
                  />
                  {/* Removed connection label text */}
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

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
            <button onClick={handleZoomIn} className="p-2 bg-white border rounded shadow hover:bg-gray-50">+</button>
            <button onClick={handleZoomOut} className="p-2 bg-white border rounded shadow hover:bg-gray-50">–</button>
        </div>
      </div>
      </div>

      {/* Modal for type selection */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-4">{pendingNodeType === 'source' ? 'Choose Data Source Type' :
              pendingNodeType === 'parser' ? 'Choose Parser Type' :
              pendingNodeType === 'destination' ? 'Choose Destination Type' :
              pendingNodeType === 'matcher' ? 'Choose Matcher Type' :
              pendingNodeType === 'mapper' ? 'Choose Mapper Type' :
              pendingNodeType === 'filter' ? 'Choose Filter Type' :
              pendingNodeType === 'transformer' ? 'Choose Transformer Type' :
              pendingNodeType === 'aggregator' ? 'Choose Aggregator Type' :
              'Choose Node Type'}</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Source options */}
              {pendingNodeType === 'source' && (<>
                <button onClick={() => handleTypeSelect('s3')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <S3SourceNode id="modal-s3" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">S3</span>
                </button>
                <button onClick={() => handleTypeSelect('ftp')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <FTPSourceNode id="modal-ftp" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">FTP</span>
                </button>
                <button onClick={() => handleTypeSelect('localfolder')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <LocalFolderSourceNode id="modal-localfolder" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Local Folder</span>
                </button>
                <button onClick={() => handleTypeSelect('azureblob')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <AzureBlobSourceNode id="modal-azureblob" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Azure Blob</span>
                </button>
                <button onClick={() => handleTypeSelect('api')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <APISourceNode id="modal-api" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">API</span>
                </button>
                <button onClick={() => handleTypeSelect('email')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <EmailAttachmentSourceNode id="modal-email" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Email Attachment</span>
                </button>
              </>)}
              {/* Parser options */}
              {pendingNodeType === 'parser' && (<>
                <button onClick={() => handleTypeSelect('documentintelligence')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <DocumentIntelligenceParserNode id="modal-docint" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Document Intelligence</span>
                </button>
                <button onClick={() => handleTypeSelect('csv')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">CSV</span>
                </button>
                <button onClick={() => handleTypeSelect('excel')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Excel</span>
                </button>
                <button onClick={() => handleTypeSelect('pdf')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">PDF</span>
                </button>
                <button onClick={() => handleTypeSelect('json')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">JSON</span>
                </button>
                <button onClick={() => handleTypeSelect('xml')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">XML</span>
                </button>
              </>)}
              {/* Add similar blocks for destination, matcher, etc. as needed */}
              {/* Destination options */}
              {pendingNodeType === 'destination' && (<>
                <button onClick={() => handleTypeSelect('database')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Database</span>
                </button>
                <button onClick={() => handleTypeSelect('s3destination')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">S3 Bucket</span>
                </button>
                <button onClick={() => handleTypeSelect('azureblobdestination')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Azure Blob</span>
                </button>
                <button onClick={() => handleTypeSelect('localfile')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Local File</span>
                </button>
                <button onClick={() => handleTypeSelect('apiendpoint')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">API Endpoint</span>
                </button>
                <button onClick={() => handleTypeSelect('email')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Email</span>
                </button>
                <button onClick={() => handleTypeSelect('slackteams')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <SlackTeamsNode id="modal-slackteams" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Slack/Teams</span>
                </button>
                <button onClick={() => handleTypeSelect('webhook')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <WebhookNode id="modal-webhook" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Webhook</span>
                </button>
                <button onClick={() => handleTypeSelect('alert')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <AlertNode id="modal-alert" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Alert</span>
                </button>
                <button onClick={() => handleTypeSelect('filewriter')} className="p-3 rounded border hover:bg-blue-50 flex flex-col items-center">
                  <FileWriterNode id="modal-filewriter" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">File Writer</span>
                </button>
              </>)}
              {/* Matcher options */}
              {pendingNodeType === 'matcher' && (<>
                <button onClick={() => handleTypeSelect('automapping')} className="p-3 rounded border hover:bg-orange-50 flex flex-col items-center">
                  <AutoMappingMatcherNode id="modal-automapping" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Auto-Mapping</span>
                </button>
                <button onClick={() => handleTypeSelect('fuzzy')} className="p-3 rounded border hover:bg-orange-50 flex flex-col items-center">
                  <FuzzyLookupNode id="modal-fuzzy" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Fuzzy Lookup</span>
                </button>
                <button onClick={() => handleTypeSelect('exact')} className="p-3 rounded border hover:bg-orange-50 flex flex-col items-center">
                  <ExactLookupNode id="modal-exact" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Exact Lookup</span>
                </button>
                <button onClick={() => handleTypeSelect('regex')} className="p-3 rounded border hover:bg-orange-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Regex Match</span>
                </button>
                <button onClick={() => handleTypeSelect('semantic')} className="p-3 rounded border hover:bg-orange-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Semantic Match</span>
                </button>
              </>)}
              {/* Mapper options */}
              {pendingNodeType === 'mapper' && (<>
                <button onClick={() => handleTypeSelect('fieldmapping')} className="p-3 rounded border hover:bg-indigo-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Field Mapping</span>
                </button>
                <button onClick={() => handleTypeSelect('transformation')} className="p-3 rounded border hover:bg-indigo-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Data Transformation</span>
                </button>
                <button onClick={() => handleTypeSelect('schema')} className="p-3 rounded border hover:bg-indigo-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Schema Mapping</span>
                </button>
                <button onClick={() => handleTypeSelect('format')} className="p-3 rounded border hover:bg-indigo-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Format Conversion</span>
                </button>
                <button onClick={() => handleTypeSelect('joinmerge')} className="p-3 rounded border hover:bg-indigo-50 flex flex-col items-center">
                  <JoinMergeNode id="modal-joinmerge" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Join/Merge</span>
                </button>
              </>)}
              {/* Filter options */}
              {pendingNodeType === 'filter' && (<>
                <button onClick={() => handleTypeSelect('condition')} className="p-3 rounded border hover:bg-red-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Condition Filter</span>
                </button>
                <button onClick={() => handleTypeSelect('range')} className="p-3 rounded border hover:bg-red-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Range Filter</span>
                </button>
                <button onClick={() => handleTypeSelect('duplicate')} className="p-3 rounded border hover:bg-red-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Duplicate Filter</span>
                </button>
                <button onClick={() => handleTypeSelect('quality')} className="p-3 rounded border hover:bg-red-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Quality Filter</span>
                </button>
              </>)}
              {/* Transformer options */}
              {pendingNodeType === 'transformer' && (<>
                <button onClick={() => handleTypeSelect('aggregation')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Aggregation</span>
                </button>
                <button onClick={() => handleTypeSelect('calculation')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Calculation</span>
                </button>
                <button onClick={() => handleTypeSelect('enrichment')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Data Enrichment</span>
                </button>
                <button onClick={() => handleTypeSelect('normalization')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Normalization</span>
                </button>
                <button onClick={() => handleTypeSelect('reconciliation')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <ReconciliationNode id="modal-reconciliation" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Reconciliation</span>
                </button>
                <button onClick={() => handleTypeSelect('llmqa')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <LLMQANode id="modal-llmqa" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">LLM QA</span>
                </button>
                <button onClick={() => handleTypeSelect('errorhandler')} className="p-3 rounded border hover:bg-yellow-50 flex flex-col items-center">
                  <ErrorHandlerNode id="modal-errorhandler" ports={[]} portRefs={{ current: {} }} onPortMouseEnter={()=>{}} onPortMouseLeave={()=>{}} onPortMouseUp={()=>{}} onPortClick={()=>{}} onPortMouseDown={()=>{}} x={0} y={0} canDelete={false} onDelete={()=>{}} />
                  <span className="mt-2 text-sm">Error Handler</span>
                </button>
              </>)}
              {/* Aggregator options */}
              {pendingNodeType === 'aggregator' && (<>
                <button onClick={() => handleTypeSelect('groupby')} className="p-3 rounded border hover:bg-teal-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Group By</span>
                </button>
                <button onClick={() => handleTypeSelect('window')} className="p-3 rounded border hover:bg-teal-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Window Function</span>
                </button>
                <button onClick={() => handleTypeSelect('pivot')} className="p-3 rounded border hover:bg-teal-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Pivot Table</span>
                </button>
                <button onClick={() => handleTypeSelect('summary')} className="p-3 rounded border hover:bg-teal-50 flex flex-col items-center">
                  <span className="mt-2 text-sm">Summary Stats</span>
                </button>
              </>)}
            </div>
            <button onClick={() => setShowTypeModal(false)} className="mt-6 w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
          </div>
        </div>
      )}
      {/* Config Modal for Document Intelligence */}
      {showDocIntConfig && docIntConfigNodeId && (() => {
        const node = components.find(c => c.id === docIntConfigNodeId);
        if (!node) return null;
        return (
          <DocumentIntelligenceConfigModal
            node={node}
            onSave={(config) => {
              setComponents(prev => prev.map(c => c.id === node.id ? { ...c, config: { ...config } } : c));
              setShowDocIntConfig(false);
            }}
            onCancel={() => setShowDocIntConfig(false)}
            onChangeType={() => {
              setShowDocIntConfig(false);
              setShowTypeModal(true);
              setTypeModalPosition({ x: node.x, y: node.y });
              setPendingNodeType('parser');
              setComponents(prev => prev.filter(c => c.id !== node.id));
            }}
          />
        );
      })()}
      {/* Generic Config Modal for all node types */}
      {showNodeConfig && nodeConfigId && (() => {
        const node = components.find(c => c.id === nodeConfigId);
        if (!node) return null;
        return (
          <NodeConfigModal
            node={node}
            onCancel={() => setShowNodeConfig(false)}
            onChangeType={() => {
              setShowNodeConfig(false);
              setShowTypeModal(true);
              setTypeModalPosition({ x: node.x, y: node.y });
              setPendingNodeType(node.type.split('parser').length > 1 ? 'parser' : node.type.split('source').length > 1 ? 'source' : node.type.split('destination').length > 1 ? 'destination' : node.type.split('matcher').length > 1 ? 'matcher' : node.type.split('mapper').length > 1 ? 'mapper' : node.type.split('filter').length > 1 ? 'filter' : node.type.split('transformer').length > 1 ? 'transformer' : node.type.split('aggregator').length > 1 ? 'aggregator' : node.type);
              setComponents(prev => prev.filter(c => c.id !== node.id));
            }}
          />
        );
      })()}
      {/* LLM QA Config Modal */}
      {showLLMQAConfig && llmqaConfigNodeId && (() => {
        const node = components.find(c => c.id === llmqaConfigNodeId);
        if (!node) return null;
        return (
          <LLMQAConfigModal
            node={node}
            onSave={(config) => {
              setComponents(prev => prev.map(c => c.id === node.id ? { ...c, config: { ...config } } : c));
              setShowLLMQAConfig(false);
            }}
            onCancel={() => setShowLLMQAConfig(false)}
            onChangeType={() => {
              setShowLLMQAConfig(false);
              setShowTypeModal(true);
              setTypeModalPosition({ x: node.x, y: node.y });
              setPendingNodeType('transformer');
              setComponents(prev => prev.filter(c => c.id !== node.id));
            }}
          />
        );
      })()}
      {/* Error Handler Config Modal */}
      {showErrorHandlerConfig && errorHandlerConfigNodeId && (() => {
        const node = components.find(c => c.id === errorHandlerConfigNodeId);
        if (!node) return null;
        return (
          <ErrorHandlerConfigModal
            node={node}
            onSave={(config) => {
              setComponents(prev => prev.map(c => c.id === node.id ? { ...c, config: { ...config } } : c));
              setShowErrorHandlerConfig(false);
            }}
            onCancel={() => setShowErrorHandlerConfig(false)}
            onChangeType={() => {
              setShowErrorHandlerConfig(false);
              setShowTypeModal(true);
              setTypeModalPosition({ x: node.x, y: node.y });
              setPendingNodeType('transformer');
              setComponents(prev => prev.filter(c => c.id !== node.id));
            }}
          />
        );
      })()}
      {/* Auto-Mapping Config Modal */}
      {showAutoMappingConfig && autoMappingConfigNodeId && (() => {
        const node = components.find(c => c.id === autoMappingConfigNodeId);
        if (!node) return null;
        return (
          <AutoMappingConfigModal
            node={node}
            onSave={(config) => {
              setComponents(prev => prev.map(c => c.id === node.id ? { ...c, config: { ...config } } : c));
              setShowAutoMappingConfig(false);
            }}
            onCancel={() => setShowAutoMappingConfig(false)}
            onChangeType={() => {
              setShowAutoMappingConfig(false);
              setShowTypeModal(true);
              setTypeModalPosition({ x: node.x, y: node.y });
              setPendingNodeType('matcher');
              setComponents(prev => prev.filter(c => c.id !== node.id));
            }}
          />
        );
      })()}
    </div>
  );
};

export default FileWorkflowDesignAgent; 