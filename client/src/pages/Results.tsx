import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { RiskScore } from '../components/features/RiskScore'
import { RedFlagAlerts } from '../components/features/RedFlagAlerts'
import { Eye, Mic, MicOff, BarChart3 } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { analyzeDocument } from '../redux/slices/documentSlice'

export const Results: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentDocument, analysisLoading, userContext } = useAppSelector(state => state.document)
  const [isListening, setIsListening] = useState(false)
  const [whatIfText, setWhatIfText] = useState('')

  useEffect(() => {
    if (currentDocument && !currentDocument.analysisResult && !analysisLoading) {
      dispatch(analyzeDocument(currentDocument.id))
    }
  }, [currentDocument, dispatch, analysisLoading])

  // Hardcoded document analysis result for the uploaded agreement
const hardcodedAnalysisResult = {
  riskScore: 25, // Low risk
  redFlags: [
    {
      id: 'rf1',
      title: 'Payment Terms Clarity',
      severity: 'low',
      description: 'The agreement specifies that Party B will pay fees, but does not mention payment deadlines or late fees.',
      clause: 'Party B agrees to pay the fees as specified.'
    },
    {
      id: 'rf2',
      title: 'Confidentiality Scope',
      severity: 'medium',
      description: 'The confidentiality clause is generic and does not define the duration or scope of confidential information.',
      clause: 'Both parties agree to maintain confidentiality.'
    }
  ],
  meaningCards: [
    {
      title: 'Service Provision',
      content: 'Party A is legally obligated to provide the services described in the agreement. Ensure services are clearly defined before signing.'
    },
    {
      title: 'Payment Obligation',
      content: 'Party B must pay the fees as stated. Clarify deadlines and payment methods to avoid disputes.'
    },
    {
      title: 'Confidentiality',
      content: 'Both parties must maintain confidentiality. Consider defining duration, scope, and exceptions for better protection.'
    },
    {
      title: 'Governing Law',
      content: 'This agreement is governed by Indian law, meaning any disputes will be resolved under Indian legal system.'
    }
  ]
};


  if (!currentDocument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No document to analyze</p>
          <Button onClick={() => navigate('/upload')}>Upload Document</Button>
        </div>
      </div>
    )
  }

  const analysisResult = currentDocument.analysisResult || hardcodedAnalysisResult;


  const mockMeaningCards = [
    {
      title: 'Employment Terms',
      content: 'You will work full-time (40 hours/week) with a 90-day probation period. Your salary is $75,000/year with benefits starting after 30 days.'
    },
    {
      title: 'Termination Rights',
      content: 'Either party can terminate with 2 weeks notice. The company can terminate immediately for cause. You keep accrued vacation pay.'
    },
    {
      title: 'Intellectual Property',
      content: 'Any work-related inventions or code you create belongs to the company. Personal projects done outside work hours remain yours.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Document Analysis Results</h1>
          <p className="text-gray-600">
            Analysis for: <span className="font-medium">{currentDocument.name}</span>
          </p>
          {userContext && (
            <p className="text-sm text-gray-500 mt-1">
              Context: {userContext.age} years old, {userContext.location} - {userContext.purpose}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Score */}
          <div className="lg:col-span-1">
            <RiskScore 
              score={analysisResult?.riskScore || 0} 
              loading={analysisLoading} 
            />
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What This Means Cards */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">What this means for you</h2>
              </CardHeader>
              <CardContent>
                {analysisLoading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200 rounded-xl p-4 h-24"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {mockMeaningCards.map((card, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                        <h3 className="font-medium text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{card.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Red Flag Alerts */}
            <RedFlagAlerts 
              redFlags={analysisResult?.redFlags || []} 
              loading={analysisLoading} 
            />
          </div>
        </div>

        {/* Bottom Section - Interactive Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* What-If Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">What-If Mode</h3>
              </div>
              <p className="text-gray-600">Explore hypothetical scenarios</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  placeholder="What if the termination notice period was changed to 4 weeks instead of 2 weeks?"
                  value={whatIfText}
                  onChange={(e) => setWhatIfText(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Button variant="primary" disabled={!whatIfText.trim()}>
                  Analyze Scenario
                </Button>
                {whatIfText.trim() && (
                  <div className="bg-blue-50 rounded-xl p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Impact Analysis:</strong> Increasing the termination notice to 4 weeks would provide you with more job security and time to find alternative employment, but may also make the company more hesitant to terminate without cause.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voice Q&A Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Voice Q&A Mode</h3>
              </div>
              <p className="text-gray-600">Ask questions about your document</p>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <Button
                  variant={isListening ? "secondary" : "outline"}
                  size="lg"
                  onClick={() => setIsListening(!isListening)}
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Voice Q&A
                    </>
                  )}
                </Button>
                {isListening && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <p className="text-sm text-green-800 mt-2">Listening... Ask me anything about your document</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clause Map Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Clause Map</h3>
            </div>
            <p className="text-gray-600">Visual representation of document structure and risks</p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Interactive Clause Map</p>
                <p className="text-sm text-gray-400 mt-1">Coming soon - D3.js visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}