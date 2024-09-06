
"use client";

import { usePathname } from 'next/navigation';
import NavbarMD from './NavbarMD';
import LogoUser from './LogoUser';
import Navbar from './Navbar';

const excludedRoutes = ['/Login', '/Signup'];

const ConditionalComponents: React.FC = () => {
  const currentPath = usePathname();

  if (excludedRoutes.includes(currentPath)) return null;

  return (
    <>
      <div className="fixed hidden md:block left-0 top-0 z-10">
        <NavbarMD />
      </div>
      <LogoUser />
      <Navbar />
    </>
  );
};

export default ConditionalComponents;
