// SmartChefSection.tsx
// Place in: src/features/chatbot/SmartChefSection.tsx
// Import CSS: import './smart-chef-section.css'
// Add to router: <Route path="/smart-chef" element={<SmartChefSection />} />

import { Link } from 'react-router-dom';
import '../styles/smart-chef-page.css';

const FEATURE_CARDS = [
  { icon: '🔍', title: 'Smart Recipe Search',    desc: 'Find recipes by name, ingredients, or even if you misspell.',   tag: 'Exact & Fuzzy Search' },
  { icon: '⚖️', title: 'Ingredient Scaling',     desc: 'Automatically adjust ingredients for any number of people.',     tag: 'For 1 to 20+ people'  },
  { icon: '🧠', title: 'AI Cooking Assistant',   desc: 'Ask anything about cooking, tips, substitutes, or techniques.',  tag: 'Powered by AI'        },
  { icon: '🔥', title: 'Nutrition Analysis',     desc: 'Get calorie counts and discover healthier meal options.',        tag: 'Per serving & total'  },
  { icon: '⚡', title: 'Quick & Easy',           desc: 'Save time with quick ideas, dinner suggestions and more.',       tag: 'In seconds'           },
];

const AUDIENCE_ITEMS = [
  { icon: '👔', title: 'Busy Professionals',   desc: 'Quick meals for your busy schedule.'          },
  { icon: '🥦', title: 'Health Enthusiasts',   desc: 'Find low calorie and nutritious options.'      },
  { icon: '🍳', title: 'Home Cooks',           desc: 'Discover new recipes and improve your skills.' },
  { icon: '👨‍👩‍👧', title: 'Families & Groups',   desc: 'Scale recipes for any number of people.'      },
];

const PERFECT_LIST = [
  { icon: '💡', label: 'Instant suggestions',     desc: 'Get ideas in seconds'           },
  { icon: '📋', label: 'Detailed recipes',        desc: 'Ingredients, steps & more'      },
  { icon: '⚖️', label: 'Scale any recipe',        desc: 'Perfect for any group size'     },
  { icon: '💬', label: 'Ask follow-up questions', desc: 'Get help while cooking'         },
];

const DEMO_RECIPES = [
  { img: 'https://cdn.dummyjson.com/recipe-images/1.webp',  name: 'Grilled Chicken Salad', kcal: '350 kcal' },
  { img: 'https://cdn.dummyjson.com/recipe-images/2.webp',  name: 'Zucchini Noodles with Pesto', kcal: '320 kcal' },
  { img: 'https://cdn.dummyjson.com/recipe-images/3.webp',  name: 'Turkey Lettuce Wraps', kcal: '280 kcal' },
];

const openChat = () =>
  window.dispatchEvent(new CustomEvent('open-smart-chef'));

export default function SmartChefSection() {
  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section className="scs-hero">
        <div className="scs-hero-container">

          {/* LEFT */}
          <div className="scs-hero-left">
            <div className="scs-badge">✦ AI POWERED COOKING ASSISTANT</div>

            <h1 className="scs-hero-title">
              Cook Smarter<br />
              with <em>Smart Chef</em>
            </h1>

            <p className="scs-hero-sub">
              Your AI cooking assistant that helps you discover recipes,
              scale ingredients, analyze nutrition, and get real-time
              cooking help.
            </p>

            <div className="scs-features-grid">
              {[
                { icon: '🔍', label: 'Find Recipes',      sub: 'Instantly'         },
                { icon: '⚖️', label: 'Scale Ingredients', sub: 'For any serving'   },
                { icon: '📊', label: 'Nutrition Insights', sub: 'Know what you eat' },
                { icon: '👨‍🍳', label: 'Cooking Assistant', sub: 'Help while you cook' },
              ].map((f, i) => (
                <div key={i} className="scs-feature-item">
                  <div className="scs-feature-icon">{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 400 }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="scs-actions">
              <button className="scs-btn-primary" onClick={openChat}>
                👨‍🍳 Chat with Smart Chef
              </button>
              <Link to="/recipes" className="scs-btn-secondary">
                Explore Recipes →
              </Link>
            </div>

            <div className="scs-trust">
              <div className="scs-trust-avatars">
                {['👩', '👨', '👩‍🦱', '🧑'].map((e, i) => (
                  <div key={i} className="scs-trust-avatar">{e}</div>
                ))}
              </div>
              <div>
                <div className="scs-trust-stars">★★★★★</div>
                <div>Trusted by 10,000+ home cooks &nbsp;·&nbsp; 4.9/5</div>
              </div>
            </div>
          </div>

          {/* RIGHT — chat preview */}
          <div className="scs-hero-right">
            <div className="scs-chat-card">

              <div className="scs-chat-header">
                <div className="scs-chat-avatar">👨‍🍳</div>
                <div className="scs-chat-header-info">
                  <h4>Smart Chef</h4>
                  <span><span className="scs-online-dot" /> Your AI Cooking Assistant</span>
                </div>
                <div className="scs-chat-header-actions">
                  <button>↺</button>
                  <button>✕</button>
                </div>
              </div>

              <div className="scs-chat-messages">
                <div className="scs-msg-bot">
                  👋 Hi! I'm Smart Chef.<br />
                  What would you like to cook today?
                  <span className="scs-msg-time">10:30 AM</span>
                </div>

                <div className="scs-quick-chips">
                  {['What can I cook in 20 minutes?', 'Low calorie dinner', 'Recipes with chicken', 'I only have eggs and cheese'].map((c, i) => (
                    <button key={i} className="scs-chip" onClick={openChat}>{c}</button>
                  ))}
                </div>

                <div className="scs-msg-user">
                  I have chicken and garlic
                  <span className="scs-msg-time" style={{ color: 'rgba(255,255,255,.7)' }}>10:31 AM ✓✓</span>
                </div>

                <div className="scs-msg-bot">
                  Great! I found 4 delicious recipes you can make with chicken and garlic. Which one do you like?
                  <span className="scs-msg-time">10:31 AM</span>
                </div>
              </div>

              <div className="scs-mini-cards" style={{ padding: '0 20px 16px' }}>
                {[
                  { img: 'https://cdn.dummyjson.com/recipe-images/1.webp',  name: 'Garlic Butter Chicken',    meta: '⏱ 25 min  🔥 450 kcal' },
                  { img: 'https://cdn.dummyjson.com/recipe-images/4.webp',  name: 'Lemon Garlic Chicken',     meta: '⏱ 30 min  🔥 420 kcal' },
                  { img: 'https://cdn.dummyjson.com/recipe-images/7.webp',  name: 'Creamy Garlic Chicken Pasta', meta: '⏱ 30 min  🔥 550 kcal' },
                  { img: 'https://cdn.dummyjson.com/recipe-images/10.webp', name: 'Honey Garlic Chicken',     meta: '⏱ 20 min  🔥 480 kcal' },
                ].map((r, i) => (
                  <div key={i} className="scs-mini-card" onClick={openChat}>
                    <img src={r.img} alt={r.name} />
                    <div className="scs-mini-card-info">
                      <div className="scs-mini-card-name">{r.name}</div>
                      <div className="scs-mini-card-meta">{r.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="scs-chat-input">
                <div className="scs-chat-input-field">Ask me anything about cooking...</div>
                <button className="scs-chat-send">➜</button>
              </div>
              <div className="scs-chat-disclaimer">
                Smart Chef can make mistakes. Please check important info.
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="scs-features-section">
        <div className="scs-features-container">
          <div className="scs-section-header">
            <h2 className="scs-section-title">What Smart Chef Can Do</h2>
            <div className="scs-section-underline" />
          </div>
          <div className="scs-cards-grid">
            {FEATURE_CARDS.map((c, i) => (
              <div key={i} className="scs-card">
                <div className="scs-card-icon">{c.icon}</div>
                <div className="scs-card-title">{c.title}</div>
                <div className="scs-card-desc">{c.desc}</div>
                <div className="scs-card-tag">{c.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DEMO + AUDIENCE ══════════ */}
      <section className="scs-demo-section">
        <div className="scs-demo-container">

          {/* LEFT — live demo chat */}
          <div>
            <div className="scs-demo-title">See Smart Chef in Action</div>
            <div className="scs-demo-sub">Real conversation. Real results.</div>

            <div className="scs-demo-chat">
              <div className="scs-demo-chat-msgs">
                <div className="scs-msg-user" style={{ alignSelf: 'flex-end', fontSize: 13 }}>
                  Show me a low calorie dinner
                  <span className="scs-msg-time" style={{ color: 'rgba(255,255,255,.7)' }}>10:30 AM</span>
                </div>
                <div className="scs-msg-bot" style={{ fontSize: 13 }}>
                  Here are some low calorie dinner ideas under 400 calories per serving:
                  <span className="scs-msg-time">10:32 AM</span>
                </div>
              </div>

              <div className="scs-demo-recipe-cards">
                {DEMO_RECIPES.map((r, i) => (
                  <div key={i} className="scs-demo-recipe-card" onClick={openChat}>
                    <img src={r.img} alt={r.name} />
                    <div className="scs-demo-recipe-card-info">
                      <div className="scs-demo-recipe-card-name">{r.name}</div>
                      <div className="scs-demo-recipe-card-meta">🔥 {r.kcal}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="scs-demo-input">
                <div className="scs-demo-input-text">Type your message...</div>
                <button className="scs-demo-send" onClick={openChat}>➜</button>
              </div>
            </div>
          </div>

          {/* RIGHT — perfect for + audience */}
          <div className="scs-audience-right">
            <div className="scs-audience-title">Perfect for Every Cook</div>

            <div className="scs-audience-grid">
              {AUDIENCE_ITEMS.map((a, i) => (
                <div key={i} className="scs-audience-item">
                  <div className="scs-audience-icon">{a.icon}</div>
                  <div>
                    <div className="scs-audience-item-title">{a.title}</div>
                    <p className="scs-audience-item-desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="scs-perfect-list">
              {PERFECT_LIST.map((p, i) => (
                <div key={i} className="scs-perfect-item">
                  <div className="scs-perfect-icon">{p.icon}</div>
                  <div>
                    <div>{p.label}</div>
                    <div className="scs-perfect-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="scs-cta-section">
        <h2 className="scs-cta-title">Ready to Cook Smarter?</h2>
        <p className="scs-cta-sub">
          Join thousands of home cooks who save time and cook better with Smart Chef.
        </p>

        <div className="scs-cta-arrows">
          <span className="scs-cta-arrow-left">↩</span>
          <button className="scs-cta-btn-main" onClick={openChat}>
            👨‍🍳 Open Smart Chef Now
          </button>
          <span className="scs-cta-arrow-right">↪</span>
        </div>

        <div className="scs-cta-badges">
          {[
            { icon: '✓', label: 'No sign up required'  },
            { icon: '🎁', label: 'Free to use'          },
            { icon: '⏰', label: 'Always available'      },
            { icon: '📱', label: 'Works on all devices' },
          ].map((b, i) => (
            <div key={i} className="scs-cta-badge">
              <div className="scs-cta-badge-icon">{b.icon}</div>
              {b.label}
            </div>
          ))}
        </div>
      </section>

    </>
  );
}