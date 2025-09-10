"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { ExampleForm } from "@/components/forms/example-form"

export default function DemoPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <ExampleForm />
      </div>
    </MainLayout>
  )
}
