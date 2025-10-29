import * as React from "react"
import { cn } from "../../lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  size?: "sm" | "md" | "lg" | "xl"
  centered?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = "Loading...", size = "md", centered = true, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16"
    }

    const borderClasses = {
      sm: "border-2",
      md: "border-2",
      lg: "border-4",
      xl: "border-4"
    }

    const textSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          centered && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-gray-300 border-t-gray-600",
            sizeClasses[size],
            borderClasses[size]
          )}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    )
  }
)
Loading.displayName = "Loading"

export { Loading }
