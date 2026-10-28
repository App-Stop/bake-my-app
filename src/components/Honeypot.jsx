/**
 * Spam trap: a field real visitors never see or reach, sent as `website`. Bots fill it in and the API
 * then quietly drops the request. Off-screen rather than display:none, which some bots skip.
 * The parent needs `position: relative` so the field can't move the page.
 */
export function Honeypot({ value, onChange }) {
  const controlled = onChange ? { value, onChange: (e) => onChange(e.target.value) } : {}
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" {...controlled} />
      </label>
    </div>
  )
}
