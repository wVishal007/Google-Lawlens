import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { RiskScore } from '../components/features/RiskScore'
import { RedFlagAlerts } from '../components/features/RedFlagAlerts'
import { Eye, Mic, MicOff, BarChart3 } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { analyzeDocument, chatWithDocument, getLawyerRecommendations } from '../redux/slices/extraDocumentSlice'

export const Results: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentDocument, analysisLoading, userContext, chatResponse } = useAppSelector(state => state.document)
  const [isListening, setIsListening] = useState(false)
  const [voiceResponse, setVoiceResponse] = useState('')
  const [scenarioText, setScenarioText] = useState('')
  const [scenarioResponse, setScenarioResponse] = useState('')
  const [lawyers, setLawyers] = useState<any[]>([])

  // Auto analyze document on load
  useEffect(() => {
    if (currentDocument && !currentDocument.analysisResult && !analysisLoading) {
      dispatch(analyzeDocument(currentDocument.id))
      fetchLawyers()
    }
  }, [currentDocument, dispatch, analysisLoading])

  const fetchLawyers = async () => {
    if (!currentDocument) return
    try {
      const response = await dispatch(getLawyerRecommendations(currentDocument.id)).unwrap()
      setLawyers(response)
    } catch (err) {
      console.error('Failed to fetch lawyers', err)
    }
  }

  // Voice Q&A logic
  useEffect(() => {
    if (!isListening || !currentDocument) return

    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = async (event) => {
      const question = event.results[event.results.length - 1][0].transcript
      try {
        const answer = await dispatch(chatWithDocument({
          doc_id: currentDocument.id,
          question
        })).unwrap()
        setVoiceResponse(answer)
      } catch (err) {
        console.error('Chat error', err)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event)
      setIsListening(false)
    }

    recognition.start()
    return () => recognition.stop()
  }, [isListening, currentDocument, dispatch])

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

  const analysisResult = currentDocument.analysisResult

  // Handle What-If analysis
  const handleScenarioAnalyze = async () => {
    if (!scenarioText.trim() || !currentDocument) return
    try {
      const response = await dispatch(chatWithDocument({
        doc_id: currentDocument.id,
        question: scenarioText
      })).unwrap()
      setScenarioResponse(response)
    } catch (err) {
      console.error('Scenario analysis failed', err)
    }
  }

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
          {/* Risk Score */}
          <div className="lg:col-span-1">
            <RiskScore score={analysisResult?.riskScore || 0} loading={analysisLoading} />
          </div>

          {/* Meaning Cards + Red Flags */}
          <div className="lg:col-span-2 space-y-8">
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
                    {analysisResult?.meaningCards?.map((card, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                        <h3 className="font-medium text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{card.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <RedFlagAlerts redFlags={analysisResult?.redFlags || []} loading={analysisLoading} />
          </div>
        </div>

        {/* Bottom interactive section */}
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
                  placeholder="Ask a hypothetical question about your document..."
                  value={scenarioText}
                  onChange={(e) => setScenarioText(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Button variant="primary" disabled={!scenarioText.trim()} onClick={handleScenarioAnalyze}>
                  Analyze Scenario
                </Button>
                {scenarioResponse && (
                  <div className="bg-blue-50 rounded-xl p-4 mt-4">
                    <p className="text-sm text-blue-800">{scenarioResponse}</p>
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
                  variant={isListening ? 'secondary' : 'outline'}
                  size="lg"
                  onClick={() => setIsListening(!isListening)}
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" /> Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" /> Start Voice Q&A
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
                    <p className="text-sm text-green-800 mt-2">{voiceResponse || 'Listening... Ask me anything about your document'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lawyer Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Recommended Lawyers</h3>
          </CardHeader>
          <CardContent>
            {lawyers.length === 0 ? (
              <p className="text-gray-500">No recommendations available.</p>
            ) : (
              <div className="grid gap-4">
                {lawyers.map(lawyer => (
                  <div key={lawyer.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-medium">{lawyer.name}</p>
                      <p className="text-sm text-gray-500">{lawyer.specialization}</p>
                    </div>
                    <Button size="sm">Book Consultation</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
