// Small reusable component to display status as a colored badge
export default function StatusBadge({ status }) {
  // Map backend status value to label + Bootstrap class
  const map = {
    APPROVED: { label: "Approved", className: "badge bg-success" },
    REJECTED: { label: "Rejected", className: "badge bg-danger" },
    PENDING: { label: "Pending", className: "badge bg-warning text-dark" },
  };

  // Fallback in case status is null or unknown
  const s =
    map[status] ?? {
      label: status ?? "Unknown",
      className: "badge bg-secondary",
    };

  return <span className={s.className}>{s.label}</span>;
}
