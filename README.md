# Portfolio Analyzer

A modern web application for analyzing and managing investment portfolios with AI-powered insights.

## Features

- **Portfolio Management**: Add, edit, and track your stock holdings
- **AI-Powered Analysis**: Get intelligent insights about your portfolio performance
- **Real-time Data**: Live stock price updates and market data
- **Beautiful UI**: Modern glassmorphism design with animated backgrounds
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Glassmorphism UI design
- Custom animations and effects

### Backend
- Node.js
- Express.js
- JWT Authentication
- RESTful API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio-analyzer.git
cd portfolio-analyzer
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with your configuration:
```
PORT=5000
JWT_SECRET=your_jwt_secret
STOCK_API_KEY=your_stock_api_key
AI_API_KEY=your_ai_api_key
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio/add-stock` - Add stock to portfolio
- `GET /api/analysis` - Get AI analysis of portfolio

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/portfolio-analyzer](https://github.com/yourusername/portfolio-analyzer)
