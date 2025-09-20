import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Upload,
  FileText,
  Users,
  Calendar,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { documents, riskHistory } = useAppSelector((state) => state.document);

  const recentDocuments = documents.slice(0, 3);
  const avgRiskScore =
    riskHistory.reduce((sum, item) => sum + item.score, 0) /
      riskHistory.length || 0;

  const quickActions = [
    {
      title: "Upload Document",
      description: "Upload a new legal document for analysis",
      icon: Upload,
      href: "/upload",
      color: "bg-blue-500",
    },
    {
      title: "View Results",
      description: "Review your latest document analysis",
      icon: FileText,
      href: "/results",
      color: "bg-green-500",
    },
    {
      title: "Find Lawyers",
      description: "Connect with qualified legal experts",
      icon: Users,
      href: "/lawyers",
      color: "bg-purple-500",
    },
    {
      title: "Manage Cases",
      description: "Track your legal events and deadlines",
      icon: Calendar,
      href: "/caseboard",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your legal document activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.length}
                  </p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(avgRiskScore)}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Risk Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.reduce(
                      (sum, doc) =>
                        sum + (doc.analysisResult?.redFlags?.length || 0),
                      0
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Red Flags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {riskHistory.length > 1
                      ? Math.round(
                          ((riskHistory[riskHistory.length - 1].score -
                            riskHistory[0].score) /
                            riskHistory[0].score) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-gray-600">Risk Change</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.href}>
                    <Card hover className="h-full cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Documents
            </h2>
            {recentDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No documents yet</p>
                  <p className="text-sm text-gray-400 mt-1 mb-4">
                    Upload your first document to get started
                  </p>
                  <Link to="/upload">
                    <Button size="sm">Upload Document</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {doc.analysisResult && (
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {doc.analysisResult.riskScore}%
                            </span>
                            <p className="text-xs text-gray-500">Risk</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Documents
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {documents.length === 0 && (
          <Card className="mt-8 bg-gradient-to-r from-gray-50 to-white border-2 border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Started with LawLens
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Upload your first legal document to experience the power of
                AI-driven legal analysis. Get instant risk scores, red flag
                alerts, and plain-English explanations.
              </p>
              <Link to="/upload">
                <Button size="lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your First Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
