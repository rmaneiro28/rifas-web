import { useState } from 'react';
import { Copy, Check, ExternalLink, Phone, Mail, CreditCard, DollarSign } from 'lucide-react';

export const PaymentAccounts = () => {
  const [copiedText, setCopiedText] = useState('');

  const cuentasPago = [
    {
      id: 1,
      nombre: "PagomóvilBDV",
      tipo: "movil",
      icono: Phone,
      datos: {
        telefono: "0412-RIFAS-01",
        ci: "12345678",
        cuenta: "01020219150001234567",
        titular: "RifasPlus C.A.",
        banco: "CUENTA CORRIENTE VENEZUELA"
      }
    },
    {
      id: 2,
      nombre: "ZELLE",
      tipo: "digital",
      icono: DollarSign,
      datos: {
        email: "pagos@rifasplus.com",
        titular: "RifasPlus LLC"
      }
    },
    {
      id: 3,
      nombre: "BINANCE PAY",
      tipo: "crypto",
      icono: CreditCard,
      datos: {
        email: "crypto@rifasplus.com",
        titular: "RifasPlus Crypto"
      }
    },
    {
      id: 4,
      nombre: "PAYPAL",
      tipo: "digital",
      icono: CreditCard,
      datos: {
        email: "paypal@rifasplus.com",
        titular: "RifasPlus International"
      }
    },
    {
      id: 5,
      nombre: "BANCOLOMBIA - COLOMBIA",
      tipo: "banco",
      icono: CreditCard,
      datos: {
        cuenta: "123-456789-01",
        tipo_cuenta: "CUENTA DE AHORROS",
        titular: "RifasPlus Colombia SAS"
      }
    },
    {
      id: 6,
      nombre: "EFECTIVO",
      tipo: "efectivo",
      icono: DollarSign,
      datos: {
        ubicacion: "Oficinas RifasPlus",
        direccion: "Disponible en Venezuela",
        titular: "RifasPlus"
      }
    }
  ];

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const getIconColor = (tipo) => {
    switch (tipo) {
      case 'movil': return 'text-green-600';
      case 'digital': return 'text-blue-600';
      case 'crypto': return 'text-yellow-600';
      case 'banco': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const PaymentCard = ({ cuenta }) => {
    const IconComponent = cuenta.icono;

    // Colores por tipo de cuenta
    const getCardColors = (tipo) => {
      switch (tipo) {
        case 'movil':
          return 'from-blue-500 to-cyan-500';
        case 'digital':
          return 'from-green-500 to-emerald-500';
        case 'crypto':
          return 'from-yellow-500 to-orange-500';
        case 'banco':
          return 'from-purple-500 to-pink-500';
        case 'efectivo':
          return 'from-gray-500 to-slate-600';
        default:
          return 'from-blue-500 to-purple-500';
      }
    };

    return (
      <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:scale-105 overflow-hidden relative">
        {/* Background gradient */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getCardColors(cuenta.tipo)}`}></div>

        <div className="flex items-center mb-6">
          <div className={`p-4 bg-gradient-to-r ${getCardColors(cuenta.tipo)} rounded-2xl mr-4 shadow-lg`}>
            <IconComponent size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {cuenta.nombre}
          </h3>
        </div>

        <div className="space-y-4">
          {cuenta.datos.telefono && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
              <span className="text-sm text-blue-700 font-bold flex items-center mb-2">
                📱 TELÉFONO
              </span>
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 text-lg">{cuenta.datos.telefono}</p>
                <button
                  onClick={() => copyToClipboard(cuenta.datos.telefono, `${cuenta.nombre}-telefono`)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors group"
                  title="Copiar teléfono"
                >
                  {copiedText === `${cuenta.nombre}-telefono` ?
                    <Check size={18} className="text-green-600" /> :
                    <Copy size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  }
                </button>
              </div>
            </div>
          )}

          {cuenta.datos.email && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <span className="text-sm text-green-700 font-bold flex items-center mb-2">
                📧 CORREO ELECTRÓNICO
              </span>
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 text-lg break-all">{cuenta.datos.email}</p>
                <button
                  onClick={() => copyToClipboard(cuenta.datos.email, `${cuenta.nombre}-email`)}
                  className="p-2 bg-green-100 hover:bg-green-200 rounded-xl transition-colors group flex-shrink-0 ml-2"
                  title="Copiar email"
                >
                  {copiedText === `${cuenta.nombre}-email` ?
                    <Check size={18} className="text-green-600" /> :
                    <Copy size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                  }
                </button>
              </div>
            </div>
          )}

          {cuenta.datos.cuenta && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <span className="text-sm text-purple-700 font-bold flex items-center mb-2">
                🏦 {cuenta.datos.tipo_cuenta || 'CUENTA'}
              </span>
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 text-lg">{cuenta.datos.cuenta}</p>
                <button
                  onClick={() => copyToClipboard(cuenta.datos.cuenta, `${cuenta.nombre}-cuenta`)}
                  className="p-2 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors group"
                  title="Copiar cuenta"
                >
                  {copiedText === `${cuenta.nombre}-cuenta` ?
                    <Check size={18} className="text-green-600" /> :
                    <Copy size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
                  }
                </button>
              </div>
            </div>
          )}

          {cuenta.datos.ubicacion && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100">
              <span className="text-sm text-gray-700 font-bold flex items-center mb-2">
                📍 UBICACIÓN
              </span>
              <p className="font-bold text-gray-800">{cuenta.datos.ubicacion}</p>
              <p className="text-gray-600 text-sm">{cuenta.datos.direccion}</p>
            </div>
          )}

          {cuenta.datos.ci && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-100">
              <span className="text-sm text-yellow-700 font-bold">🆔 C.I:</span>
              <p className="font-bold text-gray-800">{cuenta.datos.ci}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-4 border-2 border-indigo-200">
            <span className="text-sm text-indigo-700 font-bold flex items-center mb-2">
              👤 TITULAR
            </span>
            <p className="font-bold text-indigo-800 text-lg">{cuenta.datos.titular}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="cuentas" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-2 mb-6">
            <span className="text-green-700 text-sm font-semibold">💳 MÉTODOS DE PAGO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Paga Como Prefieras
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ofrecemos múltiples opciones de pago para tu comodidad.
            <span className="text-green-600 font-semibold"> Todos nuestros canales son seguros</span> y confiables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cuentasPago.map((cuenta) => (
            <PaymentCard key={cuenta.id} cuenta={cuenta} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ¿Tienes dudas sobre los pagos?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro equipo está disponible para ayudarte con cualquier consulta sobre métodos de pago,
              confirmación de transferencias o proceso de compra.
            </p>
            <a
              href="https://wa.me/58412RIFASPLUS?text=Hola! Tengo una consulta sobre los métodos de pago"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105"
            >
              <span className="text-2xl">💬</span>
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
