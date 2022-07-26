from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(BaseModel):
    name: str
    user_id: int


class CategoryInDB(CategoryBase):
    user_id: int
    id: int  # noqa

    class Config:
        orm_mode = True
