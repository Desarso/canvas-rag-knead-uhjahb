import os
import urllib.request
from bs4 import BeautifulSoup

def download_and_save_text(url: str, output_file: str, class_number: str):
    folder_path = os.path.join(os.getcwd(), "data", class_number)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created.")
    else:
        print(f"Folder '{folder_path}' already exists.")

    response = urllib.request.urlopen(url)
    content_type = response.headers.get('Content-Type')  #pdf check

    if 'pdf' in content_type.lower(): #download pdf else parse html for text
        pdf_path = os.path.join(folder_path, output_file + ".pdf")
        with open(pdf_path, 'wb') as pdf_file:
            pdf_file.write(response.read())
        print(f"PDF has been downloaded and saved to {pdf_path}")
    else:
        web_content = response.read()
        soup = BeautifulSoup(web_content, 'html.parser')
        
        text_file_path = os.path.join(folder_path, output_file + ".txt") #folder
        
        with open(text_file_path, "w", encoding="utf-8") as f: #write to file
            for data in soup.find_all("p"):
                text = data.get_text()
                f.write(text + "\n") 
        
        print(f"Text has been extracted and saved to {text_file_path}") 

# Example usage: Pass the URL, desired output file name, and class number
#download_and_save_text("https://www.geeksforgeeks.org/grep-command-in-unixlinux/?ref=leftbar-rightbar", "test1", "class123")
