import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ContrastTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contrast Test Page</h1>
        <p className="text-muted-foreground">
          Visual verification of text contrast and readability across different surfaces
        </p>
      </div>

      {/* Primary Colors Test */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0A1A3F] p-4 rounded-2xl">
              <h3 className="font-semibold text-white mb-2">Primary Navy (#0A1A3F)</h3>
              <p className="text-white/80">This text should be clearly readable on the primary navy background.</p>
              <Button className="mt-2">Primary Button</Button>
            </div>
            <div className="bg-[#007BFF] p-4 rounded-2xl">
              <h3 className="font-semibold text-white mb-2">Electric Blue (#007BFF)</h3>
              <p className="text-white/80">This text should be clearly readable on the electric blue background.</p>
              <Button className="mt-2" variant="secondary">Secondary Button</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Contrast Test */}
      <Card>
        <CardHeader>
          <CardTitle>Text Contrast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Heading 1 - Large Title</h3>
            <h4 className="text-xl font-semibold">Heading 2 - Section Title</h4>
            <h5 className="text-lg font-medium">Heading 3 - Subsection</h5>
            <p className="text-base">Body text - This is the main content text that should be easily readable.</p>
            <p className="text-sm text-muted-foreground">
              Muted text - This is secondary information that should still be readable but less prominent.
            </p>
            <p className="text-xs text-muted-foreground">
              Small text - Used for captions, metadata, and fine print.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Surface Contrast Test */}
      <Card>
        <CardHeader>
          <CardTitle>Surface Contrast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Background Surface</h4>
                <p className="text-sm">Text on the main background surface.</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Card Surface</h4>
                <p className="text-sm">Text on card surfaces and elevated elements.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Muted Surface</h4>
                <p className="text-sm">Text on muted or secondary surfaces.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Button Variants Test */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Elements Test */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <a href="#" className="text-primary hover:underline block">Primary Navy Link</a>
            <a href="#" className="text-accent hover:underline block">Electric Blue Link</a>
            <a href="#" className="text-accent-2 hover:underline block">Vibrant Orange Link</a>
            <a href="#" className="text-secondary hover:underline block">Deep Red Link</a>
            <button className="text-foreground hover:text-primary transition-colors">
              Interactive Text Button
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Notes */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Text should have a contrast ratio of at least 4.5:1 for normal text</li>
            <li>• Large text (18pt+) should have a contrast ratio of at least 3:1</li>
            <li>• Interactive elements should be clearly distinguishable</li>
            <li>• Focus states should be visible and high contrast</li>
            <li>• Color should not be the only way to convey information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
