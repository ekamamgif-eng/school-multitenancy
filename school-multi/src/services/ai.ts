import { AIExtractedData, MeetingAIAnalysis } from '../types'

// Mock AI service - replace with actual OpenAI integration
export const processPaymentWithAI = async (imageUrl: string): Promise<AIExtractedData> => {
  void imageUrl
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock AI response
  const mockResponse: AIExtractedData = {
    amount: { value: 1500000, confidence: 0.95 },
    transfer_date: { value: '2024-01-15', confidence: 0.88 },
    destination_account: { value: '1234567890', confidence: 0.75 },
    sender_name: { value: 'John Doe', confidence: 0.60 },
    overall_confidence: 0.85
  }

  return mockResponse
}

export const processMeetingAudio = async (audioFile: File): Promise<MeetingAIAnalysis> => {
  void audioFile
  // Mock meeting processing
  await new Promise(resolve => setTimeout(resolve, 3000))

  return {
    transcription: "Mock transcription of meeting discussion...",
    action_items: [
      { task: "Complete budget report", owner: "John", deadline: "2024-01-20" },
      { task: "Schedule parent meeting", owner: "Sarah", deadline: "2024-01-25" }
    ],
    decisions: [
      "Approved new curriculum for next semester",
      "Budget allocated for computer lab upgrade"
    ],
    topics: ["Budget", "Curriculum", "Facilities"],
    overall_confidence: 0.90
  }
}