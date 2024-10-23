# Import the Canvas class
from canvasapi import Canvas
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()



# # Canvas API URL

# # Canvas API key
API_KEY = os.getenv("CANVAS_API")

 
class CanvasHelper:

    API_URL = "https://csus.instructure.com"

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




##for testing
canvas = Canvas(CanvasHelper.API_URL, API_KEY)

courses = CanvasHelper.get_favorite_courses(API_KEY)
course = courses[0]
print(course)
#files = CanvasHelper.get_files_from_course(course.id, API_KEY)
#print(files)
modules = course.get_modules()
items = modules[0].get_module_items()
#print(items[0])

CanvasHelper.download_files_from_course('122492')
print("done")

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
