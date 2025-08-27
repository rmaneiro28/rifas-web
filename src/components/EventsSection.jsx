import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ChevronLeft, ChevronRight, Clock, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('disponibles');
  const [currentPage, setCurrentPage] = useState(1);
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rifas from database
  const fetchRifas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('t_rifas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRifas(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rifas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRifas();
  }, []);

  // Transform database rifas to component format
  const transformRifa = (rifa) => ({
    id: rifa.id_rifa,
    titulo: rifa.nombre,
    fecha: new Date(rifa.fecha_fin).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    imagen: rifa.imagen_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=250&fit=crop",
    estado: rifa.estado === 'activa' ? 'disponible' :
            rifa.estado === 'pendiente' ? 'proximamente' : 'finalizado',
    precio: parseFloat(rifa.precio_ticket),
    totalNumeros: rifa.total_tickets,
    vendidos: Math.floor(Math.random() * rifa.total_tickets * 0.7), // Simulado por ahora
    progreso: 0, // Se calculará después
    descripcion: rifa.descripcion,
    premio_principal: rifa.premio_principal,
    categoria: rifa.categoria,
    fecha_fin: rifa.fecha_fin,
    ganador: rifa.estado === 'finalizada' ? `#${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` : null
  });

  // Get events based on active tab
  const getEventsByTab = () => {
    if (loading) return [];

    const transformedRifas = rifas.map(rifa => {
      const transformed = transformRifa(rifa);
      transformed.progreso = Math.round((transformed.vendidos / transformed.totalNumeros) * 100);
      return transformed;
    });

    if (activeTab === 'disponibles') {
      return transformedRifas.filter(rifa => rifa.estado === 'disponible' || rifa.estado === 'proximamente');
    } else {
      return transformedRifas.filter(rifa => rifa.estado === 'finalizado');
    }
  };

  const eventsPerPage = 6;
  const currentEvents = getEventsByTab();
  const totalPages = Math.ceil(currentEvents.length / eventsPerPage);

  const getCurrentEvents = () => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return currentEvents.slice(startIndex, startIndex + eventsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const EventCard = ({ evento }) => {
    const timeLeft = () => {
      if (!evento.fecha_fin) return null;
      const now = new Date();
      const endDate = new Date(evento.fecha_fin);
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return 'Finalizada';
      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return '1 día';
      return `${diffDays} días`;
    };

    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:scale-105">
        <div className="relative">
          <img
            src={evento.imagen}
            alt={evento.titulo}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />

          {/* Category badge */}
          {evento.categoria && (
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {evento.categoria}
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              evento.estado === 'disponible'
                ? 'bg-green-100 text-green-800'
                : evento.estado === 'proximamente'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {evento.estado === 'disponible' ? '🟢 Disponible' :
               evento.estado === 'proximamente' ? '🟡 Próximamente' : '🔴 Finalizado'}
            </span>
          </div>

          {/* Winner info */}
          {evento.estado === 'finalizado' && evento.ganador && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
              🏆 Ganador: {evento.ganador}
            </div>
          )}

          {/* Time left for active raffles */}
          {evento.estado === 'disponible' && timeLeft() && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
              <Clock size={12} />
              <span>Quedan: {timeLeft()}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Gift size={20} className="text-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                {evento.titulo}
              </h3>
              {evento.premio_principal && (
                <p className="text-sm text-blue-600 font-medium">
                  🏆 {evento.premio_principal}
                </p>
              )}
            </div>
          </div>

          {evento.descripcion && (
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
              {evento.descripcion}
            </p>
          )}

          {evento.estado === 'disponible' && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">${evento.precio}</div>
                    <div className="text-xs text-gray-500">Por ticket</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{evento.vendidos.toLocaleString()}/{evento.totalNumeros.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Vendidos</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso de venta</span>
                  <span className="font-medium">{evento.progreso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{width: `${evento.progreso}%`}}
                  ></div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-gray-500 mb-4 text-sm">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>Sorteo: {evento.fecha}</span>
            </div>
            {evento.estado === 'disponible' && timeLeft() && (
              <div className="flex items-center text-orange-600 font-medium">
                <Clock size={14} className="mr-1" />
                <span>{timeLeft()}</span>
              </div>
            )}
          </div>

          {evento.estado === 'disponible' ? (
            <Link
              to={`/rifa/${evento.id}`}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Eye size={16} />
              <span>Ver Detalles</span>
            </Link>
          ) : evento.estado === 'proximamente' ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Clock size={16} />
              <span>Próximamente</span>
            </button>
          ) : (
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2">
              <Gift size={16} />
              <span>Ver Resultado</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8" role="navigation" aria-label="Pagination" id='eventos'>
        <button 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary-500 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
        
        <button 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <section id="eventos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎯 Rifas Disponibles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Descubre nuestras rifas activas y elige la que más te guste. Premios increíbles te están esperando.
          </p>

          {!loading && rifas.length > 0 && (
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{rifas.filter(r => r.estado === 'activa').length} Activas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>{rifas.filter(r => r.estado === 'pendiente').length} Próximamente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>{rifas.filter(r => r.estado === 'finalizada').length} Finalizadas</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab('disponibles');
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center space-x-2 ${
                activeTab === 'disponibles'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span>Disponibles</span>
              {!loading && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'disponibles' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {rifas.filter(r => r.estado === 'activa' || r.estado === 'pendiente').length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('finalizados');
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center space-x-2 ${
                activeTab === 'finalizados'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span>Finalizados</span>
              {!loading && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'finalizados' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {rifas.filter(r => r.estado === 'finalizada').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">Error al cargar las rifas</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchRifas}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          ) : getCurrentEvents().length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {activeTab === 'disponibles' ? 'No hay Rifas Disponibles' : 'No hay Rifas Finalizadas'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'disponibles'
                  ? 'Pronto tendremos nuevas rifas disponibles'
                  : 'Aún no hay rifas finalizadas'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentEvents().map((evento) => (
                  <EventCard key={evento.id} evento={evento} />
                ))}
              </div>
              <Pagination />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
