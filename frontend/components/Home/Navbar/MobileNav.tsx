import { navLinks } from '@/constant/constant';
import Link from 'next/link';
import React from 'react';
import { CgClose } from 'react-icons/cg';

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ closeNav, showNav }: Props) => {
  const navOpen = showNav ? "translate-x-0" : "-translate-x-full"; // Fixed transition class

  return (
    <div>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 transform transition-all duration-500 z-[1002] bg-black opacity-70 w-full h-screen ${showNav ? 'block' : 'hidden'}`} 
        onClick={closeNav} // Click outside to close
      ></div>

      {/* navLinks */}
      <div 
        className={`text-white fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-rose-900 space-y-6 z-[1050] p-6 ${navOpen}`}
      >
        {navLinks.map((link) => (
          <Link key={link.id} href={link.url} className='text-white w-fit text-[20px] ml-12 border-b-[1.5px] pb-1 border-white sm:text-[30px]'>
            {link.label}
          </Link>
        ))}

        {/* Close button */}
        <CgClose 
          onClick={closeNav} 
          className='absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6 cursor-pointer'
        />
      </div>
    </div>
  );
};

export default MobileNav;
