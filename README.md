# Text-to-Speech Converter

A Next.js-based web application that converts text to speech using third-party APIs. Built with TypeScript, Tailwind CSS, and Docker, this app provides a simple yet powerful interface for users to generate speech from text.

---

## Features

- **Responsive UI**: Built with Tailwind CSS for a modern and mobile-friendly design.
- **Hybrid Rendering**: Combines server-side rendering (SSR) and client-side interactivity.
- **Third-Party API Integration**: Fetches available voices and generates speech using external APIs.
- **Containerized Deployment**: Dockerized for consistent environment setups.
- **Comprehensive Testing**: Includes unit tests (React Testing Library) and end-to-end tests (Playwright).

---

## Architecture Overview

The app follows a **Client-Server Architecture** with distinct layers and responsibilities.

### 1. Frontend Layer (Client-Side)
- **Role**: Manages user interactions, renders the UI, and communicates with the backend API.
- **Key Components**:
  - `TextInput`: Text box for user input.
  - `VoiceSelector`: Dropdown to select available voices.
  - `PlayButton`: Button to trigger text-to-speech conversion.
- **State Management**: Local state is managed with React's `useState`.
- **API Communication**: Axios is used to interact with backend APIs.
- **Styling**: Tailwind CSS ensures a clean and responsive design.

### 2. Backend Layer (Server-Side)
- **Role**: Processes API requests and interacts with third-party services.
- **API Routes**:
  - `/api/getVoices`: Fetches available voices from a third-party text-to-speech API.
  - `/api/synthesize`: Converts text to speech and returns an audio URL.
- **Server Rendering**: Uses Next.js's App Router for SSR and optimized performance.

### 3. Third-Party Services (Evenlabs)
- Provides external functionality for:
  - Fetching a list of available voices.
  - Generating speech from user input.

### 4. DevOps and Deployment Layer
- **Docker**: Containerized with a `Dockerfile` and managed via `docker-compose`.
- **Build System**: Uses Turbopack for fast development.
- **Hosting**: Ready for deployment on platforms like Vercel, AWS, or Azure.

---

## Data Flow

1. **User Interaction**:
   - The user enters text, selects a voice, and clicks the "Play" button.
2. **API Request**:
   - The frontend sends a request to the backend API (`/api/synthesize`) with the input text and selected voice.
3. **Third-Party API**:
   - The backend forwards the request to a third-party API for processing.
4. **Response**:
   - The backend returns the generated binary audio stream to the frontend.
5. **Audio Playback**:
   - The frontend plays the audio by creating an audio context and connecting it to a source i.e. speakers.

---

## Getting Started

### Prerequisites

- **Node.js**: v18+
- **Docker**: v20+
- **npm**: v8+

### Installation

1. Clone the repository:

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the app at `http://localhost:3000`.

### Docker Setup

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Run the container:
   ```bash
   docker-compose up
   ```

---

## File Structure

```plaintext
src/
├── app/                # App Router for Next.js pages
├── components/         # Reusable React components
├── lib/                # Custom Libraries & classes (e.g. TTSClient class)
├── pages/              # API routes
├── styles/             # styles
├
tests/
├── __tests__/          # Unit tests
├── e2e/                # End-to-end tests
```

---

## Testing

### Unit Tests

Run the unit tests using Jest and React Testing Library:
```bash
npm run test
```

### End-to-End Tests

Run Playwright tests for end-to-end functionality:
```bash
npx playwright test
```

---

## Deployment

### Production Build

1. Build the app for production:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t tts-converter .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 tts-converter
   ```

---
