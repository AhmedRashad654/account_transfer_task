from django.urls import path
from .views import AccountListView,AddAccount,AccountDetailsView,CreateTransfer,TransfersListView,UploadCSV,AccountListViewForSelect

urlpatterns = [
    path('add', AddAccount.as_view(), name='add_account'), 
    path('uploadCSV', UploadCSV.as_view(), name='uploadCSV'),
    path('', AccountListView.as_view(), name='view_account'), 
    path('select', AccountListViewForSelect.as_view(), name='view_account_for_select'), 
    path('<int:account_id>', AccountDetailsView.as_view(), name='account_detail'),
    path('creareTranfer', CreateTransfer.as_view(), name='create_transfer'),
    path('viewTransfer', TransfersListView.as_view(), name='view_transfer'),
]
