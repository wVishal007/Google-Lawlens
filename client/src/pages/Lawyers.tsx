import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Lawyer } from '../redux/slices/lawyerSlice';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import axios from 'axios';
import { Trash2, Users, MapPin } from 'lucide-react';
import { fetchLawyers } from '../redux/slices/lawyerSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Helper to render stars
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) stars.push(<span key={i} className="text-yellow-400">★</span>);
  if (halfStar) stars.push(<span key="half" className="text-yellow-400">☆</span>);
  for (let i = stars.length; i < 5; i++) stars.push(<span key={i + 5} className="text-gray-300">★</span>);
  return stars;
};

export const LawyerManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lawyers, loading } = useSelector((state: RootState) => state.lawyer);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newLawyer, setNewLawyer] = useState<Partial<Lawyer>>({
    name: '',
    specialization: '',
    experience: 0,
    rating: 0,
    location: '',
    hourlyRate: 0,
    bio: '',
    phone: '',
  });

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchLawyers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleRegisterLawyer = async () => {
    try {
      const formData = new FormData();
      Object.entries(newLawyer).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value.toString());
      });
      if (profilePicFile) formData.append('profilePic', profilePicFile);
      if (documentFile) formData.append('document', documentFile);

      await axios.post(`${import.meta.env.VITE_API_URL}/lawyer/register`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setRegisterModalOpen(false);
      dispatch(fetchLawyers());
      setNewLawyer({ name: '', specialization: '', experience: 0, rating: 0, location: '', hourlyRate: 0, bio: '', phone: '' });
      setProfilePicFile(null);
      setDocumentFile(null);
    } catch (error: any) {
      console.error('Failed to register lawyer:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to register lawyer');
    }
  };

  const handleDeleteLawyer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete your lawyer profile?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lawyer/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(fetchLawyers());
      toast.success('Lawyer profile deleted successfully!');
    } catch (error) {
      console.error('Failed to delete lawyer:', error);
      toast.error('Failed to delete lawyer');
    }
  };

  // Inside LawyerManagement component, before return
const isRegisteredLawyer = lawyers.some(lawyer => lawyer.userId?._id === user?.id);
const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">Expert legal help, just a click away.</h1>
  {isRegisteredLawyer ? (
    <Button onClick={() => navigate('/lawyer/manage')}>Manage Your Clients</Button>
  ) : (
    <Button onClick={() => setRegisterModalOpen(true)}>Register as Lawyer</Button>
  )}
</div>


      <div className="mb-6">
        <Input
          placeholder="Search lawyers by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading lawyers...</p>
      ) : lawyers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <Card
              key={lawyer._id}
              className="hover:shadow-2xl transition-shadow duration-300 rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
              <CardContent className="p-5">
                {/* Avatar + Name */}
                <div className="flex items-center space-x-4 mb-3">
                  {lawyer.profilePic ? (
                    <img
                      src={lawyer.profilePic}
                      alt={lawyer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : 'L'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{lawyer.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{lawyer.specialization}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">{renderStars(lawyer.rating)}</div>

                {/* Location */}
                {lawyer.location && (
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{lawyer.location}</span>
                  </div>
                )}

                {/* Experience & Hourly Rate */}
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">{lawyer.experience}</span> yrs experience • ₹{lawyer.hourlyRate}/hr
                </p>

                {/* Bio */}
                {lawyer.bio && <p className="text-gray-700 text-sm mb-3 line-clamp-2">{lawyer.bio}</p>}

                {/* Delete / Contact Button */}
                {user?.id && lawyer.userId?._id === user.id ? (
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center space-x-2 mt-3"
                    onClick={() => handleDeleteLawyer(lawyer._id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center space-x-2 mt-3"
                    onClick={() => {
                      toast(`You can contact ${lawyer.name} here!`);
                      // TODO: replace with actual chat or email logic
                    }}
                  >
                    <span>Contact Lawyer</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Register as Lawyer Modal */}
      <Modal isOpen={registerModalOpen} onClose={() => setRegisterModalOpen(false)} title="Register as Lawyer" size="md">
        <div className="space-y-4">
          <Input label="Name" value={newLawyer.name} onChange={(e) => setNewLawyer({ ...newLawyer, name: e.target.value })} />
          <Input label="Specialization" value={newLawyer.specialization} onChange={(e) => setNewLawyer({ ...newLawyer, specialization: e.target.value })} />
          <Input label="Experience (years)" type="number" value={newLawyer.experience} onChange={(e) => setNewLawyer({ ...newLawyer, experience: Number(e.target.value) })} />
          <Input label="Location" value={newLawyer.location} onChange={(e) => setNewLawyer({ ...newLawyer, location: e.target.value })} />
          <Input label="Hourly Rate (₹)" type="number" value={newLawyer.hourlyRate} onChange={(e) => setNewLawyer({ ...newLawyer, hourlyRate: Number(e.target.value) })} />
          <Input label="Phone" value={newLawyer.phone} onChange={(e) => setNewLawyer({ ...newLawyer, phone: e.target.value })} />
          <Input label="Bio" value={newLawyer.bio} onChange={(e) => setNewLawyer({ ...newLawyer, bio: e.target.value })} />

          {/* File Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                id="profilePicInput"
                className="hidden"
                onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
              />
              <Button variant="outline" onClick={() => document.getElementById('profilePicInput')?.click()}>
                {profilePicFile ? profilePicFile.name : 'Choose Profile Picture'}
              </Button>
              {profilePicFile && (
                <Button variant="destructive" size="sm" onClick={() => setProfilePicFile(null)}>Remove</Button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document (License/Certificate)</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                id="documentInput"
                className="hidden"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
              />
              <Button variant="outline" onClick={() => document.getElementById('documentInput')?.click()}>
                {documentFile ? documentFile.name : 'Choose Document'}
              </Button>
              {documentFile && (
                <Button variant="destructive" size="sm" onClick={() => setDocumentFile(null)}>Remove</Button>
              )}
            </div>
          </div>

          <div className="flex space-x-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setRegisterModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleRegisterLawyer}>Register</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
