const yahooFinance = require('yahoo-finance2').default;

class StockService {
  async getStockPrice(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol);
      return {
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        previousClose: quote.regularMarketPreviousClose,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        name: quote.longName || quote.shortName
      };
    } catch (error) {
      throw new Error(`Failed to fetch stock data for ${symbol}: ${error.message}`);
    }
  }

  async getMultipleStocks(symbols) {
    try {
      const promises = symbols.map(symbol => this.getStockPrice(symbol));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            symbol: symbols[index],
            error: result.reason.message
          };
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch multiple stocks: ${error.message}`);
    }
  }

  async getHistoricalData(symbol, period = '1y') {
    try {
      const historical = await yahooFinance.historical(symbol, {
        period1: this.getPeriodStart(period),
        period2: new Date()
      });
      
      return historical.map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));
    } catch (error) {
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error.message}`);
    }
  }

  getPeriodStart(period) {
    const now = new Date();
    switch (period) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '1w':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1m':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3m':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
  }

  calculateMetrics(holdings, stockPrices) {
    let totalValue = 0;
    let totalInvestment = 0;
    let totalGainLoss = 0;

    const analysis = holdings.map(holding => {
      // Extract data from mongoose document - use _doc if available
      const holdingData = holding._doc || holding;
      
      const stockData = stockPrices.find(stock => stock.symbol === holdingData.symbol);
      if (!stockData || stockData.error) {
        return {
          symbol: holdingData.symbol,
          quantity: holdingData.quantity,
          purchasePrice: holdingData.purchasePrice,
          purchaseDate: holdingData.purchaseDate,
          _id: holdingData._id,
          error: 'Unable to fetch current price'
        };
      }

      const currentValue = holdingData.quantity * stockData.price;
      const investment = holdingData.quantity * holdingData.purchasePrice;
      const gainLoss = currentValue - investment;
      const gainLossPercent = (gainLoss / investment) * 100;

      totalValue += currentValue;
      totalInvestment += investment;
      totalGainLoss += gainLoss;

      return {
        symbol: holdingData.symbol,
        quantity: holdingData.quantity,
        purchasePrice: holdingData.purchasePrice,
        purchaseDate: holdingData.purchaseDate,
        _id: holdingData._id,
        currentPrice: stockData.price,
        currentValue,
        investment,
        gainLoss,
        gainLossPercent,
        stockData
      };
    });

    const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    return {
      holdings: analysis,
      summary: {
        totalValue,
        totalInvestment,
        totalGainLoss,
        totalGainLossPercent
      }
    };
  }
}

module.exports = new StockService();