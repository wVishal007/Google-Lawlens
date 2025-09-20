import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Settings, FileText, BarChart3, Moon, Sun } from "lucide-react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { toggleTheme } from "../redux/slices/uiSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { documents, riskHistory } = useAppSelector((state) => state.document);
  const { theme } = useAppSelector((state) => state.ui);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // TODO: Update user profile
    setEditing(false);
  };

  console.log(documents);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account and view your legal document history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No documents uploaded yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload your first legal document to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {doc.filename}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Type: {doc.type} • Status: {doc.status} • Uploaded{" "}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                          {doc.analysisResult && (
                            <p className="text-sm text-yellow-600 mt-1">
                              Analysis: {doc.analysisResult.status}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.signed && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Signed
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, "_new")}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Settings</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(toggleTheme())}
                    >
                      {theme === "light" ? (
                        <>
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </>
                      ) : (
                        <>
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document History */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Document History</h2>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No documents uploaded yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload your first legal document to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Uploaded{" "}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.analysisResult && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Analyzed
                            </span>
                          )}
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk History Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Legal Risk History</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={(value) => `Date: ${value}`}
                        formatter={(value) => [`${value}%`, "Risk Score"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#000000"
                        strokeWidth={3}
                        dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Average risk score:{" "}
                    {Math.round(
                      riskHistory.reduce((sum, item) => sum + item.score, 0) /
                        riskHistory.length
                    )}
                    %
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
