'use server'

import genAI from '@/lib/gemini'
import model from '@/lib/gemini'
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from '@/lib/validation'

export async function generateSummary(input: GenerateSummaryInput) {
  // TODO : Check if user is premium

  const { jobTitle, educations, workExperiences, skills } =
    generateSummarySchema.parse(input)

  const systemMessage = `
  You are a job resume generator AI. Your task is to write a professional introduction summary for a resume based on the user's provided data.
  Only return the summary and do not include any other information. Keep it concise and professional.
  `

  const userMessage = `
  Please generate a professional resume summary from this data:
  Job Title: ${jobTitle || 'N/A'}
  Work Experience : 
  ${workExperiences
    ?.map(exp => {
      return `Position: ${exp.position || 'N/A'}, Company: ${exp.company || 'N/A'}, Start Date: ${exp.startDate || 'N/A'}, End Date: ${exp.endDate || 'N/A'}, Description: ${exp.description || 'N/A'}`
    })
    .join('\n')}
  Education :
  ${educations
    ?.map(edu => {
      return `Degree: ${edu.degree || 'N/A'}, School: ${edu.school || 'N/A'}, Start Date: ${edu.startDate || 'N/A'}, End Date: ${edu.endDate || 'N/A'}`
    })
    .join('\n')}
  Skills : ${skills}
  `

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemMessage,
  })

  const completion = await model.generateContent(userMessage)

  if (!completion.response) {
    throw new Error('Failed to generate AI response')
  }

  return completion.response.text()
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // TODO : Check if user is premium

  const { description } = generateWorkExperienceSchema.parse(input)

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience description based on the user's provided data.
  Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones

  Job title: <job title>
  Company: <company name>
  Start Date: <format: YYYY-MM-DD> (Only if provided)
  End Date: <format: YYYY-MM-DD> (Only if provided)
  Description: <an optimized description with each line seperated by new line, might be infered from job title>
  `

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemMessage,
  })

  const completion = await model.generateContent(userMessage)
  if (!completion.response) {
    throw new Error('Failed to generate AI response')
  }

  const aiResponse = completion.response.text()

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || '',
    company: aiResponse.match(/Company: (.*)/)?.[1] || '',
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || '').trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience
}
