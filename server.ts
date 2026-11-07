import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { GRANTLY_KNOWLEDGE_BASE } from './src/data/websiteKnowledgeBase.ts';
import { SCHOLARSHIPS_DATA } from './src/data/scholarshipsData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Secure API Key from backend environment with user-provided key fallback
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || 'AQ.Ab8RN6L67gvNJq6VHIcq9e7Qr93oT3JcbsRY7px01Em0lbzJGA';

let geminiClient: GoogleGenAI | null = null;
try {
  geminiClient = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log('Gemini API client successfully initialized on backend.');
} catch (e) {
  console.error('Failed to initialize GoogleGenAI client:', e);
}

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: !!geminiClient,
    timestamp: new Date().toISOString(),
  });
});

// API: Explain eligibility
app.post('/api/ai/explain-eligibility', async (req: Request, res: Response) => {
  try {
    const { scholarshipTitle, provider, studentProfile, evaluationResults, language } = req.body;

    if (!scholarshipTitle || !evaluationResults) {
      return res.status(400).json({ error: 'Missing scholarship or evaluation data.' });
    }

    if (geminiClient) {
      const prompt = `You are GRANTLY's explainable eligibility engine.
Analyze this student's evaluation for "${scholarshipTitle}" by "${provider}":

Student Snapshot:
- Education Level: ${studentProfile?.educationLevel || 'N/A'}
- Course: ${studentProfile?.course || 'N/A'} (${studentProfile?.degree || 'N/A'})
- Academic Score: ${studentProfile?.academicScore ? studentProfile.academicScore + '%' : 'N/A'}
- Family Income: ₹${studentProfile?.annualFamilyIncome ? Number(studentProfile.annualFamilyIncome).toLocaleString('en-IN') : 'N/A'}
- State: ${studentProfile?.state || 'N/A'}
- Category: ${studentProfile?.category || 'General'}

Evaluation Criteria Breakdown:
${JSON.stringify(evaluationResults, null, 2)}

Language Requested: ${language === 'Hindi' ? 'Simple, clear Hindi' : 'English'}

Provide a clear, encouraging, 3-to-4 sentence explanation for the student explaining why they qualify, partially qualify, or fail specific mandatory rules. Highlight specifically what satisfied the rules and what document or criterion is missing or blocking them. Maintain a professional, encouraging FinTech/EdTech tone. Never fabricate rules.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are GRANTLY AI, an explainable scholarship eligibility analyst. Be concise, direct, helpful, and completely honest about rules. Ground all assertions in verified data.',
        },
      });

      return res.json({ explanation: response.text });
    } else {
      // Deterministic fallback explanation if key is not attached
      const passed = evaluationResults.filter((r: any) => r.status === 'passed').length;
      const failed = evaluationResults.filter((r: any) => r.status === 'failed').length;
      const missing = evaluationResults.filter((r: any) => r.status === 'missing_info').length;

      let fallbackText = '';
      if (failed > 0) {
        const failedRule = evaluationResults.find((r: any) => r.status === 'failed');
        fallbackText = `You do not currently satisfy this scholarship because of the mandatory rule: "${failedRule?.ruleName || 'eligibility criteria'}". However, you satisfy ${passed} other requirement(s). Review our opportunity recovery suggestions to find matching alternatives.`;
      } else if (missing > 0) {
        fallbackText = `You are potentially eligible for ${scholarshipTitle}! You satisfy ${passed} verified requirement(s), but ${missing} condition(s) require verification or missing profile details before confirming readiness.`;
      } else {
        fallbackText = `Congratulations! You satisfy 100% of the mandatory criteria for ${scholarshipTitle}. Your academic score, income bracket, and location all match the provider's verified guidelines.`;
      }

      return res.json({ explanation: fallbackText, isFallback: true });
    }
  } catch (err: any) {
    console.error('Gemini Explain Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate explanation.' });
  }
});

// Intelligent conversation engine for GRANTLY platform and scholarship guidance
function generateKnowledgeEngineResponse(
  message: string,
  history: any[] = [],
  studentProfile: any = {},
  savedScholarships: string[] = [],
  activeApplications: any[] = []
): string {
  const q = message.trim().toLowerCase();
  const firstName = studentProfile?.fullName ? studentProfile.fullName.split(' ')[0] : 'there';
  const degree = studentProfile?.degree || 'degree';
  const course = studentProfile?.course || 'studies';

  // 1. Greetings (e.g. "hi", "hello", "hey", "good morning", "good evening", "namaste")
  if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|hola|sup|greetings)\b/i.test(q) || /^(hi|hello|hey)[\s!.,?]*$/i.test(q)) {
    return `Hello ${firstName}! How can I help you today? I can guide you through:
• Finding top verified scholarships matching your ${degree} in ${course}
• Running an Explainable Eligibility assessment on any scheme
• Reviewing required certificates for your Document Vault
• Checking your active application deadlines and Next Best Actions

What would you like to explore?`;
  }

  // 2. Identity & capabilities ("who are you", "what is your name", "what can you do")
  if (/who (are|is) you|what is your name|what (can|do) you do|introduce yourself|tell me about yourself/i.test(q)) {
    return `I am **Ask GRANTLY**, your personal AI scholarship intelligence advisor.

Here is how I assist you across the GRANTLY platform:
1. **Scholarship Discovery:** Pinpoint verified national, state, and corporate CSR opportunities that match your academic and financial profile.
2. **Explainable Eligibility:** Audit your eligibility criteria using our mathematical rule engine—no black-box AI rejections.
3. **Application Command Center:** Track your applications across 8 pipeline stages, view Next Best Actions, and log official reference IDs.
4. **Smart Document Vault:** Check document readiness scores and see how 1 uploaded certificate satisfies multiple schemes.
5. **Deadline Intelligence:** Forecast closing dates with our 0–100 Deadline Risk Score so you never miss a submission window.

Feel free to ask about any specific scholarship, document, or feature!`;
  }

  // 3. Creator & developer questions ("who created you", "who designed you", "who is the developer")
  if (/who (created|developed|made|designed|built) (you|grantly)|who is (your|the) developer|who (is|are) behind grantly/i.test(q)) {
    return `I was designed and developed by the **GRANTLY Engineering & Product Team**.

GRANTLY was built around a central philosophy: *"Every opportunity deserves a fair chance."* Our team created GRANTLY to replace fragmented government gazettes, complex CSR portals, and confusing eligibility guidelines with a unified, transparent, deterministic student command center.`;
  }

  // 4. Hindi queries ("hindi", "हिंदी" or Devanagari script)
  if (q.includes('hindi') || q.includes('हिंदी') || /[\u0900-\u097F]/.test(message)) {
    return `नमस्ते ${firstName}! मैं **Ask GRANTLY** हूँ, आपका व्यक्तिगत छात्रवृत्ति सलाहकार।

GRANTLY पर आप:
• **छात्रवृत्ति खोज (Scholarship Discovery):** सरकारी एवं कॉरपोरेट ट्रस्ट की प्रमाणित छात्रवृत्तियाँ पा सकते हैं।
• **पात्रता जांच (Eligibility Intelligence):** अपने अंक, वार्षिक आय और राज्य के आधार पर 100% सटीक योग्यता जांच सकते हैं।
• **दस्तावेज़ वॉल्ट (Document Vault):** आय प्रमाण पत्र, अंकतालिका और बोनाफाइड प्रमाणपत्र सुरक्षित रख सकते हैं।
• **अंतिम तिथि कैलेंडर (Deadline Calendar):** किसी भी छात्रवृत्ति की समय सीमा छूटने से पहले सतर्क हो सकते हैं।

आप किस छात्रवृत्ति या सुविधा के बारे में जानना चाहते हैं?`;
  }

  // 5. Active applications & personal status queries
  if (/my application|active application|my status|application status|what did i apply/i.test(q)) {
    if (activeApplications && activeApplications.length > 0) {
      const appSummary = activeApplications
        .map((a: any, idx: number) => `${idx + 1}. **${a.title}** — Stage: \`${a.status}\` | Deadline: ${a.deadline}${a.ref ? ` | Ref: ${a.ref}` : ''}`)
        .join('\n');
      return `Here is the current status of your active applications in the Command Center:\n\n${appSummary}\n\n**Next Best Action:** Make sure all required documents for these schemes are verified in your Document Vault before the deadline!`;
    }
    return `You currently do not have any active applications tracked in your Command Center. 

To get started:
1. Navigate to **Scholarship Discovery** to find schemes matching your profile.
2. Click **Save to Command Center** on any opportunity to initiate tracking.
3. Move it through the 8 stages from *Saved* to *Submitted*!`;
  }

  // 6. Scholarships queries (list, recommend, best scholarships, engineering, undergraduate, specific brands)
  if (/scholarship|scholarships|recommend|find scheme|best scheme|engineering|b\.?tech|undergraduate|reliance|tata|nsp|pragati|hdfc|ongc|aid|funding/i.test(q)) {
    const featured = SCHOLARSHIPS_DATA.slice(0, 4);
    const listText = featured
      .map(
        (s) =>
          `• **${s.title}** (${s.provider})\n  - **Grant:** ${s.fundingAmountDisplay}\n  - **Category:** ${s.category} | **Deadline:** ${s.deadline}\n  - **Target:** ${s.educationLevel.join(', ')} (Income limit: ₹${(s.rules.find((r) => r.ruleType === 'max_family_income')?.requiredValue as number || 800000).toLocaleString('en-IN')})\n  - **Required Documents:** ${s.requiredDocuments.map((d) => d.documentType).slice(0, 3).join(', ')}`
      )
      .join('\n\n');

    return `Here are top verified scholarship opportunities currently open in the GRANTLY database:\n\n${listText}\n\n💡 **Tip:** Go to **Scholarship Discovery** to view your personalized **Best Matches** where 100% of eligibility criteria are satisfied!`;
  }

  // 7. Explainable Eligibility Intelligence & What-If Simulator
  if (/eligibility|simulator|what-if|what if|rule matrix|criteria|qualify|match score/i.test(q)) {
    return `GRANTLY's **Eligibility Intelligence Engine** replaces black-box guesswork with deterministic mathematical evaluation:

1. **Rule Evaluation Matrix:** Compares your exact academic score, household income, degree, and domicile against official gazette rules. Each rule is marked **Satisfied** (green) or **Gap** (amber/red) with full explanations.
2. **What-If Simulator:** Allows you to test hypothetical score increases or income bracket shifts in real time without modifying your actual student profile.
3. **Opportunity Recovery Engine:** If you are ineligible for a target scholarship, GRANTLY automatically recommends 3 alternative schemes where your profile satisfies 100% of criteria.

You can run an eligibility audit on any scholarship by clicking **"Check Explainable Eligibility"** on its details page!`;
  }

  // 8. Application Command Center & Next Best Action
  if (/command center|kanban|pipeline|submit|submitted|confetti|next best action/i.test(q)) {
    return `The **Application Command Center** is your end-to-end workspace for managing scholarship submissions:

• **8 Workflow Stages:** Saved → Preparing → Ready to Apply → Submitted → Under Review → Approved → Rejected → Withdrawn.
• **Interactive Kanban & Table Views:** Drag-and-drop or status-select between stages.
• **Next Best Action Engine:** Computes the single most impactful task for each application (e.g., upload income certificate, verify college seal).
• **Official Reference Numbers:** Store your government/CSR application numbers so you never lose track.
• **Confetti Celebration:** When you mark an application as **'Submitted'**, a celebration confetti effect fires to mark your milestone!`;
  }

  // 9. Smart Document Vault & Document Reuse Multiplier
  if (/document|vault|reuse|upload|certificate|marksheet|bonafide|income proof|aadhaar/i.test(q)) {
    return `The **Smart Document Vault** secures your official academic and financial records with cross-scholarship intelligence:

• **Supported Documents:** Income Certificate (from Tehsildar/SDM), 10th & 12th Marksheets, College Semester Marksheets, Bonafide Student Certificate, Caste Certificate, Aadhaar ID, and Bank Passbook.
• **Document Reuse Multiplier:** Shows how a single uploaded document (e.g., Income Certificate) satisfies 4 or 5 scholarships simultaneously without duplicate uploads.
• **Document Readiness Percentage:** Visual indicator (0–100%) showing whether you have all required attachments ready for your target scholarships.

Check your **Document Vault** tab to upload and manage your files!`;
  }

  // 10. Deadline Intelligence & Risk Scoring
  if (/deadline|calendar|risk score|milestone|schedule|when is|due/i.test(q)) {
    return `The **Deadline Intelligence Calendar** ensures you never miss a submission window:

• **Deadline Risk Score (0–100):** Mathematically computed from:
  - Days Remaining (50% weight)
  - Application Workflow Stage (30% weight)
  - Missing Vault Documents (20% weight)
• **Urgency Indicators:** Critical (<= 5 days), Urgent (<= 14 days), and Upcoming (> 14 days).
• **Personal Milestones:** Set custom reminders for administrative tasks like visiting the Tehsil office or obtaining college verification stamps.`;
  }

  // 11. Student Profile & Onboarding
  if (/profile|onboarding|completeness|information|change details/i.test(q)) {
    return `Your **Smart Student Profile** is the single source of truth that drives GRANTLY's matching:

It covers 5 structured steps:
1. **Personal Identity & Domicile** (State, District, Category)
2. **Educational Enrollment** (Institution, Degree, Course, Year)
3. **Academic Records** (Latest Percentage / CGPA, 10th/12th Board marks)
4. **Financial Background** (Annual Family Income, Supporting documentation)
5. **Scheme Preferences** (Government, CSR, Merit-cum-Means)

A high profile completeness score unlocks more verified opportunities!`;
  }

  // 12. How to apply roadmap
  if (/how to apply|how do i apply|process|steps to apply|getting started/i.test(q)) {
    return `Here is the recommended 5-step roadmap to apply for scholarships using GRANTLY:

1. **Complete Profile:** Fill your 5-step Student Profile so the engine knows your qualifications.
2. **Discover Matches:** Go to **Scholarship Discovery** to review your **Best Matches**.
3. **Check Eligibility:** Run the **Eligibility Intelligence Matrix** to verify criteria.
4. **Prepare Documents:** Upload required certificates in the **Smart Document Vault** until readiness reaches 100%.
5. **Apply & Track:** Follow the official portal link, submit your form, and update your status to **Submitted** in the **Application Command Center**!`;
  }

  // 13. Context-aware multi-turn / General query
  return `Thank you for your question about ${message.length > 40 ? 'this topic' : `"${message}"`}.

On GRANTLY, we provide comprehensive scholarship intelligence:
• **Discovery:** Browse 10+ verified national and CSR programs in the Discovery catalog.
• **Deterministic Matching:** Check your match score against income limits, academic criteria, and domicile rules.
• **Command Center & Vault:** Keep your applications on track and your certificates ready for instant reuse.

Would you like me to recommend scholarships for your profile, explain eligibility rules for a specific scheme, or check required documents?`;
}

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, studentProfile, savedScholarships, activeApplications } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing prompt message.' });
    }

    if (geminiClient) {
      // Construct comprehensive knowledge base text
      const knowledgeContext = `
========================================
GRANTLY PLATFORM KNOWLEDGE BASE:
========================================
About GRANTLY:
- Name: ${GRANTLY_KNOWLEDGE_BASE.about.name}
- Tagline: "${GRANTLY_KNOWLEDGE_BASE.about.tagline}"
- Mission: ${GRANTLY_KNOWLEDGE_BASE.about.mission}

The Six Interconnected Modules:
${GRANTLY_KNOWLEDGE_BASE.sixCoreModules
  .map(
    (m) => `
Module ${m.id}: ${m.name} (Route: ${m.route})
Description: ${m.description}
Details: ${m.features ? m.features.join('; ') : ''} ${m.steps ? m.steps.join('; ') : ''} ${m.keyDifferentiators ? m.keyDifferentiators.join('; ') : ''}
`
  )
  .join('\n')}

Website Navigation & Routes:
${GRANTLY_KNOWLEDGE_BASE.routes.map((r) => `- ${r.path}: ${r.description}`).join('\n')}

Frequently Asked Questions:
${GRANTLY_KNOWLEDGE_BASE.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

Verified Scholarships Available in Database:
${SCHOLARSHIPS_DATA.map(
  (s) =>
    `- "${s.title}" by ${s.provider} (Award: ${s.fundingAmountDisplay}, Category: ${s.category}, Deadline: ${s.deadline}, States: ${s.eligibleStates.join(', ')}, Required Docs: ${s.requiredDocuments.map((d) => d.documentType).join(', ')})`
).join('\n')}
========================================
AUTHENTICATED STUDENT CONTEXT:
========================================
- Student Legal Name: ${studentProfile?.fullName || 'Aarav Sharma'}
- Registered Email: ${studentProfile?.email || 'student@example.edu.in'}
- Education Level: ${studentProfile?.educationLevel || 'Undergraduate'}
- College / Institution: ${studentProfile?.institution || 'NIT Lucknow'}
- Degree / Stream: ${studentProfile?.degree || 'B.Tech'} in ${studentProfile?.course || 'Computer Science and Engineering'}
- Academic Score: ${studentProfile?.academicScore ? studentProfile.academicScore + '%' : '82.5%'}
- Annual Family Income: ₹${studentProfile?.annualFamilyIncome ? Number(studentProfile.annualFamilyIncome).toLocaleString('en-IN') : '3,20,000'} / annum
- Domicile State: ${studentProfile?.state || 'Uttar Pradesh'} (${studentProfile?.district || 'Lucknow'})
- Social Category: ${studentProfile?.category || 'General'}
- Saved Scholarships Count: ${savedScholarships?.length || 0}
- Saved Scholarship IDs: ${JSON.stringify(savedScholarships || [])}
- Active Applications Workspaces:
${JSON.stringify(activeApplications || [], null, 2)}
========================================
ROLE & GUIDELINES:
1. You are "Ask GRANTLY", the official AI advisor for GRANTLY.
2. Answer the student's questions directly, conversationally, concisely, and accurately using both the platform knowledge base and their authenticated student context.
3. Greetings ("hi", "hello"): respond politely and warmly, addressing them by their name and offering relevant help.
4. Identity / Creator: explain that you are Ask GRANTLY, developed by the GRANTLY Engineering & Product Team.
5. Scholarships: provide real schemes from the database with amounts and deadlines.
6. Modules: explain Discovery, Eligibility Intelligence, Command Center, Document Vault, Deadline Calendar, and Profile accurately.
7. Active applications: reference their actual data from above.
8. If asked in Hindi, reply fluently and politely in Hindi.
9. NEVER output generic repetitive welcome boilerplate. Provide an insightful, direct, contextual answer to what was asked.
`;

      // Build conversation contents including history
      const contents: any[] = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      // Add the current user query with the knowledge context injected
      contents.push({
        role: 'user',
        parts: [{ text: `${knowledgeContext}\n\nStudent User Query: ${message}` }],
      });

      let responseText = '';
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const model of candidateModels) {
        try {
          const response = await geminiClient.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction:
                'You are Ask GRANTLY, the expert AI scholarship intelligence advisor for GRANTLY. Answer questions directly, concisely, and helpfully. Never repeat welcome messages.',
              abortSignal: AbortSignal.timeout(8000),
            },
          });
          if (response && response.text && response.text.trim().length > 0) {
            responseText = response.text.trim();
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Chat model ${model} attempt note:`, modelErr?.status || modelErr?.message?.slice(0, 70));
        }
      }

      if (responseText) {
        return res.json({ response: responseText, source: 'gemini' });
      }

      // If live API calls encountered temporary rate limits or latency, generate from intelligent engine
      const intelligentReply = generateKnowledgeEngineResponse(
        message,
        history,
        studentProfile,
        savedScholarships,
        activeApplications
      );
      return res.json({ response: intelligentReply, source: 'knowledge_engine' });
    } else {
      const intelligentReply = generateKnowledgeEngineResponse(
        message,
        history,
        studentProfile,
        savedScholarships,
        activeApplications
      );
      return res.json({ response: intelligentReply, source: 'knowledge_engine' });
    }
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to process chat message.' });
  }
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GRANTLY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
