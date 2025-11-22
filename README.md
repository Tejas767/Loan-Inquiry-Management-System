Navkar Finance – Loan Inquiry Management System
📌 Overview-
The Loan Finance System (Navkar Finance) is a full-stack web application designed to manage loan inquiries for customers and administrators.
Customers can submit loan applications, while the admin can review, approve, or reject those inquiries through a dedicated dashboard with data visualization and status tracking.


🛠️ Tech Stack

-Frontend: React.js, Bootstrap, React Router, React Toastify, Chart.js
-Backend: Spring Boot, Spring Data JPA, Spring Security (JWT)
-Database: MySQL
-Build Tools: Maven (Backend), npm (Frontend)
-Other Tools: Postman, VS Code, IntelliJ IDEA, Git, GitHub




✨ Features

*👤 Customer Features

-Register and log in securely
-Submit loan inquiries through a detailed form with validation
-View personal loan applications and their real-time approval status
-Get updates for approved, rejected, or pending loans



*🧑‍💼 Admin Features

-View all customer loan inquiries in an organized dashboard
-Approve, reject, or keep inquiries pending
-Visualize loan status statistics using Chart.js pie charts
-Manage data in real-time with toast notifications and auto-refresh



*🔒 Security

User authentication and authorization using JWT Tokens
Encrypted credentials stored in MySQL
Role-based access control for Admin and Customer



🧩 API Endpoints

*🔑 Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login and get JWT token |


*🧾 Loan Inquiries

| Method | Endpoint                                              | Description                             |
| ------ | ----------------------------------------------------- | --------------------------------------- |
| POST   | `/api/inquiries/inquiry`                              | Submit a new loan inquiry               |
| GET    | `/api/inquiries/my`                                   | Get inquiries of the logged-in customer |
| PATCH  | `/api/inquiries/{id}/status?status=APPROVED/REJECTED` | Update inquiry status *(Admin only)*    |
| GET    | `/api/inquiries`                                      | Get all inquiries *(Admin only)*        |


🧱 Project Structure

LoanFinanceSystem/
 ┣ 📂 backend/
 ┃ ┣ 📂 controller/     # REST Controllers for Auth & Inquiry handling
 ┃ ┣ 📂 service/        # Business logic (LoanInquiryService)
 ┃ ┣ 📂 repository/     # JPA repositories
 ┃ ┣ 📂 entity/         # Entity and Enum classes (User, LoanInquiry, LoanStatus)
 ┃ ┣ 📜 LoanApplication.java
 ┃ ┗ 📜 application.properties
 ┣ 📂 frontend/
 ┃ ┣ 📂 components/     # React components (Login, Register, Dashboard, etc.)
 ┃ ┣ 📂 services/       # Axios API calls
 ┃ ┣ 📜 App.js
 ┃ ┣ 📜 package.json
 ┗ 📜 README.md



⚙️ Installation & Setup
🧩 Backend Setup

1.Clone the repository.
git clone https://github.com/Tejas767/Loan-Inquiry-Management-System.git
cd backend


2.Configure your MySQL database in application.properties

3.Run the backend.
  mvn spring-boot:run

4. API runs at → http://localhost:8080



💻 Frontend Setup

1.Navigate to the frontend folder.
cd frontend
npm install
npm start


2.React app runs at → http://localhost:3000
