import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { TrendingUp, Eye, EyeOff, Zap, Brain, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting form:', { isLogin, formData });
      
      const response = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      console.log('Auth response:', response);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      onLogin(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.error || 'Authentication failed');
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyber-pink/5 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-neon-gradient rounded-2xl flex items-center justify-center neon-blue shadow-2xl">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-green rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-cyber-dark" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold gradient-text font-inter mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Future'}
          </h2>
          <p className="text-gray-300 font-inter text-lg">
            AI-powered portfolio analysis for smart investing
          </p>
          
          {/* Feature highlights */}
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-cyber-blue">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-inter">AI Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-cyber-purple">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-inter">Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-cyber-green">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-inter">Real-time</span>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="glass-dark border border-red-400/50 rounded-xl p-4 animate-slide-down">
              <p className="text-red-300 text-sm font-inter flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                {error}
              </p>
            </div>
          )}
          
          <div className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 glass border border-white/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent transition-all duration-300 font-inter backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyber-blue transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-neon-gradient hover:shadow-lg hover:shadow-cyber-blue/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift font-inter overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyber-blue hover:text-cyber-purple text-sm font-inter transition-colors duration-300"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;