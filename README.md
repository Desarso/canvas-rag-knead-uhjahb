
# Interview GPT

A very simple chatbot app, using reactjs, tailwinds and fastapi.


## Preview



https://github.com/user-attachments/assets/fa8aca59-18b9-431a-ac3d-f927ae294039



## How to run

Frontend and backend are in seperate folders

### Frontend

From frontend folder

    npm install
    npm run start

### Backend

From backend folder

Peferably create a virtual python enviroment

    python -m venv venv

Activate the enviroment 

Windows: 

    .\venv\Scripts\activate

Linux/Mac:

    source venv/bin/activate

Install packages:

    pip install python-dotenv
    pip install canvasapi
    pip install llama-index
    pip install fastapi
    pip install openai
    pip install uvicorn

Rename .env.example to .env and add your api keys

    CANVAS_API=
    GROQ_API_KEY=

Run the backend:

    python index.py











