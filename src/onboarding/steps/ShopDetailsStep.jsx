import { SectionLabel, TextField, UploadBox } from '../../components/form'
import { StepShell } from '../StepShell'

export function ShopDetailsStep({ state, actions, onNext }) {
  const { shop } = state
  const set = (key) => (e) => actions.updateShop({ [key]: e.target.value })

  return (
    <StepShell
      step={0}
      title="Tell us about your shop"
      description="Basic details so we can set up your storefront. You can change everything later."
      onNext={onNext}
      nextDisabled={!shop.name.trim()}
    >
      <div className="flex flex-col gap-2.5">
        <TextField
          label="Shop Name"
          placeholder="Ross Bakers Co."
          value={shop.name}
          onChange={set('name')}
          autoComplete="organization"
          required
        />
        <TextField
          label="Tagline"
          placeholder="Freshly baked goods"
          value={shop.tagline}
          onChange={set('tagline')}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <SectionLabel>Company Logo</SectionLabel>
        <UploadBox
          className="h-40 w-full bg-surface"
          value={shop.logo}
          onChange={(logo) => actions.updateShop({ logo })}
          accept="image/png,image/jpeg,image/svg+xml"
          title="Drop it here or click to upload"
          hint="PNG, JPG, or SVG — 512×512 recommended"
          label="Upload company logo"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <TextField
            className="min-w-0 flex-1"
            label="Address"
            placeholder="123, Ross Bakers Co., Texas, US"
            value={shop.address}
            onChange={set('address')}
            autoComplete="street-address"
          />
          <TextField
            className="min-w-0 flex-1"
            label="Phone"
            type="tel"
            placeholder="(555) 232 21342"
            value={shop.phone}
            onChange={set('phone')}
            autoComplete="tel"
          />
        </div>
        <TextField
          label="Email"
          type="email"
          placeholder="contact@rossbakers.com"
          value={shop.email}
          onChange={set('email')}
          autoComplete="email"
        />
      </div>
    </StepShell>
  )
}
