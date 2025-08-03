import axios from 'axios';

const apiKey = import.meta.env.VITE_TRANSCRIPT_API_KEY;

export async function getTranscript(url) {
  try {
    const response = await axios.get(`https://api.scrapecreators.com/v1/tiktok/video/transcript?url=${url}`, {
      headers: { "x-api-key": apiKey }
    });
    const data = response.data;
    // Parse the transcript JSON string if present
    let transcriptText = '';
    if (data && data.transcript) {
      // If transcript is a JSON string, parse it
      let transcriptRaw = data.transcript;
      if (typeof transcriptRaw === 'string') {
        // Check if it's WEBVTT format
        if (transcriptRaw.trim().startsWith('WEBVTT')) {
          // Split by lines, filter out timestamps and empty lines
          transcriptText = transcriptRaw
            .split('\n')
            .filter(line =>
              line.trim() && // not empty
              !/^WEBVTT/.test(line) &&
              !/^\d{2}:\d{2}:\d{2}\./.test(line.trim()) && // not a timestamp
              !/^-->.*/.test(line.trim()) // not an arrow line
            )
            .join(' ');
        } else {
          // Try to parse as JSON with utterances (old format)
          try {
            const transcriptObj = JSON.parse(transcriptRaw);
            if (transcriptObj.utterances && Array.isArray(transcriptObj.utterances)) {
              transcriptText = transcriptObj.utterances.map(u => u.text).join(' ');
            }
          } catch (e) {
            // Not JSON, just return as is
            transcriptText = transcriptRaw;
          }
        }
      } else if (typeof transcriptRaw === 'object' && transcriptRaw.utterances) {
        transcriptText = transcriptRaw.utterances.map(u => u.text).join(' ');
      }
    }
    console.log('Transcript fetched successfully:', transcriptText);
    return transcriptText;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}