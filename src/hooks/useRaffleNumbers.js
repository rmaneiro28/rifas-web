import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'


export const useRaffleNumbers = (rifaId) => {
  const [availableNumbers, setAvailableNumbers] = useState([])
  const [soldNumbers, setSoldNumbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true;
    if (!rifaId) return;
    const fetchSoldNumbers = async () => {
      try {
        if (!mounted) return;
        setLoading(true)
        setError(null)
        setAvailableNumbers([])
        setSoldNumbers([])
        // Por ahora simulamos números vendidos
        // En el futuro esto vendría de una tabla t_tickets o similar
        const { data: rifa, error: rifaError } = await supabase
          .from('t_rifas')
          .select('total_tickets')
          .eq('id_rifa', rifaId)
          .single()

        if (!mounted) return;
        if (rifaError) throw rifaError
        if (!rifa || !rifa.total_tickets || rifa.total_tickets <= 0) {
          setError('No hay tickets disponibles para esta rifa.')
          setAvailableNumbers([])
          setSoldNumbers([])
          return
        }
        // Simulamos que se han vendido algunos números aleatorios
        const totalTickets = rifa.total_tickets
        const soldCount = Math.floor(totalTickets * 0.3) // 30% vendidos
        const sold = []
        while (sold.length < soldCount) {
          const randomNum = Math.floor(Math.random() * totalTickets) + 1
          if (!sold.includes(randomNum)) {
            sold.push(randomNum)
          }
        }
        setSoldNumbers(sold.sort((a, b) => a - b))
        // Crear array de números disponibles
        const available = []
        for (let i = 1; i <= totalTickets; i++) {
          if (!sold.includes(i)) {
            available.push(i)
          }
        }
        setAvailableNumbers(available)
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Error al cargar los números disponibles.')
        setAvailableNumbers([])
        setSoldNumbers([])
        console.error('Error fetching sold numbers:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    };
    fetchSoldNumbers();
    return () => { mounted = false; };
  }, [rifaId]);

  // Generar números aleatorios disponibles
  const generateRandomNumbers = (quantity) => {
    if (quantity <= 0 || quantity > availableNumbers.length) {
      return []
    }

    const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, quantity).sort((a, b) => a - b)
  }

  // Verificar si un número está disponible
  const isNumberAvailable = (number) => {
    return availableNumbers.includes(number)
  }

  // Obtener estadísticas
  const getStats = () => {
    const total = availableNumbers.length + soldNumbers.length
    const sold = soldNumbers.length
    const available = availableNumbers.length
    const percentage = total > 0 ? Math.round((sold / total) * 100) : 0

    return {
      total,
      sold,
      available,
      percentage
    }
  }

  return {
    availableNumbers,
    soldNumbers,
    loading,
    error,
    generateRandomNumbers,
    isNumberAvailable,
    getStats
  }
}
