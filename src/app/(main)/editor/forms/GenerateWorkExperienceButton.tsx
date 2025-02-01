import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { generateWorkExperience } from './actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/LoadingButton'

interface GenerateWorkExperienceButtonsProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void
}

export default function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonsProps) {
  const [showInputDialog, setShowInputDialog] = useState(false)

  return (
    <>
      <Button
        variant={'outline'}
        type='button'
        // TODO : Block for non-premium users.
        onClick={() => setShowInputDialog(true)}
      >
        <WandSparkles className='size-4' /> Smart Fill (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={workExperience => {
          onWorkExperienceGenerated(workExperience)
          setShowInputDialog(false)
        }}
      />
    </>
  )
}

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void
}

function InputDialog({
  open,
  onOpenChange,
  onWorkExperienceGenerated,
}: InputDialogProps) {
  const { toast } = useToast()

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: '',
    },
  })

  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input)
      onWorkExperienceGenerated(response)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again later.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experience</DialogTitle>
          <DialogDescription>
            Describe your work experience and AI will generate a professional
            summary for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='E.g. "from nov 2019 to dec 2024 I worked at ranch as a software engineer, tasks given were .....'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={form.formState.isSubmitting} type='submit'>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
