import LoadingButton from '@/components/LoadingButton'
import { useToast } from '@/hooks/use-toast'
import { ResumeValues } from '@/lib/validation'
import { WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { generateSummary } from './actions'

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues
  onSummaryGenerated: (summary: string) => void
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  async function handleClick() {
    // TODO : Prevent user who doesn't have a subscription from using this feature.

    try {
      setLoading(true)
      const response = await generateSummary(resumeData)
      onSummaryGenerated(response)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingButton
        variant={'outline'}
        type='button'
        onClick={handleClick}
        loading={loading}
      >
        <WandSparkles className='size-4' /> Generate (AI)
      </LoadingButton>
    </>
  )
}
