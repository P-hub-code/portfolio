import React from 'react';

export const Header: React.FC = () => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-[240px] right-0 h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] z-40 items-center justify-end px-6">
        <div className="w-8 h-8 rounded-full bg-[#5427e6] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[18px]">person</span>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden w-full bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button aria-label="Menu" className="p-1 -ml-1 text-gray-600 hover:text-gray-900 focus:outline-none" type="button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div className="flex items-center tracking-tight text-lg font-bold">
            <span className="text-[#111827]">PAY</span>
            <span className="text-[#6D4AFF]">FLOW</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-[#B45309]">
            Mode Test
          </span>
          <div className="w-7 h-7 rounded-full bg-[#EDE9FE] text-[#6D4AFF] flex items-center justify-center font-semibold text-[11px] ring-1 ring-[#6D4AFF]/20" title="Admin">
            AD
          </div>
        </div>
      </header>
    </>
  );
};
