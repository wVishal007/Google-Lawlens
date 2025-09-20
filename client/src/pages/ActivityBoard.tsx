import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { fetchActivities, addActivity } from "../redux/slices/activitySlice";
import { RootState } from "../redux/store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";

export const ActivitiesBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activities, isLoading } = useSelector((state: RootState) => state.activity);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    repeatFrequency: "none",
  });

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addActivity(formData));
    setModalOpen(false);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      repeatFrequency: "none",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Activities</h1>
        <Button onClick={() => setModalOpen(true)} className="self-end">
          Add Activity
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-500">No activities yet. Click "Add Activity" to get started.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="p-5 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{activity.title}</h2>
              <p className="text-gray-600 mb-2">{activity.description}</p>
              <p className="text-gray-500 text-sm">
                {activity.date} at {activity.time} &middot; {activity.repeatFrequency}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Activity"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter activity title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repeat Frequency
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={formData.repeatFrequency}
              onChange={(e) =>
                setFormData({ ...formData, repeatFrequency: e.target.value })
              }
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-2">
            Add Activity
          </Button>
        </form>
      </Modal>
    </div>
  );
};
