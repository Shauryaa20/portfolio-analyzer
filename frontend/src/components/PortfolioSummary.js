import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

const PortfolioSummary = ({ summary }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const isPositive = summary.totalGainLoss >= 0;

  const cards = [
    {
      title: 'Total Value',
      value: formatCurrency(summary.totalValue || 0),
      icon: DollarSign,
      gradient: 'from-cyber-blue to-blue-500',
      glow: 'neon-blue',
      description: 'Current portfolio worth'
    },
    {
      title: 'Total Investment',
      value: formatCurrency(summary.totalInvestment || 0),
      icon: PieChart,
      gradient: 'from-gray-500 to-gray-600',
      glow: '',
      description: 'Total amount invested'
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(summary.totalGainLoss || 0),
      icon: isPositive ? TrendingUp : TrendingDown,
      gradient: isPositive ? 'from-cyber-green to-green-500' : 'from-red-500 to-red-600',
      glow: isPositive ? 'neon-green' : 'neon-red',
      description: 'Profit/Loss amount',
      isPositive
    },
    {
      title: 'Return %',
      value: formatPercentage(summary.totalGainLossPercent || 0),
      icon: isPositive ? TrendingUp : TrendingDown,
      gradient: isPositive ? 'from-cyber-purple to-purple-500' : 'from-red-500 to-red-600',
      glow: isPositive ? 'neon-purple' : 'neon-red',
      description: 'Percentage return',
      isPositive
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title}
            className={`glass rounded-2xl border border-white/20 p-6 hover-lift transition-all duration-300 group ${card.glow}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300 font-inter">{card.title}</p>
                <p className="text-xs text-gray-400 font-inter">{card.description}</p>
              </div>
              <div className={`p-3 bg-gradient-to-r ${card.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className={`text-2xl font-bold font-inter ${
                card.isPositive !== undefined 
                  ? (card.isPositive ? 'text-cyber-green' : 'text-red-400')
                  : 'text-white'
              }`}>
                {card.value}
              </p>
              
              {/* Performance indicator */}
              {card.isPositive !== undefined && (
                <div className={`flex items-center space-x-2 ${
                  card.isPositive ? 'text-cyber-green' : 'text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    card.isPositive ? 'bg-cyber-green' : 'bg-red-400'
                  } animate-pulse`}></div>
                  <span className="text-xs font-inter">
                    {card.isPositive ? 'Gaining' : 'Losing'}
                  </span>
                </div>
              )}
            </div>

            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse"></div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioSummary;