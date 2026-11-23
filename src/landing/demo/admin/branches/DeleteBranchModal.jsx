import { HugeiconsIcon } from '@hugeicons/react'
import { TriangleAlertIcon } from '@hugeicons/core-free-icons'

export function DeleteBranchModal({ branch, onConfirm, onCancel }) {
  if (!branch) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-branch-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="flex w-full max-w-[420px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0px_10px_40px_0px_rgba(0,0,0,0.16)]">
        {/* Destructive Heading */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[20px] bg-[#ffecec] text-[#ea0101]">
            <HugeiconsIcon icon={TriangleAlertIcon} size={20} color="currentColor" />
          </div>
          <h3 id="delete-branch-title" className="text-lg font-semibold text-ink">
            Delete branch?
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm leading-[22px] text-muted">
          This will permanently delete <span className="font-semibold text-ink">{branch.name}</span> and its configuration. This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={() => onConfirm(branch.id)}
            className="flex-1 rounded-full bg-[#ea0101] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#d00101] cursor-pointer"
          >
            Yes, Delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-[#e8e8e8] bg-white px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-[#f5f5f5] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
