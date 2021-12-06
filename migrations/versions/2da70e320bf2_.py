"""empty message

Revision ID: 2da70e320bf2
Revises: 
Create Date: 2021-11-29 14:02:43.947267

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2da70e320bf2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('category', 'image')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('category', sa.Column('image', sa.VARCHAR(length=1000), autoincrement=False, nullable=False))
    # ### end Alembic commands ###
