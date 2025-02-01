import useDimensions from '@/hooks/useDimension'
import { cn } from '@/lib/utils'
import { ResumeValues } from '@/lib/validation'
import Image from 'next/image'
import React from 'react'
import { formatDate } from 'date-fns'
import { Badge } from './ui/badge'
import { BorderStyles } from '@/app/(main)/editor/BorderStyleButton'

interface ResumePreviewProps {
  resumeData: ResumeValues
  className?: string
}

export default function ResumePreview({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const { width } = useDimensions(containerRef)
  return (
    <div
      className={cn(
        'bg-white text-black h-fit w-full aspect-[210/297]', // Aspect ratio of A4 Sheet Paper
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn('space-y-6 p-6', !width && 'invisible')}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        {/* <pre>{JSON.stringify(resumeData, null, 4)}</pre> */}
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  )
}

interface ResumeSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData

  const [photoSrc, setPhotoSrc] = React.useState(
    photo instanceof File ? '' : photo,
  )

  React.useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ''
    if (objectUrl) {
      setPhotoSrc(objectUrl)
    }

    if (photo == null) {
      setPhotoSrc('')
    }

    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  return (
    <div className='flex items-center gap-6'>
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt='Author Photo'
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? '0px'
                : borderStyle === BorderStyles.CIRCLE
                  ? '9999px'
                  : '10%',
          }}
          className='aspect-square object-cover'
        />
      )}

      <div className='space-y-2 5'>
        <div className='space-y-1'>
          <p className='text-3xl font-bold' style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p className='font-medium' style={{ color: colorHex }}>
            {jobTitle}
          </p>
          <p className='text-xs text-gray-500'>
            {city} {city && country ? ', ' : ''}
            {country}
            {(city || country) && (phone || email) ? ' • ' : ''}
            {[phone, email].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>
    </div>
  )
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData

  if (!summary) return null

  return (
    <>
      <hr className='border-2' style={{ borderColor: colorHex }} />
      {/* break-inside-avoid is used to avoid breaking the content inside the div  */}
      <div className='space-y-3 break-inside-avoid'>
        <p className='text lg font-semibold' style={{ color: colorHex }}>
          Professional Profile
        </p>
        <div className='whitespace-pre-line text-sm'>{summary}</div>
      </div>
    </>
  )
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData

  const workExperiencesNotEmpty = workExperiences?.filter(
    edu => Object.values(edu).filter(Boolean).length > 0,
  )
  if (!workExperiencesNotEmpty?.length) return null

  return (
    <>
      <hr className='border-2' style={{ borderColor: colorHex }} />
      <div className='space-y-3'>
        <p className='text-lg font-semibold' style={{ color: colorHex }}>
          Work Experience
        </p>
        {workExperiencesNotEmpty.map((edu, index) => (
          <div key={index} className='break-inside-avoid space-y-1'>
            <div
              className='flex items-center justify-between text-sm font-semibold'
              style={{ color: colorHex }}
            >
              <span>{edu.position}</span>
              {edu.startDate && (
                <span className='text-xs'>
                  {formatDate(edu.startDate, 'MMM yyyy')} -{' '}
                  {edu.endDate
                    ? formatDate(edu.endDate, 'MMM yyyy')
                    : 'Present'}{' '}
                </span>
              )}
            </div>
            <p className='text-xs font-semibold'>{edu.company}</p>
            <ul className='whitespace-pre-line text-xs list-disc pl-6'>
              {edu.description
                ?.split('\n')
                .filter(Boolean)
                .map((line, index) => (
                  <li key={index}>
                    {/* {" • "} */}
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData

  const educationsNotEmpty = educations?.filter(
    edu => Object.values(edu).filter(Boolean).length > 0,
  )

  if (!educationsNotEmpty?.length) return null

  return (
    <>
      <hr className='border-2' style={{ borderColor: colorHex }} />
      <div className='space-y-3'>
        <p className='text-lg font-semibold' style={{ color: colorHex }}>
          Work Experience
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className='break-inside-avoid space-y-1'>
            <div
              className='flex items-center justify-between text-sm font-semibold'
              style={{ color: colorHex }}
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span className='text-xs'>
                  {formatDate(edu.startDate, 'MMM yyyy')}
                  {edu.endDate
                    ? `- ${formatDate(edu.endDate, 'MMM yyyy')}`
                    : ''}
                </span>
              )}
            </div>
            <p className='text-xs font-semibold'>{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData

  if (!skills?.length) return null

  return (
    <>
      <hr className='border-2' style={{ borderColor: colorHex }} />
      <div className='break-inside-avoid space-y-3'>
        <p className='text-lg font-semibold' style={{ color: colorHex }}>
          Skills
        </p>
        <div className='flex break-inside-avoid flex-wrap gap-2'>
          {skills.map((skill, index) => (
            <Badge
              className='bg-black text-white hover:bg-black'
              style={{
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? '0px'
                    : borderStyle === BorderStyles.CIRCLE
                      ? '9999px'
                      : '8px',
                backgroundColor: colorHex,
              }}
              key={index}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  )
}
