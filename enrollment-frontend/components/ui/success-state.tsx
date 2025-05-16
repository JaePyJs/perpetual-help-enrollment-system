"use client"

import { Button } from "@/components/ui/button"
import { IllustrationComponent } from "@/components/ui/assets/illustration-component"
import { IconComponent } from "@/components/ui/assets/icon-component"
import { BackgroundComponent } from "@/components/ui/assets/background-component"
import { cn } from "@/lib/utils"

interface SuccessStateProps {
  title: string
  description: string
  illustrationType: string
  primaryActionLabel: string
  primaryActionIcon?: string
  onPrimaryAction: () => void
  secondaryActionLabel?: string
  secondaryActionIcon?: string
  onSecondaryAction?: () => void
  className?: string
}

export function SuccessState({
  title,
  description,
  illustrationType,
  primaryActionLabel,
  primaryActionIcon,
  onPrimaryAction,
  secondaryActionLabel,
  secondaryActionIcon,
  onSecondaryAction,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center text-center p-8", className)}>
      {/* Decorative background elements */}
      <BackgroundComponent pattern="circles" position="top-right" opacity={0.05} className="h-48 w-48" />
      <BackgroundComponent pattern="dots" position="bottom-left" opacity={0.05} className="h-48 w-48" />

      <IllustrationComponent
        category="success"
        type={illustrationType as any}
        width={300}
        height={250}
        className="mb-6"
      />

      <h2 className="text-2xl font-poppins font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">{description}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onPrimaryAction} className="bg-primary hover:bg-primary-600">
          {primaryActionIcon && <IconComponent name={primaryActionIcon as any} size="sm" className="mr-2" />}
          {primaryActionLabel}
        </Button>

        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionIcon && <IconComponent name={secondaryActionIcon as any} size="sm" className="mr-2" />}
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
