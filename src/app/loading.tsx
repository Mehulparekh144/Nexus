import { Loader2 } from 'lucide-react'

// The name of file should be loading.tsx as next.js will automatically detect the file and render the component.
export default function Loading() {
  return <Loader2 className='mx-auto my-6 animate-spin' />
}
