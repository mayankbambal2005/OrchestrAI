import os


def read_pdf(file_path: str) -> str:
    """Extract text from a PDF file using PyPDF2."""
    try:
        import PyPDF2
        if not os.path.exists(file_path):
            return f"File not found: {file_path}"

        text = []
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text.append(page.extract_text() or "")
        return "\n".join(text)[:5000]  # cap at 5000 chars
    except ImportError:
        return "PyPDF2 not installed. Run: pip install PyPDF2"
    except Exception as e:
        return f"PDF read error: {str(e)}"
