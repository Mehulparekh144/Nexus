import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, FileUserIcon, PenLineIcon } from 'lucide-react'
import Link from 'next/link'
import { steps } from './steps'
import { cn } from '@/lib/utils'

interface FooterProps {
  currentStep: string
  setCurrentStep: (step: string) => void
  showSmResumePreview: boolean
  setShowSmResumePreview: (show: boolean) => void
  isSaving: boolean
}

export default function Footer({
  currentStep,
  setCurrentStep,
  setShowSmResumePreview,
  isSaving,
  showSmResumePreview,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key

  return (
    <footer className='w-full border-t px-3 py-5'>
      <div className='max-w-7xl mx-auto flex flex-wrap justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Button
            variant={'secondary'}
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            <ArrowLeft /> Previous Step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next Step <ArrowRight />
          </Button>
        </div>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className='md:hidden'
          title={
            showSmResumePreview ? 'Show Input Form' : 'Show Resume Preview'
          }
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className='flex items-center gap-3'>
          <p
            className={cn(
              'text-muted-foreground opacity-0',
              isSaving && 'opacity-100',
            )}
          >
            Saving...
          </p>
          <Button variant='destructive' asChild>
            <Link href={'/resumes'}>Close</Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
