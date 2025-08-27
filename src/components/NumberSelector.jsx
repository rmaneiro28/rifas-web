import { useState, useEffect, useCallback } from 'react'
import { Plus, Minus, Shuffle } from 'lucide-react'
import { useRaffleNumbers } from '../hooks/useRaffleNumbers'

export const NumberSelector = ({ rifaId, onSelectionChange, maxQuantity = 50, price = 250 }) => {
  const { raffles, selectedNumbers, setSelectedNumbers, selectedQuantity } = useRaffleNumbers(rifaId)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)


  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity)
    setTotal(newQuantity * price)
  }
  const handlePlus = () => {
    if (selectedQuantity < maxQuantity) {
      setQuantity(selectedQuantity + 1)
      setTotal((selectedQuantity + 1) * price)
    }
  }
  const handleMinus = () => {
    if (selectedQuantity > 1) {
      setQuantity(selectedQuantity - 1)
      setTotal((selectedQuantity - 1) * price)
    }
  }
  
}