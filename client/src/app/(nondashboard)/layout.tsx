import Navbar from '@/components/Navbar';
import { NAVBAR_HEIGHT } from '@/lib/constants'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className={`flex w-full flex-col`}
      style={{paddingTop: `${NAVBAR_HEIGHT}px]`}}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
