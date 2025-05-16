"use client"

import { Button } from "@/components/ui/button"
import { IllustrationComponent } from "@/components/ui/assets/illustration-component"
import { IconComponent } from "@/components/ui/assets/icon-component"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  illustrationCategory: "empty" | "error"
  illustrationType: string
  actionLabel?: string
  actionIcon?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  illustrationCategory,
  illustrationType,
  actionLabel,
  actionIcon,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      <IllustrationComponent
        category={illustrationCategory as any}
        type={illustrationType as any}
        width={250}
        height={200}
        className="mb-6"
      />

      <h3 className="text-xl font-poppins font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary-600">
          {actionIcon && <IconComponent name={actionIcon as any} size="sm" className="mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
