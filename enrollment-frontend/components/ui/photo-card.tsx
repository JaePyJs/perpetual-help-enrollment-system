import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AssetImage } from "@/components/ui/assets/asset-image"
import { cn } from "@/lib/utils"

interface PhotoCardProps {
  title: string
  description?: string
  imageSrc: string
  imageAlt: string
  className?: string
  imageClassName?: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

export function PhotoCard({
  title,
  description,
  imageSrc,
  imageAlt,
  className,
  imageClassName,
  children,
  footer,
}: PhotoCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-48">
        <AssetImage src={imageSrc} alt={imageAlt} fill className={cn("object-cover", imageClassName)} />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
