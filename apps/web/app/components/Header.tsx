import React from "react";

const Header = () => (
  <header className="sticky top-0 z-30 w-full bg-[#edf0f2] border-b border-gray-200/60">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-6">
      <span className="font-bold text-2xl md:text-3xl tracking-tight" style={{ fontFamily: 'Neue Machina, sans-serif' }}>
        VIDWANIC
      </span>
      {/* Add nav or actions here if needed */}
    </div>
  </header>
);

export default Header; 