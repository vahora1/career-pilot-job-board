from io import BytesIO

from pypdf import PdfReader
from docx import Document


def extract_docx_text(data: bytes) -> str:
    document = Document(BytesIO(data))

    parts = []

    # ---------------------------------------------------------
    # 1. Normal DOCX paragraphs
    # ---------------------------------------------------------
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            parts.append(text)

    # ---------------------------------------------------------
    # 2. DOCX tables
    # ---------------------------------------------------------
    def extract_table(table):
        table_parts = []

        for row in table.rows:
            row_parts = []

            for cell in row.cells:
                cell_parts = []

                # Paragraphs inside the cell
                for paragraph in cell.paragraphs:
                    text = paragraph.text.strip()

                    if text:
                        cell_parts.append(text)

                # Nested tables inside the cell
                for nested_table in cell.tables:
                    nested_text = extract_table(nested_table)

                    if nested_text:
                        cell_parts.append(nested_text)

                if cell_parts:
                    row_parts.append("\n".join(cell_parts))

            if row_parts:
                table_parts.append(" | ".join(row_parts))

        return "\n".join(table_parts)

    for table in document.tables:
        table_text = extract_table(table)

        if table_text:
            parts.append(table_text)

    # ---------------------------------------------------------
    # Clean up
    # ---------------------------------------------------------
    text = "\n".join(parts)

    # Remove excessive blank lines
    lines = [line.strip() for line in text.splitlines()]

    cleaned_lines = []
    previous_blank = False

    for line in lines:
        if not line:
            if not previous_blank:
                cleaned_lines.append("")
            previous_blank = True
        else:
            cleaned_lines.append(line)
            previous_blank = False

    return "\n".join(cleaned_lines).strip()


def extract_text(data: bytes, suffix: str) -> str:
    suffix = suffix.lower().strip()

    if not suffix.startswith("."):
        suffix = "." + suffix

    # ---------------------------------------------------------
    # TXT
    # ---------------------------------------------------------
    if suffix == ".txt":
        return data.decode("utf-8", errors="replace").strip()

    # ---------------------------------------------------------
    # PDF
    # ---------------------------------------------------------
    if suffix == ".pdf":
        reader = PdfReader(BytesIO(data))

        pages = []

        for page in reader.pages:
            page_text = page.extract_text() or ""

            if page_text.strip():
                pages.append(page_text.strip())

        return "\n\n".join(pages).strip()

    # ---------------------------------------------------------
    # DOCX
    # ---------------------------------------------------------
    if suffix == ".docx":
        return extract_docx_text(data)

    raise ValueError(f"Unsupported file type: {suffix}")