# Import the Canvas class
from canvasapi import Canvas
from datetime import datetime
from dotenv import load_dotenv
import requests
import os

load_dotenv()



# Canvas API URL
API_URL = "https://csus.instructure.com"
# Canvas API key
API_KEY = os.getenv("CANVAS_API")

# Initialize a new Canvas object
canvas = Canvas(API_URL, API_KEY)



user = canvas.get_user('self')
courses = user.get_courses(enrollment_status='active',include =['favorites'])



    

def get_favorite_courses():
    favorite_courses=[]

    for course in courses:
        if hasattr(course, 'name'):
            if course.is_favorite:
                favorite_courses.append(course)
                
    return favorite_courses

def get_courses_for_frontend():
    courses = get_favorite_courses()
    parsed = []
    for course in courses:
        parsed.append({
            "course_id": course.id,
            "course_name": course.name,
        })
    return parsed

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat() 
    if isinstance(obj, object):  
        return str(obj.__dict__)  
    raise TypeError(f"Type {type(obj)} not serializable")


def get_files_from_course(id: str):
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

def download_files_from_course(id: str):
    base_directory = 'data'
    
    if not os.path.exists(base_directory):
        os.makedirs(base_directory)
    
    course_directory = os.path.join(base_directory, id)
    

    if not os.path.exists(course_directory): # Create a folder for the course if it doesn't exist
        os.makedirs(course_directory)
        print(f"Folder created for course: {id}")
    else:
        print(f"Folder for course {id} already exists")
        

    files = get_files_from_course(id)
    
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



courses = get_favorite_courses()

for course in courses:
    print(course.name, course.id, course.is_favorite, sep=" | ")

#download_files_from_course('122492')

#print(courses[1].name, courses[1].id, courses[1].is_favorite, sep=" | ")
modules = courses[1].get_modules()
#items = modules[0].get_module_items()
# print(items[0].__dict__)


#files =  get_files_from_course('122492')
#for file in files: 
#    print(file)


# Set up the headers with the API key
headers = {
    'Authorization': f'Bearer {API_KEY}'
}

index = 1
for module in modules:
    items = module.get_module_items()
    print("MODULE: ", index, module.name)
    index += 1
    for item in items:
        print("     ", item, item.type)
        if hasattr(item, 'url'):
            print("url:", item.url)
            try:
                response = requests.get(item.url, headers=headers)
                response.raise_for_status()  # Check for any request errors
                print("     ", response.json())
            except requests.exceptions.RequestException as e:
                print(f"Error fetching URL: {e}")
        if item.type == "File":
            print("     ", item.__dict__)
            file = canvas.get_file(item.content_id)
            file.download(f"files/{item.title}")
            break
        if item.type == "ExternalUrl":
            print("url:", item.external_url)






"""for module in modules:
    print("MODULE:", module.id, module.name, sep=" | ")
    #print(dir(module))
    #print(module.__dict__)
    items = module.get_module_items()
    body = module.get_module_items()
    #rint(body.get_page())
    #print(body)
    for items in items:
        print(items.id, items.title, items.type, sep=" | ")
        if items.type == "Page":
            #test = items.get_page()
            print(items.url)
            
    #for item in items:
        #print(items.__dict__)
        #if hasattr(items, 'url'):
            #print(items.url)
       # if items.type == "File":
           # print(items.url)"""

#canvas.get_file('6550472')
#file_url = 

