"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

export function ThemeSettings() {
  const [theme, setTheme] = useState("system")
  const [primaryColor, setPrimaryColor] = useState("blue")
  const [fontSize, setFontSize] = useState("medium")

  const themes = [
    {
      id: "light",
      name: "Light",
      description: "Clean and bright interface",
      icon: Sun,
      preview: "bg-white border-2 border-gray-200"
    },
    {
      id: "dark",
      name: "Dark",
      description: "Easy on the eyes in low light",
      icon: Moon,
      preview: "bg-gray-900 border-2 border-gray-700"
    },
    {
      id: "system",
      name: "System",
      description: "Follows your device settings",
      icon: Monitor,
      preview: "bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400"
    }
  ]

  const colors = [
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" }
  ]

  const fontSizes = [
    { id: "small", name: "Small", description: "Compact interface" },
    { id: "medium", name: "Medium", description: "Balanced and readable" },
    { id: "large", name: "Large", description: "Easy to read" }
  ]

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleColorChange = (newColor: string) => {
    setPrimaryColor(newColor)
    // Apply color to CSS variables
    document.documentElement.style.setProperty('--primary', `hsl(var(--${newColor}))`)
  }

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize)
    // Apply font size to document
    document.documentElement.setAttribute('data-font-size', newSize)
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Selection</CardTitle>
          <CardDescription>
            Choose your preferred theme and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-4">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <motion.div
                  key={themeOption.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={themeOption.id} id={themeOption.id} />
                  <div className={`w-12 h-12 rounded-lg ${themeOption.preview} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={themeOption.id} className="text-base font-medium cursor-pointer">
                      {themeOption.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {themeOption.description}
                    </p>
                  </div>
                  {theme === themeOption.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </motion.div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>
            Customize the primary color of your interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-lg ${color.class} cursor-pointer border-2 ${
                    primaryColor === color.id ? 'border-gray-900' : 'border-transparent'
                  } flex items-center justify-center`}
                  onClick={() => handleColorChange(color.id)}
                >
                  {primaryColor === color.id && (
                    <CheckCircle className="h-6 w-6 text-white" />
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: <Badge variant="outline">{colors.find(c => c.id === primaryColor)?.name}</Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle>Font Size</CardTitle>
          <CardDescription>
            Adjust the text size for better readability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={fontSize} onValueChange={handleFontSizeChange} className="space-y-3">
            {fontSizes.map((size) => (
              <div key={size.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={size.id} id={size.id} />
                <div className="flex-1">
                  <Label htmlFor={size.id} className="text-base font-medium cursor-pointer">
                    {size.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {size.description}
                  </p>
                </div>
                {fontSize === size.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your theme looks with the current settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold">Sample Card</h3>
              <p className="text-muted-foreground">
                This is how text will appear with your selected theme and font size.
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm">Primary Button</Button>
                <Button variant="outline" size="sm">Secondary Button</Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}