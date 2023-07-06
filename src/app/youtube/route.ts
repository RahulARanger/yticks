import { redirect } from 'next/navigation'
import { redirectToDocs } from './redirectComponent'
import { type ReactNode } from 'react'

export function GET (_: Request): ReactNode {
  redirect(redirectToDocs())
}
