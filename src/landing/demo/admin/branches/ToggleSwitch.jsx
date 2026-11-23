export function ToggleSwitch({ checked, onChange, label, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-[50px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        checked ? 'bg-[#39ab00] justify-end' : 'bg-[#dcdcdc] justify-start'
      }`}
    >
      <span className="block h-5 w-7 rounded-full bg-white shadow-sm transition-transform" />
    </button>
  )
}
