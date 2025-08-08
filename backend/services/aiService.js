const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzePortfolio(portfolioData) {
    const { holdings, summary } = portfolioData;
    
    const prompt = `
    Analyze this investment portfolio and provide insights in simple, easy-to-understand language:

    Portfolio Summary:
    - Total Value: $${summary.totalValue.toFixed(2)}
    - Total Investment: $${summary.totalInvestment.toFixed(2)}
    - Total Gain/Loss: $${summary.totalGainLoss.toFixed(2)} (${summary.totalGainLossPercent.toFixed(2)}%)

    Holdings:
    ${holdings.map(holding => `
    - ${holding.symbol}: ${holding.quantity} shares
      Current Price: $${holding.currentPrice}
      Purchase Price: $${holding.purchasePrice}
      Current Value: $${holding.currentValue.toFixed(2)}
      Gain/Loss: $${holding.gainLoss.toFixed(2)} (${holding.gainLossPercent.toFixed(2)}%)
    `).join('')}

    Please provide:
    1. Overall portfolio performance assessment
    2. Risk analysis
    3. Diversification insights
    4. 3 specific actionable recommendations
    5. Market trend explanation

    Use simple language that a beginner investor can understand. Avoid jargon.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly financial advisor who explains investment concepts in simple terms. Always provide actionable advice and explain the reasoning behind recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  async explainMarketTrend(stockData) {
    const prompt = `
    Explain the current market trend for ${stockData.symbol} (${stockData.name}) in simple terms:

    Current Price: $${stockData.price}
    Daily Change: $${stockData.change} (${stockData.changePercent.toFixed(2)}%)
    Day Range: $${stockData.dayLow} - $${stockData.dayHigh}
    Volume: ${stockData.volume}

    Please explain:
    1. What this price movement means
    2. Whether this is a good or bad sign
    3. What factors might be causing this trend
    4. Simple recommendation for investors

    Keep it under 200 words and use beginner-friendly language.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful financial educator who explains market movements in simple, non-technical terms."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Market trend explanation failed: ${error.message}`);
    }
  }
}

module.exports = new AIService();