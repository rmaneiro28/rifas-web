import { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import Descarga from '../assets/descarga.png';
import Moto from '../assets/moto.png';
import { NavLink } from 'react-router-dom';
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white shadow-lg border-b border-gray-100'
        : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      {/* Top info bar - Más sutil y profesional */}
      <div className={`transition-all duration-300 py-2 px-4 border-b ${
        isScrolled
          ? 'bg-gray-50 border-gray-200'
          : 'bg-gray-50/90 border-gray-200/50'
      }`}>
       
      </div>

      {/* Main navigation */}
      <nav className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-4">
            {/* Logo */}
            <div className="flex items-center absolute top-4 left-8 right-0 z-50">
              <img src={Descarga} alt="Logo" className="w-24 object-cover rounded-full" />
            </div>

            {/* Desktop Navigation */}
            <div className="max-md:hidden md:flex md:md-colitems-center justify-end space-x-1">
              <NavLink 
                to="#inicio"
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg  font-medium transition-colors duration-200"
              >
                INICIO
              </NavLink>
              <NavLink 
                to="#eventos"
                onClick={() => scrollToSection('eventos')}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Rifas
              </NavLink>
              <NavLink 
                to="/pagos"
                onClick={() => scrollToSection('cuentas')}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Pagos
              </NavLink>
              <div className="ml-4 flex items-center space-x-3">
                <a
                  href="https://wa.me/58412RIFASPLUS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>💬</span>
                  <span>Contacto</span>
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="flex flex-col space-y-1 px-4 py-4">
                <NavLink
                  to="/"
                  onClick={() => {
                    scrollToSection('inicio');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Inicio
                </NavLink>
                <NavLink 
                  to="/rifas"
                  onClick={() => {
                    scrollToSection('eventos');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Rifas
                </NavLink>
                <NavLink 
                  to="/pagos"
                  onClick={() => {
                    scrollToSection('cuentas');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Pagos
                </NavLink>
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <a
                    href="https://wa.me/584123397066?text=¡Hola!%20Quiero%20participar%20en%20las%20rifas%20de%20RifasPlus 🎯"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    💬 Contacto
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};