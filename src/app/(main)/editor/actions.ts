'use server'

import prisma from '@/lib/prisma'
import { resumeSchema, ResumeValues } from '@/lib/validation'
import { auth } from '@clerk/nextjs/server'
import { del, put } from '@vercel/blob'
import path from 'path'

export async function saveResume(values: ResumeValues) {
  const { id } = values
  console.log('Values ', values)

  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values)

  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }
  // TODO : Check resume count for non premium users

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id } })
    : null

  if (id && !existingResume) {
    throw new Error('Resume not found')
  }

  //Uploading photo to blob
  // Undefined - No photo uploded and Null means photo deleted
  let photoUrl: string | undefined | null = undefined

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }

    const { url } = await put(
      `resume-photos/${path.extname(photo.name)}`,
      photo,
      {
        access: 'public',
      },
    )
    photoUrl = url
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }

    photoUrl = null
  }

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl,
        workExperiences: {
          deleteMany: {}, // Delete all workExperiences
          create: workExperiences?.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })), // Create new workExperiences
        },
        educations: {
          deleteMany: {},
          create: educations?.map(edu => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    })
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        photoUrl,
        userId,
        workExperiences: {
          create: workExperiences?.map(exp => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map(edu => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    })
  }
}
