import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, Shield, AlertTriangle, Mic, Eye, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppSelector } from '../hooks/useAppSelector'

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth)

  const features = [
    {
      icon: Eye,
      title: 'What-If Mode',
      description: 'Explore different scenarios and understand potential outcomes before signing.'
    },
    {
      icon: Shield,
      title: 'Risk Score',
      description: 'Get an instant assessment of legal risks with our AI-powered analysis.'
    },
    {
      icon: AlertTriangle,
      title: 'Red Flag Alerts',
      description: 'Identify problematic clauses that could impact your interests.'
    },
    {
      icon: Mic,
      title: 'Voice Q&A',
      description: 'Ask questions about your document using natural voice commands.'
    },
    {
      icon: Users,
      title: 'Lawyer Network',
      description: 'Connect with qualified attorneys when you need professional help.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 animate-fade-in">
              Turning legal jargon
              <br />
              <span className="text-gray-500">into real-life guidance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload any legal document and get instant AI-powered analysis, risk assessment, 
              and plain-English explanations tailored to your situation.
            </p>
            <div className="space-x-4">
              <Link to={isAuthenticated ? "/upload" : "/signup"}>
                <Button size="lg" className="shadow-lg hover:shadow-xl">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Document
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-gray-100 to-white rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-gradient-to-tr from-gray-100 to-white rounded-full opacity-50 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">
              Everything you need to understand legal documents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform breaks down complex legal language into clear, 
              actionable insights so you can make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  hover 
                  className="text-center p-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to decode your legal documents?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users who trust LawLens to make sense of their legal paperwork.
          </p>
          <Link to={isAuthenticated ? "/upload" : "/signup"}>
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
              <Upload className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}