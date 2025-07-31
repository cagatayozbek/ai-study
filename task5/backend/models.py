from pydantic import BaseModel

class CodeRequest(BaseModel):
    code: str
    model: str = "llama3"
    remember_context: bool = False
    previous_summary: str = ""
