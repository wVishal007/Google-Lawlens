import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; 
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LawyerClients: React.FC = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data );
      setClients(res.data.users);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading clients...</p>;
  if (!clients.length) return <p>No clients found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Client Management</h1>

      <div className="mb-6">
        <Input
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClients.length === 0 ? (
        <p>No clients match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client._id}
              className="p-4 border rounded-lg bg-white shadow hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3 mb-3">
                {client.ProfilePicture ? (
                  <img
                    src={client.ProfilePicture}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-gray-500 text-sm">{client.email}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">Gender: {client.gender}</p>
              <p className="text-gray-400 text-xs mb-3">
                Joined: {new Date(client.createdAt).toLocaleDateString()}
              </p>
              <Button
                className="w-full"
                onClick={() => toast(`You can contact ${client.name} here!`)}
              >
                Contact Client
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
