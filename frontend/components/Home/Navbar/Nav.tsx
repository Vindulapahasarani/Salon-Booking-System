"use client";
import { navLinks } from '@/constant/constant';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { TbAirBalloon } from 'react-icons/tb';

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [navBg, setNavBg] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavBg(true);
      else setNavBg(false);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div
      className={`bg-blue-950 transition-all duration-200 h-[12vh] z-[1000] fixed w-full ${
        navBg ? 'shadow-md' : ''
      }`}
    >
      <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
            <TbAirBalloon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl text-white uppercase font-bold">
            Salon
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link href={link.url} key={link.id} scroll={true}>
              <p className="relative text-white text-base font-medium w-fit block after:block after:absolute after:h-[3px] after:bg-yellow-300 after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-200">
                {link.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="px-5 py-2 text-black bg-white hover:bg-gray-200 rounded-lg text-sm transition-all duration-200">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-5 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm transition-all duration-200">
                  Register
                </button>
              </Link>
            </>
          )}

          {/* Burger Menu */}
          <HiBars3BottomRight
            onClick={openNav}
            className="w-8 h-8 cursor-pointer text-white lg:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;
