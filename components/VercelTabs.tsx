"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface VercelTabsProps {
  tabs: { label: string; href: string }[];
}

export default function Frame({ tabs }: VercelTabsProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  // Find the active tab index based on the current pathname
  const activeIndex = tabs.findIndex(tab => tab.href === pathname);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex]
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeIndex])

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0]
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    })
  }, [])

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="w-full max-w-[1200px] h-[100px] border-none shadow-none relative flex items-center justify-center">
        <CardContent className="p-0">
          <div className="relative">
            {/* Hover Highlight */}
            <div
              className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            {/* Active Indicator */}
            <div
              className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
              style={activeStyle}
            />

            {/* Tabs */}
            <div className="relative flex space-x-[6px] items-">
              {tabs.map((tab, index) => (
                <div
                  key={tab.label}
                  ref={el => { tabRefs.current[index] = el; }}
                  className="h-[30px] flex items-center justify-center"
                >
                  <Link
                    href={tab.href}
                    className={`px-3 py-2 cursor-pointer transition-colors duration-300 flex items-center justify-center rounded-md
                      ${index === activeIndex
                        ? "text-[#0e0e10] dark:text-white font-semibold"
                        : "text-[#0e0f1199] dark:text-[#ffffff99]"}
                    `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span className="text-sm leading-5 whitespace-nowrap">
                      {tab.label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
