"use client"

import { useState } from "react"
import { Calendar, Check, ChevronRight, Clock, Flag } from "lucide-react"

import { cn } from "@/lib/utils"

type IconType = "calendar" | "flag" | "clock" | "check"
type EventStatus = "completed" | "in-progress" | "upcoming"

interface TimelineEvent {
  id: string
  title: string
  date: string
  time: string
  description: string
  icon: IconType
  status: EventStatus
}

interface InteractiveTimelineProps {
  defaultActive?: string
}

interface TimelineEventProps {
  event: TimelineEvent
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

interface StatusStyles {
  bg: string
  ring: string
  glow: string
  text: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "event-1",
    title: "Project Kickoff",
    date: "Jan 15, 2024",
    time: "9:00 AM",
    description:
      "Initial meeting with stakeholders to define project scope and goals. We'll establish the foundation for our collaboration.",
    icon: "calendar",
    status: "completed",
  },
  {
    id: "event-2",
    title: "Design Phase",
    date: "Feb 10, 2024",
    time: "2:30 PM",
    description:
      "Finalized wireframes and design mockups for the new application interface. Focus on user experience and accessibility.",
    icon: "flag",
    status: "completed",
  },
  {
    id: "event-3",
    title: "Development Sprint",
    date: "Mar 5, 2024",
    time: "10:00 AM",
    description:
      "Started the first development sprint focusing on core features and functionality. Implementation of key user stories begins.",
    icon: "clock",
    status: "in-progress",
  },
  {
    id: "event-4",
    title: "User Testing",
    date: "Apr 20, 2024",
    time: "1:00 PM",
    description:
      "Scheduled user testing sessions to gather feedback on the initial prototype. Validation of design decisions and usability.",
    icon: "check",
    status: "upcoming",
  },
]

const getIcon = (iconType: IconType) => {
  const iconProps = { className: "h-4 w-4" }
  const icons = {
    calendar: <Calendar {...iconProps} />,
    flag: <Flag {...iconProps} />,
    clock: <Clock {...iconProps} />,
    check: <Check {...iconProps} />,
  }
  return icons[iconType] || icons.calendar
}

const getStatusStyles = (status: EventStatus): StatusStyles => {
  const styles = {
    completed: {
      bg: "bg-emerald-500",
      ring: "ring-emerald-500/20",
      glow: "shadow-emerald-500/25",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    "in-progress": {
      bg: "bg-blue-500",
      ring: "ring-blue-500/20",
      glow: "shadow-blue-500/25",
      text: "text-blue-600 dark:text-blue-400",
    },
    upcoming: {
      bg: "bg-slate-400",
      ring: "ring-slate-400/20",
      glow: "shadow-slate-400/25",
      text: "text-slate-600 dark:text-slate-400",
    },
  }
  return styles[status]
}

const TimelineEventItem = ({
  event,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: TimelineEventProps) => {
  const styles = getStatusStyles(event.status)
  const isActive = isSelected || isHovered

  return (
    <div className="group fade-in-up relative">
      <div className="absolute top-0 left-0">
        <div
          className={cn(
            "relative h-12 w-12 rounded-full transition-all duration-300 ease-out",
            isActive
              ? cn(styles.ring, "ring-6", styles.glow, "shadow-lg")
              : "ring-0"
          )}
        >
          <div
            className={cn(
              "absolute inset-1.5 flex items-center justify-center rounded-full text-white transition-all duration-300",
              styles.bg,
              isActive && "shadow-lg"
            )}
          >
            {getIcon(event.icon)}
          </div>
        </div>
      </div>

      <div className="ml-16">
        <div
          className={cn(
            "group cursor-pointer rounded-xl border backdrop-blur-sm transition-all duration-300 ease-out",
            isSelected
              ? "border-light-300 dark:border-dark-300 bg-light-50 dark:bg-dark-50 shadow-light-200/50 dark:shadow-dark-200/50 scale-[1.01] shadow-lg"
              : "border-light-200 dark:border-dark-200 bg-light-50/80 dark:bg-dark-50/80 hover:border-light-300 dark:hover:border-dark-300 hover:bg-light-50 dark:hover:bg-dark-50 hover:scale-[1.005] hover:shadow-md"
          )}
          onClick={() => onSelect(event.id)}
          onMouseEnter={() => onHover(event.id)}
          onMouseLeave={() => onHover(null)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-light-950 dark:text-dark-950 group-hover:text-light-900 dark:group-hover:text-dark-900 text-base font-semibold transition-colors">
                  {event.title}
                </h3>
                <div className="text-light-600 dark:text-dark-600 mt-0.5 flex items-center gap-3 text-xs">
                  <span className="font-medium">{event.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                    styles.text,
                    "bg-light-100 dark:bg-dark-100"
                  )}
                >
                  <div
                    className={cn("h-1.5 w-1.5 rounded-full", styles.bg)}
                  ></div>
                  {event.status.replace("-", " ")}
                </div>
                <ChevronRight
                  className={cn(
                    "text-light-400 dark:text-dark-400 h-4 w-4 transition-transform duration-300",
                    isSelected ? "rotate-90" : "group-hover:translate-x-0.5"
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isSelected
                  ? "mt-3 max-h-48 opacity-100"
                  : "mt-0 max-h-0 opacity-0"
              )}
            >
              <div className="border-light-200 dark:border-dark-200 border-t pt-3">
                <p className="text-light-700 dark:text-dark-700 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InteractiveTimeline({
  defaultActive = "event-3",
}: InteractiveTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(
    defaultActive || null
  )
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId)
  }

  const numEvents = timelineEvents.length
  let progressLineHeight = "0%"
  let progressLineColorClass = "bg-gradient-to-b from-emerald-400 to-blue-500"

  const firstInProgressIndex = timelineEvents.findIndex(
    (e) => e.status === "in-progress"
  )
  const lastCompletedIndex = timelineEvents.findLastIndex(
    (e) => e.status === "completed"
  )

  if (numEvents > 0) {
    if (firstInProgressIndex !== -1) {
      progressLineHeight = `${((firstInProgressIndex + 0.5) / numEvents) * 100}%`
      progressLineColorClass = "bg-gradient-to-b from-emerald-400 to-blue-500"
    } else if (lastCompletedIndex === numEvents - 1) {
      progressLineHeight = "100%"
      progressLineColorClass = "bg-emerald-500"
    } else if (lastCompletedIndex !== -1) {
      progressLineHeight = `${((lastCompletedIndex + 0.5) / numEvents) * 100}%`
      progressLineColorClass = "bg-emerald-500"
    } else {
      progressLineHeight = "0%"
    }
  }

  return (
    <div className="bg-light-50 dark:bg-dark-50 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-light-950 dark:text-dark-950 text-2xl font-bold">
            Project Timeline
          </h1>
          <p className="text-light-600 dark:text-dark-600 mt-2 text-sm">
            Track your project milestones and progress
          </p>
        </div>

        <div className="relative">
          <div className="bg-light-200 dark:bg-dark-200 absolute top-0 left-6 h-full w-0.5"></div>

          <div
            className={cn(
              "absolute top-0 left-6 w-0.5 transition-all duration-1000 ease-out",
              progressLineColorClass
            )}
            style={{
              height: progressLineHeight,
            }}
          ></div>

          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <TimelineEventItem
                key={event.id}
                event={event}
                isSelected={selectedEvent === event.id}
                isHovered={hoveredEvent === event.id}
                onSelect={handleEventClick}
                onHover={setHoveredEvent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
