import { Link, Outlet } from "react-router-dom";

import { SettingsPanel } from "@/widgets/settingsPanel/ui/SettingsPanel";
import { APP_ROUTES } from "@/shared/config/routes";

export const AppLayout = () => (
  <div className="app-shell">
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
    <header className="app-header">
      <Link className="brand" to={APP_ROUTES.main}>
        <span className="brand-badge" aria-hidden="true">
          DM
        </span>
        <span className="brand-text">
          <span className="brand-title">Daker May</span>
          <span className="brand-subtitle">Web mini game</span>
        </span>
      </Link>
      <nav className="app-nav" aria-label="Primary">
        <Link to={APP_ROUTES.main}>Home</Link>
        <Link to={APP_ROUTES.game}>Play</Link>
        <Link to={APP_ROUTES.result}>Results</Link>
      </nav>
      <SettingsPanel />
    </header>
    <main id="main-content" className="app-main">
      <Outlet />
    </main>
    <footer className="app-footer">
      <p>Built for instant play. No server required.</p>
    </footer>
  </div>
);
