import { HugeiconsIcon } from '@hugeicons/react'
import { CroissantIcon } from '@hugeicons/core-free-icons'
import { CATEGORY_ICONS } from './categoryIcons'

export function CategoryIcon({ icon, size = 20, color = 'currentColor', className = '' }) {
  const match = CATEGORY_ICONS.find((ci) => ci.id === icon)
  const IconComponent = match ? match.icon : CroissantIcon
  return <HugeiconsIcon icon={IconComponent} size={size} color={color} className={className} />
}
