"""empty message

Revision ID: 849def24bf6c
Revises: 5aadf6bd0f99
Create Date: 2021-12-01 02:55:56.299368

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '849def24bf6c'
down_revision = '5aadf6bd0f99'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('verification_code', sa.String(length=10), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'verification_code')
    # ### end Alembic commands ###
