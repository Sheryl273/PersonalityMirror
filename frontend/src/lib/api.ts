import type { AnalyzeResponse, TimelineResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || ''

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  console.log('API URL:', API_URL)
  console.log('Request:', `${API_URL}${path}`, init)
  
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  console.log('Response status:', res.status, res.statusText)
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('API Error Response:', text)
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }

  return (await res.json()) as T
}

export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Test connection failed:', error)
    return false
  }
}

export async function analyzeText(text: string, voiceTranscript?: string): Promise<AnalyzeResponse> {
  try {
    return apiFetch<AnalyzeResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice_transcript: voiceTranscript || undefined,
      }),
    })
  } catch (error) {
    console.error('Full error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

export async function fetchTimeline(limit = 30): Promise<TimelineResponse> {
  const url = `/timeline?limit=${encodeURIComponent(String(limit))}`
  return apiFetch<TimelineResponse>(url)
}

