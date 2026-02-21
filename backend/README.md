# AuthentiMed Backend Setup

## Backend Overview
This backend is a production-ready starter built with Node.js, Express, and TypeScript.
It provides the foundational API infrastructure for AuthentiMed and includes placeholders for future AI and blockchain integration.

## Tech Stack
- Node.js
- Express
- TypeScript
- dotenv
- cors
- helmet
- morgan
- ts-node-dev
- express-validator

## Setup and Run
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run in development:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start compiled server:
   ```bash
   npm start
   ```

Default server URL: `http://localhost:5000`

## API Endpoints
- `GET /api/health`
  - Response:
    ```json
    {
      "status": "ok",
      "message": "Backend running"
    }
    ```

- `POST /api/verify`
  - Request body:
    ```json
    {
      "drugId": "string",
      "batchNumber": "string"
    }
    ```
  - Current mock response:
    ```json
    {
      "success": true,
      "message": "Verification endpoint ready. AI and Blockchain integration pending."
    }
    ```

## Future Integration Plan
- AI microservice:
  - Integrate with a Python FastAPI service for drug image and metadata analysis.
- Blockchain smart contract:
  - Integrate ethers.js-based smart contract interactions for immutable verification records.
