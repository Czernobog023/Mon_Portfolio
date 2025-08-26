
from playwright.sync_api import sync_playwright
import os

def html_to_pdf():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Read HTML file
        with open('/home/user/webapp/CV_Rayan_1page.html', 'r', encoding='utf-8') as file:
            html_content = file.read()
        
        # Load HTML content
        page.set_content(html_content)
        
        # Generate PDF with A4 format
        page.pdf(
            path='/home/user/webapp/CV_Rayan_Maillard.pdf',
            format='A4',
            print_background=True,
            margin={'top': '10mm', 'right': '10mm', 'bottom': '10mm', 'left': '10mm'}
        )
        
        browser.close()
        print('PDF generated successfully!')

html_to_pdf()
