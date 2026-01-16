import { useState } from 'react'
import './CurrencyCalculator.css'

// Currency data with conversion rates to shekel
const currencies = [
  { id: 'widows-mites', name: "Widow's Mites", value: 1, image: '/widows-mites.jpg' },
  { id: 'mustard-seeds', name: 'Mustard Seeds', value: 3, image: '/mustard-seeds.jpg' },
  { id: 'copper-coin', name: 'Copper Coin', value: 5, image: '/copper-coin.jpg' },
  { id: 'silver-coin', name: 'Silver Coin', value: 11, image: '/silver-coin.jpg' },
  { id: 'denarius', name: 'Denarius', value: 17, image: '/denarius.jpg' },
  { id: 'loaf-and-fish', name: 'Loaf & Fish', value: 23, image: '/loaf-and-fish.jpg' },
  { id: 'trade-seal', name: 'Trade Seal', value: 37, image: '/trade-seal.jpg' },
  { id: 'gold-coin', name: 'Gold Coin', value: 53, image: '/gold-coin.jpg' },
  { id: 'talent', name: 'Talent', value: 101, image: '/talent.jpg' },
  { id: 'kings-tax', name: "King's Tax", value: 131, image: '/kings-tax.jpg' },
]

function CurrencyRow({ currency, amount, onAmountChange, onIncrement }) {
  const handleInputChange = (e) => {
    const value = e.target.value
    // Allow empty string or valid numbers
    if (value === '' || /^\d+$/.test(value)) {
      onAmountChange(currency.id, value === '' ? 0 : parseInt(value, 10))
    }
  }

  return (
    <div className="currency-row">
      <button 
        className="currency-image-btn" 
        onClick={() => onIncrement(currency.id)}
        type="button"
        aria-label={`Add one ${currency.name}`}
      >
        <img src={currency.image} alt={currency.name} className="currency-image" />
      </button>
      <div className="currency-info">
        <span className="currency-name">{currency.name}</span>
        <span className="currency-value">= {currency.value} shekel</span>
      </div>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={amount || ''}
        onChange={handleInputChange}
        placeholder="0"
        className="currency-input"
        aria-label={`Amount of ${currency.name}`}
      />
    </div>
  )
}

function CurrencyCalculator() {
  const [amounts, setAmounts] = useState({})

  const handleAmountChange = (currencyId, value) => {
    setAmounts(prev => ({
      ...prev,
      [currencyId]: value
    }))
  }

  const handleIncrement = (currencyId) => {
    setAmounts(prev => ({
      ...prev,
      [currencyId]: (prev[currencyId] || 0) + 1
    }))
  }

  const handleReset = () => {
    setAmounts({})
  }

  // Calculate total shekel
  const totalShekel = currencies.reduce((total, currency) => {
    const amount = amounts[currency.id] || 0
    return total + (amount * currency.value)
  }, 0)

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <div className="calculator-header">
          <h1 className="calculator-title">Currency Calculator</h1>
          <p className="calculator-subtitle">Convert game currencies to shekel</p>
        </div>

        <div className="total-display">
          <div className="total-content">
            <span className="total-amount">{totalShekel.toLocaleString()}</span>
            <span className="total-label">Shekel</span>
          </div>
          <button 
            className="reset-btn" 
            onClick={handleReset}
            type="button"
            aria-label="Reset all amounts"
          >
            ↺ Reset
          </button>
        </div>

        <div className="currencies-list">
          {currencies.map(currency => (
            <CurrencyRow
              key={currency.id}
              currency={currency}
              amount={amounts[currency.id] || 0}
              onAmountChange={handleAmountChange}
              onIncrement={handleIncrement}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CurrencyCalculator
