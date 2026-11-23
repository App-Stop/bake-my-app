export function SettingsToggle({ checked, onChange, label, ariaLabel, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-[50px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-brand justify-end' : 'bg-[#dcdcdc] justify-start'
      }`}
    >
      <span className="block h-5 w-7 rounded-full bg-white shadow-xs transition-transform" />
    </button>
  )
}
