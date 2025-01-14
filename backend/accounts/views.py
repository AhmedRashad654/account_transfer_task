import csv
from rest_framework.views import APIView
from .serializers import AccountSerializers, TransactionSerializers,AccountSerializersForSelect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser
from .models import Account,Transaction
from decimal import Decimal, InvalidOperation


# Add Account
class AddAccount(APIView):
    def post(self,request):
        serializer = AccountSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"account created successfully", "data":serializer.data},status=201)
        return Response(serializer.errors,status=400)
    

# upload cvs to model Account
class UploadCSV(APIView):
    parser_classes=[MultiPartParser]
    def post(self,request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not file.name.endswith('.csv'):
            return Response({"error": "only cvs files are allowed"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            required_fields = ['Name', 'Balance']
            if not all(field in reader.fieldnames for field in required_fields):
                return Response({"error": "csv file must contain the following columns: Name,Balance"}, status=status.HTTP_400_BAD_REQUEST)
            
            accounts = []
            for row in reader:
                name = row.get('Name')
                balance = row.get('Balance')

                if not name or not balance:
                    return Response({"error": "Invalid data in row: name or balance is empty"}, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    balance = Decimal(balance)  
                except InvalidOperation:
                    return Response({"error": "Invalid balance value in row"}, status=status.HTTP_400_BAD_REQUEST)
                accounts.append(Account(name=name, balance=balance))
            Account.objects.bulk_create(accounts)
            return Response({"message": f"{len(accounts)} accounts added successfully!"}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

# get All Account 
class AccountListView(APIView):
    def get(self,request):
        accounts = Account.objects.all().order_by('-timestamp')    
        paginator = PageNumberPagination()
        paginator.page_size = 20
        paginated_accouts = paginator.paginate_queryset(accounts,request)
        serializer = AccountSerializers(paginated_accouts,many=True) 
        return paginator.get_paginated_response(serializer.data)
        

# get All Account not pagination for select
class AccountListViewForSelect(APIView):
    def get(self,request):
          accounts = Account.objects.all().values('id', 'name').order_by('-timestamp')
          serializer = AccountSerializersForSelect(accounts, many=True)
          return Response({'results':serializer.data},status=status.HTTP_200_OK)
        
# get Details Account  
class AccountDetailsView(APIView):
    def get(self,request,account_id):
        try:
            account= Account.objects.get(id=account_id)
            serializer = AccountSerializers(account)
            return Response(serializer.data)
        except Account.DoesNotExist:
            return Response({'error':'account not found'}, status = status.HTTP_404_NOT_FOUND)

# create Transfer Between Two Account
class CreateTransfer(APIView):
    def post(self,request):

        serializer = TransactionSerializers(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        sender_id = request.data.get('sender')
        receiver_id = request.data.get('receiver')
        amount = Decimal(request.data.get('amount'))
        if sender_id == receiver_id :
            return Response({"error":"can't transfer to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try: 
            sender = Account.objects.get(pk=sender_id)
            receiver = Account.objects.get(pk=receiver_id)

            if sender.balance <amount:
                return Response({"error":"balance not enough"}, status=status.HTTP_400_BAD_REQUEST)
             
            sender.balance -=amount
            receiver.balance +=amount
            sender.save()
            receiver.save()
            transaction = Transaction.objects.create(sender=sender,receiver=receiver,amount=amount)
            transaction_serializer = TransactionSerializers(transaction)
            return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
        except  Exception as e :
            return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# get all Transfers
class TransfersListView(APIView):
    def get(self,request):
        transfers = Transaction.objects.all().order_by('-timestamp')   
        paginator = PageNumberPagination()
        paginator.page_size = 20
        paginated_transfers = paginator.paginate_queryset(transfers,request)
        serializer = TransactionSerializers(paginated_transfers,many=True) 
        return paginator.get_paginated_response(serializer.data)
        
