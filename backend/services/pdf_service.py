from fpdf import FPDF
import io

class PDFGenerator:
    @staticmethod
    def generate_letter_pdf(title: str, letter_text: str, priority: str) -> io.BytesIO:
        # Create PDF document
        pdf = FPDF()
        pdf.add_page()
        pdf.set_margins(20, 20, 20)
        
        # Set styling parameters
        pdf.set_font("Helvetica", "B", 16)
        
        # Color palette (Slate / Navy)
        primary_color = (30, 41, 59)   # Slate 800
        secondary_color = (71, 85, 105) # Slate 600
        priority_colors = {
            "high": (239, 68, 68),     # Rose 500
            "medium": (245, 158, 11),  # Amber 500
            "low": (16, 185, 129)      # Emerald 500
        }
        accent_color = priority_colors.get(priority.lower(), (71, 85, 105))
        
        # Title Header
        pdf.set_text_color(*primary_color)
        pdf.cell(0, 10, "FORMIFY COMPLAINT DOSSIER", ln=True, align="L")
        
        # Line Separator
        pdf.set_draw_color(*secondary_color)
        pdf.set_line_width(0.5)
        pdf.line(20, 32, 190, 32)
        pdf.ln(8)
        
        # Metadata Card
        pdf.set_fill_color(248, 250, 252) # Slate 50
        pdf.rect(20, 35, 170, 15, style="F")
        pdf.set_xy(22, 38)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*secondary_color)
        pdf.cell(30, 10, "DOCUMENT TYPE:")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*primary_color)
        pdf.cell(50, 10, "Official Complaint Letter")
        
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*secondary_color)
        pdf.cell(20, 10, "PRIORITY:")
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*accent_color)
        pdf.cell(30, 10, priority.upper())
        
        pdf.ln(12)
        pdf.set_x(20)
        
        # Letter Body
        pdf.set_font("Times", "", 11.5)
        pdf.set_text_color(15, 23, 42) # Slate 900
        
        # Handle text lines
        lines = letter_text.split("\n")
        for line in lines:
            if not line.strip():
                pdf.ln(4)
            else:
                pdf.multi_cell(0, 5.5, line)
        
        # Footer branding
        pdf.set_y(-25)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(148, 163, 184) # Slate 400
        pdf.cell(0, 10, "Generated via Formify - Automated Consumer Empowerment", align="C")
        
        # Write to byte stream
        pdf_bytes = io.BytesIO()
        pdf_data = pdf.output()
        pdf_bytes.write(pdf_data)
        pdf_bytes.seek(0)
        return pdf_bytes
