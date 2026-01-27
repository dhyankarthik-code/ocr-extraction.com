# System Architecture & Data Flow

This document provides a comprehensive visual and technical breakdown of the `ocr-extraction.com` platform.

## 1. Master Architecture (Vertical Stack)
*Best viewed on Desktop. Scroll down for detailed flows.*

```mermaid
graph TD
    %% Global Styles
    classDef default fill:#fff,stroke:#000,stroke-width:2px,color:#000;
    classDef cluster fill:#f9f9f9,stroke:#000,stroke-width:2px,color:#000;
    classDef highlight fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000;
    
    %% FORCE RED CONNECTIONS
    linkStyle default stroke:#d50000,stroke-width:4px,fill:none;

    %% --- Actors ---
    User[User / Client Device]
    Crawler[Search Crawler]

    %% --- Frontend Layer ---
    subgraph Frontend [1. Client Layer]
        direction TB
        Page[Landing Page]
        Upload[Smart Upload Zone]
        Camera[Camera Capture]
        Poll[Polling Loop]
    end

    %% --- API Layer ---
    subgraph API [2. Serverless API Layer]
        direction TB
        Router{OCR Router /api/ocr}:::highlight
        Status[Status Endpoint]
        Middleware[Auth/RateLimit]
    end

    %% --- Async Process ---
    subgraph Async [3. Async Engine]
        direction TB
        Inngest[Inngest Queue]
        Worker[OCR Worker]:::highlight
    end

    %% --- Data Layer ---
    subgraph Data [4. Data & AI Services]
        direction TB
        Redis[(Redis Cache)]
        DB[(Supabase DB)]
        Mistral[Mistral AI]
    end

    %% Flow Connections (Vertical Spine)
    User -->|Action| Frontend
    Crawler -->|Index| Page

    Frontend -->|Request| Middleware
    Middleware -->|Pass| API

    %% Logic Split
    Router -->|If Small| Mistral
    Router -->|If Large/PDF| Inngest
    
    %% Async Loop
    Inngest -->|Trigger| Worker
    Worker -->|Process| Mistral
    Worker -->|Update| Redis
    
    %% Polling Loop
    Poll -.->|Check| Status
    Status -->|Read| Redis
    
    %% Storage
    Router --> DB
    Worker --> DB
```

## 2. Detailed Flows (Zoomed In)

### A. The Hybrid OCR Decision Flow
How the system decides between Fast (Sync) and Heavy (Async).

```mermaid
graph TD
    classDef default fill:#fff,stroke:#000,color:#000;
    linkStyle default stroke:#d50000,stroke-width:4px,fill:none;
    
    Req(User Upload) -->|POST /api/ocr| Check{Size > 4MB <br/> OR PDF?}
    
    %% Fast Path
    Check -- No (Small Img) --> Sync[Direct to Mistral]
    Sync -->|Wait 3s| Res[Return JSON Result]
    
    %% Slow Path
    Check -- Yes (Large/PDF) --> Async[Send to Inngest]
    Async -->|Return 202| Queued[Return 'JobQueued']
    
    %% Feeback Loop
    Queued -->|Client| Client[Client Polling Mode]
    Client -->|GET /status| Redis[(Check Redis)]
    Redis -->|'Processing'| Client
    Redis -->|'Completed'| Done(Render Result)
```

### B. Auto-Scaling & Security
How we handle scale and bots.

```mermaid
graph LR
    classDef default fill:#fff,stroke:#000,color:#000;
    linkStyle default stroke:#d50000,stroke-width:4px,fill:none;

    User -->|1. Solve| Captcha[ReCAPTCHA]
    Captcha -->|2. Token| API
    API -->|3. Validate| Google
    Google -->|4. Score > 0.5| Allowed
    Allowed -->|5. Check Limit| Redis[(Rate Limit)]
    Redis -->|OK| Process
```

---

## 3. Component Deep Dive

### A. The Hybrid OCR Engine
This is the core innovation. It prevents timeout crashes while keeping valid requests fast.

*   **Logic**: The `/api/ocr` route acts as a **Traffic Cop**.
    *   **Images (< 4MB)**: Processed **Synchronously**. The user waits ~2-5 seconds. Response is immediate.
    *   **PDFs / Large Files**: Processed **Asynchronously**.
        1.  API generates a `Job ID`.
        2.  Payload is sent to **Inngest**.
        3.  API results `202 Accepted` to the Frontend.
        4.  Frontend enters "Polling Mode", asking Redis "Is Job X done?" every 2 seconds.

### B. Inngest Integration (The Async Backbone)
Inngest handles the "heavy lifting" that would otherwise kill a Vercel Serverless Function.

*   **Trigger**: `inngest.send({ name: "ocr/process.requested", data: { file... } })`
*   **Execution**:
    1.  **Step 0**: Set Redis status to `processing`.
    2.  **Step 1**: Upload file to Mistral (if PDF).
    3.  **Step 2**: Wait for Mistral (can take 30s-60s).
    4.  **Step 3**: On success, write result to Redis key `job:{id}` and expire in 24h.
*   **Reliability**: If Mistral fails, Inngest automatically retries 3 times.

### C. Data & Availability
*   **Supabase (Postgres)**: Stores Profile, Usage Logs, and Credits.
*   **Upstash (Redis)**: Handles Rate Limiting and Temporary Job Status storage.

### D. Security & Analytics
*   **ReCAPTCHA**: Protects API form bot abuse.
*   **GA4**: Tracks user behavior and conversion events.
*   **Resend**: Reliable email delivery infrastructure.

## 4. Cron Jobs (Automated Maintenance)

```mermaid
sequenceDiagram
    participant VercelCron as Vercel Cron
    participant API as /api/cron
    participant DB as Supabase DB

    rect rgba(213, 0, 0, 0.1)
        Note right of VercelCron: Daily Reset Loop
        VercelCron->>API: Trigger Daily (00:00 UTC)
        API->>DB: Reset Usage Limits
        DB-->>API: Success
        API-->>VercelCron: 200 OK
    end
```
