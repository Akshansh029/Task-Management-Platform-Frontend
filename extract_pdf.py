import PyPDF2
import sys

try:
    pdf_path = r'e:\Dev_Projects\task-management-platform-frontend\Frontend_PRD_TaskManager.pdf'
    with open(pdf_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        
        # Save to file
        with open('prd_content.txt', 'w', encoding='utf-8') as output:
            output.write(text)
        
        print(text)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
