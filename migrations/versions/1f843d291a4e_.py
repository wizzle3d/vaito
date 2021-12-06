"""empty message

Revision ID: 1f843d291a4e
Revises: c7dc225af22a
Create Date: 2021-11-29 17:01:47.186382

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f843d291a4e'
down_revision = 'c7dc225af22a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('card', sa.Column('status', sa.String(length=30), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('card', 'status')
    # ### end Alembic commands ###
