public with sharing class ExpenseController {
    //@AuraEnabled enables client- and server-side access to the controller method
    @AuraEnabled
    public static List<Expense__c> getExpenses() {
        // This returns all the details from Expense Object
        // Perform isAccessible() check here
        return [SELECT Id, Name, Amount__c, Client__c, Date__c,
        Reimbursed__c, CreatedDate FROM Expense__c];
    }
}