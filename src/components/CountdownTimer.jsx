import { MapPin, Phone, Globe, Facebook, Instagram, Twitter, Gift, Clock, Users } from 'lucide-react';
import { useRifas, useRifasStats } from '../hooks/useRifas';
import { useState, useEffect } from 'react';

// Componente para el contador regresivo
export const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [prevTimeLeft, setPrevTimeLeft] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      completed: false
    };
  }

  useEffect(() => {
    // Guardar el estado anterior antes de actualizar
    setPrevTimeLeft(timeLeft);
    
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Activar animación
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate]);

  // Función para determinar si un valor cambió
  const valueChanged = (key) => prevTimeLeft[key] !== timeLeft[key];

  if (timeLeft.completed) {
    return <span className="text-red-400 font-bold">Finalizada</span>;
  }

  return (
    <div className="flex space-x-1">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-400">Días</div>
          <div className={`bg-gray-800 rounded-lg p-2 min-w-[40px] text-center ${valueChanged('days') && isAnimating ? 'animate-pulse' : ''}`}>
            <span className="font-bold text-yellow-400 text-lg">{timeLeft.days}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-400">Horas</div>
        <div className={`bg-gray-800 rounded-lg p-2 min-w-[40px] text-center ${valueChanged('hours') && isAnimating ? 'animate-pulse' : ''}`}>
          <span className="font-bold text-yellow-400 text-lg">{timeLeft.hours.toString().padStart(2, '0')}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-400">Min</div>
        <div className={`bg-gray-800 rounded-lg p-2 min-w-[40px] text-center ${valueChanged('minutes') && isAnimating ? 'animate-pulse' : ''}`}>
          <span className="font-bold text-yellow-400 text-lg">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-400">Seg</div>
        <div className={`bg-gray-800 rounded-lg p-2 min-w-[40px] text-center ${valueChanged('seconds') && isAnimating ? 'animate-pulse' : ''}`}>
          <span className="font-bold text-yellow-400 text-lg">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { rifas, loading: rifasLoading } = useRifas();
  const { stats, loading: statsLoading } = useRifasStats();
  
  // Fecha objetivo para el contador regresivo (puedes cambiarla según necesites)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7); // 7 días desde ahora

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Finalizada';
    } else if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Mañana';
    } else if (diffDays <= 7) {
      return `${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>

        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-purple-800/60 to-pink-900/40"></div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent transform rotate-12"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-transparent via-white/10 to-transparent transform -rotate-12"></div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          
          {/* Sección de contador regresivo destacado */}
          <div className="bg-gradient-to-r from-purple-800 to-blue-800 rounded-xl p-6 mb-12 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Clock className="mr-2" /> ⏰ Próximo Gran Sorteo
            </h2>
            <div className="flex justify-center mb-4">
              <CountdownTimer targetDate={targetDate} />
            </div>
            <p className="text-gray-200">¡No te pierdas la oportunidad de ganar increíbles premios!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎲</span>
                <div className="text-2xl font-bold text-yellow-400">
                  RifasPlus
                </div>
              </div>

              <h3 className="text-lg font-bold text-yellow-400">
                La Plataforma de Rifas Más Confiable
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Transformamos la manera de participar en rifas con tecnología de vanguardia,
                transparencia absoluta y premios que cambian vidas.
              </p>

              {/* Achievement badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-400">
                    {statsLoading ? '...' : stats.totalRifas || '1000+'}
                  </div>
                  <div className="text-gray-400 text-xs">Rifas Totales</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-400">
                    {statsLoading ? '...' : stats.rifasActivas || '50K+'}
                  </div>
                  <div className="text-gray-400 text-xs">Rifas Activas</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-400">
                    {statsLoading ? '...' : `$${(stats.totalPremios || 2000000).toLocaleString()}`}
                  </div>
                  <div className="text-gray-400 text-xs">En Premios</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-cyan-400">
                    {statsLoading ? '...' : (stats.totalTickets || '99.9%')}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {statsLoading ? 'Cargando...' : (stats.totalTickets ? 'Tickets Total' : 'Satisfacción')}
                  </div>
                </div>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2">
                {[
                  { name: 'Inicio', href: '#inicio' },
                  { name: 'Rifas Activas', href: '#rifas' },
                  { name: 'Métodos de Pago', href: '#pagos' },
                  { name: 'Ganadores', href: '#ganadores' },
                  { name: 'Centro de Ayuda', href: '#ayuda' },
                  { name: 'Soporte 24/7', href: '#soporte' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {[
                  { name: 'Términos y Condiciones', href: '#terminos' },
                  { name: 'Política de Privacidad', href: '#privacidad' },
                  { name: 'Política de Cookies', href: '#cookies' },
                  { name: 'Aviso Legal', href: '#aviso' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conecta con Nosotros */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">
                Conecta con Nosotros
              </h3>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-yellow-400" />
                  <a
                    href="tel:+58412RIFASPLUS"
                    className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
                  >
                    +58 412-RIFAS-PLUS
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-yellow-400" />
                  <span className="text-gray-300 font-medium">Venezuela</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe size={20} className="text-yellow-400" />
                  <a
                    href="https://www.rifasplus.com"
                    className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.rifasplus.com
                  </a>
                </div>
              </div>

              {/* WhatsApp destacado */}
              <div className="bg-green-600 rounded-lg p-4 hover:bg-green-500 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h4 className="text-white font-bold">WhatsApp</h4>
                    <p className="text-green-100 text-sm">¡Chatea con nosotros!</p>
                    <p className="text-green-100 text-sm font-medium">Soporte 24/7</p>
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: '📘', color: 'hover:bg-blue-600' },
                  { name: 'Instagram', icon: '📸', color: 'hover:bg-pink-600' },
                  { name: 'Twitter', icon: '🐦', color: 'hover:bg-blue-400' },
                  { name: 'YouTube', icon: '📺', color: 'hover:bg-red-600' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`bg-gray-800 ${social.color} p-3 rounded-lg transition-colors duration-200`}
                    title={social.name}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
        </div>

          {/* Trust badges */}
          <div className="bg-gray-800 rounded-lg p-6 my-8">
            <h3 className="text-xl font-bold text-center text-white mb-6">🛡️ Certificaciones y Seguridad</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🔒</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">SSL Seguro</h4>
                <p className="text-gray-400 text-xs">Encriptación 256-bit</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🏆</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Verificado</h4>
                <p className="text-gray-400 text-xs">
                  {statsLoading ? 'Cargando...' : `${stats.totalRifas || 0} rifas verificadas`}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚡</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Pagos Rápidos</h4>
                <p className="text-gray-400 text-xs">Procesamiento inmediato</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Transparente</h4>
                <p className="text-gray-400 text-xs">
                  {statsLoading ? 'Cargando...' : `${stats.rifasActivas || 0} rifas activas`}
                </p>
              </div>
            </div>
          </div>

          
          {/* Línea divisoria */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Copyright y enlaces legales */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              RifasPlus es una plataforma de entretenimiento que opera bajo estrictas normas de transparencia y legalidad.
              Todos los sorteos son supervisados y verificados. Juega responsablemente.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#terminos" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Términos y Condiciones
              </a>
              <a href="#privacidad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#responsabilidad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Juego Responsable
              </a>
              <a href="#ayuda" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Centro de Ayuda
              </a>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400 mb-1">
                © {currentYear} RifasPlus
              </div>
              <div className="text-gray-400 text-sm">
                Todos los derechos reservados • Hecho con ❤️ en Venezuela
              </div>
            </div>
          </div>
      </div>
      </div>

      {/* Chat flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/584123397066?text=¡Hola! Quiero participar en las rifas de RifasPlus 🎯"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <span className="text-xl">💬</span>
          <div className="hidden lg:block">
            <div className="font-bold text-sm">¡Chatea con nosotros!</div>
            <div className="text-xs opacity-90">Soporte 24/7</div>
          </div>
        </a>
      </div>

      {/* Back to top button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Volver arriba"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      
    </footer>
  );
};