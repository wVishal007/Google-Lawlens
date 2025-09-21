import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, Image, File } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { uploadDocument, setUserContext, analyzeDocument } from '../redux/slices/extraDocumentSlice'
import { toast } from 'sonner'

export const Upload: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // ✅ Local loading state (manual control)
  const [loading, setLoading] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    purpose: ''
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (fileType.includes('image')) return <Image className="w-8 h-8 text-blue-500" />
    return <File className="w-8 h-8 text-gray-500" />
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!selectedFile) return

  const context = {
    age: parseInt(formData.age),
    location: formData.location,
    purpose: formData.purpose
  }

  dispatch(setUserContext(context))

  try {
    // Replace 'USER_ID_HERE' with actual user id from state or token
    const uploadedDoc = await dispatch(uploadDocument({ file: selectedFile, context })).unwrap()

    toast.success('Upload successful')

    await dispatch(analyzeDocument(uploadedDoc.id)).unwrap()

    navigate('/results')
  } catch (err: any) {
    toast.error(err.message || 'Upload failed')
  }
}



  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Upload Your Document</h1>
          <p className="text-xl text-gray-600">
            Upload any legal document and provide context for personalized analysis--
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Select Document</h2>
              <p className="text-gray-600">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragOver ? 'border-black bg-gray-50' : 'border-gray-300'
                } ${selectedFile ? 'border-green-500 bg-green-50' : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      {getFileIcon(selectedFile.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setSelectedFile(null)}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your document here, or click to browse
                      </p>
                      <p className="text-gray-500">Maximum file size: 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Context Form */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Provide Context</h2>
              <p className="text-gray-600">Help us provide more personalized analysis</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
                <Input
                  label="Location"
                  placeholder="New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Purpose"
                    placeholder="Employment contract review for new job"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              loading={loading}   // ✅ now manual
              disabled={!selectedFile || !formData.age || !formData.location || !formData.purpose}
              className="px-12"
            >
              Analyze Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
