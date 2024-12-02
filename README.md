# 🚀 NextHireAi (Job Seeker & Recruiter Web App)

This is a minimalistic, responsive web application built using **Next.js**, **Convex**, **Firebase**, **Clerk**, and **Google Generative AI**. The main purpose of this project is to provide a seamless and intuitive experience for job seekers and recruiters to analyze resumes (CVs) based on job descriptions. The app is designed to analyze ATS (Applicant Tracking System) scores and offer detailed feedback and suggestions for job seekers.

### 🧑‍💻 Project Overview

I built this project to solve a common problem I encountered while searching for a job. Many ATS-checking websites lack good UI and user experience, with many built using frameworks like Streamlit and Python. I wanted to create a clean, intuitive platform with great user experience where users can check their ATS score and improve their resumes.

The app allows users to sign up or log in and choose between two roles: **Recruiter** or **Job Seeker**. The Recruiter role allows you to view resumes/CVs submitted by job seekers, filter them by skills, and access them via PDF links. The Job Seeker role allows users to upload their resume (CV), input a job description, and analyze their resume using generative AI to get tips, suggestions, and an ATS score.

### ✨ Key Features

- 🔐 **User Authentication**: Login or sign up using **Clerk** (Firebase Authentication alternative).
- 🧑‍💼👩‍💻 **Role Selection**: After logging in, users can choose whether they are a **Recruiter** or a **Job Seeker**.
  - **Recruiters** can view job seekers' resumes and filter by skills.
  - **Job Seekers** can upload their resume and analyze it against a job description.
- 🤖 **AI-Powered Analysis**: Resume analysis is powered by **Google Generative AI**, **OpenAI**, or **Hugging Face** (based on configuration in `.env`).
- 📊 **ATS Score**: Job seekers can receive an ATS score based on how well their resume matches a job description.
- 💡 **Suggestions & Feedback**: Detailed suggestions, tips, and graphical representation of how the resume matches the job description.
- ✉️ **Resume Sending**: Job seekers can send their resumes to recruiters (one resume per recruiter).
- 🎯 **Quiz**: Job seekers can take a quiz based on the job description to prepare for interviews.
- 📱💻**Responsive Design**: Fully responsive UI for a seamless experience on mobile and desktop.

### 🏁 Getting Started

#### 📦 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn** (package managers)
- **Firebase** storage
- **Convex** database
- **Clerk** account and API key (for user authentication)
- **Google Cloud Generative AI API** or **OpenAI** API key (for resume analysis)

#### 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shivam171/next-hire-ai
   cd next-hire-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables by copying `.env.example` to `.env` and `.env.local.example` to `.env.local` and replacing the placeholders with your credentials:

   ```bash
   cp .env.example .env
   cp .env.local.example .env.local
   ```

4. Run the development server and convex server:

   ```bash
   npm run dev
   npx convex dev
   ```

5. Open the app in your browser at `http://localhost:3000`.

### 🛠️ Usage

1. **Sign Up / Login**: After logging in with **Clerk**, choose your role as either a **Recruiter** or **Job Seeker**.
2. **For Recruiters**: View CVs uploaded by job seekers. Filter by skills and view resumes in PDF format.
3. **For Job Seekers**: Upload your resume and paste the job description for the role you're applying for. The app will analyze your resume against the job description and provide an ATS score, along with tips, suggestions, and a quiz.
4. **ATS Score**: The system uses AI to analyze how well your resume matches the job description and provides a score (in percentage).
5. **Send Resume**: Once satisfied, you can send your resume to a recruiter by selecting from a list of recruiters.

### ⚠️ Known Issues

- Some links on the homepage may not work as they are mockups.
- The "Download Report" feature is not fully implemented yet, but feel free to contribute!

### 🤝 Contribution

If you'd like to contribute, feel free to open a pull request! Here’s a small tip for contributors:

- **Missing Feature**: A feature for downloading a report after the resume has been analyzed is planned but not yet implemented. If you'd like to add this functionality, it would be a great first contribution.

Please feel free to add more features, fix bugs, or improve the code. I welcome all contributions.

### 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

### 🌟 Star this Repo!

If you like the idea and think it can help others, feel free to star the repo! ⭐

---

🙏🏻 Thanks for checking out the project, and I hope you find it useful for improving your resume and job search process. 💼
