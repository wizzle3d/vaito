"""empty message

Revision ID: 6000b1d5a061
Revises: 081a8ccd1989
Create Date: 2021-11-30 20:25:48.511534

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6000b1d5a061'
down_revision = '081a8ccd1989'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'bank_account_no')
    op.drop_column('user', 'bank_name')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('bank_name', sa.VARCHAR(length=20), autoincrement=False, nullable=True))
    op.add_column('user', sa.Column('bank_account_no', sa.VARCHAR(length=20), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
