# ConveyAI - Real-time Conveyancing Management System

ConveyAI is a comprehensive conveyancing management system designed for property professionals in Australia. It streamlines the process of managing property transactions, clients, documents, and tasks.

## Features

- Multi-tenant architecture for different conveyancing firms
- Matter management for property sales, purchases, and transfers
- Client/contact management with identity verification
- Hierarchical document organization and management
- Task management with to-do lists
- Dashboard with key metrics and statistics
- User authentication and role-based access control

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT for authentication

### Frontend
- React
- React Router
- TailwindCSS
- Context API for state management
- Axios for API requests

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd conveyai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create backend .env file
cp backend/.env.example backend/.env

# Create frontend .env file
cp frontend/.env.example frontend/.env
```

4. Update environment variables with your database credentials and other settings

5. Set up the database
```bash
npm run setup:db
```

6. Start the development servers
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
conveyai/
├── backend/         # Node.js/Express backend
│   ├── prisma/      # Prisma schema and migrations
│   └── src/         # Backend source code
├── frontend/        # React frontend
│   ├── public/      # Static files
│   └── src/         # Frontend source code
└── uploads/         # Document storage
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Prisma](https://www.prisma.io/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
