import api from "./api";

const baseUrl = "/api/inquiries";

// Admin: fetch all inquiries
export const fetchInquiries = () => api.get(baseUrl);

// Customer: fetch only logged-in user's inquiries
export const fetchMyInquiries = () => api.get(`${baseUrl}/my`);

// Create new loan inquiry
export const newInquiry = (inquiry) => api.post(`${baseUrl}/inquiry`, inquiry);

// Get inquiry by ID (for editing)
export const getInquiryById = (id) => api.get(`${baseUrl}/${id}`);

// Update existing inquiry
export const updateInquiry = (id, inquiry) =>
  api.put(`${baseUrl}/${id}`, inquiry);

// Delete inquiry by ID
export const removeInquiry = (id) => api.delete(`${baseUrl}/${id}`);

// Admin: change status (APPROVED / REJECTED / PENDING)
export const changeStatus = (id, status) =>
  api.patch(`${baseUrl}/${id}/status`, null, { params: { status } });
