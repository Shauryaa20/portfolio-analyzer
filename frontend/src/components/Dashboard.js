import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import PortfolioSummary from './PortfolioSummary';
import HoldingsList from './HoldingsList';
import AddStockForm from './AddStockForm';
import AIAnalysis from './AIAnalysis';
import { Plus, Brain, AlertCircle, Zap, Activity } from 'lucide-react';

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing updates

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any existing errors
      const response = await portfolioAPI.getPortfolio();
      setPortfolioData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setPortfolioData({ portfolio: { holdings: [] }, analysis: { holdings: [], summary: {} } });
        setError(null); // Clear error for 404 as it's handled
      } else {
        console.error('Portfolio fetch error:', error);
        setError(error.response?.data?.error || 'Failed to fetch portfolio');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (stockData) => {
    try {
      setError(null); // Clear any existing errors
      await portfolioAPI.addStock(stockData);
      await fetchPortfolio();
      setShowAddForm(false);
      setAIAnalysis(null); // Clear AI analysis when new stock is added
    } catch (error) {
      console.error('Failed to add stock:', error);
      setError(error.response?.data?.error || 'Failed to add stock');
    }
  };

  const handleRemoveStock = async (symbol) => {
    try {
      setError(null); // Clear any existing errors
      
      await portfolioAPI.removeStock(symbol);
      
      // Refresh the portfolio data
      await fetchPortfolio();
      
      // Clear AI analysis if it exists
      setAIAnalysis(null);
      
      // Force refresh key update
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error('Failed to remove stock:', error);
      setError(error.response?.data?.error || 'Failed to remove stock');
    }
  };

  const getAIAnalysis = async () => {
    try {
      setLoadingAI(true);
      const response = await portfolioAPI.getAIAnalysis();
      setAIAnalysis(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to get AI analysis');
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent bg-gradient-to-r from-cyber-blue to-cyber-purple"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-cyber-blue opacity-20"></div>
          <div className="absolute inset-2 bg-cyber-dark rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-cyber-blue animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-slide-up">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-neon-gradient rounded-xl flex items-center justify-center neon-blue">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text font-inter">Portfolio Command Center</h1>
          </div>
        </div>
        <p className="text-gray-300 text-lg font-inter max-w-2xl mx-auto">
          Real-time portfolio tracking with AI-powered insights and advanced analytics
        </p>
      </div>

      {error && (
        <div className="glass-dark border border-red-400/50 rounded-xl p-6 animate-slide-down">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-300 font-semibold font-inter">System Alert</h3>
              <p className="text-red-200 font-inter">{error}</p>
            </div>
          </div>
        </div>
      )}

      {portfolioData && (
        <>
          <PortfolioSummary summary={portfolioData.analysis.summary} />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Holdings Section */}
            <div className="glass rounded-2xl border border-white/20 p-8 hover-lift space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-inter">Portfolio Holdings</h2>
                    <p className="text-gray-400 font-inter">Manage your investments</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center px-6 py-3 bg-neon-gradient text-white rounded-xl hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 hover-lift font-inter font-semibold group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Stock
                </button>
              </div>
              
              {showAddForm && (
                <div className="animate-slide-down">
                  <AddStockForm onAddStock={handleAddStock} onCancel={() => setShowAddForm(false)} />
                </div>
              )}
              
              <HoldingsList 
                key={`holdings-${refreshKey}-${portfolioData.analysis.holdings.length}`}
                holdings={portfolioData.analysis.holdings} 
                onRemoveStock={handleRemoveStock} 
              />
            </div>

            {/* AI Analysis Section */}
            <div className="glass rounded-2xl border border-white/20 p-8 hover-lift space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-inter">AI Intelligence</h2>
                    <p className="text-gray-400 font-inter">Advanced market analysis</p>
                  </div>
                </div>
                <button
                  onClick={getAIAnalysis}
                  disabled={loadingAI || portfolioData.analysis.holdings.length === 0}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-pink text-white rounded-xl hover:shadow-lg hover:shadow-cyber-purple/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift font-inter font-semibold group"
                >
                  <Brain className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  {loadingAI ? 'Analyzing...' : 'Get AI Insights'}
                </button>
              </div>
              
              <AIAnalysis analysis={aiAnalysis} loading={loadingAI} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;