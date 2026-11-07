# GRANTLY – Smart Scholarship Discovery & Management Platform

<p align="center">
  <strong>Your Future. Your Opportunities.</strong>
</p>

<p align="center">
  A unified scholarship intelligence platform designed to help students discover scholarships, understand eligibility, manage applications, organize documents, and never miss important deadlines.
</p>

---

## 📌 About GRANTLY

**GRANTLY** is an intelligent scholarship discovery and management platform designed to simplify the scholarship application journey for students.

Finding suitable scholarships, understanding eligibility criteria, organizing required documents, tracking application progress, and remembering deadlines can be challenging.

GRANTLY brings these essential activities together in one centralized platform.

It combines scholarship discovery, eligibility intelligence, application management, document organization, deadline tracking, and AI-powered assistance to create a more organized and accessible scholarship experience.

Instead of searching across multiple platforms and managing applications manually, students can use GRANTLY to manage their scholarship journey from one place.

### Our Vision

To make scholarship opportunities more accessible, transparent, and easier to manage so that students can focus more on their education and future.

### Our Mission

- Simplify scholarship discovery.
- Help students understand their eligibility.
- Reduce application management complexity.
- Organize important academic documents.
- Prevent missed application deadlines.
- Provide intelligent, personalized scholarship guidance.

---

## ✨ Key Features – Six Core Modules

GRANTLY is built around six interconnected modules.

### 1. Smart Student Profile

A centralized student profile that stores relevant academic and personal information.

**Key capabilities:**
- Student profile management.
- Academic information management.
- Personal and educational details.
- Centralized student information.
- Support for personalized scholarship discovery.
- Reuse of profile information across scholarship workflows.

### 2. Scholarship Discovery

Helps students explore scholarship opportunities based on their requirements.

**Key capabilities:**
- Scholarship discovery and browsing.
- Search and filtering options.
- Scholarship information and details.
- Eligibility requirements.
- Benefits and financial assistance information.
- Application details and available links.

### 3. Explainable Eligibility Intelligence

Helps students understand whether they meet the requirements of a scholarship.

**Key capabilities:**
- Compare student information with scholarship requirements.
- Identify matching eligibility criteria.
- Highlight missing requirements.
- Explain eligibility decisions.
- Help students understand why they may or may not qualify.

The goal is not just to show an eligibility result, but also to explain the reasoning behind it.

### 4. Application Command Center

A centralized place to manage scholarship applications.

**Key capabilities:**
- Track application progress.
- Organize application records.
- Monitor application statuses.
- Manage application-related activities.
- Keep scholarship application information organized.

### 5. Smart Document Vault

A centralized document management system for scholarship-related documents.

**Key capabilities:**
- Upload and organize documents.
- Manage important academic documents.
- Access stored documents.
- Organize documents for application requirements.
- Reduce repeated document searching.

### 6. Deadline Intelligence

Helps students stay aware of important scholarship deadlines.

**Key capabilities:**
- Track scholarship deadlines.
- Monitor upcoming application dates.
- Organize important dates.
- Reduce the possibility of missing deadlines.
- Support better application planning.

---

## 🤖 Ask GRANTLY – AI Scholarship Advisor

**Ask GRANTLY** is the AI-powered conversational assistant integrated into the platform.

Powered by Google's Gemini API, it is designed to help students understand GRANTLY and get scholarship-related guidance.

### Capabilities

- Answer general scholarship-related questions.
- Explain GRANTLY's six core modules.
- Guide users through website features.
- Explain eligibility concepts.
- Help students understand application workflows.
- Answer questions about document management.
- Support contextual follow-up conversations.
- Provide relevant scholarship information when verified data is available.

### Example Questions

- What is GRANTLY?
- How can I find scholarships?
- What is Eligibility Intelligence?
- How do I manage my applications?
- How can I upload my documents?
- Tell me about available scholarships.
- What are the important scholarship deadlines?

### AI Integration

The chatbot uses the Gemini API to generate dynamic responses.

The Gemini API key should be configured securely through backend environment variables or the platform's secure secrets configuration.

**Important:** Never expose API keys in frontend code or public repositories.

---

## 🛠️ Technology Stack

The project uses a modern web development architecture.

The following technologies describe the intended stack; verify the actual dependencies in `package.json` before publishing the final repository documentation.

| Technology | Purpose |
|---|---|
| React | Component-based frontend development |
| Vite | Development server and build tooling |
| JavaScript | Application functionality |
| Tailwind CSS | Styling and responsive UI |
| React Router | Client-side navigation |
| Google Gemini API | AI-powered chatbot |
| Backend / Database | Authentication, data storage, and application operations, depending on project configuration |

### Development Tools

- Node.js
- npm
- Git
- GitHub
- Visual Studio Code

---

## 📂 Project Structure

The following is a reference structure. Actual folder and file names may differ depending on the existing implementation.

```text
grantly/
│
├── public/
│   ├── assets/
│   └── images/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── Footer
│   │   ├── SplashScreen
│   │   └── Chatbot
│   │
│   ├── pages/
│   │   ├── Home
│   │   ├── Dashboard
│   │   ├── Scholarships
│   │   ├── Eligibility
│   │   ├── Applications
│   │   ├── DocumentVault
│   │   ├── Profile
│   │   └── Settings
│   │
│   ├── services/
│   │   └── API services
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## 💻 Getting Started

Follow these instructions to run GRANTLY locally.

### 1. Prerequisites

Install the following software:

- Node.js (use a version compatible with the project's Vite version).
- npm (included with Node.js).
- Git (optional, for cloning the repository).
- Visual Studio Code or another code editor.

Check whether Node.js and npm are installed:

```bash
node -v
npm -v
```

### 2. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd grantly
```

If you have already downloaded the project, simply open CMD inside its root directory.

### 3. Install Dependencies

Run:

```bash
npm install
```

If npm reports an ERESOLVE dependency conflict, try:

```bash
npm install --legacy-peer-deps
```

If you encounter the specific Vite 8 and esbuild version conflict in this project, check the dependency versions in `package.json`. Vite 8 requires a compatible esbuild version.

A possible correction, if the project still declares esbuild 0.25.x, is:

```bash
npm install -D esbuild@^0.28.0
npm install --legacy-peer-deps
```

Do not delete your lockfile or change dependency versions unnecessarily if the project already installs successfully.

### 4. Configure Environment Variables

Create a `.env` file in the project root if the application requires environment variables.

Example:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Add other backend configuration variables
# according to the existing project setup.
```

**Security Guidelines:**

- Never commit `.env` to GitHub.
- Never expose secret API keys in frontend code.
- Keep Gemini API calls on the backend.
- Use the environment variable names expected by the actual application.
- Do not assume that frontend environment variables are secret.

If your project uses a backend service or database, configure its required credentials as well.

### 5. Start the Development Server

Run:

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

Usually:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

### 6. Build for Production

To create a production build:

```bash
npm run build
```

### 7. Preview Production Build

```bash
npm run preview
```

---

## 🧭 Platform Navigation

GRANTLY brings its major features together through a centralized navigation experience.

The platform includes:

- Home – Introduction to GRANTLY.
- Dashboard – Centralized student overview.
- Scholarships – Discover opportunities.
- Eligibility – Understand scholarship eligibility.
- Applications – Manage application progress.
- Document Vault – Organize important documents.
- Deadline Intelligence – Track important dates.
- Student Profile – Manage student information.
- Ask GRANTLY – Get AI-powered assistance.

Actual routes depend on the implemented application.

---

## 🔐 Security and Privacy

GRANTLY handles student-related information, so security and responsible data management are important.

Security considerations include:

- Secure authentication.
- Protected application routes.
- Proper authorization.
- Secure API key management.
- Appropriate database access policies.
- Protection of student information.
- Secure document storage.
- Validation of user inputs.
- Prevention of unauthorized data access.

Sensitive student information should only be accessed by authorized users.

---

## 📱 Responsive Design

GRANTLY is intended to provide a consistent experience across:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile devices.

Responsive layouts and mobile-friendly navigation help students access scholarship-related features from different devices.

---

## ⚙️ Available npm Scripts

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm install --legacy-peer-deps` | Install dependencies while bypassing strict peer dependency resolution |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run preview` | Preview the production build |

Additional commands depend on the scripts defined in `package.json`.

---

## 🚀 Future Scope

Potential improvements for GRANTLY include:

- More advanced personalized scholarship recommendations.
- Expanded verified scholarship database.
- AI-powered eligibility analysis.
- Automated application reminders.
- Improved document verification workflows.
- Scholarship application analytics.
- More contextual AI assistance.
- Additional integrations with scholarship information sources.
- Enhanced accessibility and multilingual support.

These are potential future improvements, not necessarily existing features.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request.

Example:

```bash
git checkout -b feature/your-feature-name
```

Commit your changes:

```bash
git add .
git commit -m "Add: your feature description"
```

Push your branch:

```bash
git push origin feature/your-feature-name
```

---

## 🐛 Reporting Issues

If you encounter a bug or have a feature suggestion:

1. Check whether the issue has already been reported.
2. Provide a clear description.
3. Include steps to reproduce the issue.
4. Attach screenshots or error logs where appropriate.

---

## 📄 License

A license has not yet been specified.

Add an appropriate open-source or proprietary license before distributing the project publicly.

---

## 💡 Project Information

**Project Name:** GRANTLY

**Category:** EdTech / Scholarship Technology

**Project Type:** Web Application

**Primary Purpose:** Scholarship Discovery and Management

**AI Integration:** Google Gemini API

**Tagline:** Your Future. Your Opportunities.

---

<p align="center">
  <strong>GRANTLY</strong>
  <br/>
  Making scholarship opportunities easier to discover, understand, and manage.
  <br/><br/>
  <em>Your Future. Your Opportunities.</em>
</p>