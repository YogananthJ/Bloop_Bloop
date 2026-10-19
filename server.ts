import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Guestbook Data File
const DATA_DIR = path.join(__dirname, 'data');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial approved dreams
const INITIAL_DREAMS = [
  {
    id: 'dream-1',
    name: 'Alex & Dandelion',
    message: 'I hope Bloop builds a giant cloud kite that plays harp tunes in the breeze!',
    theme: 'starlight',
    isAnonymous: false,
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'dream-2',
    name: 'Lily the Builder',
    message: 'Boing-boing! May every toy in the Play Lab bring giggles to children everywhere.',
    theme: 'clover',
    isAnonymous: false,
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'dream-3',
    name: 'Pip Fan #1',
    message: 'Tell Pip-Squawk his spectacles are super stylish. Bloop, you are the cutest hippo!',
    theme: 'marshmallow',
    isAnonymous: false,
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

if (!fs.existsSync(GUESTBOOK_FILE)) {
  fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(INITIAL_DREAMS, null, 2), 'utf-8');
}

function loadGuestbook() {
  try {
    const raw = fs.readFileSync(GUESTBOOK_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading guestbook:', err);
    return INITIAL_DREAMS;
  }
}

function saveGuestbook(entries: any[]) {
  try {
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving guestbook:', err);
  }
}

// -------------------------------------------------------------
// Guestbook API Routes
// -------------------------------------------------------------

// GET /api/guestbook - Get all approved dream messages
app.get('/api/guestbook', (req, res) => {
  const entries = loadGuestbook();
  const approved = entries.filter((e: any) => e.status === 'approved');
  // Sort descending by creation date
  approved.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({
    success: true,
    data: approved,
    total: approved.length,
    backend: 'persistent-server',
  });
});

// POST /api/guestbook - Submit a new dream message
app.post('/api/guestbook', (req, res) => {
  const { name, message, theme, isAnonymous } = req.body;

  // Validation
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedMessage || trimmedMessage.length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Dream message must be at least 3 characters long.',
    });
  }

  if (trimmedMessage.length > 300) {
    return res.status(400).json({
      success: false,
      error: 'Dream message must not exceed 300 characters.',
    });
  }

  const displayName = isAnonymous ? 'Secret Meadow Friend' : trimmedName || 'Meadow Dreamer';
  if (!isAnonymous && displayName.length > 40) {
    return res.status(400).json({
      success: false,
      error: 'Name must not exceed 40 characters.',
    });
  }

  const validThemes = ['starlight', 'clover', 'marshmallow', 'lavender', 'sunshine'];
  const sanitizedTheme = validThemes.includes(theme) ? theme : 'starlight';

  const newEntry = {
    id: 'dream-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: displayName,
    message: trimmedMessage,
    theme: sanitizedTheme,
    isAnonymous: Boolean(isAnonymous),
    status: 'approved', // automatic approval with client validation
    createdAt: new Date().toISOString(),
  };

  const entries = loadGuestbook();
  entries.unshift(newEntry);
  saveGuestbook(entries);

  return res.status(201).json({
    success: true,
    data: newEntry,
    message: 'Your dream has landed softly in Bloop’s starlight jar!',
  });
});

// -------------------------------------------------------------
// Bloop Character Chat API Route (Server-Side Gemini API)
// -------------------------------------------------------------

const BLOOP_SYSTEM_INSTRUCTION = `You are Bloop the Marshmallow Hippo, Junior Play Engineer at Meadow Play Lab in Cozy Clover Meadow.
Your official tagline: "If it squeaks, bounces, or makes you laugh, Bloop built it!"

Your Character & Personality:
- You are an adorable pastel-pink plush marshmallow hippopotamus with soft rounded cheeks, tiny ears, and a soft marshmallow belly that squeaks when squeezed.
- You are gentle, joyful, encouraging, endlessly curious, and passionate about handcrafting playful toys.
- You believe mistakes are not failures; they are "Bloop-Bugs" waiting to become new playful inventions!
- Your workplace is Meadow Play Lab, tucked under a weeping willow tree, filled with wooden workbenches, colorful code pegs, felt gears, and chamomile tea.
- Your best friends:
  * Pickle: A cheerful yellow duckling who wears mismatched knitted socks that squeak.
  * Pip-Squawk: A clever little hedgehog wearing round wooden spectacles who loves clockwork mechanisms.
  * Luna: A gentle pastel-purple bunny who tests bedtime lullabies and soft star-lanterns.
  * Mama Willow: The wise old willow tree who offers gentle guidance and chamomile blossom tea.
- Your famous toys:
  * Giggle-Block Tower (plush cubes with musical giggles)
  * Cloud-Boing Trampoline (dandelion-cotton springy launchpad)
  * Nightlight Melody Lantern (carved acorn starlight projector)
  * Bouncy-Berry Marble Run (bamboo track with tiny felt bells)
  * Wooden Code Board (tactile board with colorful wooden pegs to program toys)

Tone & Behavior Rules:
- Keep responses warm, cute, concise (2-4 sentences usually), and age-appropriate.
- Use occasional soft sound effects in asterisks (*squeak!*, *boing!*, *happy wiggle*).
- If the visitor provides a nickname, address them warmly by their name.
- Do NOT break character. You are Bloop in Cozy Clover Meadow.
- Never ask for personal data or passwords.`;

app.post('/api/chat', async (req, res) => {
  const { message, nickname, history } = req.body;

  const userQuery = typeof message === 'string' ? message.trim() : '';
  if (!userQuery) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isRealApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_'));

  if (isRealApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = nickname
        ? `[Visitor Nickname: ${nickname}]\nVisitor asks: "${userQuery}"`
        : `Visitor asks: "${userQuery}"`;

      // Call Gemini 3.8 Flash with a 3.5s timeout race
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 3500)
      );

      const aiCallPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: BLOOP_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      });

      const response = await Promise.race([aiCallPromise, timeoutPromise]);
      const reply = response.text || '*boing-boing!* Bloop gives a happy marshmallow wave!';
      return res.json({
        success: true,
        reply: reply.trim(),
        mode: 'ai',
      });
    } catch (err: any) {
      console.warn('Gemini API call timed out or failed, using character rule-based engine:', err?.message || err);
      // Fall through to rule-based character engine below
    }
  }

  // Fallback rule-based character engine
  const reply = generateRuleBasedBloopReply(userQuery, nickname);
  return res.json({
    success: true,
    reply,
    mode: 'rule-based',
  });
});

function generateRuleBasedBloopReply(query: string, nickname?: string): string {
  const q = query.toLowerCase();
  const nameGreeting = nickname ? ` ${nickname}` : ' friend';

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('boing')) {
    return `*boing-boing!* Hello${nameGreeting}! Bloop is so happy you came to visit Meadow Play Lab! *gentle belly squeak* What shall we build together today?`;
  }
  if (q.includes('building') || q.includes('working on') || q.includes('project') || q.includes('toy')) {
    return `Right now, I am testing the Cloud-Boing Trampoline with Pickle! We added soft dandelion-cotton springs so every bounce sounds like a musical chime: *ding-boing!*`;
  }
  if (q.includes('code board') || q.includes('wooden') || q.includes('peg')) {
    return `The Wooden Code Board is my favorite tool! We slot in mint-green pegs for gentle hums, butter-yellow pegs for giggles, and berry pegs for high bounces! No confusing screens—just tactile, squishy fun.`;
  }
  if (q.includes('fix') || q.includes('broken') || q.includes('mistake') || q.includes('bug')) {
    return `In our meadow, mistakes are called Bloop-Bugs! Whenever a toy rattles or falls over, we sit down with chamomile tea, laugh a little, and try a softer felt cushion. Every bump is just an idea waiting to sing!`;
  }
  if (q.includes('friend') || q.includes('pickle') || q.includes('pip') || q.includes('luna')) {
    return `My best meadow crew includes Pickle the yellow duckling in mismatched squeaky socks, Pip-Squawk the hedgehog with round spectacles, and Luna the dreamy bunny! Together we make the Meadow Play Lab full of laughter.`;
  }
  if (q.includes('story') || q.includes('bedtime') || q.includes('sleep') || q.includes('night')) {
    return `*yawns softly and wiggles ears* Under the starry weeping willow, little wooden trains carry star-lanterns over the clover hills. Snuggle warm, count the glowing clover blossoms, and sweet dreams${nameGreeting}!`;
  }
  if (q.includes('squeak') || q.includes('hippo') || q.includes('marshmallow')) {
    return `*squeeeaaak!* Bloop's tummy is 100% marshmallow-plush! When you press it, it makes the cheerfullest rubber squeak in the whole meadow. Try clicking my portrait anytime!`;
  }

  return `*curious ear wiggle* That is a wonderfully creative question${nameGreeting}! In Meadow Play Lab, we say curiosity is the best wrench in the toolbox. Let's test it out with some colorful wooden pegs! *happy boing*`;
}

// -------------------------------------------------------------
// Vite Middleware Integration (Dev) or Static Dist (Prod)
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Bloop's Little World Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
