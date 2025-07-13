'use client'

import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"

interface SkillsSectionProps {
  skills: string[]
  cardId?: string
}

// Global state to track which card is expanded
const globalState = {
  expandedCardId: null as string | null
}
const expandedCardListeners: Set<(cardId: string | null) => void> = new Set()

const setExpandedCardId = (cardId: string | null) => {
  globalState.expandedCardId = cardId
  expandedCardListeners.forEach(listener => listener(cardId))
}

export function SkillsSection({ skills, cardId = Math.random().toString() }: SkillsSectionProps) {
  const skillsContainerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleSkills, setVisibleSkills] = useState<string[]>([])
  const [hiddenCount, setHiddenCount] = useState(0)

  // Listen for global expansion changes
  useEffect(() => {
    const listener = (currentExpandedId: string | null) => {
      setIsExpanded(currentExpandedId === cardId)
    }
    expandedCardListeners.add(listener)
    
    return () => {
      expandedCardListeners.delete(listener)
    }
  }, [cardId])

  useEffect(() => {
    if (!skills || skills.length === 0) return

    const calculateVisibleSkills = () => {
      if (!skillsContainerRef.current) return

      const container = skillsContainerRef.current
      const containerWidth = container.offsetWidth
      
      // If all skills fit, show them all
      if (skills.length === 0) return

      // Create a temporary container to measure actual widths
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.top = '-9999px'
      tempContainer.style.display = 'flex'
      tempContainer.style.gap = '4px' // gap-1
      tempContainer.className = 'flex gap-1'
      document.body.appendChild(tempContainer)

      // First, create the +n pill to measure its width
      const tempPill = document.createElement('span')
      tempPill.className = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors whitespace-nowrap'
      tempPill.textContent = `+${skills.length} more` // Use max possible number for accurate measurement
      tempContainer.appendChild(tempPill)
      const pillWidth = tempPill.offsetWidth + 4 // including gap

      // Remove the pill for now
      tempContainer.removeChild(tempPill)

      let totalWidth = 0
      let skillsToShow = 0

      // Measure each skill badge
      for (let i = 0; i < skills.length; i++) {
        const tempBadge = document.createElement('span')
        tempBadge.className = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap'
        tempBadge.textContent = skills[i]
        tempContainer.appendChild(tempBadge)
        
        const badgeWidth = tempBadge.offsetWidth + 4 // including gap
        
        // Check if we can fit this skill
        if (i === skills.length - 1) {
          // Last skill - no need for +n pill
          if (totalWidth + badgeWidth <= containerWidth) {
            skillsToShow++
          }
        } else {
          // Not the last skill - check if we can fit this skill + the +n pill
          if (totalWidth + badgeWidth + pillWidth <= containerWidth) {
            totalWidth += badgeWidth
            skillsToShow++
          } else {
            // Can't fit this skill with the pill, so stop here
            break
          }
        }
      }

      document.body.removeChild(tempContainer)

      setVisibleSkills(skills.slice(0, skillsToShow))
      setHiddenCount(skills.length - skillsToShow)
    }

    // Initial calculation
    setTimeout(calculateVisibleSkills, 0)

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateVisibleSkills, 0)
    })
    
    if (skillsContainerRef.current) {
      resizeObserver.observe(skillsContainerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [skills])

  const handlePillClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newExpandedId = isExpanded ? null : cardId
    setExpandedCardId(newExpandedId)
  }

  // Handle clicks outside to collapse
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Only collapse if clicking outside the skills section
      const target = event.target as Element
      if (isExpanded && !target.closest(`[data-card-id="${cardId}"]`)) {
        setExpandedCardId(null)
      }
    }

    if (isExpanded) {
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [cardId, isExpanded])

  if (!skills || skills.length === 0) {
    return null
  }

  return (
    <div className="space-y-2" data-card-id={cardId}>
      <p className="text-sm font-medium text-muted-foreground">Skills</p>
      <div 
        ref={skillsContainerRef} 
        className={`flex flex-wrap gap-1 transition-all duration-300 ${
          isExpanded ? 'max-h-none' : 'max-h-6 overflow-hidden'
        }`}
        style={isExpanded ? {} : { height: '1.5rem' }}
      >
        {/* Show visible skills or all skills when expanded */}
        {(isExpanded ? skills : visibleSkills).map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-xs whitespace-nowrap"
          >
            {skill}
          </Badge>
        ))}
        
        {/* Show +n pill only when not expanded and there are hidden skills */}
        {!isExpanded && hiddenCount > 0 && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            onClick={handlePillClick}
          >
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  )
}
