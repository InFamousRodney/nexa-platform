import * as React from "react"

export interface ToastProps {
  variant?: "default" | "destructive"
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement
