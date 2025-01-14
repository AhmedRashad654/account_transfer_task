from django.db import models
class Account(models.Model):
    name = models.CharField(max_length=150)
    balance = models.DecimalField(max_digits=10,decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True) 
    

    def __str__(self):
        return self.name
    
class Transaction(models.Model):
    sender = models.ForeignKey(Account, related_name='sent_transactions',on_delete=models.CASCADE)  
    receiver = models.ForeignKey(Account, related_name='received_transactions',on_delete=models.CASCADE)   
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"From {self.sender} to {self.receiver} - {self.amount}"

