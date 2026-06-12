// ═══════════════════════════════════════════════════════════════
// Layout — Wraps dashboard pages with Sidebar + Navbar
// ═══════════════════════════════════════════════════════════════

import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeTab={activeTab} />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
