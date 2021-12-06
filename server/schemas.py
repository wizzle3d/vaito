from server import ma


class UserWithdrawalSchema(ma.Schema):
    class Meta:
        fields = ('amount', 'id', 'date_posted', 'status')


class CategorySchema(ma.Schema):
    class Meta:
        fields = ('id', 'rate', 'currency', 'issuer', 'card_type')


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


class CardSchema(ma.Schema):
    category = ma.Nested(CategorySchema)
    class Meta:
        fields = ('id', 'image_file', 'at_rate', 'date_posted', 'status', 'category', 'date_posted', 'amount')


card_schema = CardSchema()
cards_schema = CardSchema(many=True)


class UserSchema(ma.Schema):
    withdrawals = ma.Nested(UserWithdrawalSchema(many=True))
    cards = ma.Nested(CardSchema(many=True))
    class Meta:
        fields = ('id', 'email', 'firstname', 'lastname', 'profile_pic', 'email_verified', 'admin',
                  'balance', 'withdrawals', 'bank_name', 'bank_account_no', 'cards')


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class AdminSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'firstname', 'lastname', 'admin')


admin_schema = AdminSchema()
admin_schemas = AdminSchema(many=True)




class WithdrawalSchema(ma.Schema):
    user = ma.Nested(UserSchema())
    class Meta:
        fields = ('amount', 'id', 'date_posted', 'user', 'status')


withdrawal_schema = WithdrawalSchema()
withdrawals_schema = WithdrawalSchema(many=True)