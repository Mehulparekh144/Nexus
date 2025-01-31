import { useToast } from '@/hooks/use-toast'
import useDebounce from '@/hooks/useDebounce'
import { ResumeValues } from '@/lib/validation'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { saveResume } from './actions'
import { Button } from '@/components/ui/button'
import { fileReplacer } from '@/lib/utils'

export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const debouncedResumeData = useDebounce(resumeData, 1500)

  const [resumeId, setResumeId] = useState<string | undefined>(resumeData?.id)
  // StructuredClone is used to deep clone the resume data to avoid reference issues.
  const [lastSavedData, setLastSavedData] = useState<ResumeValues>(
    structuredClone(resumeData),
  )

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsError(false)
  }, [debouncedResumeData])

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true)
        setIsError(false)

        const newData = structuredClone(debouncedResumeData)

        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        })

        setResumeId(updatedResume.id)
        setLastSavedData(newData)

        // This is to update the resumeId in the URL if it is not present. Eg. When a new resume is created.
        if (searchParams.get('resumeId') !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set('resumeId', updatedResume.id)
          window.history.replaceState(
            null,
            '',
            `?${newSearchParams.toString()}`,
          )
        }
      } catch (error) {
        setIsError(true)
        console.error(error)
        const { dismiss } = toast({
          variant: 'destructive',
          description: (
            <div className='space-y-3'>
              <p>Unable to save changes</p>
              <Button
                variant={'secondary'}
                onClick={() => {
                  dismiss()
                  save()
                }}
              >
                Retry
              </Button>
            </div>
          ),
        })
      } finally {
        setLastSavedData(structuredClone(debouncedResumeData))
        setIsSaving(false)
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer)

    if (hasUnsavedChanges && debouncedResumeData && !isError) {
      save()
    }
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    isError,
    resumeId,
    searchParams,
    toast,
  ])

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  }
}
