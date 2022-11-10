"""change amount type

Revision ID: 00011
Revises: 00010
Create Date: 2022-11-11 01:26:47.398055

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "00011"
down_revision = "00010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("operations", "amount", type_=sa.DECIMAL(15, 2))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("operations", "amount", type_=sa.Float)
    # ### end Alembic commands ###
