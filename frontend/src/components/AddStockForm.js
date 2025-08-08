import React, { useState } from 'react';
import { X, Plus, Zap } from 'lucide-react';

const AddStockForm = ({ onAddStock, onCancel }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onAddStock({
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice)
      });
      
      setFormData({
        symbol: '',
        quantity: '',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to add stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="glass-dark rounded-xl p-6 mb-6 border border-white/20 animate-slide-down">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white font-inter">Add New Stock</h3>
        </div>
        <button
          onClick={onCancel}
          className="p-2 glass rounded-lg text-gray-400 hover:text-white hover:bg-red-500/20 transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Stock Symbol
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g., AAPL"
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm uppercase"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Number of shares"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Purchase Price ($)
            </label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="Price per share"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full px-4 py-3 glass border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 glass border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-inter font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-neon-gradient text-white rounded-xl hover:shadow-lg hover:shadow-cyber-blue/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift font-inter font-semibold group"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              'Add Stock'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStockForm;
