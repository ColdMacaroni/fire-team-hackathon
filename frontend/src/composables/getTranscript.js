import axios from 'axios';
require('dotenv').config();

const apiKey = process.env.VITE_TRANSCRIPT_API_KEY;

export async function getTranscript(url) {
  try {
    const response = await axios.get(`https://api.scrapecreators.com/v1/tiktok/video/transcript?url=${url}`, {
      headers: { "x-api-key": apiKey }
    });
    const data = response.data;
    // Parse the transcript JSON string if present
    let transcriptText = '';
    if (data && data.transcript) {
      try {
        const transcriptObj = typeof data.transcript === 'string' ? JSON.parse(data.transcript) : data.transcript;
        if (transcriptObj.utterances && Array.isArray(transcriptObj.utterances)) {
          transcriptText = transcriptObj.utterances.map(u => u.text).join(' ');
        }
      } catch (e) {
        console.error('Error parsing transcript JSON:', e);
      }
    }
    console.log('Transcript fetched successfully:', transcriptText);
    return transcriptText;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}