import React, { useEffect, useState } from "react";
import { fetchInquiries, changeStatus } from "../services/InquiryService";
import StatusBadge from "../components/StatusBadge";
import { toast } from "react-toastify";

// Chart.js imports for Pie chart
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  // All inquiries for admin view
  const [inquiries, setInquiries] = useState([]);
  // Data used to render the pie chart
  const [chartData, setChartData] = useState({});

  // Load inquiries when component mounts + refresh every 5 seconds
  useEffect(() => {
    load();
    const intervalId = setInterval(load, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Whenever inquiries change, recompute chart data
  useEffect(() => {
    processChartData(inquiries);
  }, [inquiries]);

  // Fetch all inquiries from backend
  const load = () => {
    fetchInquiries()
      .then((r) => {
        setInquiries([...r.data]);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load inquiries");
      });
  };

  // Build chart data (Approved / Rejected / Pending counts)
  const processChartData = (inquiries) => {
    const approved = inquiries.filter((i) => i.status === "APPROVED").length;
    const rejected = inquiries.filter((i) => i.status === "REJECTED").length;
    const pending = inquiries.filter((i) => i.status === "PENDING").length;

    setChartData({
      labels: ["APPROVED", "REJECTED", "PENDING"],
      datasets: [
        {
          label: "# of Inquiries",
          data: [approved, rejected, pending],
          backgroundColor: [
            "rgba(40, 249, 78, 1)", // Green - Approved
            "rgba(251, 14, 14, 1)", // Red - Rejected
            "rgba(242, 255, 0, 1)", // Yellow - Pending
          ],
          borderColor: "rgba(145, 139, 139, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  // Change status (Approve / Reject) for an inquiry
  const handleStatus = (id, status) => {
    if (!window.confirm(`Set status to ${status}?`)) return;

    changeStatus(id, status)
      .then(() => {
        toast.success("Status updated");
        load(); // reload updated list
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to update status");
      });
  };

  // Pie chart options (title, legend position, responsiveness)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Inquiry Status Breakdown",
      },
    },
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4 text-secondary fw-bold">
        Admin Dashboard — Approvals
      </h2>

      {/* Data visualization section (Pie chart) */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 col-lg-4 shadow rounded p-3 bg-white">
          {Object.keys(chartData).length > 0 && inquiries.length > 0 ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <div className="text-center p-5 text-muted">
              No data to display chart.
            </div>
          )}
        </div>
      </div>

      {/* Inquiries table for admin */}
      <div className="table-responsive shadow rounded">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-secondary text-center">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Income</th>
              <th>Past Loan</th>
              <th>PAN</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td className="text-start ps-3">{i.name}</td>
                <td className="text-start ps-3">{i.email}</td>
                <td>{i.annualIncome}</td>
                <td>{i.pastLoan ? "Yes" : "No"}</td>
                <td>{i.panCard}</td>

                {/* Reusable badge component for status */}
                <td>
                  <StatusBadge status={i.status} />
                </td>

                {/* Admin actions: Approve / Reject */}
                <td>
                  <button
                    className="btn btn-sm btn-success me-1"
                    onClick={() => handleStatus(i.id, "APPROVED")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleStatus(i.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
