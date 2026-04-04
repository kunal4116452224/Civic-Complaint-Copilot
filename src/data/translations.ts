export type Lang = "en" | "hi";

const TEXT: Record<Lang, Record<string, string>> = {
    en: {
        // Nav
        home: "Home",
        reportIssue: "Report Issue",
        dashboard: "Dashboard",
        trackComplaints: "Track Complaints",
        beforeAfter: "Before/After",
        contact: "Contact",
        login: "Login",
        logout: "Logout",

        // Auth
        welcomeBack: "Welcome Back",
        signInSubtitle: "Sign in to access your civic dashboard",
        yourName: "Your Name",
        email: "Email",
        optional: "(optional)",
        selectRole: "Select Role",
        roleUser: "User",
        roleAdmin: "Admin",
        loginButton: "Login →",
        noAccountNeeded: "No account needed — just enter your name to get started.",

        // Dashboard
        dashboardLabel: "Dashboard",
        adminPanel: "Admin Panel",
        complaintOverview: "Complaint Performance Overview",
        totalComplaints: "Total Complaints",
        resolved: "Resolved",
        pending: "Pending",
        inProgress: "In Progress",
        submitted: "Submitted",
        recentComplaints: "Recent Complaints",
        reportNewIssue: "Report New Issue",
        noComplaints: "No complaints submitted yet.",
        markInProgress: "Mark In Progress",
        markResolved: "Mark Resolved",
        allComplaints: "All Complaints (Admin View)",
        myComplaints: "My Complaints",
        submittedBy: "Submitted by",
        confirmDelete: "Are you sure you want to delete this complaint?",
        allStatuses: "All Statuses",
        checkingAuth: "Checking authentication…",

        // Contact
        contactUs: "Contact Us",
        contactSubtitle: "Have questions or feedback? We'd love to hear from you.",
        yourMessage: "Your Message",
        sendMessage: "Send Message",
        messageSent: "Message sent successfully!",
        namePlaceholder: "e.g. Kunal",
        emailPlaceholder: "you@example.com",
        messagePlaceholder: "Write your message here…",

        // Hero / Landing
        civicCopilot: "Civic Complaint Copilot",
        heroTitle: "Report city issues in minutes with AI-powered complaint drafting.",
        heroSubtitle: "Upload an image, describe the problem, and submit a polished complaint to the right authority with confidence.",
        reportIssueNow: "Report Issue Now",
        viewNearbyComplaints: "View Nearby Complaints",
        complaintsResolved: "Complaints resolved",
        avgResolutionTime: "Avg resolution time",
        guidedSubmission: "Guided Complaint Submission",
        guidedSubmissionDesc: "Four-step AI-assisted reporting with image upload and authority mapping.",
        performanceDashboard: "Performance Dashboard",
        performanceDashboardDesc: "See total, resolved, and pending complaint metrics in one place.",
        timelineTracking: "Timeline Tracking",
        timelineTrackingDesc: "Monitor Submitted, In Progress, and Resolved lifecycle updates.",
        open: "Open",
        beforeAfterSpotlight: "Before/After Spotlight",
        viewFullGallery: "View Full Gallery",
        currentSituation: "Current Situation",
        expectedResolution: "Expected Resolution",
        nearbySnapshot: "Nearby Complaints Snapshot",

        // Tracking
        trackingLabel: "Tracking",
        trackingTitle: "Follow every complaint stage",

        // Before/After
        beforeAfterLabel: "Before & After",
        beforeAfterTitle: "Visual proof of complaint impact",
        garbageCase: "Solid waste complaint outcome",
        potholeCase: "Road damage repair tracking",
        streetlightCase: "Streetlight restoration case",

        // Report Flow
        complaintFiling: "Complaint Filing",
        reportFlowTitle: "Report a civic issue in 4 guided steps",
        reportFlowSubtitle: "Upload proof, let AI prepare the official complaint, and track authority updates without losing your current workflow.",
        analyzeIssue: "Analyze Issue",
        submitAndTrack: "Submit & Track",
        analysisFailedTitle: "Analysis failed",
        retryAnalysis: "Retry analysis",
        backToEdit: "Back to edit",
        aiPreparing: "AI is preparing your complaint",
        pdfPreviewTitle: "Official Complaint PDF Preview",
        pdfPreviewSubtitle: "Review the content before downloading.",
        complaintId: "Complaint ID",
        subject: "Subject",
        body: "Body",
        department: "Department",
        close: "Close",
        downloadPdf: "Download PDF",

        // API error fallback
        apiErrorMessage: "Something went wrong. Please try again.",

        // Authorities
        "Municipal Corporation": "Municipal Corporation",
        "Public Works Department (PWD)": "Public Works Department (PWD)",
        "Water & Sewer Board": "Water & Sewer Board",
        "Electricity Department": "Electricity Department",

        // Severities
        low: "Low",
        medium: "Medium",
        high: "High",

        // Status
        statusSubmitted: "Submitted",
        statusInProgress: "In Progress",
        statusResolved: "Resolved",

        // Nearby Issues Demo
        nearbyPothole: "Large pothole near Central Market",
        nearbyStreetlight: "Street light not working for 3 days",
        nearbyGarbage: "Garbage not collected since Monday",
        mgRoad: "MG Road, Sector 14",
        parkAvenue: "Park Avenue, Block C",
        greenColony: "Green Colony, Lane 4",

        // Flow Steps
        step1Title: "Upload Image / Describe Issue",
        step1Desc: "Add a clear photo, issue text, and location details.",
        step2Title: "AI Analysis",
        step2Desc: "Issue type, severity, and authority are detected automatically.",
        step3Title: "Review Generated Complaint",
        step3Desc: "Edit the title and body before final submission.",
        step4Title: "Submit & Track",
        step4Desc: "Save and monitor status updates on a timeline.",

        // Quotes
        quote1: "Clean city, responsible citizens.",
        quote2: "Your complaint can change your street.",
        quote3: "Do not ignore - report.",
        quote4: "Small civic actions create safer neighborhoods.",

        // Alt
        cityAlt: "City maintenance activity",

        // Tracking Section
        complaintTracking: "Complaint Tracking",
        trackProgressDesc: "Track progress from submission to final resolution.",
        noComplaintsTracked: "No complaints tracked yet. Submit a complaint to see timeline updates.",
        delete: "Delete",
        pendingUpdate: "Pending update",
        pdfDownloaded: "PDF downloaded.",
        failedToGeneratePdf: "Failed to generate PDF.",
        statusUpdatedTo: "Status updated to",
        complaintRemoved: "Complaint removed.",
        officialPdfDownloaded: "Official complaint PDF downloaded.",
        analysisCancelled: "Analysis cancelled.",
        aiServiceUnavailable: "AI service unavailable. Loaded a fallback complaint draft.",
        aiAnalysisComplete: "AI analysis complete. Review your complaint draft.",
        potholePlaceholder: "Example: Pothole near bus stop causes accidents during rain.",
        locationPlaceholder: "Street, area, city",
        landmarkPlaceholder: "Near metro station",
        useCurrentLocation: "Use current location",
        detectingLocation: "Detecting location...",
        uploadEvidence: "Upload Evidence",
        browseFiles: "Browse files",
        replaceImage: "Replace image",
        removeImage: "Remove image",
        dragDropImage: "Drag and drop a civic issue image",
        supportedFormats: "PNG, JPG, WEBP supported",
        describeIssue: "Describe the Issue",
        issueDetails: "Issue details",
        landmarkLabel: "Landmark (optional)",
        locationLabel: "Location",

        // Misc
        welcome: "Welcome",
        lightMode: "Light mode",
        darkMode: "Dark mode",
        switchToLight: "Switch to Light mode",
        switchToDark: "Switch to Dark mode",
    },
    hi: {
        // Nav
        home: "होम",
        reportIssue: "समस्या दर्ज करें",
        dashboard: "डैशबोर्ड",
        trackComplaints: "शिकायत ट्रैक करें",
        beforeAfter: "पहले/बाद",
        contact: "संपर्क",
        login: "लॉगिन",
        logout: "लॉगआउट",

        // Auth
        welcomeBack: "वापस स्वागत है",
        signInSubtitle: "अपने सिविक डैशबोर्ड तक पहुँचने के लिए साइन इन करें",
        yourName: "आपका नाम",
        email: "ईमेल",
        optional: "(वैकल्पिक)",
        selectRole: "भूमिका चुनें",
        roleUser: "उपयोगकर्ता",
        roleAdmin: "एडमिन",
        loginButton: "लॉगिन →",
        noAccountNeeded: "किसी खाते की आवश्यकता नहीं — शुरू करने के लिए बस अपना नाम दर्ज करें।",

        // Dashboard
        dashboardLabel: "डैशबोर्ड",
        adminPanel: "एडमिन पैनल",
        complaintOverview: "शिकायत प्रदर्शन अवलोकन",
        totalComplaints: "कुल शिकायतें",
        resolved: "समाधान",
        pending: "लंबित",
        inProgress: "प्रगति पर",
        submitted: "सबमिट किया",
        recentComplaints: "हाल की शिकायतें",
        reportNewIssue: "नई समस्या दर्ज करें",
        noComplaints: "अभी तक कोई शिकायत दर्ज नहीं की गई।",
        markInProgress: "प्रगति पर लगाएँ",
        markResolved: "समाधान करें",
        allComplaints: "सभी शिकायतें (एडमिन दृश्य)",
        myComplaints: "मेरी शिकायतें",
        submittedBy: "द्वारा सबमिट",
        confirmDelete: "क्या आप वाकई इस शिकायत को हटाना चाहते हैं?",
        allStatuses: "सभी स्थितियाँ",
        checkingAuth: "प्रमाणीकरण जाँच रहा है…",

        // Contact
        contactUs: "संपर्क करें",
        contactSubtitle: "कोई सवाल या प्रतिक्रिया? हम आपसे सुनना चाहेंगे।",
        yourMessage: "आपका संदेश",
        sendMessage: "संदेश भेजें",
        messageSent: "संदेश सफलतापूर्वक भेजा गया!",
        namePlaceholder: "जैसे कुणाल",
        emailPlaceholder: "you@example.com",
        messagePlaceholder: "अपना संदेश यहाँ लिखें…",

        // Hero / Landing
        civicCopilot: "सिविक शिकायत कोपायलट",
        heroTitle: "AI-संचालित शिकायत ड्राफ्टिंग से शहर की समस्याएं मिनटों में दर्ज करें।",
        heroSubtitle: "एक तस्वीर अपलोड करें, समस्या का वर्णन करें, और सही प्राधिकरण को विश्वास के साथ शिकायत प्रस्तुत करें।",
        reportIssueNow: "अभी समस्या दर्ज करें",
        viewNearbyComplaints: "आस-पास की शिकायतें देखें",
        complaintsResolved: "शिकायतें हल हुईं",
        avgResolutionTime: "औसत समाधान समय",
        guidedSubmission: "गाइडेड शिकायत सबमिशन",
        guidedSubmissionDesc: "इमेज अपलोड और प्राधिकरण मैपिंग के साथ चार-चरणीय AI-सहायता रिपोर्टिंग।",
        performanceDashboard: "प्रदर्शन डैशबोर्ड",
        performanceDashboardDesc: "कुल, समाधान, और लंबित शिकायत मेट्रिक्स एक जगह देखें।",
        timelineTracking: "टाइमलाइन ट्रैकिंग",
        timelineTrackingDesc: "सबमिटेड, प्रगति पर, और समाधान जीवनचक्र अपडेट देखें।",
        open: "खोलें",
        beforeAfterSpotlight: "पहले/बाद स्पॉटलाइट",
        viewFullGallery: "पूरी गैलरी देखें",
        currentSituation: "वर्तमान स्थिति",
        expectedResolution: "अपेक्षित समाधान",
        nearbySnapshot: "आस-पास की शिकायतें",

        // Tracking
        trackingLabel: "ट्रैकिंग",
        trackingTitle: "प्रत्येक शिकायत चरण का पालन करें",

        // Before/After
        beforeAfterLabel: "पहले और बाद",
        beforeAfterTitle: "शिकायत प्रभाव का दृश्य प्रमाण",
        garbageCase: "ठोस अपशिष्ट शिकायत परिणाम",
        potholeCase: "सड़क क्षति मरम्मत ट्रैकिंग",
        streetlightCase: "स्ट्रीटलाइट बहाली केस",

        // Report Flow
        complaintFiling: "शिकायत दर्ज करना",
        reportFlowTitle: "4 गाइडेड चरणों में सिविक समस्या दर्ज करें",
        reportFlowSubtitle: "सबूत अपलोड करें, AI को आधिकारिक शिकायत तैयार करने दें, और बिना किसी रुकावट के प्राधिकरण अपडेट ट्रैक करें।",
        analyzeIssue: "समस्या विश्लेषण करें",
        submitAndTrack: "सबमिट और ट्रैक करें",
        analysisFailedTitle: "विश्लेषण विफल",
        retryAnalysis: "पुनः प्रयास करें",
        backToEdit: "संपादन पर वापस जाएँ",
        aiPreparing: "AI आपकी शिकायत तैयार कर रहा है",
        pdfPreviewTitle: "आधिकारिक शिकायत PDF पूर्वावलोकन",
        pdfPreviewSubtitle: "डाउनलोड करने से पहले सामग्री की समीक्षा करें।",
        complaintId: "शिकायत ID",
        subject: "विषय",
        body: "विवरण",
        department: "विभाग",
        close: "बंद करें",
        downloadPdf: "PDF डाउनलोड करें",

        // API error fallback
        apiErrorMessage: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",

        // Authorities
        "Municipal Corporation": "नगर निगम",
        "Public Works Department (PWD)": "लोक निर्माण विभाग (PWD)",
        "Water & Sewer Board": "जल एवं सीवर बोर्ड",
        "Electricity Department": "बिजली विभाग",

        // Severities
        low: "कम",
        medium: "मध्यम",
        high: "उच्च",

        // Status
        statusSubmitted: "सबमिट किया गया",
        statusInProgress: "प्रगति पर",
        statusResolved: "समाधान हो गया",

        // Nearby Issues Demo
        nearbyPothole: "सेंट्रल मार्केट के पास बड़ा गड्ढा",
        nearbyStreetlight: "3 दिनों से स्ट्रीट लाइट काम नहीं कर रही है",
        nearbyGarbage: "सोमवार से कचरा इकट्ठा नहीं हुआ",
        mgRoad: "एमजी रोड, सेक्टर 14",
        parkAvenue: "पार्क एवेन्यू, ब्लॉक सी",
        greenColony: "ग्रीन कॉलोनी, लेन 4",

        // Flow Steps
        step1Title: "छवि अपलोड करें / समस्या का वर्णन करें",
        step1Desc: "एक स्पष्ट फोटो, समस्या का विवरण और स्थान विवरण जोड़ें।",
        step2Title: "AI विश्लेषण",
        step2Desc: "समस्या का प्रकार, गंभीरता और प्राधिकरण का स्वचालित रूप से पता लगाया जाता है।",
        step3Title: "जनरेट की गई शिकायत की समीक्षा करें",
        step3Desc: "अंतिम सबमिशन से पहले शीर्षक और मुख्य भाग को संपादित करें।",
        step4Title: "सबमिट और ट्रैक करें",
        step4Desc: "टाइमलाइन पर स्थिति अपडेट सहेजें और मॉनिटर करें।",

        // Quotes
        quote1: "स्वच्छ शहर, जिम्मेदार नागरिक।",
        quote2: "आपकी शिकायत आपकी गली को बदल सकती है।",
        quote3: "अनदेखा न करें - रिपोर्ट करें।",
        quote4: "छोटे नागरिक कार्य सुरक्षित पड़ोस बनाते हैं।",

        // Alt
        cityAlt: "शहर रखरखाव गतिविधि",

        // Tracking Section
        complaintTracking: "शिकायत ट्रैकिंग",
        trackProgressDesc: "सबमिशन से अंतिम समाधान तक प्रगति को ट्रैक करें।",
        noComplaintsTracked: "अभी तक कोई शिकायत ट्रैक नहीं की गई है। टाइमलाइन अपडेट देखने के लिए शिकायत सबमिट करें।",
        delete: "हटाएं",
        pendingUpdate: "अपडेट लंबित",
        pdfDownloaded: "PDF डाउनलोड हो गया।",
        failedToGeneratePdf: "PDF जनरेट करने में विफ़ल।",
        statusUpdatedTo: "स्थिति अपडेट कर दी गई है:",
        complaintRemoved: "शिकायत हटा दी गई।",
        officialPdfDownloaded: "आधिकारिक शिकायत PDF डाउनलोड हो गया।",
        analysisCancelled: "विश्लेषण रद्द कर दिया गया।",
        aiServiceUnavailable: "AI सेवा अनुपलब्ध है। एक फ़ालबैक शिकायत ड्राफ्ट लोड किया गया।",
        aiAnalysisComplete: "AI विश्लेषण पूरा हुआ। अपने शिकायत ड्राफ्ट की समीक्षा करें।",
        potholePlaceholder: "उदाहरण: बस स्टॉप के पास गड्ढे के कारण बारिश में दुर्घटनाएं होती हैं।",
        locationPlaceholder: "सड़क, क्षेत्र, शहर",
        landmarkPlaceholder: "मेट्रो स्टेशन के पास",
        useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
        detectingLocation: "स्थान का पता लगाया जा रहा है...",
        uploadEvidence: "सबूत अपलोड करें",
        browseFiles: "फ़ाइलें खोजें",
        replaceImage: "छवि बदलें",
        removeImage: "छवि हटाएँ",
        dragDropImage: "एक सिविक समस्या की छवि यहाँ खींचें और छोड़ें",
        supportedFormats: "PNG, JPG, WEBP समर्थित",
        describeIssue: "समस्या का वर्णन करें",
        issueDetails: "समस्या का विवरण",
        landmarkLabel: "लैंडमार्क (वैकल्पिक)",
        locationLabel: "स्थान",

        // Misc
        welcome: "स्वागत है",
        lightMode: "लाइट मोड",
        darkMode: "डार्क मोड",
        switchToLight: "लाइट मोड पर जाएँ",
        switchToDark: "डार्क मोड पर जाएँ",
    },
};

export default TEXT;
