from rest_framework import serializers
from .models import Account,Transaction


class AccountSerializers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class TransactionSerializers(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    receiver_name = serializers.CharField(source='receiver.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'timestamp', 'sender_name', 'receiver_name']

class AccountSerializersForSelect(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name']
