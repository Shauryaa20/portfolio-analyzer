import React, { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown, Info, Zap, AlertTriangle } from 'lucide-react';
import { portfolioAPI } from '../services/api';

const HoldingsList = ({ holdings, onRemoveStock }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [trendExplanation, setTrendExplanation] = useState(null);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [removingStock, setRemovingStock] = useState(null);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00%';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatQuantity = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    return value.toString();
  };

  const explainTrend = async (symbol) => {
    try {
      setLoadingTrend(true);
      setSelectedStock(symbol);
      const response = await portfolioAPI.explainTrend(symbol);
      setTrendExplanation(response.data);
    } catch (error) {
      console.error('Failed to get trend explanation:', error);
      setTrendExplanation({
        explanation: 'Unable to fetch trend explanation at this time. Please try again later.'
      });
    } finally {
      setLoadingTrend(false);
    }
  };

  const handleRemoveStock = async (symbol) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      try {
        setRemovingStock(symbol);
        // Call the onRemoveStock function passed from parent
        await onRemoveStock(symbol);
        // Close any open trend explanations for this stock
        if (selectedStock === symbol) {
          setSelectedStock(null);
          setTrendExplanation(null);
        }
      } catch (error) {
        console.error('Failed to remove stock:', error);
        // Error handling is done in the parent component
      } finally {
        setRemovingStock(null);
      }
    }
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-cyber-blue" />
        </div>
        <p className="text-gray-400 font-inter text-lg">No holdings yet</p>
        <p className="text-gray-500 font-inter text-sm mt-2">Add your first stock to get started with AI-powered analysis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {holdings.map((holding, index) => {
        const isPositive = holding.gainLoss && holding.gainLoss >= 0;
        const isRemoving = removingStock === holding.symbol;
        const hasError = holding.error;
        
        return (
          <div 
            key={`${holding.symbol}-${holding.quantity}-${holding.purchasePrice}-${index}`} 
            className={`glass-dark border border-white/10 rounded-xl p-6 hover-lift transition-all duration-300 ${isRemoving ? 'opacity-50' : ''} group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  hasError 
                    ? 'bg-red-500/20 text-red-400'
                    : isPositive 
                      ? 'bg-gradient-to-r from-cyber-green to-green-500 text-white'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }`}>
                  {hasError ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-bold font-inter">
                      {holding.symbol.substring(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white font-inter">{holding.symbol}</h3>
                  {hasError && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full font-inter">
                      Data Error
                    </span>
                  )}
                </div>
                {!hasError && (
                  <button
                    onClick={() => explainTrend(holding.symbol)}
                    disabled={isRemoving}
                    className="p-2 glass rounded-lg text-cyber-blue hover:text-white hover:bg-cyber-blue/20 transition-all duration-300 disabled:cursor-not-allowed group-hover:animate-pulse"
                    title="Get AI trend explanation"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleRemoveStock(holding.symbol)}
                disabled={isRemoving}
                className="p-3 glass rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover-lift"
                title="Remove stock"
              >
                {isRemoving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {hasError ? (
              <div className="glass-dark border border-red-400/50 rounded-xl p-4 mb-4">
                <p className="text-red-300 text-sm font-inter">{holding.error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="space-y-1">
                  <p className="text-gray-400 font-inter">Quantity</p>
                  <p className="font-semibold text-white font-inter">{formatQuantity(holding.quantity)} shares</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 font-inter">Purchase Price</p>
                  <p className="font-semibold text-white font-inter">{formatCurrency(holding.purchasePrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 font-inter">Current Price</p>
                  <p className="font-semibold text-white font-inter">{formatCurrency(holding.currentPrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 font-inter">Current Value</p>
                  <p className="font-semibold text-white font-inter">{formatCurrency(holding.currentValue)}</p>
                </div>
              </div>
            )}
            
            {!hasError && (
              <div className={`flex items-center justify-between p-4 glass rounded-xl ${
                isPositive ? 'border-cyber-green/30' : 'border-red-400/30'
              }`}>
                <div className={`flex items-center space-x-2 ${isPositive ? 'text-cyber-green' : 'text-red-400'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span className="font-bold font-inter">
                    {formatCurrency(holding.gainLoss)} ({formatPercentage(holding.gainLossPercent)})
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-cyber-green' : 'bg-red-400'} animate-pulse`}></div>
              </div>
            )}

            {selectedStock === holding.symbol && trendExplanation && (
              <div className="mt-4 glass-dark border border-cyber-blue/50 rounded-xl p-4 animate-slide-down">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-cyber-blue rounded-lg flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-bold text-cyber-blue font-inter">AI Trend Analysis</h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-inter">
                  {trendExplanation.explanation}
                </p>
                <button
                  onClick={() => {
                    setSelectedStock(null);
                    setTrendExplanation(null);
                  }}
                  className="mt-3 text-cyber-blue hover:text-white text-sm font-inter transition-colors"
                >
                  Close Analysis
                </button>
              </div>
            )}

            {selectedStock === holding.symbol && loadingTrend && (
              <div className="mt-4 glass rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyber-blue"></div>
                  <p className="text-gray-300 font-inter">AI is analyzing market trends...</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HoldingsList;