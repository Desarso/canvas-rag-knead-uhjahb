# Import the Canvas class
from canvasapi import Canvas
from datetime import datetime
from dotenv import load_dotenv
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
        })
    return parsed_files

courses = get_favorite_courses()
course = courses[0]
modules = course.get_modules()
items = modules[0].get_module_items()
print(items[0].__dict__)

# for item in items:
#     print(module.__dict__)

