**Technical Specification Document for FlowLibre Studio**

---

### 1. Overview
This document outlines the technical architecture, components, and functionalities of a document-centric project workflow application. The goal is to enable users to create, design, and run intelligent workflows for handling document types such as Invoices, Contracts, Bills of Lading (BoLs), and Payment Slips using a modular visual interface backed by cloud-native and containerized services.

---

### 2. Project Types
The application supports multiple project types, offering flexibility for various automation and data processing use cases beyond just document workflows.

- **Currently Supported Project Type:**
  - **File Work Flow**: This project type focuses on workflows that ingest PDF documents (e.g., Invoices, Contracts, BoLs, Payment Slips), parse them, match their content against reference datasets, and export structured outputs to downstream systems.

Additional project types may be introduced in future versions to support broader or more specialized scenarios (e.g., Image-Based Workflows, Real-Time Document Streams).

---

### 3. Project Views
Each project, once opened, presents a set of internal views tailored to the selected project type. These views are **not** visible on the FlowLibre Studio home screen.

The following views are specific to the "File Work Flow" project type:

#### 3.1 Dashboard View
- **Purpose:** Display key operational metrics with filtering capabilities.
- **Filtering Options:**
  - Date Range Picker
  - File Types
  - Processing Status

- **Metrics (with drill-down capabilities):**
  a. Total Files Processed
  b. Files Parsed Successfully
  c. Files Mapped to Lookup Data
  d. Files Needing Manual Intervention
  e. Files Not Mapped and Needing Manual Action
  f. Suggested Additional Metrics:
     - Files in Retry Queue
     - Files Failed During Parsing
     - Top Lookup Sources Used
     - Most Common Document Types Processed

---

#### 3.2 Design Flow View
- **Purpose:** Visually build ETL-style workflows.
- **Component Palette:** (Draggable from side panel)

##### a. Source Component
- **Connectors:**
  - SFTP
  - Amazon S3
  - Azure Blob Storage
  - Google Cloud Storage (optional future support)
- **Connection Fields:** Endpoint, Access Key, Secret, Folder Path, Test Connection
- **Supported File Types:** PDFs only (for now)

##### b. File Parser Component
- **Supported Engines:**
  - AWS Textract (API + container)
  - Azure Document Intelligence (API + container)
- **Deployment Architecture:**
  - **Cloud Mode:** Use native AWS or Azure API endpoints to send files for parsing when cloud usage is permitted.
  - **Local Mode:** Option to deploy containerized versions of Textract or Document Intelligence services on-premise.
    - Containers are pulled from private or public container registries (e.g., ECR, ACR, Docker Hub).
    - Files are processed locally without any data leaving the customer network.
    - Requires GPU or CPU resources and volume mounts to input/output directories.
  - The selection between local vs. cloud mode is configurable per project or per component.
- **Connector Visualization:**
  - Automatically link upstream and downstream components
  - Clickable edge shows data preview from previous component

##### c. Data Matcher Component
- **Supported Lookup Sources:**
  - TXT / CSV File
  - Excel / Google Sheet
  - SQL Server Table / Query
- **Matching Engines:**
  - Azure AI Match API (custom model)
  - AWS Comprehend Custom Entity Matching
  - Local matching service using spaCy / FuzzyWuzzy in container
- **Architecture:**
  - **Cloud Mode:** Use remote AWS/Azure APIs for lookup matching and enrichment.
  - **Local Mode:** Deploy the matching engine locally in containers or as Python microservices to ensure data never leaves the premises.
    - All lookup files and parsed content remain on the secure internal network.
    - The container may reuse the same base as the file parser for co-located services.
  - Optional deployment in same container as File Parser
  - Matching microservice can use RESTful API layer
- **Field Mapping UI:**
  - Two-panel view:
    - Left: Extracted PDF fields
    - Right: Lookup source columns
  - Drag-and-drop for creating mappings
  - Add new fields if needed
- **Match Confidence Feature:**
  - Highlight matches with confidence score < 90%
  - Allow override by:
    - Selecting from suggestions
    - Manual override by user
- **Feedback-Based Model Tuning:**
  - All manual corrections made by users (e.g., choosing different match or entering a value manually) are logged and stored as feedback entries.
  - A feedback manager service monitors these entries and uses them to create labeled datasets.
  - These datasets feed into a periodic model retraining pipeline (using Azure ML, SageMaker, or local scripts).
  - Updated models are tested and deployed automatically or manually after QA.
  - A toggle per project allows enabling/disabling feedback learning per matcher instance.
- **Connectors:**
  - Save to Files: CSV, Avro, Parquet, Excel, TXT
  - Save to SQL Server:
    - Table Insert
    - Update existing column based on primary key match

##### d. Destination Component
- **Purpose:** Configure final output destinations for processed data
- **Supported Destinations:**
  - **File Systems:** Local storage, network shares, cloud storage
  - **Databases:** SQL Server, PostgreSQL, MongoDB
  - **APIs:** REST endpoints, webhooks
  - **Message Queues:** RabbitMQ, Azure Service Bus
- **Configuration Options:**
  - Output format selection (CSV, JSON, XML, etc.)
  - Data transformation rules
  - Scheduling and frequency settings
  - Error handling and retry policies

##### e. Save & Run Flow
- **Functionality:**
  - Save current design to backend (YAML or JSON spec)
  - Trigger async job to execute components sequentially
  - Show runtime logs and intermediate outputs

---

#### 3.3 LLM View
- **Purpose:** Interact with processed data using an LLM
- **Supported Providers:**
  - Azure OpenAI Service
  - Amazon Bedrock (Anthropic, Cohere, etc.)
- **Modes:**
  - Online Mode (API-based)
  - Local Mode (Ollama, LM Studio)
- **Features:**
  - Natural Language Q&A
  - Use Retrieval-Augmented Generation (RAG) to query processed outputs
  - File selection or filter-driven RAG index scope

---

### 3.4 Error Handling and Validation
- **Graceful Failures:** Each component should return meaningful error messages and exit codes.
- **Retries:** Parser and Matcher components support retry logic with exponential backoff for transient failures.
- **Validation:** Input and output schemas are validated at each step; alerts triggered on validation mismatches.

### 3.5 API Documentation
- **Specification Format:** OpenAPI 3.0 (Swagger UI auto-generated)
- **Coverage:** Project CRUD, File Upload, Flow Execution, LLM Query
- **Access:** Available at `/docs` endpoint (Swagger UI) and `/openapi.json` for machine-readable formats

### 3.6 Testing Strategy
- **Unit Tests:** Written for all core functions and services (pytest, unittest)
- **Integration Tests:** Validate service interactions, parsing + matching end-to-end
- **E2E Tests:** Cypress or Playwright-based tests for UI workflows
- **CI/CD Integration:** GitHub Actions or Azure DevOps for test automation

### 3.7 Performance & Scalability
- **Horizontal Scaling:** Stateless services run on Kubernetes with horizontal pod autoscaling
- **Batch Processing:** Large file batches are queued and processed in worker pools
- **Throughput Metrics:** Expose custom Prometheus metrics for processing time, queue length, etc.
- **LLM Caching:** RAG index results and common questions are cached with Redis or local store

### 3.8 Resource Requirements
See "Resource Intensity Overview" breakdown:
- **Small Team Deployment:** 8 vCPU, 32 GB RAM, 250 GB SSD
- **Production Load:** 16–32 vCPU, 64–128 GB RAM, optional GPU for parsing/LLMs
- **Component Isolation:** Optionally deploy Parser, Matcher, LLM services on dedicated nodes

### 4. Backend Architecture
- **Microservices-Based** with the following key services:
  - **Project Service** (CRUD project metadata)
  - **File Service** (Upload, storage, and access)
  - **Parser Service** (Cloud + container logic)
  - **Matcher Service** (Azure/AWS/local matching logic)
  - **LLM Service** (Query interface)
- **Data Store:**
  - PostgreSQL or MongoDB for metadata
  - MinIO or Azure Blob for file storage
- **Queue:**
  - RabbitMQ or Azure Service Bus for job orchestration
- **Orchestration Engine:**
  - Prefect or Temporal for running multi-step pipelines

---

### 5. Frontend UI Framework
- **React + TailwindCSS** with state managed via Redux or Zustand
- **Drag-and-Drop UI:**
  - Use `react-flow` or `dagre` for visual workflow canvas
- **Field Mapping View:**
  - Use dynamic tables with inline editing (e.g., `ag-grid`)

---

### 6. Security and Access Control
- **Authentication:** OAuth2 / Azure AD
- **RBAC:** Role-based view/edit rights per project
- **Audit Logs:** All actions (upload, parse, match, edit) logged with timestamp

---

### 7. Deployment & Environments
- **Local (Dev):** Docker Compose
- **Staging & Prod:** Kubernetes on AKS or EKS
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack or Azure Monitor

---

### 8. Roadmap (Future)
- Add support for image-based documents (JPEG, PNG)
- Add custom component creation interface

---

### Appendix
- **Glossary**
  - BoL: Bill of Lading
  - RAG: Retrieval-Augmented Generation
  - RBAC: Role-Based Access Control
  - AKS: Azure Kubernetes Service
  - EKS: Elastic Kubernetes Service (AWS)

