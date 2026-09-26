import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  RankingIcon,
} from '@hugeicons/core-free-icons'
import { CampaignModal } from './CampaignModal'

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    title: '20% Off All Croissants',
    type: 'Percentage Discount',
    discountValue: '20',
    minOrderValue: '$10.00',
    validFrom: 'Oct 1, 2024',
    validTo: 'Oct 15, 2024',
    description: 'Get 20% off all delicious hand-crafted croissants for two weeks!',
    channel: 'Push Notification',
    targetType: 'CATEGORY',
    selectedCategories: ['Croissants'],
    selectedItems: [1, 2],
    audience: '458 members',
    timeInfo: 'Sent Oct 10',
    openRate: '67%',
    clickRate: '22%',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Weekend Bread Special',
    type: 'Fix Price OFF',
    discountValue: '2.00',
    minOrderValue: '$15.00',
    validFrom: 'Oct 14, 2024',
    validTo: 'Oct 16, 2024',
    description: 'Enjoy fresh artisan bread with $2 off this weekend.',
    channel: 'SMS',
    targetType: 'CATEGORY',
    selectedCategories: ['Bread'],
    selectedItems: [],
    audience: '312 members',
    timeInfo: 'Starts Sat Oct 14',
    openRate: '-',
    clickRate: '-',
    status: 'Scheduled',
  },
  {
    id: 3,
    title: 'Loyalty Double Points',
    type: 'Buy 1 Get 1',
    discountValue: 'BOGO',
    minOrderValue: '$0.00',
    validFrom: 'Oct 1, 2024',
    validTo: 'Oct 31, 2024',
    description: 'Earn double points on all pastries and handcrafted beverages.',
    channel: 'In-App Offer',
    targetType: 'ITEM',
    selectedCategories: ['Croissants'],
    selectedItems: [1, 2],
    audience: '634 members',
    timeInfo: 'Sent Oct 01',
    openRate: '84%',
    clickRate: '38%',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Autumn Cake Launch',
    type: 'Percentage Discount',
    discountValue: '15',
    minOrderValue: '$25.00',
    validFrom: 'Sep 20, 2024',
    validTo: 'Sep 28, 2024',
    description: 'Celebrate the new autumn seasonal cake line with 15% off.',
    channel: 'Push Notification',
    targetType: 'CATEGORY',
    selectedCategories: ['Cakes'],
    selectedItems: [],
    audience: '458 members',
    timeInfo: 'Sent Sep 28',
    openRate: '59%',
    clickRate: '15%',
    status: 'Ended',
  },
]

export function PromotionsView() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS)
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', data: null })
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 3000)
  }

  const handleOpenCreate = () => {
    setModalState({ isOpen: true, mode: 'create', data: null })
  }

  const handleOpenEdit = (campaign) => {
    setModalState({ isOpen: true, mode: 'edit', data: campaign })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'create', data: null })
  }

  const handleSaveCampaign = (campaignData) => {
    if (modalState.mode === 'create') {
      const newCampaign = {
        ...campaignData,
        id: Date.now(),
        audience: '458 members',
        openRate: '-',
        clickRate: '-',
        status: 'Active',
      }
      setCampaigns([newCampaign, ...campaigns])
      showToast(`Campaign "${newCampaign.title}" launched successfully!`)
    } else {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignData.id ? { ...c, ...campaignData } : c)),
      )
      showToast(`Campaign "${campaignData.title}" updated successfully!`)
    }
  }

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-5 lg:gap-7">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[26px] lg:text-[28px] font-semibold tracking-tight text-ink">
            Promotions &amp; Discounts
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Reach your customers with targeted campaigns and offers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-full bg-[var(--brand,#c15400)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer self-start sm:self-auto"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
        {/* Left Column: Active Campaigns List */}
        <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#f0ece9] shadow-[0px_4px_10px_rgba(0,0,0,0.02)] flex flex-1 flex-col gap-3 min-w-0 w-full">
          <h2 className="text-base sm:text-lg font-semibold text-ink">Active Campaigns</h2>

          <div className="flex flex-col divide-y divide-[#f0ece9]">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2"
              >
                {/* Campaign Meta */}
                <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-ink truncate">
                    {camp.title}
                  </h3>
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="rounded-[4px] bg-[var(--brand-light,#fdf6ee)] px-2 py-0.5 text-[11px] font-medium text-[var(--brand,#c15400)]">
                      {camp.channel}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>Audience: {camp.audience}</span>
                      <span>•</span>
                      <span>{camp.timeInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Rates & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0">
                  {/* Performance stats */}
                  <div className="flex items-center gap-5 sm:gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-ink">{camp.openRate}</span>
                      <span className="text-[11px] text-muted">Open Rate</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-ink">{camp.clickRate}</span>
                      <span className="text-[11px] text-muted">Click Rate</span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="w-[84px] text-right sm:text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        camp.status === 'Active'
                          ? 'bg-[#e8f5e9] text-[#2e7d32]'
                          : camp.status === 'Scheduled'
                          ? 'bg-[#fff3e0] text-[#ed6c02]'
                          : 'bg-[#f0ece9] text-[#6a6a6a]'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(camp)}
                    className="rounded-[8px] border border-[#e8e8e8] bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats Panel */}
        <div className="flex flex-col gap-5 w-full lg:w-[380px] xl:w-[400px] shrink-0">
          {/* Quick Stats Card */}
          <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#f0ece9] shadow-[0px_4px_10px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h2 className="text-base font-semibold text-ink">Quick Stats</h2>
            <div className="flex flex-col gap-3.5 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted">Total Campaigns This Month</span>
                <span className="font-medium text-ink">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Push Notifications Sent</span>
                <span className="font-medium text-ink">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">SMS Sent</span>
                <span className="font-medium text-ink">312</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Avg. Open Rate</span>
                <span className="font-medium text-[var(--brand,#c15400)]">64.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Avg. Redemption Rate</span>
                <span className="font-medium text-ink">12.8%</span>
              </div>
            </div>
          </div>

          {/* Top Performer Card */}
          <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#f0ece9] shadow-[0px_4px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={RankingIcon}
                size={22}
                className="text-[var(--brand,#c15400)] shrink-0"
              />
              <span className="text-sm sm:text-base font-semibold text-[var(--brand,#c15400)]">
                Top Performing Offer
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-medium text-ink">
                Free Croissant with custom Cake orders
              </p>
              <div className="flex flex-col gap-2 rounded-lg bg-[#f5f5f5] p-3 text-xs sm:text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Redemptions</span>
                  <span className="font-medium text-ink">234 times</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Redemption rate</span>
                  <span className="font-medium text-[#2e7d32]">18.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CampaignModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={handleCloseModal}
        onSave={handleSaveCampaign}
      />
    </div>
  )
}
