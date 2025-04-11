import React, { useId } from 'react'

function InputDivs({ type = "from", amount=1, onAmountChange, currency = "INR", onCurrencyChange, options = {} }) {
    const amountInputId = useId();
    const currencyInputId = useId();

    return (
        <div className="bg-white/50 dark:bg-black/50 p-3 rounded-sm backdrop-blur-md flex flex-row gap-1 w-full max-w-2xl">
            <div className="flex flex-col w-[90%] space-y-1">
                <label htmlFor={amountInputId} className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {type}
                </label>
                <input
                    type="number"
                    id={amountInputId}
                    value={amount}
                    placeholder="0"
                    onChange={(e) => onAmountChange?.(Number(e.target.value))}
                    className="bg-white dark:bg-black/70 dark:text-white p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                />
            </div>

            <div className="flex flex-col w-1/2 space-y-1">
                <label htmlFor={currencyInputId} className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Currency Type
                </label>
                <select
                    id={currencyInputId}
                    name="currencytype"
                    value={currency}
                    onChange={(e) => onCurrencyChange?.(e.target.value)}
                    className="bg-white/60 dark:bg-black/50 dark:text-white p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                >
                    {Object.keys(options).map((elemnt) => (
                        <option key={elemnt}>{elemnt}</option>
                    ))}
                </select>
            </div>
        </div>

    )
}
export default InputDivs