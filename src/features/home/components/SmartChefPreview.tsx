import "../styles/smart-chef-preview.css";
import { useNavigate } from "react-router-dom";

export default function SmartChefPreview() {

  const navigate = useNavigate();

  return (

    <section className="smart-chef-home-section">

      <div className="smart-chef-home-container">

        {/* ───────────────── LEFT ───────────────── */}
        <div className="smart-chef-home-left">

          <span className="smart-chef-home-badge">
            ✨ AI Assistant
          </span>

          <h2 className="smart-chef-home-title">
            Cook Smarter with
            <br />
            Smart Chef 👨‍🍳
          </h2>

          <p className="smart-chef-home-description">
            Discover recipes, analyze calories, scale ingredients,
            and get real-time cooking help powered by AI.
          </p>

          {/* FEATURES */}
          <div className="smart-chef-home-features">

            <div className="smart-chef-feature-card">
              <span>🍽</span>
              <p>Recipe Discovery</p>
            </div>

            <div className="smart-chef-feature-card">
              <span>📊</span>
              <p>Nutrition Analysis</p>
            </div>

            <div className="smart-chef-feature-card">
              <span>⚖</span>
              <p>Ingredient Scaling</p>
            </div>

            <div className="smart-chef-feature-card">
              <span>👨‍🍳</span>
              <p>Cooking Assistant</p>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="smart-chef-home-actions">

            <button
              className="smart-chef-home-primary"
              onClick={() => {

                const chatbot =
                  document.querySelector(
                    ".aic-float-btn"
                  ) as HTMLButtonElement;

                chatbot?.click();

              }}
            >
              ✨ Open Smart Chef
            </button>

            <button
              className="smart-chef-home-secondary"
              onClick={() => navigate("/smart-chef")}
            >
              Read More 
            </button>

          </div>

          {/* USERS */}
          
            

        </div>

        {/* ───────────────── RIGHT ───────────────── */}
        <div className="smart-chef-home-right">

          {/* FLOAT CARD */}
          <div className="smart-chef-card smart-chef-card-top-left">
            <span>🍽 Servings</span>
            <h3>4</h3>
            <p>people</p>
          </div>

          {/* FLOAT CARD */}
          <div className="smart-chef-card smart-chef-card-top-right">
            <span>🔥 Calories</span>
            <h3>420</h3>
            <p>kcal</p>
          </div>

          {/* MAIN IMAGE */}
          <div className="smart-chef-plate-wrapper">

            <div className="smart-chef-circle" />

            <img
              className="smart-chef-plate-image"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop"
              alt="Healthy Food"
            />

          </div>

          {/* FLOAT CARD */}
          <div className="smart-chef-card smart-chef-card-bottom-left">
            <span>⏱ Ready in</span>
            <h3>25</h3>
            <p>mins</p>
          </div>

          {/* FLOAT CARD */}
          <div className="smart-chef-card smart-chef-card-bottom-right">
            <span>❤ Health Score</span>
            <h3>92%</h3>
            <p>Great choice</p>
          </div>

        </div>

      </div>

    </section>

  );
}