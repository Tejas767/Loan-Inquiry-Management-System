import React, { useState, useEffect } from "react";
import {
  newInquiry,
  updateInquiry,
  getInquiryById,
} from "../services/InquiryService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Regex patterns for validation
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;      // letters and spaces only
const MOBILE_REGEX = /^[0-9]{10}$/;      // exactly 10 digits

const AddInquiry = () => {
  // Form state values
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [workType, setWorkType] = useState("");
  const [loanType, setLoanType] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [pastLoan, setPastLoan] = useState("");
  const [panCard, setPanCard] = useState("");

  // Validation error messages for each field
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams(); // if id exists => Edit mode, else Add mode

  // Helper to clear form and errors
  const resetForm = () => {
    setName("");
    setMobileNumber("");
    setEmail("");
    setAddress("");
    setWorkType("");
    setLoanType("");
    setAnnualIncome("");
    setPastLoan("");
    setPanCard("");
    setErrors({});
  };

  // When editing an inquiry, load its data by ID
  useEffect(() => {
    if (id) {
      getInquiryById(id)
        .then((response) => {
          const data = response.data;
          setName(data.name || "");
          setMobileNumber(data.mobileNumber || "");
          setEmail(data.email || "");
          setAddress(data.address || "");
          setWorkType(data.workType || "");
          setLoanType(data.loanType || "");
          setAnnualIncome(data.annualIncome || "");
          setPastLoan(data.pastLoan ? "yes" : "no");
          setPanCard(data.panCard || "");
        })
        .catch((error) => {
          console.error("Error fetching inquiry:", error);
          toast.error("Failed to load inquiry details.");
        });
    }
  }, [id]);

  // Single-field validation helpers (used by full validation + live validation)
  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (!NAME_REGEX.test(value)) return "Name can contain only letters and spaces";
    return null;
  };

  const validateMobile = (value) => {
    if (!value.trim()) return "Mobile number is required";
    if (value.length < 10) return "Mobile number must be at least 10 digits";
    if (!/^[0-9]+$/.test(value)) return "Mobile number must contain only digits";
    if (!MOBILE_REGEX.test(value)) return "Mobile number must be exactly 10 digits";
    return null;
  };

  const validatePan = (value) => {
    if (!value.trim()) return "PAN is required";
    if (!PAN_REGEX.test(value)) return "PAN must be in format AAAAA9999A (uppercase)";
    return null;
  };

  // Validate all fields before submit
  const validateAll = () => {
    const newErrors = {};

    const n = validateName(name);
    if (n) newErrors.name = n;

    const m = validateMobile(mobileNumber);
    if (m) newErrors.mobileNumber = m;

    if (!email) newErrors.email = "Email is required";
    if (!address) newErrors.address = "Address is required";
    if (!workType) newErrors.workType = "Work Type is required";
    if (!loanType) newErrors.loanType = "Loan Type is required";
    if (!annualIncome) newErrors.annualIncome = "Annual income is required";
    if (!pastLoan) newErrors.pastLoan = "Please choose Past Loan option";

    const p = validatePan(panCard);
    if (p) newErrors.panCard = p;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // no errors => valid
  };

  // Restrict name input to letters + spaces only
  const onNameChange = (e) => {
    const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setName(filtered);

    // Live-validate if an error already exists
    if (errors.name) setErrors((prev) => ({ ...prev, name: validateName(filtered) }));
  };

  // Restrict mobile input to digits only, max length 10
  const onMobileChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(digits);

    if (errors.mobileNumber)
      setErrors((prev) => ({ ...prev, mobileNumber: validateMobile(digits) }));
  };

  // Force PAN to uppercase alphanumeric, max length 10
  const onPanChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setPanCard(val);

    if (errors.panCard)
      setErrors((prev) => ({ ...prev, panCard: validatePan(val) }));
  };

  // Handle Add / Update submit
  const saveOrUpdateInquiry = (e) => {
    e.preventDefault();

    // If validation fails -> show toast + stop
    if (!validateAll()) {
      toast.error("Please fix validation errors");
      return;
    }

    // Build payload object for backend
    const inquiry = {
      name,
      mobileNumber,
      email,
      address,
      workType,
      loanType,
      annualIncome: parseFloat(annualIncome),
      pastLoan: pastLoan === "yes",
      panCard,
    };

    // If id exists => update mode
    if (id) {
      updateInquiry(id, inquiry)
        .then(() => {
          toast.success("Inquiry Updated Successfully!");
          navigate("/inquiries");
        })
        .catch((error) => {
          console.error("Error updating inquiry:", error);
          toast.error("Failed to update inquiry. Please try again.");
        });
    } else {
      // Else => create new inquiry
      newInquiry(inquiry)
        .then(() => {
          toast.success("Inquiry Added Successfully!");
          resetForm();
          navigate("/inquiries");
        })
        .catch((error) => {
          console.error("Error adding inquiry:", error);
          toast.error("Failed to add inquiry. Please try again.");
        });
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="col-md-8 border border-2 border-dark rounded-4 shadow-lg p-4 bg-white">
        <h2 className="text-center mb-4 text-secondary fw-bold">
          {id ? "Update Inquiry" : "Add Inquiry"}
        </h2>

        <form onSubmit={saveOrUpdateInquiry} autoComplete="off">
          <div className="row">
            {/* LEFT SIDE FORM FIELDS */}
            <div className="col-md-6">
              {/* Name field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  value={name}
                  onChange={onNameChange}
                  placeholder="Enter your name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Mobile field */}
              <div className="mb-3">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={onMobileChange}
                  placeholder="Enter your mobile number"
                  maxLength={10}
                />
                {errors.mobileNumber && (
                  <div className="invalid-feedback">{errors.mobileNumber}</div>
                )}
              </div>

              {/* Email field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Address field */}
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: null }));
                  }}
                  placeholder="Enter your address"
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>
            </div>

            {/* RIGHT SIDE FORM FIELDS */}
            <div className="col-md-6">
              {/* Work type */}
              <div className="mb-3">
                <label htmlFor="workType" className="form-label">Work Type</label>
                <input
                  type="text"
                  className={`form-control ${errors.workType ? "is-invalid" : ""}`}
                  id="workType"
                  value={workType}
                  onChange={(e) => {
                    setWorkType(e.target.value);
                    if (errors.workType)
                      setErrors((prev) => ({ ...prev, workType: null }));
                  }}
                  placeholder="Enter your work type"
                />
                {errors.workType && (
                  <div className="invalid-feedback">{errors.workType}</div>
                )}
              </div>

              {/* Loan type */}
              <div className="mb-3">
                <label htmlFor="loanType" className="form-label">Loan Type</label>
                <select
                  className={`form-select ${errors.loanType ? "is-invalid" : ""}`}
                  id="loanType"
                  value={loanType}
                  onChange={(e) => {
                    setLoanType(e.target.value);
                    if (errors.loanType)
                      setErrors((prev) => ({ ...prev, loanType: null }));
                  }}
                  required
                >
                  <option value="">Select Loan Type</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Bike Loan">Bike Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Education Loan">Education Loan</option>
                </select>
                {errors.loanType && (
                  <div className="invalid-feedback">{errors.loanType}</div>
                )}
              </div>

              {/* Annual income */}
              <div className="mb-3">
                <label htmlFor="annualIncome" className="form-label">Annual Income</label>
                <input
                  type="number"
                  className={`form-control ${errors.annualIncome ? "is-invalid" : ""}`}
                  id="annualIncome"
                  value={annualIncome}
                  onChange={(e) => {
                    setAnnualIncome(e.target.value);
                    if (errors.annualIncome)
                      setErrors((prev) => ({ ...prev, annualIncome: null }));
                  }}
                  placeholder="Enter your annual income"
                />
                {errors.annualIncome && (
                  <div className="invalid-feedback">{errors.annualIncome}</div>
                )}
              </div>

              {/* Past loan radio buttons */}
              <div className="mb-3">
                <label className="form-label d-block">Past Loan</label>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="pastLoanYes"
                    name="pastLoan"
                    value="yes"
                    checked={pastLoan === "yes"}
                    onChange={(e) => {
                      setPastLoan(e.target.value);
                      if (errors.pastLoan)
                        setErrors((prev) => ({ ...prev, pastLoan: null }));
                    }}
                  />
                  <label htmlFor="pastLoanYes" className="form-check-label">
                    Yes
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="pastLoanNo"
                    name="pastLoan"
                    value="no"
                    checked={pastLoan === "no"}
                    onChange={(e) => {
                      setPastLoan(e.target.value);
                      if (errors.pastLoan)
                        setErrors((prev) => ({ ...prev, pastLoan: null }));
                    }}
                  />
                  <label htmlFor="pastLoanNo" className="form-check-label">
                    No
                  </label>
                </div>
                {errors.pastLoan && (
                  <div className="text-danger small mt-1">{errors.pastLoan}</div>
                )}
              </div>

              {/* PAN card field */}
              <div className="mb-3">
                <label htmlFor="panCard" className="form-label">PAN Card</label>
                <input
                  type="text"
                  className={`form-control ${errors.panCard ? "is-invalid" : ""}`}
                  id="panCard"
                  value={panCard}
                  onChange={onPanChange}
                  placeholder="Enter your PAN card number"
                  maxLength={10}
                />
                {errors.panCard && (
                  <div className="invalid-feedback">{errors.panCard}</div>
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary px-5 fw-semibold">
              {id ? "Update Inquiry" : "Add Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInquiry;
