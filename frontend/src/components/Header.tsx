import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-commerce</h1>
        <nav>
          <NavLink to="/" className={({ isActive }) => "mr-4 " + (isActive ? 'text-blue-400 underline' : '')}>Home</NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'text-blue-400 underline' : '')}>Cart</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
