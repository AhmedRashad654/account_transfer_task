from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import Account,Transaction
from decimal import Decimal


# test Add Account
class AccountAddTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.account_data  = {
            "name":"ahmed",
            "balance":1000.00
        }

    def test_add_account(self):
        response = self.client.post('/api/accounts/add',self.account_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"],"account created successfully")

# test import file cvs
class UploadCSVTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.file_data = SimpleUploadedFile("accounts.csv",b"Name,Balance\nahmed,100\nrashad,200",content_type="text/cvs")

    def test_upload_csv(self):
        response = self.client.post('/api/accounts/uploadCSV', {'file': self.file_data}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("accounts added successfully", response.data['message'])
         

# test transfer between two account
class TransferTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sender = Account.objects.create(name="sender", balance=500)
        self.receiver = Account.objects.create(name="receiver", balance=200)
        self.transfer_data = {
            "sender": self.sender.id,
            "receiver": self.receiver.id,
            "amount": 100.0
        }
    
    def test_create_transfer(self):
        response = self.client.post('/api/accounts/creareTranfer', self.transfer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.sender.refresh_from_db()
        self.receiver.refresh_from_db()
        self.assertEqual(self.sender.balance, Decimal(400.0)) 
        self.assertEqual(self.receiver.balance, Decimal(300.0))

#test Accounts List View
class AccountListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        for i in range(50):
            Account.objects.create(name=f"user {i+1}", balance=100 + i)
    
    def test_account_list_pagination(self):
        response = self.client.get('/api/accounts/')
        self.assertEqual(len(response.data['results']), 20)
        first_account = response.data['results'][0]
        self.assertIn(first_account['name'], "user 1")
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data) 

    def test_account_list_pagination_page_2(self):
        response = self.client.get('/api/accounts/?page=2')
        self.assertEqual(len(response.data['results']), 20)
        first_account_in_page_2 = response.data['results'][0]
        self.assertEqual(first_account_in_page_2['name'], "user 21")

# get details Account Test
class AccountDetailsViewTest(TestCase):
    def setUp(self):
        self.account = Account.objects.create(name="ahmed", balance=100.00)
        self.client = APIClient()

    def test_account_details_success(self):
        response = self.client.get(f'/api/accounts/{self.account.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "ahmed")
        self.assertEqual(response.data['balance'], '100.00') 

    def test_account_details_not_found(self):
        response = self.client.get('/api/accounts/33')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'account not found')

# get Transfer list view Test
class TransfersListViewTest(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(name="account 1", balance=1000)
        self.account2 = Account.objects.create(name="account 2", balance=500)
        self.transfer1 = Transaction.objects.create(
            sender=self.account1, receiver=self.account2, amount=100
        )
        self.transfer2 = Transaction.objects.create(
            sender=self.account2, receiver=self.account1, amount=50
        )
        self.client = APIClient()

    def test_transfer_list(self):
        response = self.client.get('/api/accounts/viewTransfer') 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_transfer_list_no_transfers(self):
        Transaction.objects.all().delete()
        response = self.client.get('/api/accounts/viewTransfer') 
        self.assertEqual(len(response.data['results']), 0) 

# get list view accout for select 
class AccountListViewAccountForSelectTest(TestCase):
    def setUp(self):
        self.account1= Account.objects.create(name='ahmed', balance=100)
        self.account2= Account.objects.create(name='ali', balance=200)
        self.client = APIClient()
    def test_account_list_view_select(self):
        response = self.client.get('/api/accounts/select') 
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.data['results'][0]['name'], self.account1.name)
        self.assertEqual(response.data['results'][1]['name'], self.account2.name)

       

        
