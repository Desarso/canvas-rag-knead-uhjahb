---

# 🧭 Compass for Canvas

**Fall 2024 AI Hackathon Project by Team Knead Uhjahb**

**Compass** is an AI-driven web application that helps students quickly find specific information from their Canvas courses, addressing the problem of *knowledge bottlenecks*. By integrating a full Retrieval-Augmented Generation (RAG) system, Compass offers accurate, context-aware responses, simplifying the process of studying and reviewing course materials.

---

## 🚀 Project Overview

### Problem Space

Students often face the challenge of locating specific course information amidst extensive lecture notes and textbooks. This can result in time wasted and hindered academic progress.

### Solution Space

Compass addresses these issues by providing:
- **Reduced AI Hallucinations**: Accurate answers sourced directly from course materials.
- **Fast and Relevant Responses**: Saves time by pinpointing information students need most.
- **User-Friendly Interface**: Seamless and easy to navigate.
- **Canvas Integration**: Direct connection to Canvas courses for optimized user experience.

## 💡 How It Works

Compass leverages the following technologies to create an efficient and accurate information retrieval system:

- **Retrieval-Augmented Generation (RAG)**: Combining generative AI with retrieval capabilities to ensure relevant, specific responses.
- **Key Components**:
  - **Llama-Index**: Supports structured data retrieval.
  - **Groq**: Enhances processing efficiency.
  - **Canvas API**: Provides direct integration with Canvas courses.
  - **React & FastAPI**: A modern, robust tech stack to power the front and back end.
  - **Python**: Core language for system integration and processing.

## ✅ Validation

Our model has undergone extensive testing to ensure that it:
- Only answers relevant questions.
- Utilizes information directly from course materials to avoid AI hallucinations.
- Delivers concise, accurate responses quickly, helping students study effectively.

## 📈 Impact & Benefits

With Compass, students can:
- Find course information faster than traditional study methods.
- Engage in interactive learning experiences through back-and-forth queries.
- Save valuable study time with auto-generated summaries.

---

### Preview



---

## 🛠️ How to Run

The frontend and backend are located in separate folders.

### Frontend

From the `frontend` folder, run:

```bash
npm install
npm run start
```

### Backend

From the `backend` folder, follow these steps:

1. Preferably, create a virtual Python environment:

    ```bash
    python -m venv venv
    ```

2. Activate the environment:

   - **Windows**:
      ```bash
      .\venv\Scripts\activate
      ```
   - **Linux/Mac**:
      ```bash
      source venv/bin/activate
      ```

3. Install required packages:

    ```bash
    pip install python-dotenv canvasapi llama-index fastapi openai uvicorn
    ```

4. Rename `.env.example` to `.env` and add your API keys:

    ```
    CANVAS_API=
    GROQ_API_KEY=
    ```

5. Run the backend:

    ```bash
    python index.py
    ```

---

## 👥 Meet the Team

- **Gabriel Malek** - Programmer
- **William Lorence** - Software Engineer
- **Kevin Esquivel** - Developer
- **Rahul Gupta** - Coder

---

### Join us on our journey to redefine academic study tools and make learning more accessible!

--- 
