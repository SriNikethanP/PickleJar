"use client"

import Link from "next/link"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that uses India country code in the url.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={`/in${href}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
