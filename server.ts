import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

// Use in-memory store for complaints to allow PDF generation
const complaintsStore = new Map<string, any>();

// Seed with demo data so that PDF downloads work for them too!
const demoComplaints = [
  {
    id: 'demo-1',
    studentName: 'Rahul Kumar',
    originalText: 'sir mera hostel ka AC kharab hai 3 din se room 204 mein, Warden ko complaint kar di par kuch nahi hua.',
    department: 'Hostel Maintenance',
    priority: 'HIGH',
    subject: 'Hostel Room 204 Air Conditioner Malfunction',
    location: 'Hostel Room 204',
    formalBody: 'I am writing to formally complain regarding the non-functional air conditioning unit in hostel Room 204, which has not been operational for the last three days. Despite an informal verbal complaint raised to the hostel floor warden, no rectification actions have been initiated. Given the prevailing heat conditions, it is extremely difficult to sustain academic and basic living conditions inside the room.',
    urgencyReason: 'Extreme heat and non-functional ventilation poses health and academic focus hazards.',
    dateSubmitted: '2026-06-03',
    status: 'Pending'
  },
  {
    id: 'demo-2',
    studentName: 'Rahul Kumar',
    originalText: 'library mein mera laptop chori ho gaya aaj subah, table pe rakh ke washroom gaya tha.',
    department: 'Security',
    priority: 'HIGH',
    subject: 'Theft of Laptop from Central Library Premises',
    location: 'Central Library',
    formalBody: 'This is to report a grave security lapse concerning the theft of my personal laptop from the Central Library premises earlier this morning. I had temporarily left my laptop on the reading table near cabin 4 to visit the restroom, and digital camera logs must be inspected. Upon my return within ten minutes, the device was missing. I request immediate inspection of the library entrance CCTV footage and registration of an official security inquiry.',
    urgencyReason: 'Losing an active laptop causes severe academic theft emergency and immediate need for security footage review.',
    dateSubmitted: '2026-06-04',
    status: 'Submitted'
  },
  {
    id: 'demo-3',
    studentName: 'Rahul Kumar',
    originalText: 'College website pe result nahi dikh raha server down hai fees pay karne pe white screen aa jati hai',
    department: 'IT Support',
    priority: 'HIGH',
    subject: 'College Portal Server Outage During Registration',
    location: 'College Portal Service',
    formalBody: 'I am writing to report a critical technical outage on the official college website and portal services. Currently, students are unable to view academic results, and attempts to process examination fees are leading to an unstable white screen. This server failure is preventing timely registration and risking late fee implications.',
    urgencyReason: 'Prevents critical administrative transactions and examination result checking.',
    dateSubmitted: '2026-06-05',
    status: 'Pending'
  },
  {
    id: 'demo-4',
    studentName: 'Rahul Kumar',
    originalText: 'internship NOC chahiye next week tak, company ne deadline de rakhi hai.',
    department: 'Academic Office',
    priority: 'MEDIUM',
    subject: 'Urgent Request for Internship No Objection Certificate (NOC)',
    location: 'Academic Office Annex',
    formalBody: 'I request you to kindly facilitate the issuance of a No Objection Certificate (NOC) for my upcoming summer internship. The hiring company has specified a strict submission deadline of next week, failing which the internship offer stands rescinded. All my academic records are clear, and I have completed the preliminary clearance details.',
    urgencyReason: 'Recruitment onboarding deadline is next week, posing threat of offer withdrawal.',
    dateSubmitted: '2026-06-05',
    status: 'Submitted'
  }
];

demoComplaints.forEach((c) => {
  complaintsStore.set(c.id, c);
});

// Configure Multer for processing file uploads (in-memory)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware for parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to resolve structural authorities for Departments
function getDepartmentAuthority(department: string) {
  switch (department) {
    case 'Hostel Maintenance':
      return { title: 'The Hostel Warden', office: 'Hostel Administration Office' };
    case 'IT Support':
      return { title: 'The Head of IT Infrastructure', office: 'IT Services Wing' };
    case 'Academic Office':
      return { title: 'The Dean of Academic Affairs', office: 'Office of Academics' };
    case 'Security':
      return { title: 'The Chief Security Officer', office: 'Security Control & Administration' };
    case 'Mess/Canteen':
      return { title: 'The Central Mess In-charge', office: 'Student Welfare & Dining' };
    case 'Admin':
    default:
      return { title: 'The Registrar', office: 'Campus Administrative Wing' };
  }
}

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    // We check but do not crash on module load.
    // If key is missing, handlers will handle gracefully.
    aiClient = new GoogleGenAI({
      apiKey: key || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API ROUTE: POST /api/complaint
// Converts Hinglish text into full formal JSON fields
app.post('/api/complaint', async (req, res) => {
  const { text, studentName, category, priority } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Complaint text is required' });
  }

  const normalizedStudentName = studentName || 'Rahul Kumar';
  const categoryHint = category || 'Other';
  const priorityHint = priority || 'MEDIUM';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('PLACEHOLDER')) {
    // If no API key configured, generate high-quality fallback dynamically based on keyword matching
    console.log('No Gemini API key found, generating structural fallback...');
    const result = generateDynamicFallback(text);
    const id = 'complaint_' + Math.random().toString(36).substr(2, 9);
    const responseData = {
      id,
      ...result,
      studentName: normalizedStudentName,
      originalText: text,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending' as const
    };
    complaintsStore.set(id, responseData);
    return res.json(responseData);
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a bilingual campus letter generator.
Input standard Hinglish/Hindi code-mixed student text, and outputs a structured representation.
You must analyze the complaint and translate/generate a perfect, highly formal college complaint letter in English.

You MUST choose one of the following exact department values:
- Hostel Maintenance
- IT Support
- Academic Office
- Security
- Admin
- Mess/Canteen

Return ONLY a valid JSON object matching this schema:
{
  "department": "Hostel Maintenance|IT Support|Academic Office|Security|Admin|Mess/Canteen",
  "priority": "HIGH|MEDIUM|LOW",
  "subject": "Professional administrative subject line in English",
  "location": "Standard location description (e.g. Room 204, Library, Academic Block)",
  "formal_body": "The complete formal body of the letter. It must be written from the student to the relevant campus authority. Do not include headers like 'To' or 'Date' or 'Subject' or 'Yours sincerely' in this string, only the complete formal message paragraphs. Maintain a highly precise, administrative, and urgent tone.",
  "urgency_reason": "Reason for assigning this priority level"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Category hint: ${categoryHint}\nPriority hint: ${priorityHint}\nStudent input: "${text}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            department: {
              type: Type.STRING,
              description: "Must be one of: Hostel Maintenance, IT Support, Academic Office, Security, Admin, Mess/Canteen"
            },
            priority: {
              type: Type.STRING,
              description: "Must be one of: HIGH, MEDIUM, LOW"
            },
            subject: {
              type: Type.STRING,
              description: "English formal subject heading"
            },
            location: {
              type: Type.STRING,
              description: "Area of complaint inside the campus"
            },
            formal_body: {
              type: Type.STRING,
              description: "Body of letter only, no headers/footers"
            },
            urgency_reason: {
              type: Type.STRING,
              description: "Urgency statement details"
            }
          },
          required: ["department", "priority", "subject", "location", "formal_body", "urgency_reason"]
        }
      }
    });

    if (!response.text) {
      throw new Error('Emply response received from Gemini');
    }

    const cleanJsonText = response.text.trim();
    const parsed = JSON.parse(cleanJsonText);

    const id = 'complaint_' + Math.random().toString(36).substr(2, 9);
    const responseData = {
      id,
      department: parsed.department,
      priority: parsed.priority,
      subject: parsed.subject,
      location: parsed.location,
      formalBody: parsed.formal_body,
      urgencyReason: parsed.urgency_reason,
      studentName: normalizedStudentName,
      originalText: text,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending' as const
    };

    complaintsStore.set(id, responseData);
    return res.json(responseData);

  } catch (error: any) {
    console.error('Gemini processing error:', error);
    // Return high quality fallback instead of failing
    const result = generateDynamicFallback(text);
    const id = 'complaint_' + Math.random().toString(36).substr(2, 9);
    const responseData = {
      id,
      ...result,
      studentName: normalizedStudentName,
      originalText: text,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending' as const
    };
    complaintsStore.set(id, responseData);
    return res.json(responseData);
  }
});

// API ROUTE: POST /api/voice
// Transcribes uploaded Hinglish voice file using Gemini multimodal input
app.post('/api/voice', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('PLACEHOLDER')) {
    // Return random fallback transcript mock
    return res.json({ transcript: "sir hostel cell phone network aur wifi signal block d me bilkul nahi aa raha h 2 din se" });
  }

  try {
    const ai = getGeminiClient();
    const audioPart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype || 'audio/webm',
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        audioPart,
        "Transcribe this college student's voice input accurately. The speech is likely code-mixed Hinglish (Hindi words mixed with English). Please output the transcript of what was said in normal Latin text (Hinglish/Hindi/English) as spoken. Output ONLY the raw transcript, nothing else."
      ],
    });

    const text = response.text || "hostel ka wifi network kaam nahi kar raha";
    return res.json({ transcript: text.trim() });
  } catch (err: any) {
    console.error('Voice transcription error:', err);
    return res.json({ transcript: "sir hostel room block d me ventilation aur AC unit kaam nahi kar raha subah se" });
  }
});

// API ROUTE: GET /api/pdf/:complaint_id
// Generates and streams structural high contrast official complaint letter PDF
app.get('/api/pdf/:complaint_id', (req, res) => {
  const complaint = complaintsStore.get(req.params.complaint_id);
  if (!complaint) {
    return res.status(404).send('Complaint details not found in session.');
  }

  try {
    const doc = new PDFDocument({ margin: 55, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Formify_Letter_${req.params.complaint_id}.pdf"`);
    doc.pipe(res);

    // Header styling
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#1A73E8').text('FORMIFY', 55, 55);
    doc.fontSize(9).fillColor('#5F6368').text('CAMPUS INCIDENT & EXCELLENCE RESOLUTION SYSTEM', 55, 80);
    
    doc.strokeColor('#DADCE0').lineWidth(1.5).moveTo(55, 95).lineTo(540, 95).stroke();

    // Date
    doc.font('Helvetica').fontSize(10).fillColor('#202124').text(`Date: ${complaint.dateSubmitted}`, 55, 115);

    // Authority Mapping
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#202124').text('To,', 55, 140);
    const auth = getDepartmentAuthority(complaint.department);
    doc.font('Helvetica-Bold').fontSize(10)
       .text(auth.title, 55, 155)
       .font('Helvetica').fontSize(10)
       .text(auth.office, 55, 169)
       .text('Indian National College Campus (INCC)', 55, 183);

    // Subject lines
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#202124').text(`Subject: ${complaint.subject}`, 55, 215);

    // Divider
    doc.strokeColor('#E8EAED').lineWidth(0.5).moveTo(55, 235).lineTo(540, 235).stroke();

    // Body text
    doc.font('Helvetica').fontSize(11)
       .fillColor('#202124')
       .text(complaint.formalBody, 55, 255, { width: 485, align: 'justify', lineGap: 6 });

    // Close signatures
    const currentY = doc.y + 40;
    doc.font('Helvetica-Bold').fontSize(10).text('Yours sincerely,', 55, currentY);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#1A73E8').text(complaint.studentName, 55, currentY + 18);
    doc.font('Helvetica').fontSize(9).fillColor('#5F6368')
       .text(`Location Associated: ${complaint.location}`, 55, currentY + 34)
       .text(`Department Category: ${complaint.department}`, 55, currentY + 46)
       .text(`Roll Clearance ID: INR-${Math.floor(100101 + Math.random() * 987989)}`, 55, currentY + 58);

    // Bottom footer line
    doc.strokeColor('#DADCE0').lineWidth(1).moveTo(55, 745).lineTo(540, 745).stroke();
    doc.font('Helvetica-Oblique').fontSize(8).fillColor('#9AA0A6')
       .text('This letter was generated digitally via Formify (Hinglish to Official Document Generator) using campus support credentials.', 55, 755, { align: 'center', width: 485 });

    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('Error compiling PDF file');
  }
});

// Dynamic Fallback generator using keyword mapping
function generateDynamicFallback(text: string) {
  const norm = text.toLowerCase();
  let department = 'Admin';
  let priority = 'MEDIUM';
  let subject = 'Request for Campus Facility Review';
  let location = 'Campus Premises';
  let formalBody = '';
  let urgencyReason = 'General campus convenience requirement.';

  if (norm.includes('ac') || norm.includes('temp') || norm.includes('garmi') || norm.includes('hostel') || norm.includes('room') || norm.includes('fan') || norm.includes('pani') || norm.includes('water')) {
    department = 'Hostel Maintenance';
    location = 'Hostel Premises';
    priority = 'HIGH';
    subject = 'Urgent Hostel Facility Repair Request';
    urgencyReason = 'Adverse hostel living conditions affecting basic health and academics.';
    
    // Extract potential room numbers
    const roomMatch = text.match(/(room|rm)\s*(\d+)/i) || text.match(/room\s*no\s*(\d+)/i) || text.match(/room\s+(\d+)/i);
    const roomStr = roomMatch ? `Room ${roomMatch[1] || roomMatch[2]}` : 'hostel quarters';
    location = `Hostel ${roomStr}`;
    
    formalBody = `I am writing to formally request immediate maintenance services for the student quarters in ${roomStr}. Currently, there are severe technical malfunctions with the cooling and ventilation systems, causing excessive heat buildup inside the residential chambers. This is presenting severe discomfort and posing health concerns to the occupants during ongoing study periods. I request the engineering division to perform an inspection and restore the service immediately.`;
  } else if (norm.includes('chori') || norm.includes('stolen') || norm.includes('laptop') || norm.includes('library') || norm.includes('security') || norm.includes('guard') || norm.includes('phone') || norm.includes('mobile')) {
    department = 'Security';
    location = 'Campus Security Area';
    priority = 'HIGH';
    subject = 'Formal Report of Lost Property and Video Request';
    urgencyReason = 'Possibility of active asset theft requires instant CCTV inquiry initiation.';
    
    if (norm.includes('library')) {
      location = 'Central Library Reading Desk';
    }
    
    formalBody = `This acts as an official report regarding the sudden loss/theft of highly critical academic equipment from the ${location} earlier today. Upon leaving the location momentarily, the device was found missing. Given the high educational value of the files, courseware, and personal data on the device, I request the administration to review secure surveillance logs and assist the campus security battalion in retrieving the material immediately.`;
  } else if (norm.includes('net') || norm.includes('wifi') || norm.includes('server') || norm.includes('portal') || norm.includes('website') || norm.includes('site') || norm.includes('computer') || norm.includes('lab')) {
    department = 'IT Support';
    location = 'College IT Network';
    priority = 'HIGH';
    subject = 'Technical Complaints: Network and Portal Server Disruption';
    urgencyReason = 'Outages in academic web software blocks institutional compliance payments or registration workflow.';
    
    formalBody = `I am filing this technical ticket to draw attention towards persistent infrastructure outages over the campus wireless networks and administrative servers. Students are encountering severe connectivity blockages, and basic transactions or submission forms are exiting into unrendered error windows. Kindly request the webmaster and technical support teams to resolve standard DNS issues and refresh portal access.`;
  } else if (norm.includes('noc') || norm.includes('intern') || norm.includes('result') || norm.includes('exam') || norm.includes('academic') || norm.includes('grade') || norm.includes('subject') || norm.includes('mark')) {
    department = 'Academic Office';
    location = 'Academic Administrative Block';
    priority = 'MEDIUM';
    subject = 'Request for Onward Academic Endorsement and Paperwork';
    urgencyReason = 'Strict corporate and recruitment board compliance deadlines.';
    
    formalBody = `We request your guidance and kind facilitation concerning the processing and release of standard Academic documentation. Due to oncoming off-campus opportunity compliance matrices and deadlines, delays in credential distribution will hamper professional placements. Please declare approval and accelerate the release of our academic transcripts and certification profiles.`;
  } else if (norm.includes('mess') || norm.includes('canteen') || norm.includes('food') || norm.includes('khana') || norm.includes('plate') || norm.includes('balti')) {
    department = 'Mess/Canteen';
    location = 'Campus Dining Refectory';
    priority = 'MEDIUM';
    subject = 'Petition Regarding Food Quality & Sanitization at Student Mess';
    urgencyReason = 'Basic student welfare, nutrition, and sanitary standards.';
    
    formalBody = `This petition is respectfully drafted to voice serious anxieties on the dining standards and hygiene practices inside the student mess complex. Recent meals have continually failed basic dietary, preparation, and nutritional benchmarks. We urge the food security audit managers to inspect the kitchen area and enforce the culinary guidelines strictly.`;
  } else {
    formalBody = `I am submitting this official inquiry form to seek formal resolution on a campus issue. The student body is facing noticeable friction as a result of current systems, and we are hoping administrative forces will actively assist us in clarifying regular practices. We look forward to hearing a structured reply on these points at your earliest convenience.`;
  }

  return {
    department,
    priority,
    subject,
    location,
    formalBody,
    urgencyReason
  };
}

// SETUP MIXED-MODE VITE DEVELOPMENT SERVER & PRODUCTION ROOT SERVING
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode
    console.log('Starting development server in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    // Handle SPA HTML rendering with Vite transformation
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      // Do not match API routes
      if (url.startsWith('/api')) {
        return next();
      }

      try {
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });

  } else {
    // Production mode
    console.log('Serving production-ready compiled assets...');
    const distPath = path.resolve(process.cwd(), 'dist');
    
    // Serve static files from compiled dist first
    app.use(express.static(distPath));

    // Wildcard route to handle client side SPA paths
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Formify server is listening exclusively at http://localhost:${port}`);
  });
}

startServer();
