export type ComponentId =
  | 'command-palette'
  | 'delete-button'
  | 'marquee'
  | 'drawer'
  | 'number-flow'
  | 'toolbar'

const items: { id: ComponentId; label: string }[] = [
  { id: 'command-palette', label: 'Command Palette' },
  { id: 'delete-button', label: 'Delete Button' },
  { id: 'marquee', label: 'Marquee' },
  { id: 'drawer', label: 'Drawer' },
  { id: 'number-flow', label: 'Number Flow' },
  { id: 'toolbar', label: 'Toolbar' },
]

type SidebarMenuProps = {
  active: ComponentId
  onSelect: (id: ComponentId) => void
}

export function SidebarMenu({ active, onSelect }: SidebarMenuProps) {
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col rounded-xl border border-neutral-200 bg-white p-4">
      <p className="mb-4 text-sm font-medium text-neutral-900">Menu</p>

      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = active === item.id

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-100 font-medium text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
