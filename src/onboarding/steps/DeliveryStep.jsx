import { SelectField, TextField, Toggle } from '../../components/form'
import { StepShell } from '../StepShell'

const DELIVERY_TIMES = ['10-20 minutes', '20-30 minutes', '30-45 minutes', '45-60 minutes']
const TAX_LABELS = ['VAT', 'GST', 'Sales Tax']

export function DeliveryStep({ state, actions, onBack, onNext }) {
  const { delivery } = state
  const set = (key) => (e) => actions.updateDelivery({ [key]: e.target.value })

  return (
    <StepShell
      step={3}
      title="Delivery & operations"
      description="Set your delivery fee, tax rate, and estimated delivery time. These appear in your customer's cart at checkout."
      onBack={onBack}
      onNext={onNext}
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-2.5">
          <TextField
            className="min-w-0 flex-1"
            label="Delivery Fee"
            placeholder="$1.25"
            inputMode="decimal"
            value={delivery.fee}
            onChange={set('fee')}
          />
          <TextField
            className="min-w-0 flex-1"
            label="Free deliver above"
            placeholder="$50"
            inputMode="decimal"
            value={delivery.freeAbove}
            onChange={set('freeAbove')}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <SelectField
            label="Estimated delivery time for 5 miles"
            options={DELIVERY_TIMES}
            value={delivery.estimatedTime}
            onChange={set('estimatedTime')}
          />
          <p className="text-xs leading-normal text-muted">
            We will automatically calculate the delivery time for different locations
          </p>
        </div>

        <div className="flex items-center gap-[60px] py-2.5">
          <p className="text-base leading-normal text-ink">Allow pickup at store</p>
          <Toggle
            label="Allow pickup at store"
            checked={delivery.allowPickup}
            onChange={(allowPickup) => actions.updateDelivery({ allowPickup })}
          />
        </div>

        <hr className="border-line-strong" />

        <div className="flex gap-2.5">
          <TextField
            className="min-w-0 flex-1"
            label="Tax Rate (%)"
            placeholder="2.5"
            inputMode="decimal"
            value={delivery.taxRate}
            onChange={set('taxRate')}
          />
          <SelectField
            className="min-w-0 flex-1"
            label="Tax Label"
            options={TAX_LABELS}
            value={delivery.taxLabel}
            onChange={set('taxLabel')}
          />
        </div>
      </div>
    </StepShell>
  )
}
