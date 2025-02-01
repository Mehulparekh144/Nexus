'use client'
import { Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import usePremiumModal from '@/hooks/usePremiumModal'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { createCheckoutSession } from './actions'
import { env } from '@/env'

const premiumFeatures = ['AI Tools', 'Up to 3 resumes']

const premiumPlusFeatures = ['Infinite Resumes', 'Design Customization']

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal()

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true)
      const redirectUrl = await createCheckoutSession(priceId)
      window.location.href = redirectUrl
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
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!loading) {
          setOpen(open)
        }
      }}
    >
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Nexus Premium</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <p>
            Get access to all premium features with Nexus Premium Subscription.
          </p>
          <div className='flex'>
            <div className='flex w-1/2 flex-col space-y-5'>
              <h3 className='text-center text-lg font-bold'>Premium</h3>
              <ul className='space-y-2'>
                {premiumFeatures.map((feature, idx) => (
                  <li key={idx} className='flex items-center gap-2'>
                    <Check className='size-5 text-green-400' />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM)
                }
                disabled={loading}
              >
                Get Premium
              </Button>
            </div>
            <div className='border-l mx-6' />
            <div className='flex w-1/2 flex-col space-y-5'>
              <h3 className='text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent'>
                Premium Plus
              </h3>
              <ul className='space-y-2'>
                {premiumPlusFeatures.map((feature, idx) => (
                  <li key={idx} className='flex items-center gap-2'>
                    <Check className='size-5 text-green-400' />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIMUM_PLUS,
                  )
                }
                disabled={loading}
                variant={'premium'}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
