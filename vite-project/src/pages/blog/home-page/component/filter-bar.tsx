"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  id: string
  label: string
  value: string
}

interface FilterBarProps {
  options: FilterOption[]
  selectedValues?: string[]
  onSelectionChange?: (selectedValues: string[]) => void
  className?: string
  variant?: "button" | "badge"
  allowMultiple?: boolean
}

export default function FilterBar({
  options,
  selectedValues = [],
  onSelectionChange,
  className,
  variant = "button",
  allowMultiple = true,
}: FilterBarProps) {
  const [selected, setSelected] = React.useState<string[]>(selectedValues)
  const [showLeftShadow, setShowLeftShadow] = React.useState(false)
  const [showRightShadow, setShowRightShadow] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({})

  React.useEffect(() => {
    setSelected(selectedValues)
  }, [selectedValues])

  // Check scroll shadows
  const checkScrollShadows = React.useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftShadow(scrollLeft > 0)
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  // Initialize scroll shadows
  React.useEffect(() => {
    checkScrollShadows()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollShadows)
      window.addEventListener("resize", checkScrollShadows)
      return () => {
        container.removeEventListener("scroll", checkScrollShadows)
        window.removeEventListener("resize", checkScrollShadows)
      }
    }
  }, [checkScrollShadows])

  // Auto scroll to selected item
  const scrollToItem = React.useCallback((value: string) => {
    const container = scrollContainerRef.current
    const item = itemRefs.current[value]

    if (!container || !item) return

    const containerRect = container.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    // Calculate if item is visible
    const isVisible = itemRect.left >= containerRect.left && itemRect.right <= containerRect.right

    if (!isVisible) {
      // Calculate scroll position to center the item
      const itemOffsetLeft = item.offsetLeft
      const itemWidth = item.offsetWidth
      const containerWidth = container.clientWidth

      const scrollPosition = itemOffsetLeft - containerWidth / 2 + itemWidth / 2

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      })
    }
  }, [])

  const handleToggle = (value: string) => {
    let newSelected: string[]

    if (allowMultiple) {
      if (selected.includes(value)) {
        newSelected = selected.filter((item) => item !== value)
      } else {
        newSelected = [...selected, value]
        // Auto scroll to newly selected item
        setTimeout(() => scrollToItem(value), 100)
      }
    } else {
      newSelected = selected.includes(value) ? [] : [value]
      if (!selected.includes(value)) {
        // Auto scroll to newly selected item
        setTimeout(() => scrollToItem(value), 100)
      }
    }

    setSelected(newSelected)
    onSelectionChange?.(newSelected)
  }

  const isSelected = (value: string) => selected.includes(value)

  if (variant === "badge") {
    return (
      <div className={cn("relative", className)}>
        {/* Left shadow */}
        {showLeftShadow && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Right shadow */}
        {showRightShadow && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((option) => (
            <div key={option.id} ref={(el) => (itemRefs.current[option.value] = el)} className="flex-shrink-0">
              <Badge
                variant={isSelected(option.value) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-primary/80 whitespace-nowrap",
                  isSelected(option.value) && "bg-primary text-primary-foreground",
                )}
                onClick={() => handleToggle(option.value)}
              >
                {option.label}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Left shadow */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      )}

      {/* Right shadow */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {options.map((option) => (
          <div key={option.id} className="relative flex-shrink-0" ref={(el) => (itemRefs.current[option.value] = el)}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto px-3 py-2 text-sm font-normal text-muted-foreground hover:text-foreground whitespace-nowrap",
                isSelected(option.value) && "text-foreground",
              )}
              onClick={() => handleToggle(option.value)}
            >
              {option.label}
            </Button>
            {isSelected(option.value) && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
