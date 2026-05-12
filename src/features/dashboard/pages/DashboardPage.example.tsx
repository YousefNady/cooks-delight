/**
 * DashboardPage.example.tsx
 *
 * Drop this in: src/features/dashboard/pages/DashboardPage.tsx
 *
 * Shows both Header usage modes:
 *   Mode A — pass a pre-fetched `user` object (recommended for production)
 *   Mode B — let Header self-fetch via `fetchUserId` (good for prototyping)
 */

import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import type { NavId } from "../components/Layout/Sidebar";
import type { DummyJSONUser } from "../../../shared/types/dashboard.types";

// ---------------------------------------------------------------------------
// Example A: parent owns the user (wire to your auth store / React Query)
// ---------------------------------------------------------------------------

const DashboardPageWithUser: React.FC = () => {
  const [activeNavId, setActiveNavId] = useState<NavId>("dashboard");

  // Replace with real data from your auth/API service:
  const user: DummyJSONUser = {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    maidenName: "Smith",
    age: 29,
    gender: "female",
    email: "sarah.johnson@x.dummyjson.com",
    phone: "+1 555-123-4567",
    username: "sarahj",
    password: "", // never store real passwords in component state
    birthDate: "1995-04-12",
    image: "https://i.pravatar.cc/128?img=47",
    bloodGroup: "A+",
    height: 167,
    weight: 58,
    eyeColor: "Brown",
    hair: { color: "Black", type: "Straight" },
    ip: "",
    address: {
      address: "42 Culinary Lane",
      city: "New York",
      state: "New York",
      stateCode: "NY",
      postalCode: "10001",
      coordinates: { lat: 40.712776, lng: -74.005974 },
      country: "United States",
    },
    macAddress: "",
    university: "",
    bank: { cardExpire: "", cardNumber: "", cardType: "", currency: "", iban: "" },
    company: {
      department: "",
      name: "",
      title: "",
      address: {
        address: "",
        city: "",
        state: "",
        stateCode: "",
        postalCode: "",
        coordinates: { lat: 0, lng: 0 },
        country: "",
      },
    },
    ein: "",
    ssn: "",
    userAgent: "",
    crypto: { coin: "", wallet: "", network: "" },
    role: "user",
  };

  return (
    <DashboardLayout
      /* Sidebar */
      activeNavId={activeNavId}
      onNavChange={setActiveNavId}
      onLogout={() => console.log("logout")}
      onUpgrade={() => console.log("upgrade")}
      /* Header — Mode A: pre-fetched user */
      user={user}
      notificationCount={2}
      onSearchSubmit={(q: string) => console.log("search:", q)}
      onNotificationsClick={() => console.log("notifications")}
      onProfileClick={() => console.log("profile")}
    >
      {/* Your inner page content here */}
      <p style={{ color: "#9a9088" }}>Inner dashboard content goes here.</p>
    </DashboardLayout>
  );
};

// ---------------------------------------------------------------------------
// Example B: Header self-fetches (quick prototyping / Storybook)
// ---------------------------------------------------------------------------

const DashboardPageAutoFetch: React.FC = () => {
  const [activeNavId, setActiveNavId] = useState<NavId>("dashboard");

  return (
    <DashboardLayout
      /* Sidebar */
      activeNavId={activeNavId}
      onNavChange={setActiveNavId}
      onLogout={() => console.log("logout")}
      onUpgrade={() => console.log("upgrade")}
      /* Header — Mode B: self-fetch user id 1 from DummyJSON */
      fetchUserId={1}
      notificationCount={2}
      onSearchSubmit={(q: string) => console.log("search:", q)}
    >
      <p style={{ color: "#9a9088" }}>Inner dashboard content goes here.</p>
    </DashboardLayout>
  );
};

export { DashboardPageWithUser, DashboardPageAutoFetch };
export default DashboardPageWithUser;
