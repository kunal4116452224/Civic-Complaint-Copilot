# Civic Complaint Copilot

**Civic Complaint Copilot** is a high-impact, AI-powered platform designed to transform citizen-led observations (photos and text descriptions) into professional, municipal-grade grievances. By bridging the gap between casual observation and administrative requirements, it empowers residents to report infrastructure and public issues effectively.

---

## Features

- **AI-Powered Issue Classification**: Automatically detects issue types (e.g., potholes, sanitation, lighting) and assesses severity using an intelligent AI pipeline.
- **Precision Geocoding**: Integrated GPS detection with reverse geocoding to provide human-readable addresses for formal reporting.
- **Departmental Mapping**: Intelligently routes grievances to the relevant municipal departments.
- **Formal Grievance Generation**: Transforms raw input into professional, polite, yet firm grievance letters.
- **Official PDF Export**: Allows users to download a physical copy of their complaint for official filing or personal records.
- **Integrated Tracking Dashboard**: A local-first dashboard to view, manage, and track the status of past complaints.
- **Multi-Language Support**: Accessible to a diverse population with built-in localization features.

---

## Tech Stack

- **Core**: [Next.js 15+](https://nextjs.org/) (App Router), React 19, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Aesthetics and Animations)
- **Utilities**: 
  - [jsPDF](https://github.com/parallax/jsPDF) for professional document generation
  - Browser Geolocation API for precise coordinate tracking
- **Deployment**: [Vercel](https://vercel.com/) (Optimized for Next.js)

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (version 18.x or later) installed.

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/civic-complaint-copilot.git
   cd civic-complaint-copilot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your AI service credentials (if applicable).
   ```env
   NEXT_PUBLIC_AI_API_KEY=your_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Usage

1. **Upload or Capture**: Provide a photo or a text description of the civic issue.
2. **Auto-Detect Location**: Use the geolocation feature to automatically pin the issue's address.
3. **AI Analysis**: Let the "Copilot" analyze the issue, identify the relevant authority, and draft the complaint.
4. **Download/File**: Review the formal letter, export it as a PDF, or track it in your personal dashboard.

---

## Project Structure

```text
src/
├── app/          # Next.js App Router (pages, layouts, API routes)
├── components/   # Modular UI components (Navigation, Forms, UI Elements)
├── config/       # Global constants (Authority maps, department settings)
├── contexts/     # Application-wide state (Authentication, Localization)
├── data/         # Static data assets (Issue types, analysis constants)
├── hooks/        # Custom React hooks (useGeolocation, useComplaints)
├── lib/          # Business logic and utilities (PDF generators, helpers)
└── styles/       # Global CSS and Tailwind configuration
```

---

## Screenshots / Demo

*Coming Soon: A visual walkthrough of the 'Home', 'Result', and 'Dashboard' screens.*

---

## Future Improvements

- [ ] Real-time integration with municipal grievance APIs.
- [ ] Push notifications for status updates on filed complaints.
- [ ] Community verification system to upvote/validate existing issues.
- [ ] Expansion of departmental mapping to include regional and state-level authorities.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Transforming complaints into action with Civic Complaint Copilot.*
