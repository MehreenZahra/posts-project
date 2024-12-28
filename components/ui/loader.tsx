import { Loader2 } from 'lucide-react'


export default function Loader({ title }: { title?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" />
      {title && (
        <h3  className="ml-2">
          {title}
        </h3>
      )}
    </div>
  )
}
