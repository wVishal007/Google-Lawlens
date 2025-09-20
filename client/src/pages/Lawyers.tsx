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
import { Trash2, Users } from 'lucide-react';
import { fetchLawyers } from '../redux/slices/lawyerSlice';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLawyer, setNewLawyer] = useState<Partial<Lawyer>>({
    name: '',
    specialization: '',
    experience: 0,
    rating: 0,
    location: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    dispatch(fetchLawyers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleAddLawyer = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/lawyer/addLawyer`, newLawyer, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAddModalOpen(false);
      dispatch(fetchLawyers());
      setNewLawyer({ name: '', specialization: '', experience: 0, rating: 0, location: '', hourlyRate: 0 });
    } catch (error) {
      console.error('Failed to add lawyer:', error);
    }
  };

  const handleDeleteLawyer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lawyer?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/lawyer/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(fetchLawyers());
    } catch (error) {
      console.error('Failed to delete lawyer:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lawyer Management</h1>
        <Button onClick={() => setAddModalOpen(true)}>Add New Lawyer</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <Card
              key={lawyer._id}
              className="hover:shadow-lg transition-shadow duration-300 rounded-lg"
            >
              <CardContent className="p-4">
                {/* Avatar */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : 'L'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                    <p className="text-gray-600">{lawyer.specialization}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">{renderStars(lawyer.rating)}</div>

                {/* Details */}
                <p className="text-sm text-gray-500 mt-1">
                  {lawyer.experience} years experience • ₹{lawyer.hourlyRate}/hour
                </p>
                <p className="text-sm text-gray-500 mt-1">{lawyer.location}</p>

                <Button
                  variant="destructive"
                  className="mt-4 w-full flex items-center justify-center space-x-2"
                  onClick={() => handleDeleteLawyer(lawyer._id!)}
                >
                  <Trash2 className="w-4 h-4" /> <span>Delete</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Lawyer Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Lawyer" size="md">
        <div className="space-y-4">
          <Input
            label="Name"
            value={newLawyer.name}
            onChange={(e) => setNewLawyer({ ...newLawyer, name: e.target.value })}
          />
          <Input
            label="Specialization"
            value={newLawyer.specialization}
            onChange={(e) => setNewLawyer({ ...newLawyer, specialization: e.target.value })}
          />
          <Input
            label="Experience (years)"
            type="number"
            value={newLawyer.experience}
            onChange={(e) => setNewLawyer({ ...newLawyer, experience: Number(e.target.value) })}
          />
          <Input
            label="Rating (0-5)"
            type="number"
            value={newLawyer.rating}
            onChange={(e) => setNewLawyer({ ...newLawyer, rating: Number(e.target.value) })}
          />
          <Input
            label="Location"
            value={newLawyer.location}
            onChange={(e) => setNewLawyer({ ...newLawyer, location: e.target.value })}
          />
          <Input
            label="Hourly Rate (₹)"
            type="number"
            value={newLawyer.hourlyRate}
            onChange={(e) => setNewLawyer({ ...newLawyer, hourlyRate: Number(e.target.value) })}
          />
          <div className="flex space-x-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddLawyer}>
              Add Lawyer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
