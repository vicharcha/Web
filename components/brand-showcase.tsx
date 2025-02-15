import { Logo } from "./logo"

export function BrandShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Main Logo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Main Logo</h2>
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800">
          <Logo animated />
        </div>
      </section>

      {/* Small Logo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Small Logo</h2>
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800">
          <Logo variant="small" />
        </div>
      </section>

      {/* Icon Only */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Icon Only</h2>
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800">
          <Logo variant="icon" />
        </div>
      </section>

      {/* Color Variations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Color Variations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 rounded-lg bg-gray-900">
            <Logo className="text-white" />
          </div>
          <div className="p-8 rounded-lg bg-white">
            <Logo className="text-gray-900" />
          </div>
        </div>
      </section>
    </div>
  )
}

