/**
 * PromoCodeValidator Component
 * 
 * Component for validating and applying promo codes.
 * Real-time validation with feedback and benefits display.
 */

import React, { useState, useCallback } from 'react'
import { ValidatePromoCodeUseCase } from '../../../application/use-cases/promotion/ValidatePromoCodeUseCase'

interface PromoCodeValidatorProps {
  onCodeApplied?: (code: string, discount: number) => void
  onError?: (error: string) => void
  orderAmount?: number
  guestTier?: string
  className?: string
}

interface ValidationResult {
  valid: boolean
  code: string
  discountAmount: number
  discountPercentage?: number
  message: string
  restrictions?: string[]
}

/**
 * PromoCodeValidator Component
 */
export const PromoCodeValidator: React.FC<PromoCodeValidatorProps> = ({
  onCodeApplied,
  onError,
  orderAmount = 0,
  guestTier,
  className = '',
}) => {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const useCase = new ValidatePromoCodeUseCase()

  const handleValidate = useCallback(async () => {
    if (!code.trim()) {
      onError?.("\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 \u043d\u0435 \u0432\u0432\u043e\u0434\u0435\u043d")
      return
    }

    setIsLoading(true)
    try {
      const validationResult = await useCase.execute({
        code: code.toUpperCase(),
        guestTier,
        orderAmount,
      })

      setResult(validationResult)
      setShowResult(true)

      if (validationResult.valid) {
        onCodeApplied?.(validationResult.code, validationResult.discountAmount)
      } else {
        onError?.(validationResult.message)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u0430\u043b\u0438\u0434\u0430\u0446\u0438\u0438'
      onError?.(errorMsg)
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }, [code, guestTier, orderAmount, onCodeApplied, onError, useCase])

  const handleClear = useCallback(() => {
    setCode('')
    setResult(null)
    setShowResult(false)
  }, [])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isLoading) {
        handleValidate()
      }
    },
    [handleValidate, isLoading],
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input Section */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 (\u043f\u043eс\u0442\u0430\u0432\u044c \u043a\u043e\u0434, \u043d\u0430\u043f\u0440. PROMO20)"
            disabled={isLoading}
            maxLength={12}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm uppercase transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434"
          />
          {code && (
            <button
              onClick={() => setCode('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={handleValidate}
          disabled={isLoading || !code.trim()}
          className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430...' : '\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c'}
        </button>
      </div>

      {/* Result Display */}
      {showResult && result && (
        <div
          className={`rounded-lg border-l-4 p-4 ${
            result.valid
              ? 'border-green-400 bg-green-50 text-green-900'
              : 'border-red-400 bg-red-50 text-red-900'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{result.valid ? '\u2705' : '\u274c'}</span>
            <div className="flex-1">
              <h4 className="font-semibold">{result.message}</h4>
              {result.valid && orderAmount > 0 && (
                <div className="mt-2 space-y-1 text-sm">
                  <p>\u0421КИДКА: {result.discountPercentage}%</p>
                  <p>Оригинальная цена: ₽{orderAmount}</p>
                  <p className="font-bold">
                    Новая цена: ₽{orderAmount - result.discountAmount}
                  </p>
                </div>
              )}
              {result.restrictions && result.restrictions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {result.restrictions.map((restriction, idx) => (
                    <p key={idx} className="text-sm">
                      {restriction}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      {!showResult && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-medium">\ud83d\udcc4 \u0423 вас ес\u0442ь пр\u043e\u043c\u043e\u043a\u043e\u0434?</p>
          <p className="mt-1 text-xs opacity-75">Введ\u0438\u0442\u0435 к\u043e\u0434 в\u044b\u0448\u0435 и п\u043e\u043b\u0443\u0447\u0438\u0442\u0435 с\u043a\u0438\u0434\u043a\u0443.</p>
        </div>
      )}

      {/* Popular Codes (for testing) */}
      {!showResult && (
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-600">\ud83c\udf1f \u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u043a\u043e\u0434\u044b:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['SAVE10OFF', 'PROMO20', 'NEWUSER50', 'VIP100'].map((popularCode) => (
              <button
                key={popularCode}
                onClick={() => setCode(popularCode)}
                className="rounded bg-white px-2 py-1 text-xs font-mono text-teal-600 hover:bg-teal-50"
              >
                {popularCode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoCodeValidator
