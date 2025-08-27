import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useRifas = () => {
  const [rifas, setRifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRifas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('t_rifas')
        .select('*')
        .eq('estado', 'activa')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        throw error
      }

      setRifas(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching rifas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRifas()
  }, [])

  return { rifas, loading, error, refetch: fetchRifas }
}

export const useRifasStats = () => {
  const [stats, setStats] = useState({
    totalRifas: 0,
    rifasActivas: 0,
    totalTickets: 0,
    totalPremios: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Obtener estadísticas generales
      const { data: rifasData, error: rifasError } = await supabase
        .from('t_rifas')
        .select('estado, total_tickets, precio_ticket')

      if (rifasError) throw rifasError

      const totalRifas = rifasData.length
      const rifasActivas = rifasData.filter(r => r.estado === 'activa').length
      const totalTickets = rifasData.reduce((sum, r) => sum + r.total_tickets, 0)
      const totalPremios = rifasData.reduce((sum, r) => sum + (r.total_tickets * r.precio_ticket), 0)

      setStats({
        totalRifas,
        rifasActivas,
        totalTickets,
        totalPremios
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, refetch: fetchStats }
}
