import { useState, useEffect } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from './Toast';
import { NumberSelector } from './NumberSelector';
import { supabase } from '../lib/supabase';
import { CountdownTimer } from './CountdownTimer';

export const RaffleDetail = () => {
  const { id: raffleId } = useParams();
  const [selection, setSelection] = useState({ type: 'random', quantity: 1, numbers: [], total: 1 });
  const [personalData, setPersonalData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: ''
  });
  const [raffleData, setRaffleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [comprobante, setComprobante] = useState('');
  const [sending, setSending] = useState(false);
  const { ToastContainer, showNotification } = useToast();
  // Validaciones simples
  const isPersonalDataValid = personalData.nombre && personalData.apellido && personalData.cedula && personalData.telefono;
  // Permitir selección de cantidad de números aleatorios
  const isSelectionValid = selection.quantity && selection.quantity >= 1 && selection.numbers.length > 0;
  const isPaymentValid = selectedPaymentMethod && comprobante;

  // Estado para el tipo de cambio
  const [exchange, setExchange] = useState({ bs: null, loading: true, error: null });

  // Fetch rifa data from database
  const fetchRaffleData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vw_rifas')
        .select('*')
        .eq('id_rifa', raffleId)
        .single();

      if (error) throw error;

      if (data) {
        setRaffleData({
          id: data.id_rifa,
          title: data.nombre,
          description: data.descripcion,
          image: data.imagen_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
          price: parseFloat(data.precio_ticket),
          totalNumbers: data.total_tickets,
          soldNumbers: data.tickets_vendidos,
          drawDate: data.fecha_fin,
          status: data.estado,
          premio_principal: data.premio_principal,
          segundo_premio: data.segundo_premio,
          tercer_premio: data.tercer_premio,
          cuarto_premio: data.cuarto_premio,
          categoria: data.categoria,
          reglas: data.reglas
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching raffle data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener tipo de cambio al montar
  useEffect(() => {
    const fetchExchange = async () => {
      setExchange({ bs: null, loading: true, error: null });
      try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const data = await res.json();
        setExchange({ bs: data.promedio, loading: false, error: null });
      } catch (err) {
        setExchange({ bs: null, loading: false, error: 'No se pudo obtener el tipo de cambio' });
      }
    };
    fetchExchange();
  }, []);

  useEffect(() => {
    if (raffleId) {
      fetchRaffleData();
    }
  }, [raffleId]);

  // Handle selection change
  const handleSelectionChange = (newSelection) => {
    setSelection(newSelection);
  };
  // Handle personal data change
  const handlePersonalDataChange = (field, value) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // Handle payment method
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };
  // Handle comprobante
  const handleComprobanteChange = (e) => {
    setComprobante(e.target.value);
  };

  // Enviar tickets a supabase - CORREGIDO: Insertar múltiples tickets
  const handleSubmit = async () => {
    setSending(true);
    try {
      // Crear array de tickets a insertar
      const ticketsToInsert = selection.numbers.map(numero => ({
        id_rifa: raffleId,
        nombre: personalData.nombre,
        apellido: personalData.apellido,
        cedula: personalData.cedula,
        telefono: personalData.telefono,
        email: personalData.email,
        numero: numero,
        metodo_pago: selectedPaymentMethod,
        comprobante: comprobante,
        status: 'pendiente',
      }));

      const { data, error } = await supabase.from('t_tickets').insert(ticketsToInsert);
      
      if (error) throw error;
      showNotification(`¡${selection.numbers.length} ticket(s) enviado(s)! Pronto serán validados.`, 'success');
      setShowModal(false);
      setCurrentStep(0);
      setSelection({ type: 'random', quantity: 1, numbers: [], total: 1 });
      setPersonalData({ nombre: '', apellido: '', cedula: '', telefono: '', email: '' });
      setSelectedPaymentMethod('');
      setComprobante('');
    } catch (err) {
      showNotification('Error al enviar los tickets: ' + err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando rifa...</h2>
          <p className="text-gray-500">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar la rifa</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchRaffleData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!raffleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Rifa no encontrada</h2>
          <p className="text-gray-500 mb-4">La rifa que buscas no existe o ha sido eliminada</p>
          <NavLink 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a Rifas
          </NavLink>
        </div>
      </div>
    );
  }

  // Modal paso a paso
  const StepModal = ({ show, step, onClose, onNext, onPrev, children, canNext, canSubmit, onSubmit, sending }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 sm:p-6 relative animate-fadeIn">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          <div>{children}</div>
          <div className="flex justify-between mt-6 gap-2">
            {step > 0 && (
              <button onClick={onPrev} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-semibold text-sm">Anterior</button>
            )}
            <div className="flex-1" />
            {step < 2 && (
              <button onClick={onNext} disabled={!canNext} className={`px-4 py-2 rounded font-semibold text-sm ${canNext ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Siguiente</button>
            )}
            {step === 2 && (
              <button onClick={onSubmit} disabled={!canSubmit || sending} className={`px-4 py-2 rounded font-semibold text-sm ${canSubmit && !sending ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{sending ? 'Enviando...' : 'Confirmar'}</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Pasos del modal
  const steps = [
    // Paso 1: Selección de número(s)
    <div key="step0">
      <h2 className="text-lg font-bold mb-4 text-center">Selecciona la cantidad de números</h2>
      <div className="max-w-xs mx-auto">
        <NumberSelector
          rifaId={raffleId}
          onSelectionChange={handleSelectionChange}
          maxQuantity={50}
          price={raffleData.price}
        />
        {/* Mostrar números seleccionados */}
        {selection.numbers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-blue-800">Números asignados:</span>
              <span className="text-sm text-blue-600">{selection.numbers.length} número(s)</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {selection.numbers.map((num, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Resumen de compra */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 max-w-xs mx-auto text-center">
        <div className="font-semibold text-blue-900 mb-1">Resumen de tu compra</div>
        <div className="text-sm text-gray-700">Tickets: <span className="font-bold">{selection.quantity || 1}</span></div>
        <div className="text-sm text-gray-700">Precio unitario: <span className="font-bold">${raffleData.price?.toFixed(2) || '--'}</span></div>
        <div className="text-base font-bold text-blue-700 mt-2">Total: ${((selection.quantity || 1) * (raffleData.price || 0)).toFixed(2)}</div>
        {exchange.loading ? (
          <div className="text-xs text-gray-500 mt-1">Cargando tasa Bs...</div>
        ) : exchange.error ? (
          <div className="text-xs text-red-500 mt-1">{exchange.error}</div>
        ) : (
          <div className="text-sm text-green-700 mt-1">Total en Bs: <span className="font-bold">{((selection.quantity || 1) * (raffleData.price || 0) * exchange.bs).toLocaleString('es-VE', { style: 'currency', currency: 'VES', minimumFractionDigits: 2 })}</span></div>
        )}
      </div>
      {!isSelectionValid && <p className="text-xs text-red-500 mt-2 text-center">Selecciona al menos un número</p>}
    </div>,
    // Paso 2: Datos personales
    <div key="step1">
      <h2 className="text-lg font-bold mb-4 text-center">Datos personales</h2>
      <div className="grid gap-2">
        <input name="nombre" value={personalData.nombre} onChange={e => handlePersonalDataChange('nombre', e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Nombre *" />
        <input name="apellido" value={personalData.apellido} onChange={e => handlePersonalDataChange('apellido', e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Apellido *" />
        <input name="cedula" value={personalData.cedula} onChange={e => handlePersonalDataChange('cedula', e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Cédula *" />
        <input name="telefono" value={personalData.telefono} onChange={e => handlePersonalDataChange('telefono', e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Teléfono *" />
        <input name="email" value={personalData.email} onChange={e => handlePersonalDataChange('email', e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Email" />
      </div>
      {!isPersonalDataValid && <p className="text-xs text-red-500 mt-2 text-center">Completa los campos obligatorios</p>}
    </div>,
    // Paso 3: Método de pago y comprobante
    <div key="step2">
      <h2 className="text-lg font-bold mb-4 text-center">Método de pago y comprobante</h2>
      {/* Resumen de compra */}
      <div className="mb-4 bg-blue-50 rounded-lg p-4 max-w-xs mx-auto text-center">
        <div className="font-semibold text-blue-900 mb-1">Resumen de tu compra</div>
        <div className="text-sm text-gray-700">Tickets: <span className="font-bold">{selection.quantity || 1}</span></div>
        <div className="text-sm text-gray-700">Precio unitario: <span className="font-bold">${raffleData.price?.toFixed(2) || '--'}</span></div>
        <div className="text-base font-bold text-blue-700 mt-2">Total: ${((selection.quantity || 1) * (raffleData.price || 0)).toFixed(2)}</div>
        {exchange.loading ? (
          <div className="text-xs text-gray-500 mt-1">Cargando tasa Bs...</div>
        ) : exchange.error ? (
          <div className="text-xs text-red-500 mt-1">{exchange.error}</div>
        ) : (
          <div className="text-sm text-green-700 mt-1">Total en Bs: <span className="font-bold">{((selection.quantity || 1) * (raffleData.price || 0) * exchange.bs).toLocaleString('es-VE', { style: 'currency', currency: 'VES', minimumFractionDigits: 2 })}</span></div>
        )}
      </div>
      <div className="grid gap-2 mb-2">
        <select value={selectedPaymentMethod} onChange={e => handlePaymentMethodChange(e.target.value)} className="border p-2 rounded w-full text-sm">
          <option value="">Selecciona método de pago</option>
          <option value="banesco">Banesco (Pago Móvil)</option>
          <option value="zelle">Zelle (Transferencia)</option>
          <option value="binance">Binance (Crypto)</option>
        </select>
        <input value={comprobante} onChange={handleComprobanteChange} className="border p-2 rounded w-full text-sm" placeholder="N° de comprobante o referencia *" />
      </div>
      {!isPaymentValid && <p className="text-xs text-red-500 mt-2 text-center">Completa todos los campos</p>}
      <div className="mt-3 space-y-2">
        <label className="flex items-start space-x-2">
          <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" required />
          <span className="text-xs text-gray-700">Autorizo el uso de <a href="#" className="text-blue-600 underline">Mis Datos Personales</a></span>
        </label>
        <label className="flex items-start space-x-2">
          <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" required />
          <span className="text-xs text-gray-700">Acepto los <a href="#" className="text-blue-600 underline">Términos y Condiciones</a></span>
        </label>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header y detalles de la rifa como antes */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                <span className="hidden sm:inline">Volver a Rifas</span>
                <span className="sm:hidden">Volver</span>
              </span>
            </Link>
            <div className="text-base sm:text-lg md:text-2xl font-bold" style={{color: '#045882'}}>
              <span className="hidden sm:inline">🎲 RifasPlus</span>
              <span className="sm:hidden">🎲</span>
            </div>
            <div className="hidden lg:block">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition-colors"
              >
                Ver Métodos de Pago
              </button>
            </div>
            {/* Mobile floating action button */}
            <div className="lg:hidden">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                title="Ver Métodos de Pago"
              >
                <ArrowLeft size={14} className="rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 md:py-8">
        {/* Información de la rifa - Arriba */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <div className="relative">
              <img
                src={raffleData.image}
                alt={raffleData.title}
                className="w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80 object-cover"
              />
              <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                <span className="hidden sm:inline">30 SEP 2025 11:59 PM</span>
                <span className="sm:hidden">30 SEP</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                  <span className="break-words">{raffleData.title}</span>
                  <span className="text-blue-500 text-xl sm:text-2xl">💙</span>
                </div>
              </h1>
              {/* Info Cards - Mobile First */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {/* Fecha */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 text-lg">📅</span>
                    <span className="text-orange-600 font-semibold text-sm sm:text-base">Fecha: 30 de septiembre</span>
                  </div>
                </div>
                {/* Premios */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-blue-600 text-lg">🏆</span>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">Premios:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 ml-6">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">DT 175 2025</span>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">AGV BLADE</span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">FX AZUL</span>
                  </div>
                </div>
                {/* Info adicional */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 text-lg">ℹ️</span>
                    <span className="text-xs sm:text-sm text-gray-600">Para participar mínimo 2 tickets.</span>
                  </div>
                  <div className="ml-6">
                    <span className="font-semibold text-orange-500 text-sm sm:text-base">Super gana</span>
                  </div>
                </div>
              </div>
              {/* Contador de tiempo - CORREGIDO: Pasamos la fecha de la rifa */}
              <div className="flex justify-center mb-4">
                <CountdownTimer targetDate={new Date(raffleData.drawDate)} />
              </div>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all shadow-lg text-sm sm:text-base md:text-lg transform hover:scale-105 active:scale-95"
                onClick={() => setShowModal(true)}
              >
                🎯 PARTICIPA Y GANA
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Modal paso a paso */}
      <StepModal
        show={showModal}
        step={currentStep}
        onClose={() => setShowModal(false)}
        onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
        onPrev={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        canNext={currentStep === 0 ? isSelectionValid : isPersonalDataValid}
        canSubmit={isPaymentValid}
        onSubmit={handleSubmit}
        sending={sending}
      >
        {steps[currentStep]}
      </StepModal>
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};