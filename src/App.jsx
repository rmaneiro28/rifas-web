import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { EventsSection } from './components/EventsSection'
import { PaymentAccounts } from './components/PaymentAccounts'
import { RaffleDetail } from './components/RaffleDetail'
import { ScrollToTop } from './components/ScrollToTop'
import Logo from './assets/Logo.jpg';
import Moto from './assets/moto.png';

// Componente Home
const Home = () => {
  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero Section */}
        <section id="inicio" className="relative  pb-20">
          <div className="relative z-10 mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <img src={Moto} alt="Logo" className="h-96 mx-auto" />
              </div>
              {/* Left Content */}
              <div className="text-center lg:text-left">
                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  El de las flores
                </h1>
                  <span className="block text-blue-600 text-[21px] font-bold pr-1">VENEZOLANO<span  className="text-red-600 text-[16px]">VE</span> </span>
                  <span className="block text-gray-900 font-bold text-lg ">Carayaca</span>
                  <span className="block text-gray-900 font-bold ">Amante a las motos</span>
                  <span className="block text-gray-900 font-bold mb-10">Nada es imposible, en busca de hacer un sueño realidad💭</span>

                

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <button
                    onClick={() => document.getElementById('eventos').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>🎯</span>
                    <span>Ver Rifas Activas</span>
                  </button>

                  <button
                    onClick={() => document.getElementById('cuentas').scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>💳</span>
                    <span>Métodos de Pago</span>
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className="font-medium">Pagos Seguros</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600"> 
                    <span className="text-blue-500 text-lg">🛡️</span>
                    <span className="font-medium">100% Confiable</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-purple-500 text-lg">⚡</span>
                    <span className="font-medium">Resultados Inmediatos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Events Section */}
        <EventsSection />

        {/* Payment Accounts Section */}
        <PaymentAccounts />

        
      </main>
    </>
  );
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rifa/:id" element={<RaffleDetail />} />
      </Routes>
    </>
  );
}

export default App;
