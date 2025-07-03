# FU Self Learning UI
HHE
A modern web application built with Next.js, TypeScript, and Ant Design for the FU Self Learning platform.

## 🚀 Features

- Built with Next.js 15.3.1 and React 19
- TypeScript for type safety
- Ant Design for UI components
- Redux Toolkit for state management
- React Query for data fetching
- TailwindCSS for styling
- Docker support for containerization

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd fu-self-learning-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables.

## 🏃‍♂️ Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Building for Production

To build the application:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## 🐳 Docker Deployment

Build and run the application using Docker:

```bash
docker-compose up --build
```

## 📁 Project Structure

```
src/
├── app/          # Next.js app directory
├── components/   # Reusable React components
├── context/      # React context providers
├── hooks/        # Custom React hooks
├── providers/    # Application providers
├── shared/       # Shared utilities and constants
└── utils/        # Utility functions
```

## 🧪 Testing

Run the linter:

```bash
npm run lint
# or
yarn lint
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.1
- **Language:** TypeScript
- **UI Library:** Ant Design
- **State Management:** Redux Toolkit
- **Data Fetching:** React Query
- **Styling:** TailwindCSS
- **Containerization:** Docker

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]
