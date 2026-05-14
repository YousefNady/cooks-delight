import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/chatbot.css';

import { getRecipes } from '../../recipes/services/API';
import type { Recipe } from '../../recipes/types/Recipe';

/* =========================
   API KEYS
========================= */
const API_KEYS: string[] = [
  import.meta.env.VITE_API_KEY_1,
  import.meta.env.VITE_API_KEY_2,
  import.meta.env.VITE_API_KEY_3,
  import.meta.env.VITE_API_KEY_4,
  import.meta.env.VITE_API_KEY_5,
  import.meta.env.VITE_API_KEY_6,
];

/* =========================
   GEMINI FALLBACK
========================= */
const generateWithFallback = async (prompt: string) => {
  for (const key of API_KEYS) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch {
      console.warn('API Key failed... trying next key');
    }
  }
  throw new Error('All API keys failed');
};

/* =========================
   MESSAGE TYPE
========================= */
interface Message {
  sender: 'user' | 'bot';
  text: string;
  clickableRecipes?: string[];
}

/* =========================
   FLOAT BUTTON MESSAGES
========================= */
const FLOAT_MESSAGES = [
  { text: 'Ask me anything 🍳', icon: '👨‍🍳' },
  { text: 'Find a recipe!',      icon: '🔍' },
  { text: 'Smart Chef AI',       icon: '✨' },
  { text: "What's for dinner?",  icon: '🍽' },
  { text: 'Scale ingredients',   icon: '👥' },
  { text: 'Low-calorie meals?',  icon: '🥗' },
  { text: "I'm your chef!",      icon: '👨‍🍳' },
  { text: 'Try Italian cuisine', icon: '🌍' },
];

/* =========================
   QUICK PROMPTS
========================= */
const QUICK_PROMPTS = [
  'What can I cook in 20 minutes?',
  'Low calorie dinner',
  'Recipes with chicken',
  'I only have eggs and cheese',
];

/* =========================
   EXTRACT SERVINGS
========================= */
const extractServings = (message: string): number | null => {
  const lower = message.toLowerCase();
  const match = lower.match(/(\d+)\s*(people|persons?)|for\s*(\d+)/);
  if (!match) return null;
  return Number(match[1] || match[3]);
};

/* =========================
   SCALE INGREDIENTS
========================= */
const scaleIngredient = (
  ingredient: string,
  originalServings: number,
  newServings: number
) => {
  const ratio = newServings / originalServings;
  return ingredient.replace(/(\d+(\.\d+)?)/, (match) => {
    const num = parseFloat(match);
    return (Math.round(num * ratio * 100) / 100).toString();
  });
};

/* =========================
   FUZZY MATCH SCORE
========================= */
const fuzzyScore = (str: string, query: string): number => {
  str = str.toLowerCase();
  query = query.toLowerCase();
  if (str === query) return 1;
  if (str.includes(query)) return 0.95;
  let score = 0, qi = 0;
  for (let i = 0; i < str.length && qi < query.length; i++) {
    if (str[i] === query[qi]) { score++; qi++; }
  }
  return score / query.length;
};

const fuzzySearchRecipes = (
  keyword: string,
  recipes: Recipe[],
  threshold = 0.55
): Recipe[] => {
  if (!keyword || keyword.length < 2) return [];
  return recipes
    .map((r) => ({
      recipe: r,
      score: Math.max(
        fuzzyScore(r.name, keyword),
        ...r.ingredients.map((ing) => fuzzyScore(ing, keyword))
      ),
    }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.recipe);
};

/* =========================
   BUILD RECIPE RESPONSE
========================= */
const buildRecipeResponse = (recipe: Recipe, finalServings: number): string => {
  const totalCalories = Math.round(
    ((recipe.caloriesPerServing ?? 0) / (recipe.servings ?? 1)) * finalServings
  );
  const perPersonCalories = Math.round(totalCalories / finalServings);
  return `
────────────────────────────
🍽 RECIPE NAME
${recipe.name}

────────────────────────────
🍴 MEAL TYPE
${recipe.mealType?.join(', ') || 'Not Available'}

────────────────────────────
🌍 CUISINE
${recipe.cuisine || 'Not Available'}

────────────────────────────
⏱ PREP TIME
${recipe.prepTimeMinutes} Minutes

────────────────────────────
🔥 COOK TIME
${recipe.cookTimeMinutes} Minutes

────────────────────────────
👥 SERVINGS
${finalServings} People

────────────────────────────
🔥 CALORIES
${totalCalories} kcal
👤 Per Person: ${perPersonCalories} kcal

────────────────────────────
🧂 INGREDIENTS

• ${recipe.ingredients
    .map((ing) => scaleIngredient(ing, recipe.servings, finalServings))
    .join('\n• ')}

────────────────────────────
👨‍🍳 INSTRUCTIONS

${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n\n')}

────────────────────────────
`;
};

/* =========================
   RECIPE CARDS
========================= */
interface RecipeCardsProps {
  names: string[];
  recipesData: Recipe[];
  onRecipeClick: (name: string) => void;
}

const RecipeCards = ({ names, recipesData, onRecipeClick }: RecipeCardsProps) => (
  <div className="aic-recipe-cards-grid">
    {names.map((name) => {
      const recipe = recipesData.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      const totalMin = recipe
        ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
        : null;
      const kcal = recipe
        ? Math.round((recipe.caloriesPerServing ?? 0) / (recipe.servings ?? 1))
        : null;
      const image = recipe
        ? (recipe as any).thumbnail ||
          (recipe as any).image ||
          (recipe as any).photo ||
          null
        : null;

      return (
        <div
          key={name}
          onClick={() => onRecipeClick(name)}
          className="aic-recipe-card"
        >
          {/* image or fallback */}
          {image ? (
            <img
              src={image}
              alt={name}
              className="aic-recipe-card-img"
            />
          ) : (
            <div className="aic-recipe-card-img-placeholder">🍽</div>
          )}

          {/* info */}
          <div className="aic-recipe-card-body">
            <div className="aic-recipe-card-name">{name}</div>
            <div className="aic-recipe-card-meta-row">
              {totalMin !== null && (
                <span className="aic-recipe-card-meta">⏱ {totalMin} min</span>
              )}
              {kcal !== null && (
                <span className="aic-recipe-card-meta">🔥 {kcal} kcal</span>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

/* =========================
   RENDER MESSAGE TEXT
========================= */
const renderMessageText = (
  msg: Message,
  onRecipeClick: (name: string) => void,
  recipesData: Recipe[]
) => {
  if (!msg.clickableRecipes || msg.clickableRecipes.length === 0) {
    return <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>;
  }
  const cleaned = msg.text
    .replace(/^\d+\.\s*🍽\s*\[\[CLICKABLE:[^\]]+\]\]\n?/gm, '')
    .replace(/\[\[CLICKABLE:[^\]]+\]\]/g, '')
    .trimEnd();
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {cleaned}
      <RecipeCards
        names={msg.clickableRecipes}
        recipesData={recipesData}
        onRecipeClick={onRecipeClick}
      />
      <div className="aic-cards-hint">Tap a recipe to see full details.</div>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
function AIChef() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recipesData, setRecipesData] = useState<Recipe[]>([]);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [lastRecipe, setLastRecipe] = useState<Recipe | null>(null);

  /* ── Float animation ── */
  const [msgIndex, setMsgIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* =========================
     LOAD RECIPES
  ========================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipes();
        setRecipesData(data.recipes);
      } catch (e) {
        console.error('Error fetching recipes:', e);
      }
    })();
  }, []);

  /* =========================
     OPEN FROM OUTSIDE
  ========================= */
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-smart-chef', handler);
    return () => window.removeEventListener('open-smart-chef', handler);
  }, []);

  /* =========================
     FLOAT ANIMATION LOOP
  ========================= */
  const clearAnimTimers = () => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
  };

  const scheduleAnimation = () => {
    clearAnimTimers();
    const t1 = setTimeout(() => setExpanded(true), 0);
    const t2 = setTimeout(() => setTextVisible(true), 150);
    const t3 = setTimeout(() => setTextVisible(false), 2800);
    const t4 = setTimeout(() => setExpanded(false), 3100);
    const t5 = setTimeout(() => {
      setMsgIndex((i) => (i + 1) % FLOAT_MESSAGES.length);
    }, 3400);
    animTimers.current = [t1, t2, t3, t4, t5];
  };

  useEffect(() => {
    if (isOpen) {
      clearAnimTimers();
      setExpanded(false);
      setTextVisible(false);
      return;
    }
    const init = setTimeout(scheduleAnimation, 1500);
    const loop = setInterval(scheduleAnimation, 5000);
    return () => {
      clearTimeout(init);
      clearInterval(loop);
      clearAnimTimers();
    };
  }, [isOpen]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* =========================
     FOCUS INPUT ON OPEN
  ========================= */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  /* =========================
     SUGGESTIONS
  ========================= */
  const handleSuggestionSearch = (value: string) => {
    setPrompt(value);
    if (!value.trim()) { setSuggestions([]); return; }
    const kw = value.toLowerCase();
    setSuggestions(
      recipesData.filter((r) => r.name.toLowerCase().includes(kw)).slice(0, 6)
    );
  };

  const handleRecipeClick = (name: string) => handleGenerate(name);

  /* =========================
     AI INTENT ROUTER
  ========================= */
  const detectIntent = async (
    userMessage: string,
    recipes: Recipe[],
    lastRecipeName: string | null
  ): Promise<{ intent: 'exact_recipe' | 'analytical' | 'general'; recipeName?: string }> => {
    const summary = recipes.map((r) => ({
      name: r.name, cuisine: r.cuisine, mealType: r.mealType,
      tags: (r as any).tags,
      diet: (r as any).diet || (r as any).dietaryLabels,
      ingredients: r.ingredients,
      caloriesPerServing: r.caloriesPerServing, servings: r.servings,
      caloriesPerPerson: Math.round((r.caloriesPerServing ?? 0) / (r.servings ?? 1)),
    }));

    const routerPrompt = `
You are a smart intent classifier for a recipe chatbot.
Available recipes (JSON): ${JSON.stringify(summary)}
${lastRecipeName ? `Last recipe: "${lastRecipeName}"` : ''}
User message: "${userMessage}"
Respond ONLY with valid JSON:
{"intent":"exact_recipe","recipeName":"<exact name>"}
{"intent":"analytical"}
{"intent":"general"}`;

    try {
      const raw = await generateWithFallback(routerPrompt);
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return { intent: 'general' };
    }
  };

  /* =========================
     HANDLE GENERATE
  ========================= */
  const handleGenerate = async (customPrompt?: string) => {
    const finalText = (customPrompt || prompt).trim();
    if (!finalText) return;

    const requestedServings = extractServings(finalText);
    const keyword = finalText
      .toLowerCase()
      .replace(/for\s*\d+|(\d+)\s*(people|persons?)/g, '')
      .trim();

    if (requestedServings !== null && keyword === '' && lastRecipe) {
      setMessages((p) => [...p, { sender: 'user', text: finalText }]);
      setPrompt(''); setSuggestions([]); setIsLoading(true);
      setMessages((p) => [...p, { sender: 'bot', text: buildRecipeResponse(lastRecipe, requestedServings) }]);
      setIsLoading(false);
      return;
    }

    setMessages((p) => [...p, { sender: 'user', text: finalText }]);
    setPrompt(''); setSuggestions([]); setIsLoading(true);

    try {
      let botResponse = '';
      let clickableRecipes: string[] = [];

      const exact = recipesData.find((r) => r.name.toLowerCase() === keyword);
      const fuzzy = !exact && keyword.length >= 2
        ? fuzzySearchRecipes(keyword, recipesData)
        : [];

      if (exact) {
        const sv = requestedServings || exact.servings;
        setLastRecipe(exact);
        botResponse = buildRecipeResponse(exact, sv);

      } else if (fuzzy.length > 0) {
        clickableRecipes = fuzzy.map((r) => r.name);

        if (fuzzy.length === 1 || fuzzyScore(fuzzy[0].name, keyword) > 0.85) {
          const best = fuzzy[0];
          setLastRecipe(best);
          botResponse = buildRecipeResponse(best, requestedServings || best.servings);
          clickableRecipes = [];
        } else {
          botResponse = `\n📌 RECIPES FOUND\n\nI found ${fuzzy.length} recipes that match "${finalText}":\n`;
          try {
            const guide = await generateWithFallback(`
You are Smart Chef AI.
The user searched for: "${finalText}"
Give a SIMPLE cooking guide.
FORMAT: 👨‍🍳 HOW TO COOK / 🧂 Ingredients • item / 👨‍🍳 Instructions 1. step
RULES: English only, clean formatting`);
            botResponse += `\n────────────────────────────\n${guide}`;
          } catch { /* skip */ }
        }

      } else {
        const { intent, recipeName } = await detectIntent(finalText, recipesData, lastRecipe?.name ?? null);

        if (intent === 'exact_recipe' && recipeName) {
          const r = recipesData.find((x) => x.name.toLowerCase() === recipeName.toLowerCase());
          if (r) {
            setLastRecipe(r);
            botResponse = buildRecipeResponse(r, requestedServings || r.servings);
          }

        } else if (intent === 'analytical') {
          const fullData = recipesData.map((r) => ({
            name: r.name, cuisine: r.cuisine, mealType: r.mealType,
            tags: (r as any).tags, diet: (r as any).diet || (r as any).dietaryLabels,
            ingredients: r.ingredients,
            prepTimeMinutes: r.prepTimeMinutes, cookTimeMinutes: r.cookTimeMinutes,
            caloriesPerServing: r.caloriesPerServing, servings: r.servings,
            caloriesPerPerson: Math.round((r.caloriesPerServing ?? 0) / (r.servings ?? 1)),
            rating: (r as any).rating, difficulty: (r as any).difficulty,
          }));
          const aiAnswer = await generateWithFallback(`
You are Smart Chef AI with access to a recipe database.
Recipe database (JSON): ${JSON.stringify(fullData)}
User question: "${finalText}"
Analyze the data and answer accurately.
If listing recipes, use [[CLICKABLE:Recipe Name]] format.
FORMAT: Clear, structured, emojis, numbered list.
RULES: Only use data above. English only.`);
          const matches = aiAnswer.match(/\[\[CLICKABLE:(.+?)\]\]/g) || [];
          clickableRecipes = matches.map((m) => m.replace(/\[\[CLICKABLE:|]]/g, ''));
          botResponse = aiAnswer;

        } else {
          botResponse = await generateWithFallback(`
You are Smart Chef AI.
User message: "${finalText}"
Respond helpfully. Suggest a recipe or answer the cooking question.
FORMAT: 🍽 Recipe Name / 🧂 Ingredients • item / 👨‍🍳 Instructions 1. step
RULES: English only, clean and simple`);
        }
      }

      setMessages((p) => [...p, { sender: 'bot', text: botResponse, clickableRecipes }]);
    } catch {
      setMessages((p) => [...p, { sender: 'bot', text: 'Oops! Smart Chef is busy right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMsg = FLOAT_MESSAGES[msgIndex];
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* =========================
     UI
  ========================= */
  return (
    <div className="aic-widget-container">

      {/* ── CHAT WINDOW ── */}
      <div className={`aic-chat-window ${isOpen ? 'open' : ''}`}>

        {/* HEADER */}
        <div className="aic-header">
          <div className="aic-header-left">
            <div className="aic-header-avatar">👨‍🍳</div>
            <div className="aic-header-info">
              <span className="aic-header-title">Smart Chef</span>
              <span className="aic-header-subtitle">
                <span className="aic-online-dot" /> Your AI Cooking Assistant
              </span>
            </div>
          </div>
          <div className="aic-header-actions">
            <button
              className="aic-header-action-btn"
              onClick={() => setMessages([])}
              title="New chat"
            >
              ↺
            </button>
            <button
              className="aic-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="aic-messages-area">

          {/* ── WELCOME MESSAGE (always shown at top) ── */}
          <div className="aic-welcome-row">
            <div className="aic-welcome-avatar-sm">👨‍🍳</div>
            <div>
              <div className="aic-welcome-bubble">
                Hi! I'm Smart Chef.<br />
                What would you like to cook today?
              </div>
              <span className="aic-msg-time">{nowTime}</span>
            </div>
          </div>

          {/* ── QUICK PROMPT CHIPS (only before first message) ── */}
          {messages.length === 0 && (
            <div className="aic-quick-prompts">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  className="aic-quick-prompt-btn"
                  onClick={() => handleGenerate(qp)}
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {messages.map((msg, i) => (
            <div key={i} className={`aic-message ${msg.sender}`}>
              {msg.sender === 'user' ? (
                <div>
                  {renderMessageText(msg, handleRecipeClick, recipesData)}
                  <span className="aic-msg-time aic-msg-time-user">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </span>
                </div>
              ) : (
                <div>
                  {renderMessageText(msg, handleRecipeClick, recipesData)}
                  <span className="aic-msg-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* TYPING */}
          {isLoading && (
            <div className="aic-message bot">
              <div className="aic-typing">
                <div className="aic-typing-dot" />
                <div className="aic-typing-dot" />
                <div className="aic-typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="aic-input-area">
          <div className="aic-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="aic-input"
              value={prompt}
              onChange={(e) => handleSuggestionSearch(e.target.value)}
              placeholder="Ask about recipes..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
            />
            <button
              className="aic-send-btn"
              onClick={() => handleGenerate()}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? '⏳' : '➜'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="aic-suggestions">
              {suggestions.map((r) => (
                <div
                  key={r.id}
                  className="aic-suggestion-item"
                  onClick={() => handleGenerate(r.name)}
                >
                  🍽 {r.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FLOAT BUTTON ── */}
      <button
        className={`aic-float-btn ${expanded && !isOpen ? 'expanded' : ''}`}
        onClick={() => {
          clearAnimTimers();
          setExpanded(false);
          setTextVisible(false);
          setIsOpen((o) => !o);
        }}
        aria-label="Open Smart Chef"
      >
        <span className="aic-float-icon">
          {isOpen ? '✕' : (expanded ? currentMsg.icon : '👨‍🍳')}
        </span>
        {!isOpen && (
          <span className={`aic-float-text ${textVisible ? 'visible' : ''}`}>
            {currentMsg.text}
          </span>
        )}
      </button>

    </div>
  );
}

export default AIChef;