'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [loaded, setLoaded] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {loaded && <Confetti width={width} height={height} tweenDuration={100} />}
      <main className='max-w-7xl mx-auto px-3 py-6 text-center space-y-6'>
        <h1 className='text-3xl font-bold'>Billing Success</h1>
        <p>
          The checkout was successful. Your subscription has been activated.
        </p>
        <Button asChild>
          <Link href={'/resumes'}>Go to resumes</Link>
        </Button>
      </main>
    </>
  )
}
