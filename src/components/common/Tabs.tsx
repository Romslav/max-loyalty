import React, { useState } from 'react'
import classNames from 'classnames'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'pills' | 'underline'
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className="w-full">
      {/* Tab List */}
      <div
        className={classNames(
          'flex gap-2 border-b-2 border-neutral-200',
          variant === 'pills' && 'gap-3 border-0'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={classNames(
              'px-4 py-2.5 font-medium transition-colors',
              activeTab === tab.id
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-neutral-600 hover:text-neutral-900',
              variant === 'pills' &&
                activeTab === tab.id &&
                'bg-primary-500 text-white rounded-lg border-0',
              variant === 'pills' &&
                activeTab !== tab.id &&
                'text-neutral-600 hover:bg-neutral-100 rounded-lg'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id} className="animate-fadeIn">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default Tabs
