import Image from 'next/image'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import resumePreviewPage from '@/assets/resume-preview.png'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-gray-900 text-center md:text-start md:flex-row lg:gap-12'>
      <div className='max-w-prose space-y-3'>
        <Image
          src={logo}
          alt='Logo'
          width={150}
          height={150}
          className='mx-auto md:ms-0'
        />
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl scroll-m-20'>
          Create the{' '}
          <span className='bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent inline-block'>
            Perfect Resume
          </span>{' '}
          in Minutes
        </h1>
        <p className='text-lg text-gray-500'>
          Create a professional resume with our{' '}
          <span className='font-bold'>AI resume builder</span>. Get started now
          and land more interviews!
        </p>
        <Button size={'lg'} variant={'premium'}>
          <Link href={'/resumes'}>Get Started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumePreviewPage}
          alt='Resume Preview'
          width={600}
          className='shadow-md lg:rotate-[1.5deg]'
        />
      </div>
    </main>
  )
}
