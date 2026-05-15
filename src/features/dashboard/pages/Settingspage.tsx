import React, { useState } from "react";

import { DashboardLayout } from "../components/Layout";
import type { NavId } from "../components/Layout";
import type { DummyJSONUser } from "../../../shared/types/dashboard.types";
import "./SettingsPage.css";

// =============================================================================
// Icons
// =============================================================================

const IconUser: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconShield: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBell: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const IconSliders: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const IconTrash: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// =============================================================================
// Tab configuration
// =============================================================================

type SettingsTab = "account" | "preferences" | "security" | "notifications";

interface Tab {
  id: SettingsTab;
  label: string;
  icon: React.ReactElement;
}

const TABS: Tab[] = [
  { id: "account",       label: "Account",           icon: <IconUser />    },
  { id: "preferences",   label: "Preferences",       icon: <IconSliders /> },
  { id: "security",      label: "Privacy & Security", icon: <IconShield />  },
  { id: "notifications", label: "Notifications",     icon: <IconBell />    },
];

// =============================================================================
// Toggle switch component — reused across Preferences and Notifications tabs
// =============================================================================

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id, checked, onChange, label, description, disabled = false,
}) => (
  <div className="settings-toggle">
    <div className="settings-toggle__text">
      <label className="settings-toggle__label" htmlFor={id}>{label}</label>
      {description && (
        <p className="settings-toggle__desc">{description}</p>
      )}
    </div>
    <button
      id={id}
      className={[
        "settings-toggle__track",
        checked ? "settings-toggle__track--on" : "",
        disabled ? "settings-toggle__track--disabled" : "",
      ].filter(Boolean).join(" ")}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle__thumb" />
    </button>
  </div>
);

// =============================================================================
// Mock data
// =============================================================================

const MOCK_USER: DummyJSONUser = {
  id: 1, firstName: "Sarah", lastName: "Johnson", maidenName: "Williams",
  age: 29, gender: "female", email: "sarah.johnson@x.dummyjson.com",
  phone: "+1 555-123-4567", username: "sarahjohnson", password: "",
  birthDate: "1995-04-12",
  image: "https://dummyjson.com/icon/sarahjohnson/128",
  bloodGroup: "A+", height: 167, weight: 58, eyeColor: "Brown",
  hair: { color: "Black", type: "Straight" }, ip: "192.168.1.1",
  address: {
    address: "42 Culinary Lane", city: "New York", state: "New York",
    stateCode: "NY", postalCode: "10001",
    coordinates: { lat: 40.712776, lng: -74.005974 }, country: "United States",
  },
  macAddress: "00:1B:44:11:3A:B7", university: "Culinary Institute of America",
  bank: { cardExpire: "06/30", cardNumber: "4111111111111111", cardType: "Visa", currency: "USD", iban: "GB29NWBK60161331926819" },
  company: {
    department: "Engineering", name: "FoodTech Co.", title: "Software Engineer",
    address: { address: "1 Tech Plaza", city: "San Francisco", state: "California", stateCode: "CA", postalCode: "94105", coordinates: { lat: 37.7749, lng: -122.4194 }, country: "United States" },
  },
  ein: "12-3456789", ssn: "123-45-6789",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  crypto: { coin: "Bitcoin", wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a", network: "Ethereum (ERC20)" },
  role: "user",
};

// =============================================================================
// Section components — isolated so each tab's JSX stays readable
// =============================================================================

// ── Account section ───────────────────────────────────────────────────────────

interface AccountSectionProps {
  user: DummyJSONUser;
}

const AccountSection: React.FC<AccountSectionProps> = ({ user }) => {
  const [firstName, setFirstName]   = useState(user.firstName);
  const [lastName,  setLastName]    = useState(user.lastName);
  const [email,     setEmail]       = useState(user.email);
  const [saved,     setSaved]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = (): void => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    console.log("[Settings/Account] save:", { firstName, lastName, email });
    // TODO: PATCH /users/1
  };

  return (
    <div className="settings-section">
      {/* Account Information */}
      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Account Information</h3>

        <div className="settings-section__row">
          <div className="settings-section__field settings-section__field--half">
            <label className="settings-section__label" htmlFor="s-first-name">
              First Name
            </label>
            <input
              id="s-first-name"
              className="settings-section__input"
              type="text"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setSaved(false); }}
              placeholder="First name"
            />
          </div>
          <div className="settings-section__field settings-section__field--half">
            <label className="settings-section__label" htmlFor="s-last-name">
              Last Name
            </label>
            <input
              id="s-last-name"
              className="settings-section__input"
              type="text"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setSaved(false); }}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="settings-section__field">
          <label className="settings-section__label" htmlFor="s-email">
            Email Address
          </label>
          <input
            id="s-email"
            className="settings-section__input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
            placeholder="Email address"
          />
        </div>

        <button
          className={[
            "settings-section__btn settings-section__btn--primary",
            saved ? "settings-section__btn--saved" : "",
          ].filter(Boolean).join(" ")}
          type="button"
          onClick={handleSave}
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* Delete Account */}
      <div className="settings-section__group settings-section__group--danger">
        <h3 className="settings-section__group-title settings-section__group-title--danger">
          Delete Account
        </h3>
        <p className="settings-section__danger-text">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        {!showDeleteConfirm ? (
          <button
            className="settings-section__btn settings-section__btn--danger"
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <IconTrash />
            Delete Account
          </button>
        ) : (
          <div className="settings-section__confirm">
            <p className="settings-section__confirm-text">
              Are you sure? This action cannot be undone.
            </p>
            <div className="settings-section__confirm-actions">
              <button
                className="settings-section__btn settings-section__btn--danger"
                type="button"
                onClick={() => console.log("[Settings] delete account confirmed")}
              >
                Yes, delete
              </button>
              <button
                className="settings-section__btn settings-section__btn--ghost"
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Preferences section ────────────────────────────────────────────────────────

const PreferencesSection: React.FC = () => {
  const [darkMode,     setDarkMode]     = useState(false);
  const [emailNotifs,  setEmailNotifs]  = useState(true);
  const [recipeRecs,   setRecipeRecs]   = useState(true);
  const [marketing,    setMarketing]    = useState(false);
  const [language,     setLanguage]     = useState("English");

  const FUTURE_FEATURES = [
    { icon: "💳", label: "Payment Methods" },
    { icon: "👑", label: "Premium Plans"   },
    { icon: "🛒", label: "Shopping List"   },
  ];

  return (
    <div className="settings-section">
      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Preferences</h3>

        <ToggleSwitch
          id="pref-dark-mode"
          label="Dark Mode"
          description="Switch to a darker colour scheme"
          checked={darkMode}
          onChange={setDarkMode}
        />
        <div className="settings-section__divider" />
        <ToggleSwitch
          id="pref-email-notifs"
          label="Email Notifications"
          description="Receive recipe updates and news by email"
          checked={emailNotifs}
          onChange={setEmailNotifs}
        />
        <div className="settings-section__divider" />
        <ToggleSwitch
          id="pref-recipe-recs"
          label="Recipe Recommendations"
          description="Let us suggest recipes based on your activity"
          checked={recipeRecs}
          onChange={setRecipeRecs}
        />
        <div className="settings-section__divider" />
        <ToggleSwitch
          id="pref-marketing"
          label="Marketing Emails"
          description="Promotions, tips, and offers from Cooks Delight"
          checked={marketing}
          onChange={setMarketing}
        />
        <div className="settings-section__divider" />

        {/* Language select */}
        <div className="settings-section__field settings-section__field--inline">
          <div>
            <label className="settings-section__label" htmlFor="pref-language">
              Language
            </label>
          </div>
          <div className="settings-section__select-wrap">
            <select
              id="pref-language"
              className="settings-section__select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {["English", "Spanish", "French", "German", "Arabic", "Japanese"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Future Features */}
      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Future Features</h3>
        <ul className="settings-section__future-list" role="list">
          {FUTURE_FEATURES.map(({ icon, label }) => (
            <li key={label} className="settings-section__future-item">
              <span className="settings-section__future-icon" aria-hidden="true">{icon}</span>
              <span className="settings-section__future-label">{label}</span>
              <span className="settings-section__coming-soon-badge">Coming Soon</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ── Security section ──────────────────────────────────────────────────────────

const SecuritySection: React.FC = () => {
  const [currentPwd,  setCurrentPwd]  = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [confirmPwd,  setConfirmPwd]  = useState("");
  const [publicProfile, setPublicProfile] = useState(true);
  const [twoFactor,     setTwoFactor]     = useState(false);
  const [pwdSaved,    setPwdSaved]    = useState(false);
  const [pwdError,    setPwdError]    = useState("");

  const handlePasswordUpdate = (): void => {
    if (newPwd.length < 8) {
      setPwdError("Password must be at least 8 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Passwords do not match.");
      return;
    }
    setPwdError("");
    setPwdSaved(true);
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setTimeout(() => setPwdSaved(false), 2500);
    console.log("[Settings/Security] password updated");
    // TODO: PATCH /users/1/password
  };

  return (
    <div className="settings-section">
      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Change Password</h3>

        <div className="settings-section__field">
          <label className="settings-section__label" htmlFor="s-cur-pwd">
            Current Password
          </label>
          <input
            id="s-cur-pwd"
            className="settings-section__input"
            type="password"
            value={currentPwd}
            onChange={(e) => { setCurrentPwd(e.target.value); setPwdError(""); }}
            placeholder="Enter current password"
          />
        </div>
        <div className="settings-section__field">
          <label className="settings-section__label" htmlFor="s-new-pwd">
            New Password
          </label>
          <input
            id="s-new-pwd"
            className="settings-section__input"
            type="password"
            value={newPwd}
            onChange={(e) => { setNewPwd(e.target.value); setPwdError(""); }}
            placeholder="At least 8 characters"
          />
        </div>
        <div className="settings-section__field">
          <label className="settings-section__label" htmlFor="s-confirm-pwd">
            Confirm New Password
          </label>
          <input
            id="s-confirm-pwd"
            className={[
              "settings-section__input",
              pwdError ? "settings-section__input--error" : "",
            ].filter(Boolean).join(" ")}
            type="password"
            value={confirmPwd}
            onChange={(e) => { setConfirmPwd(e.target.value); setPwdError(""); }}
            placeholder="Repeat new password"
          />
          {pwdError && (
            <p className="settings-section__error-msg" role="alert">{pwdError}</p>
          )}
        </div>

        <button
          className={[
            "settings-section__btn settings-section__btn--primary",
            pwdSaved ? "settings-section__btn--saved" : "",
          ].filter(Boolean).join(" ")}
          type="button"
          onClick={handlePasswordUpdate}
        >
          {pwdSaved ? "✓ Updated" : "Update Password"}
        </button>
      </div>

      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Privacy</h3>
        <ToggleSwitch
          id="sec-public-profile"
          label="Public Profile"
          description="Allow other users to view your profile and recipes"
          checked={publicProfile}
          onChange={setPublicProfile}
        />
        <div className="settings-section__divider" />
        <ToggleSwitch
          id="sec-two-factor"
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          checked={twoFactor}
          onChange={setTwoFactor}
        />
      </div>
    </div>
  );
};

// ── Notifications section ─────────────────────────────────────────────────────

const NotificationsSection: React.FC = () => {
  const [newRecipes,  setNewRecipes]  = useState(true);
  const [savedAlerts, setSavedAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [comments,    setComments]    = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  return (
    <div className="settings-section">
      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Recipe Notifications</h3>
        <ToggleSwitch id="notif-new" label="New Recipes" description="Notify me when new recipes matching my preferences are added" checked={newRecipes} onChange={setNewRecipes} />
        <div className="settings-section__divider" />
        <ToggleSwitch id="notif-saved" label="Saved Recipe Updates" description="Notify me when a recipe I've saved is updated" checked={savedAlerts} onChange={setSavedAlerts} />
        <div className="settings-section__divider" />
        <ToggleSwitch id="notif-weekly" label="Weekly Digest" description="A weekly email summary of trending recipes" checked={weeklySummary} onChange={setWeeklySummary} />
      </div>

      <div className="settings-section__group">
        <h3 className="settings-section__group-title">Activity Notifications</h3>
        <ToggleSwitch id="notif-comments" label="Comments & Reviews" description="Notify me when someone comments on my recipes" checked={comments} onChange={setComments} />
        <div className="settings-section__divider" />
        <ToggleSwitch id="notif-system" label="System Alerts" description="Important updates about your account" checked={systemAlerts} onChange={setSystemAlerts} />
      </div>
    </div>
  );
};

// =============================================================================
// SettingsPage
// =============================================================================

const SettingsPage: React.FC = () => {
  const [activeNavId,  setActiveNavId]  = useState<NavId>("settings");
  const [activeTab,    setActiveTab]    = useState<SettingsTab>("account");

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? "Settings";

  return (
    <DashboardLayout
      activeNavId={activeNavId}
      onNavChange={(id) => setActiveNavId(id)}
      onLogout={() => console.log("[SettingsPage] logout")}
      onUpgrade={() => console.log("[SettingsPage] upgrade")}
      user={MOCK_USER}
      notificationCount={2}
      onSearchSubmit={(q) => console.log("[SettingsPage] search:", q)}
      onNotificationsClick={() => console.log("[SettingsPage] notifications")}
      onProfileClick={() => console.log("[SettingsPage] profile menu")}
    >
      <div className="settings-page">

        {/* ================================================================
            PAGE HEADER
            ================================================================ */}
        <header className="settings-page__header">
          <h1 className="settings-page__title">Settings</h1>
          <p className="settings-page__subtitle">
            Manage your account and preferences
          </p>
        </header>

        {/* ================================================================
            SETTINGS BODY — left tab nav + right content panel
            ================================================================ */}
        <div className="settings-page__body">

          {/* ── Tab navigation ── */}
          <nav
            className="settings-page__tab-nav"
            aria-label="Settings sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={[
                  "settings-page__tab-btn",
                  tab.id === activeTab ? "settings-page__tab-btn--active" : "",
                ].filter(Boolean).join(" ")}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-selected={tab.id === activeTab}
                aria-controls={`settings-panel-${tab.id}`}
                role="tab"
              >
                <span className="settings-page__tab-btn-icon" aria-hidden="true">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ── Content panel ── */}
          <div
            className="settings-page__panel"
            id={`settings-panel-${activeTab}`}
            role="tabpanel"
            aria-label={activeTabLabel}
          >
            <h2 className="settings-page__panel-title">{activeTabLabel}</h2>

            {activeTab === "account"       && <AccountSection user={MOCK_USER} />}
            {activeTab === "preferences"   && <PreferencesSection />}
            {activeTab === "security"      && <SecuritySection />}
            {activeTab === "notifications" && <NotificationsSection />}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;