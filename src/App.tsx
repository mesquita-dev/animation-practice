import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { DeleteButton } from './components/DeleteButton'
import { DrawerPage } from './components/Drawer'
import { MarqueePage } from './components/Marquee'
import { NumberFlowPage } from './components/NumberFlowPage'
import { Preloader } from './components/Preloader'
import { SidebarMenu, type ComponentId } from './components/SidebarMenu'
import { ToolbarPage } from './components/Toolbar'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [activeComponent, setActiveComponent] =
    useState<ComponentId>('command-palette')

  return (
    <>
      <AnimatePresence>
        {!isReady && <Preloader onComplete={() => setIsReady(true)} />}
      </AnimatePresence>

      {isReady && (
        <motion.div
          className="min-h-screen bg-neutral-100 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex min-h-[calc(100vh-24px)] gap-3">
            <SidebarMenu
              active={activeComponent}
              onSelect={setActiveComponent}
            />

            <main className="flex flex-1 items-center justify-center">
              {activeComponent === 'command-palette' && <CommandPalette />}
              {activeComponent === 'delete-button' && <DeleteButton />}
              {activeComponent === 'marquee' && <MarqueePage />}
              {activeComponent === 'drawer' && <DrawerPage />}
              {activeComponent === 'number-flow' && <NumberFlowPage />}
              {activeComponent === 'toolbar' && <ToolbarPage />}
            </main>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default App
