import React from 'react';
import { Brain, Lightbulb, TrendingUp, Shield, Target, Zap, Activity } from 'lucide-react';

const AIAnalysis = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent bg-gradient-to-r from-cyber-purple to-cyber-pink mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-cyber-purple opacity-20"></div>
            <div className="absolute inset-2 bg-cyber-dark rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-cyber-purple animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-white font-inter font-semibold">AI Neural Network Active</p>
            <p className="text-gray-400 font-inter text-sm">Analyzing market patterns and portfolio dynamics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="h-8 w-8 text-cyber-purple" />
        </div>
        <h3 className="text-xl font-bold text-white font-inter mb-2">AI Ready for Analysis</h3>
        <p className="text-gray-400 font-inter">Click "Get AI Insights" to unlock advanced portfolio intelligence</p>
        <p className="text-sm text-gray-500 font-inter mt-3">
          Advanced algorithms will analyze market trends, risk factors, and optimization opportunities
        </p>
      </div>
    );
  }

  // Parse the AI analysis text into sections
  const parseAnalysis = (text) => {
    const sections = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection = null;
    let currentContent = [];
    
    lines.forEach(line => {
      line = line.trim();
      
      // Check if line is a section header
      if (line.match(/^\d+\.|^[A-Z][a-z\s]+:$/)) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join(' ')
          });
        }
        currentSection = line.replace(/^\d+\.\s*/, '').replace(/:$/, '');
        currentContent = [];
      } else if (line && currentSection) {
        currentContent.push(line);
      }
    });
    
    // Add the last section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join(' ')
      });
    }
    
    return sections;
  };

  const sections = parseAnalysis(analysis.analysis);
  
  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('performance') || lowerTitle.includes('assessment')) {
      return <TrendingUp className="h-5 w-5 text-cyber-green" />;
    } else if (lowerTitle.includes('risk')) {
      return <Shield className="h-5 w-5 text-red-400" />;
    } else if (lowerTitle.includes('recommendation') || lowerTitle.includes('action')) {
      return <Target className="h-5 w-5 text-cyber-blue" />;
    } else {
      return <Lightbulb className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getSectionGradient = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('performance') || lowerTitle.includes('assessment')) {
      return 'from-cyber-green to-green-500';
    } else if (lowerTitle.includes('risk')) {
      return 'from-red-500 to-red-600';
    } else if (lowerTitle.includes('recommendation') || lowerTitle.includes('action')) {
      return 'from-cyber-blue to-blue-500';
    } else {
      return 'from-yellow-500 to-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      {sections.length > 0 ? (
        sections.map((section, index) => (
          <div 
            key={index} 
            className="glass-dark border border-white/10 rounded-xl p-6 hover-lift transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 bg-gradient-to-r ${getSectionGradient(section.title)} rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300`}>
                {getSectionIcon(section.title)}
              </div>
              <h3 className="font-bold text-white font-inter text-lg">{section.title}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed font-inter">{section.content}</p>
            
            {/* Animated accent line */}
            <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))
      ) : (
        <div className="glass-dark border border-cyber-purple/50 rounded-xl p-6 animate-slide-down">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="font-bold text-cyber-purple font-inter text-lg">AI Neural Analysis</h3>
                <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse"></div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-300 leading-relaxed font-inter whitespace-pre-wrap">
                  {analysis.analysis}
                </p>
              </div>
            </div>
          </div>
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/10 via-cyber-pink/10 to-cyber-purple/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      )}
      
      {/* AI Signature */}
      <div className="flex items-center justify-center space-x-2 pt-4">
        <Activity className="h-4 w-4 text-cyber-purple animate-pulse" />
        <span className="text-xs text-gray-500 font-inter">Powered by Advanced AI Neural Networks</span>
        <Zap className="h-4 w-4 text-cyber-blue animate-pulse" />
      </div>
    </div>
  );
};

export default AIAnalysis;