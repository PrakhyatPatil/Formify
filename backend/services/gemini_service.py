import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        # The client will automatically use GEMINI_API_KEY from environment
        self.client = genai.Client()
        self.model_name = "gemini-2.5-flash"

    def generate_complaint_letter(self, description: str, priority: str, category: str = None) -> dict:
        """
        Generates a professional complaint letter and a suitable title/subject line based on the user's description.
        """
        category_info = f"Category: {category}\n" if category else ""
        prompt = f"""
You are an expert consumer advocate and formal letter writer.
Generate a professional, firm, yet polite complaint letter based on the user's raw input.

User Description: "{description}"
Priority Level: {priority}
{category_info}
Please construct a formal letter. Include the following sections:
1. Sender Info Placeholders ([Your Name], [Your Address], etc.)
2. Date (use current date or a placeholder)
3. Recipient Info Placeholders ([Recipient/Company Name], [Address])
4. Subject line (clear and concise)
5. Formal Salutation
6. The body of the letter:
   - Clearly state the issue and relevant details.
   - Describe the impact or inconvenience caused.
   - Mention that this has been marked as a {priority} priority issue.
   - Suggest a reasonable resolution (e.g., refund, replacement, service repair).
7. Formal Closing & Signature block.

Also, provide a short, concise, catchy title/subject for this complaint (under 8 words).

Return the output strictly in the following JSON format:
{{
  "title": "Short Title Here",
  "letter_text": "The full formatted formal letter text here. Use clean spacing and formatting."
}}

Do not include any markdown code block wraps (like ```json) in your response. Just return the raw JSON object.
"""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )
            import json
            result = json.loads(response.text)
            return result
        except Exception as e:
            # Fallback in case of API issues
            return {
                "title": f"Complaint regarding {category or 'Service'}",
                "letter_text": f"Dear Customer Support,\n\nI am writing to formally log a complaint regarding the following issue:\n\n{description}\n\nThis is a {priority} priority matter. I look forward to your prompt response and resolution.\n\nSincerely,\n[Your Name]"
            }
