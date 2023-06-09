import { redirect } from 'next/navigation'
import { redirectToDocs } from '../redirectComponent'

export function GET (_: Request, { params }: { params: { slug: string[] } }): void {
  redirect(redirectToDocs(params.slug))
}
