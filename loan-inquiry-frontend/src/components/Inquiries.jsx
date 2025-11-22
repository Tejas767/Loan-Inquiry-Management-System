import React, { useEffect, useState } from "react";
import { fetchMyInquiries, removeInquiry } from "../services/InquiryService";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import StatusBadge from "../components/StatusBadge";

const Inquiries = () => {
  // Logged-in user's own inquiries
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  // Load inquiries initially and refresh every 3 seconds
  useEffect(() => {
    loadInquiries();
    const intervalId = setInterval(loadInquiries, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch only current user's inquiries from backend (/api/inquiries/my)
  const loadInquiries = () => {
    fetchMyInquiries()
      .then((response) => {
        setInquiries([...response.data]);
      })
      .catch((error) =>
        console.error("Error fetching inquiries:", error)
      );
  };

  // Navigate to add inquiry screen
  function addInquiry() {
    navigate("/add-inquiry");
  }

  // Navigate to update specific inquiry
  function updateInquiry(id) {
    navigate(`/update-inquiry/${id}`);
  }

  // Delete an inquiry by id
  function deleteInquiry(id) {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      removeInquiry(id)
        .then(() => {
          toast.success("Inquiry deleted successfully!");
          loadInquiries();
        })
        .catch((error) => {
          console.error("Error deleting inquiry:", error);
          toast.error("Failed to delete inquiry!");
        });
    }
  }

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4 text-secondary fw-bold">
        Loan Inquiries
      </h2>

      <button className="btn btn-primary mb-3 ms-4" onClick={addInquiry}>
        Add Inquiry
      </button>

      <div className="table-responsive shadow rounded">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-secondary text-center">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Work Type</th>
              <th>Loan Type</th>
              <th>Annual Income</th>
              <th>Past Loan</th>
              <th>PAN Card</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((inquiry) => (
              <tr className="text-center" key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td className="text-start ps-3">{inquiry.name}</td>
                <td>{inquiry.mobileNumber}</td>
                <td className="text-start ps-3">{inquiry.email}</td>
                <td className="text-start ps-3">{inquiry.address}</td>
                <td>{inquiry.workType}</td>
                <td>{inquiry.loanType}</td>
                <td>{inquiry.annualIncome}</td>
                <td>{inquiry.pastLoan ? "Yes" : "No"}</td>
                <td>{inquiry.panCard}</td>

                {/* Status is read-only for customer */}
                <td>
                  <StatusBadge status={inquiry.status} />
                </td>

                {/* Customer actions: Edit / Delete */}
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => updateInquiry(inquiry.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteInquiry(inquiry.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inquiries;
