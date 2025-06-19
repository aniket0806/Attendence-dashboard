import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
;import { apiClient } from "../lib/api-client";

const Contacts = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/auth/complaints", formData);
      toast.success("Complaint submitted successfully!");
      setFormData({
        user_name: "",
        email: "",
        mobile: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-md mt-10">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4 text-center">👤 Submit a Complaint About Attendance App</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          placeholder="Your Name *"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (Optional)"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile (Optional)"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Complaint Subject *"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Describe your problem *"
          rows="4"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default Contacts;