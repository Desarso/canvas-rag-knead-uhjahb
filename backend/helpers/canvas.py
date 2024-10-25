# Import the Canvas class
from canvasapi import Canvas
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests
import os

load_dotenv()



# # Canvas API URL

# # Canvas API key
API_KEY = os.getenv("CANVAS_API")


class CanvasHelper:

    API_URL = "https://csus.instructure.com"

    @staticmethod
    def download_files_from_course(id: str):
        base_directory = '../data'
        
        if not os.path.exists(base_directory):
            os.makedirs(base_directory)
        
        course_directory = os.path.join(base_directory, id)
        
        if not os.path.exists(course_directory): # Create a folder for the course if it doesn't exist
            os.makedirs(course_directory)
            print(f"Folder created for course: {id}")
        else:
            print(f"Folder for course {id} already exists")
            return
        files = CanvasHelper.get_files_from_course(id, API_KEY)        
        session = canvas._Canvas__requester._session # authorize the download w/ canvas api
        
        for file in files:
            file_path = os.path.join(course_directory, file['display_name'])
            response = session.get(file['url'], stream=True)
            
            if response.status_code == 200:
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded: {file['display_name']}")
            else:
                print(f"Failed to download {file['display_name']}")

                

    ##get's all enrolled courses from api key
    @staticmethod
    def get_favorite_courses(api_key: str):
        canvas = Canvas(CanvasHelper.API_URL, api_key)
        user = canvas.get_user('self')
        courses = user.get_courses(enrollment_status='active',include =['favorites'])
        favorite_courses=[]
        for course in courses:
            if hasattr(course, 'name'):
                if course.is_favorite:
                    favorite_courses.append(course)
                    
        return favorite_courses
    
    @staticmethod
    def get_courses_for_frontend(api_key: str):
        courses = CanvasHelper.get_favorite_courses(api_key)
        parsed = []
        for course in courses:
            parsed.append({
                "course_id": course.id,
                "course_name": course.name,
            })
        return parsed
    

    @staticmethod
    def get_files_from_course(id: str, api_key):
        canvas = Canvas(CanvasHelper.API_URL, api_key)
        course = canvas.get_course(id)
        files = course.get_files()
        parsed_files = []
        for file in files:
            parsed_files.append({
                "file_id": file.id,
                "display_name": file.display_name,
                "url": file.url
            })
        return parsed_files
    
    @staticmethod
    def get_module_text_from_course(course_id: str, api_key):
        canvas = Canvas(CanvasHelper.API_URL, api_key)
        course = canvas.get_course(course_id)
        modules = course.get_modules()
        headers = {'Authorization': f'Bearer {api_key}'}
        index = 1

        # Ensure the folder structure exists
        folder_path = os.path.join(os.getcwd(), "../data", str(course.id))
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"Folder '{folder_path}' created.")
        else:
            print(f"Folder '{folder_path}' already exists.")

        for module in modules:
            items = module.get_module_items()
            #print("MODULE: ", index, module.name)
            index += 1
            for item in items:
                #print("     ", item, item.type)
                if item.type == "Page":
                    #print("url:", item.url)
                    try:
                        # Fetch the page content using the item's URL
                        response = requests.get(item.url, headers=headers)
                        response.raise_for_status()  # Check for any request errors

                        # Assuming the response is in JSON and contains the 'body' field
                        json_data = response.json()
                        if 'body' in json_data:
                            # Extract HTML content from the 'body'
                            text_html = json_data['body']
                            soup = BeautifulSoup(text_html, 'html.parser')
                            text = soup.get_text()

                            # Prepare the file name by cleaning the item title (remove special characters)
                            name = item.title.replace("/", "_")  # Avoid invalid characters in filenames
                            text_file_path = os.path.join(folder_path, f"{name}.txt")

                            # Write the text content to a file in the specified folder
                            with open(text_file_path, "w", encoding="utf-8") as f:
                                f.write(f"Title: {item.title}\n\n")
                                f.write(text)

                            print("File Saved")
                        else:
                            print(f"No 'body' found in the JSON response for {item.title}")

                    except requests.exceptions.RequestException as e:
                        print(f"Error fetching URL: {e}")


#testmodule = CanvasHelper.get_module_text_from_course('124752', API_KEY)

#print(testmodule)

##for testing
"""canvas = Canvas(CanvasHelper.API_URL, API_KEY)

courses = CanvasHelper.get_favorite_courses(API_KEY)
course = courses[0]
print(course)
#files = CanvasHelper.get_files_from_course(course.id, API_KEY)
#print(files)
modules = course.get_modules()
items = modules[0].get_module_items()
#print(items[0])

CanvasHelper.download_files_from_course('122492')
print("done") """

"""index = 1
for module in modules:
    items = module.get_module_items()
    print("MODULE: ",index, module.name)
    index+=1
    for item in items:
        print("     ",item, item.type)
        if hasattr(item, 'url'):
            print("     url: ", item.url)
        if item.type == "File":
            print("     ", item.__dict__)
            file = canvas.get_file(item.content_id)
            file.download(f"../files/{item.title}")
            break
        if item.type == "ExternalUrl" :
            print("     url:",item.external_url)"""
## possible workflow for module items, we fetch all the items
##save file types
##the ones that have url params we fetch json, feed it to an ell function to get only relevant data
##then save response as a file
##for external links we can either ignore, or we can fetch the url to the website,
##extract only images and text, use the groq's llama image model to describe all images
##then save that as it's own file
