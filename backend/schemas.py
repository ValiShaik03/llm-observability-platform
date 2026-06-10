from pydantic import BaseModel
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    model: str
    template: str | None = None


class PromptTemplateCreate(BaseModel):
    name: str
    version: str
    template: str


class PromptTemplateResponse(BaseModel):
    id: int
    name: str
    version: str
    template: str
    is_active: bool

    class Config:
        from_attributes = True