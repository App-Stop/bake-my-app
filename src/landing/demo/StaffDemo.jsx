import { DemoPage, DemoWindow } from './DemoShell'
import { StaffScreen } from './StaffScreen'

/** Staff portal demo (Figma "Landing" 123:5109): the order console in a 1308×819.2 window. */
export function StaffDemo() {
  return (
    <DemoPage title="Bakery staff portal demo" active="Staff Portal" top={80} height={819.2}>
      <DemoWindow width={1308} height={819.2}>
        <StaffScreen />
      </DemoWindow>
    </DemoPage>
  )
}
