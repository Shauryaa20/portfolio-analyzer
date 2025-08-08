const express = require('express');
const Portfolio = require('../models/Portfolio');
const stockService = require('../services/stockService');
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Get current stock prices
    const symbols = portfolio.holdings.map(holding => holding.symbol);
    const stockPrices = await stockService.getMultipleStocks(symbols);

    // Calculate metrics
    const analysis = stockService.calculateMetrics(portfolio.holdings, stockPrices);

    res.json({
      portfolio: portfolio.toObject(),
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update portfolio
router.post('/', auth, async (req, res) => {
  try {
    const { name, holdings } = req.body;

    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (portfolio) {
      portfolio.name = name || portfolio.name;
      portfolio.holdings = holdings || portfolio.holdings;
    } else {
      portfolio = new Portfolio({
        userId: req.userId,
        name: name || 'My Portfolio',
        holdings: holdings || []
      });
    }

    await portfolio.save();

    res.json({
      message: 'Portfolio updated successfully',
      portfolio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add stock to portfolio
router.post('/add-stock', auth, async (req, res) => {
  try {
    const { symbol, quantity, purchasePrice, purchaseDate } = req.body;

    // Validate required fields
    if (!symbol || !quantity || !purchasePrice) {
      return res.status(400).json({ error: 'Symbol, quantity, and purchase price are required' });
    }

    // Validate numeric values
    if (isNaN(quantity) || isNaN(purchasePrice) || quantity <= 0 || purchasePrice <= 0) {
      return res.status(400).json({ error: 'Quantity and purchase price must be positive numbers' });
    }

    const symbolUpper = symbol.toUpperCase();
    console.log(`Adding stock ${symbolUpper} for user ${req.userId}`);

    // Validate stock symbol
    try {
      await stockService.getStockPrice(symbolUpper);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid stock symbol or unable to fetch stock data' });
    }

    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        userId: req.userId,
        holdings: []
      });
    }

    // Check if stock already exists
    const existingHolding = portfolio.holdings.find(holding => holding.symbol === symbolUpper);
    
    if (existingHolding) {
      // Update existing holding - calculate weighted average price
      const oldValue = existingHolding.quantity * existingHolding.purchasePrice;
      const newValue = parseFloat(quantity) * parseFloat(purchasePrice);
      const totalQuantity = existingHolding.quantity + parseFloat(quantity);
      
      existingHolding.quantity = totalQuantity;
      existingHolding.purchasePrice = (oldValue + newValue) / totalQuantity;
      console.log(`Updated existing holding for ${symbolUpper}`);
    } else {
      // Add new holding
      portfolio.holdings.push({
        symbol: symbolUpper,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: new Date(purchaseDate || Date.now())
      });
      console.log(`Added new holding for ${symbolUpper}`);
    }

    await portfolio.save();

    res.json({
      message: 'Stock added successfully',
      portfolio: portfolio.toObject()
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove stock from portfolio
router.delete('/remove-stock/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const symbolUpper = symbol.toUpperCase();

    console.log(`Removing stock ${symbolUpper} for user ${req.userId}`);

    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const initialLength = portfolio.holdings.length;
    portfolio.holdings = portfolio.holdings.filter(holding => holding.symbol !== symbolUpper);
    
    if (portfolio.holdings.length === initialLength) {
      return res.status(404).json({ error: 'Stock not found in portfolio' });
    }

    await portfolio.save();
    console.log(`Stock ${symbolUpper} removed successfully`);

    res.json({
      message: 'Stock removed successfully',
      portfolio: portfolio.toObject()
    });
  } catch (error) {
    console.error('Error removing stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI analysis
router.get('/ai-analysis', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    if (!portfolio || portfolio.holdings.length === 0) {
      return res.status(400).json({ error: 'No portfolio data available for analysis' });
    }

    // Get current stock prices
    const symbols = portfolio.holdings.map(holding => holding.symbol);
    const stockPrices = await stockService.getMultipleStocks(symbols);

    // Calculate metrics
    const analysis = stockService.calculateMetrics(portfolio.holdings, stockPrices);

    // Get AI analysis
    const aiAnalysis = await aiService.analyzePortfolio(analysis);

    res.json({
      analysis: aiAnalysis,
      portfolioData: analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stock trend explanation
router.get('/explain-trend/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;

    const stockData = await stockService.getStockPrice(symbol);
    const explanation = await aiService.explainMarketTrend(stockData);

    res.json({
      explanation,
      stockData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

