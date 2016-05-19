public with sharing class PermissionSetPortalControllers {

  private static List<PermissionSet> AllPermissionSets;

  public static List<ObjectDetailsClass> allObjectsOfOrg;

  private static Set<String> isNotSystemSObjectList;

  private static Set<String> contactsField = new Set<String>();
  private static Set<String> accountField = new Set<String>();

  public static void addSObjNamesToList() {
    System.debug('Exec is in addSObjNamesToList');
    isNotSystemSObjectList = addTotallyAccessibleObjs();
  }

  public static Set<String> addTotallyAccessibleObjs() {
    List<String> objswithNietherObjorFieldPermissions = new List<String>();
    objswithNietherObjorFieldPermissions.add('Accounts');
    // objswithNietherObjorFieldPermissions.add('App Launcher');
    // objswithNietherObjorFieldPermissions.add('Assets');
    //objswithNietherObjorFieldPermissions.add('Campaign Members');
    // objswithNietherObjorFieldPermissions.add('Campaigns');
    // objswithNietherObjorFieldPermissions.add('Cases');
    //objswithNietherObjorFieldPermissions.add('Chatter');
    // objswithNietherObjorFieldPermissions.add('Coaching');
    //objswithNietherObjorFieldPermissions.add('Coaching');
    objswithNietherObjorFieldPermissions.add('Contacts');
    //objswithNietherObjorFieldPermissions.add('Content');
    // objswithNietherObjorFieldPermissions.add('Contracts');
    //objswithNietherObjorFieldPermissions.add('D&B Companies');
    //objswithNietherObjorFieldPermissions.add('Dashboards');
    //objswithNietherObjorFieldPermissions.add('Data.com');
    //objswithNietherObjorFieldPermissions.add('Documents');
    //objswithNietherObjorFieldPermissions.add('Duplicate Record Items');
    // objswithNietherObjorFieldPermissions.add('Duplicate Record Sets');
    // //objswithNietherObjorFieldPermissions.add('Events');
    // objswithNietherObjorFieldPermissions.add('Expenses');
    // objswithNietherObjorFieldPermissions.add('Feedback');
    // objswithNietherObjorFieldPermissions.add('Feedback Questions');
    // objswithNietherObjorFieldPermissions.add('Feedback Question Sets');
    // objswithNietherObjorFieldPermissions.add('Feedback Requests');
    // objswithNietherObjorFieldPermissions.add('Feedback Templates');
    //objswithNietherObjorFieldPermissions.add('Files');
    //objswithNietherObjorFieldPermissions.add('Forecasts');
    //objswithNietherObjorFieldPermissions.add('Global');
    //objswithNietherObjorFieldPermissions.add('Goal Links');
    //objswithNietherObjorFieldPermissions.add('Goals');
    //objswithNietherObjorFieldPermissions.add('Goals');
    //objswithNietherObjorFieldPermissions.add('Groups');
    //objswithNietherObjorFieldPermissions.add('Home');
    //objswithNietherObjorFieldPermissions.add('Ideas');
    // objswithNietherObjorFieldPermissions.add('Leads');
    // //objswithNietherObjorFieldPermissions.add('Libraries');
    // objswithNietherObjorFieldPermissions.add('Macros');
    // //objswithNietherObjorFieldPermissions.add('Metric Data Links');
    // objswithNietherObjorFieldPermissions.add('Metrics');
    // objswithNietherObjorFieldPermissions.add('Opportunities');
    // //objswithNietherObjorFieldPermissions.add('Opportunity Product');
    // //objswithNietherObjorFieldPermissions.add('Order Products');
    // objswithNietherObjorFieldPermissions.add('Orders');
    // //objswithNietherObjorFieldPermissions.add('Outlook');
    // //objswithNietherObjorFieldPermissions.add('People');
    // objswithNietherObjorFieldPermissions.add('Performance Cycles');
    //objswithNietherObjorFieldPermissions.add('Price Book Entries');
    //objswithNietherObjorFieldPermissions.add('Price Books');
    //objswithNietherObjorFieldPermissions.add('Products');
    //objswithNietherObjorFieldPermissions.add('Profile');
    // objswithNietherObjorFieldPermissions.add('Profile Coaching');
    // objswithNietherObjorFieldPermissions.add('Profile Feed');
    // objswithNietherObjorFieldPermissions.add('Profile Feedback');
    // objswithNietherObjorFieldPermissions.add('Profile Goals');
    // objswithNietherObjorFieldPermissions.add('Profile Overview');
    //objswithNietherObjorFieldPermissions.add('Push Topics');
    //objswithNietherObjorFieldPermissions.add('Reports');
    //objswithNietherObjorFieldPermissions.add('Site.com');
    //objswithNietherObjorFieldPermissions.add('Social Personas');
    // objswithNietherObjorFieldPermissions.add('Solutions');
    //objswithNietherObjorFieldPermissions.add('Streaming Channels');
    //objswithNietherObjorFieldPermissions.add('Subscriptions');
    //objswithNietherObjorFieldPermissions.add('Tasks');
    //objswithNietherObjorFieldPermissions.add('User Provisioning Requests');
    //objswithNietherObjorFieldPermissions.add('Users');
    Set<String> valToReturn = new Set<String>(objswithNietherObjorFieldPermissions);
    return valToReturn;
  }

  private static Set<String> addSystemLevelFields() {
    Set<String> fieldsWhichCannotBeAccessible = new Set<String>();
    fieldsWhichCannotBeAccessible.add('id');
    fieldsWhichCannotBeAccessible.add('isdeleted');
    fieldsWhichCannotBeAccessible.add('createdbyid');
    fieldsWhichCannotBeAccessible.add('createddate');
    fieldsWhichCannotBeAccessible.add('lastmodifiedbyid');
    fieldsWhichCannotBeAccessible.add('lastmodifieddate');
    fieldsWhichCannotBeAccessible.add('systemmodstamp');
    return fieldsWhichCannotBeAccessible;
  }

  private static void addFieldWhichAreNotAccessibile() {
    // contactsField = new Set<String>();
    contactsField.add('otherstate');
    contactsField.add('mailingstate');
    contactsField.add('otherstreet');
    contactsField.add('mailingstreet');
    contactsField.add('othercity');
    contactsField.add('mailingcity');
    contactsField.add('otherpostalcode');
    contactsField.add('mailingpostalcode');
    contactsField.add('othercountry');
    contactsField.add('mailingcountry');
    contactsField.add('otherlatitude');
    contactsField.add('mailinglatitude');
    contactsField.add('otherlongitude');
    contactsField.add('mailinglongitude');
    contactsField.add('othergeocodeaccuracy');
    contactsField.add('mailinggeocodeaccuracy');
    contactsField.add('otherphone');
    contactsField.add('cleanstatus');
    contactsField.add('accountid');
    contactsField.add('reportstoid');

    // accountField = new Set<String>();
    accountField.add('fax');
    accountField.add('type');
    accountField.add('description');
    accountField.add('phone');
    accountField.add('rating');
    accountField.add('billingcity');
    accountField.add('billingcountry');
    accountField.add('billinggeocodeaccuracy');
    accountField.add('billinglatitude');
    accountField.add('billinglongitude');
    accountField.add('billingstate');
    accountField.add('billingstreet');
    accountField.add('billingpostalcode');
    accountField.add('shippingstreet');
    accountField.add('shippingcity');
    accountField.add('shippingstate');
    accountField.add('shippingpostalcode');
    accountField.add('shippingcountry');
    accountField.add('shippinglatitude');
    accountField.add('shippinglongitude');
    accountField.add('shippinggeocodeaccuracy');
    accountField.add('cleanstatus');
    accountField.add('dandbcompanyid');
    accountField.add('parentid');
    accountField.add('naicscode');
    accountField.add('accountnumber');
    accountField.add('site');
    accountField.add('accountsource');

  }

  @AuraEnabled
  public static List<PermissionSetClass> getAllPermissionSets() {
    try{
      AllPermissionSets = [SELECT Id,label,Name,Description,NamespacePrefix,UserLicenseId,CreatedDate FROM PermissionSet];
      if(!AllPermissionSets.isEmpty()) {
        System.debug('inside AllPermissionSets not empty');
        PermissionSetClass pSetObj;
        List<PermissionSetClass> permissionSetsLst = new List<PermissionSetClass>();
        for(PermissionSet PSetName : AllPermissionSets) {
          if(!(PSetName.label).startsWith('00e')) {
            // System.debug('PSetName.UserLicenseId: ' + PSetName.UserLicenseId);
            String user_License_Name = null;
            if(PSetName.UserLicenseId != null) {
              UserLicense ulicense = [SELECT Id, Name FROM UserLicense WHERE Id =:PSetName.UserLicenseId];
              user_License_Name = ulicense.Name;
            }
            pSetObj = new PermissionSetClass(PSetName.label, PSetName.Name, String.valueOf(PSetName.Id), PSetName.Description, PSetName.NamespacePrefix, user_License_Name, String.valueOf(PSetName.CreatedDate));
            //pSetObj = new PermissionSetClass(PSetName.label, PSetName.Name, String.valueOf(PSetName.Id), PSetName.Description, PSetName.NamespacePrefix, null, String.valueOf(PSetName.CreatedDate));
            permissionSetsLst.add(pSetObj);
            System.debug(Logginglevel.ERROR, 'The PermissionSet Name: ' + PSetName);
          }
        }
        return permissionSetsLst;
      }
      else {
        System.debug('No Permission Sets found');
        return null;
      }
    }
    catch(DmlException e) {
      System.debug('The following DML exception has occurred in getAllPermissionSets: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in getAllPermissionSets: ' + e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static List<UserLicense> getAllUserLicenses() {
    try{
      List<UserLicense> user_License_List = [SELECT Id, Name FROM UserLicense];
      return user_License_List;
    }
    catch(Exception e) {
      System.debug('The following DML exception has occurred in getAllUserLicenses: ' + e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static List<ObjectDetailsClass> getAllObjects() {
    try{
      Map<String, Schema.SObjectType> allObjectsofOrgFromGlobalDescribe = Schema.getGlobalDescribe();

      allObjectsOfOrg = new List<ObjectDetailsClass>();

      List<String> objAPINamesList = new List<String>();

      //System.debug(Logginglevel.ERROR, 'allObjectsofOrgFromGlobalDescribe Length: ' + allObjectsofOrgFromGlobalDescribe.size());

      if(!allObjectsofOrgFromGlobalDescribe.isEmpty()) {

        ObjectDetailsClass objectClassObj;
        ObjectPermissionsClass objectPermissionsClassObj;

        //adding all required obj names to the list

        addSObjNamesToList();

        for(String key:allObjectsofOrgFromGlobalDescribe.keySet()) {

          DescribeSObjectResult sObjResult = allObjectsofOrgFromGlobalDescribe.get(key).getDescribe();


          if(sObjResult.isAccessible() && sObjResult.isQueryable() && (sObjResult.isCustom() || isNotSystemSObjectList.contains(sObjResult.getLabelPlural()))) {
            System.debug('obj is both accessible and queryable: ' + sObjResult.getLabelPlural());
            // public ObjectPermissionsClass(String objPermissionsId, Boolean read, Boolean create, Boolean edit, Boolean deleteData, Boolean viewAll, Boolean modifyAll)
            objectPermissionsClassObj = new ObjectPermissionsClass(null, false, false, false, false, false, false);
            objectClassObj = new ObjectDetailsClass(sObjResult.getLabelPlural(), sObjResult.getLabel(), sObjResult.getName(), key, null, objectPermissionsClassObj, null);
            allObjectsOfOrg.add(objectClassObj);
            objAPINamesList.add(sObjResult.getLabelPlural());
          }
          else {
            System.debug('obj is NOT accessible, queryable and NON Custom: ' + sObjResult.getLabelPlural());
          }

          // //implementing sorting
          // allObjectsOfOrg = sortObjectNames(objAPINamesList, allObjectsOfOrg);
        }

        //implementing sorting
        allObjectsOfOrg = sortObjectNames(objAPINamesList, allObjectsOfOrg);
        System.debug('All Object Details: ' + allObjectsOfOrg);
        return allObjectsOfOrg;

      }
      else {
        return null;
      }
    }
    catch(DmlException e) {
      //System.debug('The following DML exception has occurred in getAllObjects: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      //System.debug('The following exception has occurred in getAllObjects: ' + e.getMessage());
      return null;
    }
  }

  public static List<ObjectDetailsClass> sortObjectNames(List<String> objAPINameLst, List<ObjectDetailsClass> allObjectsOftheOrg) {//, List<ObjectDetailsClass> unSortedFinalList){
    //sort the list with obj names
    //objClassLst
    // label
    // objName
    // key
    //we have to sort it with objName
    try{
      List<ObjectDetailsClass> finalResult = new List<ObjectDetailsClass>();
      Map<String, ObjectDetailsClass> mapForComparision = new Map<String, ObjectDetailsClass>();
      for(ObjectDetailsClass obj : allObjectsOftheOrg){
        mapForComparision.put(obj.pluralLabel, obj);
      }
      objAPINameLst.sort();
      for(String str : objAPINameLst) {
            if(mapForComparision.containsKey(str)) {
              finalResult.add(mapForComparision.get(str));
          }
      }
      return finalResult;
    }
    catch(DmlException e) {
      //System.debug('The following DML exception has occurred in sortObjectNames: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      //System.debug('The following exception has occurred in sortObjectNames: ' + e.getMessage());
      return null;
    }
  }


  //NOTE: getAllObjectData This is for retrieving Object Data with Permissions
  @AuraEnabled
  public static List<ObjectDetailsClass> getAllObjectData(String PSetId) {
    try{

        System.debug('Exec is in getAllObjectData: ' + PSetId);
        //ObjectwithPSetPermissionsClass objectwithPSetPermissionsObj;
        //List<ObjectwithPSetPermissionsClass> objectwithPSetPermissionsObjList = new List<ObjectwithPSetPermissionsClass>();

        List<ObjectDetailsClass> objectDetailsClassList = new List<ObjectDetailsClass>();

        System.debug('calling getAllObjects');
        List<ObjectDetailsClass> allObjectsCopy = getAllObjects();
        List<ObjectPermissions> AllPermissionsonObjsofPset =
        [SELECT Id, ParentId, Parent.Name, Parent.PermissionsTransferAnyLead, SobjectType, PermissionsCreate, PermissionsDelete, PermissionsEdit, PermissionsModifyAllRecords, PermissionsRead, PermissionsViewAllRecords FROM ObjectPermissions WHERE ParentId = :PSetId];
        ObjectPermissionsClass objectPermissionObj;

        if(!AllPermissionsonObjsofPset.isEmpty()) {

          ObjectDetailsClass objDetailsClassObject;

          for(ObjectPermissions ObjPer : AllPermissionsonObjsofPset) {
            //public ObjectPermissionsClass(String objPermissionsId, Boolean read, Boolean create, Boolean edit, Boolean deleteData, Boolean vieAll, Boolean modifyAll)
            objectPermissionObj = new ObjectPermissionsClass(ObjPer.Id, ObjPer.PermissionsRead, ObjPer.PermissionsCreate, ObjPer.PermissionsEdit, ObjPer.PermissionsDelete, ObjPer.PermissionsViewAllRecords, ObjPer.PermissionsModifyAllRecords);
            objDetailsClassObject = new ObjectDetailsClass(null, null, ObjPer.SobjectType, null, PSetId, objectPermissionObj, null);
            objectDetailsClassList.add(objDetailsClassObject);
          }

          List<ObjectDetailsClass> finalList = comparingAndManiplatingObject(objectDetailsClassList, PSetId, allObjectsCopy);
          System.debug('AllPermissionsonObjsofPset: ' + AllPermissionsonObjsofPset);
          System.debug('final List: ' + finalList);
          //for(ObjectDetailsClass objObj : finalList) {
            // System.debug('pluralValue:'  + objObj.pluralLabel);
            // System.debug('label:'  + objObj.label);
            // System.debug('name:'  + objObj.name);
            // System.debug('key:'  + objObj.key);
            // System.debug('pSetid:'  + objObj.pSetid);
            // System.debug('objPermissions:'  + objObj.objPermissions);
            // System.debug('fieldDetails:'  + objObj.fieldDetails);
            // for(FieldDetailsClass fieldObj : objObj.fieldDetails) {
            //   System.debug('FieldDetails, Name:'  + fieldObj.fieldName);
            //   System.debug('FieldDetails, label:'  + fieldObj.fieldLabel);
            //   System.debug('FieldDetails, Permissions:'  + fieldObj.fieldPermissions);
            // }
          //}
          return finalList;
        }
        else {
          System.debug('No Permissions concerened to individual Psets');
          List<ObjectDetailsClass> allObjectsCopyToReturn = new List<ObjectDetailsClass>();
          for(ObjectDetailsClass obj : allObjectsCopy) {
            obj.pSetId = PSetId;
            allObjectsCopyToReturn.add(obj);
          }
          return allObjectsCopyToReturn;
        }
    }
    catch(DmlException e) {
      System.debug('The following DML exception has occurred in getAllObjectData: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in getAllObjectData: ' + e.getStackTraceString());
      return null;
    }
  }

  public static List<ObjectDetailsClass> comparingAndManiplatingObject(List<ObjectDetailsClass> objectDetailsClassList, String pSetId, List<ObjectDetailsClass> allObjectsCopy){
    try {
      List<ObjectDetailsClass> objectwithPSetPermissionsFinalList = new List<ObjectDetailsClass>();

      //Calling getAllObjects() to retrieve All the objects of the Org
      // List<ObjectDetailsClass> allObjectsCopy = getAllObjects();

      //converting 'allObjectsCopy' to a Map of Obj key and rest of the class
      Map<String, ObjectDetailsClass> objectDetailsClassListMap = new Map<String, ObjectDetailsClass>();
      for(ObjectDetailsClass obj : objectDetailsClassList) {
          objectDetailsClassListMap.put(obj.name, obj);
      }

      for(ObjectDetailsClass objClass : allObjectsCopy) {
        ObjectDetailsClass objectDetailsClassObjforFinalList;
        if(objectDetailsClassListMap.containsKey(objClass.name)) {
          System.debug('inside : ' + objClass.name);
          ObjectDetailsClass obj = objectDetailsClassListMap.get(objClass.name);

          // objClass.pluralLabel = obj.pluralLabel;
          // objClass.label = obj.label;
          // objClass.key = obj.key;
          // objectDetailsClassObjforFinalList = objClass;

          obj.pluralLabel = objClass.pluralLabel;
          obj.label = objClass.label;
          obj.key = objClass.key;
          objectDetailsClassObjforFinalList = obj;
        }
        else {
          System.debug('outside : ' + objClass.name);
          //ObjectDetailsClass obj = objectDetailsClassListMap.get(objClass.name);
          //System.debug('The Object : ' + obj);

          // Null and false values are given so that the objs which doesn't have any permissions will have false
          //ObjectPermissionsClass objectPermissionsObjForFinalList = new ObjectPermissionsClass(null,false,false,false,false,false,false);
          objectDetailsClassObjforFinalList = new ObjectDetailsClass(objClass.pluralLabel, objClass.label, objClass.name, objClass.key, pSetId, objClass.objPermissions, null);
        }
        System.debug('objectDetailsClassObjforFinalList value : ' + objectDetailsClassObjforFinalList);
        objectwithPSetPermissionsFinalList.add(objectDetailsClassObjforFinalList);
      }
      return objectwithPSetPermissionsFinalList;

      // for(ObjectDetailsClass obj : allObjectsCopy) {
      //   ObjectDetailsClass objectDetailsClassObjforFinalList;
      //
      //   for(ObjectDetailsClass objClass : objectDetailsClassList) {
      //     if(obj.name == objClass.name) {
      //       objClass.pluralLabel = obj.pluralLabel;
      //       objClass.label = obj.label;
      //       objClass.key = obj.key;
      //       objectDetailsClassObjforFinalList = objClass;
      //       //System.debug('objectPermissionsObj:' + objClass.objPermissions);
      //       break;
      //     }
      //     else{
      //       ObjectPermissionsClass objectPermissionsObjForFinalList = new ObjectPermissionsClass(null,false,false,false,false,false,false);
      //       objectDetailsClassObjforFinalList = new ObjectDetailsClass(obj.pluralLabel, obj.label, obj.name, obj.key, pSetId, objectPermissionsObjForFinalList,null);
      //
      //     }
      //   }
      //
      //   objectwithPSetPermissionsFinalList.add(objectDetailsClassObjforFinalList);
      // }
      //
      // return objectwithPSetPermissionsFinalList;
    }
    catch(DmlException e) {
      System.debug('The following DML exception has occurred in comparingAndManiplatingObject: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in comparingAndManiplatingObject: ' + e.getStackTraceString());
      return null;
    }

  }

  //get All Fields data with Permissions Concerning Single Obj n PSet
  @AuraEnabled
  public static List<FieldDetailsClass> get_IndividualObj_AllFieldData(String selectedObject) {
    try{
      List<FieldDetailsClass> listOfFieldsForSorting = new List<FieldDetailsClass>();
      Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
      System.debug('schemaMap in get_IndividualObj_AllFieldData: ' + schemaMap);
      List<FieldDetailsClass> individualObjectAllFieldsList = new List<FieldDetailsClass>();
      FieldDetailsClass fieldClassObj;

      if(!schemaMap.isEmpty()) {
        System.debug('schemaMap in get_IndividualObj_AllFieldData is not empty and the selectedObject: ' + selectedObject);
        Map <String, Schema.SObjectField> IndividiaulfieldMap = schemaMap.get(selectedObject).getDescribe().fields.getMap();
        System.debug('IndividiaulfieldMap in get_IndividualObj_AllFieldData: ' + IndividiaulfieldMap);
        if(!IndividiaulfieldMap.isEmpty()) {

          Set<String> systemFields = addSystemLevelFields();
          addFieldWhichAreNotAccessibile();
          for(String sfield : schemaMap.get(selectedObject).getDescribe().fields.getMap().keySet()) {

            if(IndividiaulfieldMap.get(sfield).getDescribe().isPermissionable()) {

              //this is like accessing every field

              if(!systemFields.contains(sfield)) {

                DescribeSObjectResult sObjResult = schemaMap.get(selectedObject).getDescribe();
                if((selectedObject == 'account' && !(accountField.contains(sfield))) || (selectedObject == 'contact' && !(contactsField.contains(sfield))) || (sObjResult.isCustom())) {
                  String labelOfField = IndividiaulfieldMap.get(sfield).getDescribe().getLabel();

                  FieldPermissionsClass fieldPermissionsObj = new FieldPermissionsClass(null,false,false);
                  fieldClassObj = new FieldDetailsClass(sfield, labelOfField, fieldPermissionsObj);
                  individualObjectAllFieldsList.add(fieldClassObj);
                  listOfFieldsForSorting.add(fieldClassObj);
                }
                else {
                  System.debug('unwanted in either account or contact ### sfield:' + sfield + '### label: ' + IndividiaulfieldMap.get(sfield).getDescribe().getLabel() + ' ## name: ' + IndividiaulfieldMap.get(sfield).getDescribe().getName() + '## localname: ' + IndividiaulfieldMap.get(sfield).getDescribe().getLocalName());
                }
                // if(selectedObject == 'contact' && !(contactsField.contains(sfield))) {
                //   System.debug('this is the wanted Field Name### sfield: ' + sfield + '### label: ' + labelOfField + ' ## name: ' + IndividiaulfieldMap.get(sfield).getDescribe().getName() + '## localname: ' + IndividiaulfieldMap.get(sfield).getDescribe().getLocalName());
                //   fieldClassObj = new FieldDetailsClass(sfield, labelOfField, null);
                //   individualObjectAllFieldsList.add(fieldClassObj);
                //   listOfFieldsForSorting.add(fieldClassObj);
                // }
                // else {
                //   System.debug('unwanted in contact### sfield:' + sfield);
                // }
             }
             else {
               System.debug('this is a System Field: ' + sfield);
             }

            }
            else {
              System.debug('This is not accessible: ' + sfield + '### label: ' + IndividiaulfieldMap.get(sfield).getDescribe().getLabel() + ' ## name: ' + IndividiaulfieldMap.get(sfield).getDescribe().getName() +'## localname: ' + IndividiaulfieldMap.get(sfield).getDescribe().getLocalName());
            }
          }
          // sorting the field labels
          individualObjectAllFieldsList = sortTheFieldLabels(individualObjectAllFieldsList);
          //return  getFieldPermissions(selectedPSet, selectedObject, individualObjectAllFieldsList);
          return individualObjectAllFieldsList;
        }
      }
      return null;
    }
    catch(DmlException e) {
      System.debug('The following DML exception has occurred in getAllFieldDataWithPermissions: ' + e.getMessage());
      return null;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in getAllFieldDataWithPermissions: ' + e.getMessage());
      return null;
    }
  }

  private static List<FieldDetailsClass> sortTheFieldLabels(List<FieldDetailsClass> listOfFieldDetailsClass) {
    try{

      List<String> fieldNames = new List<String>();
      List<FieldDetailsClass> finalFieldNameSortedList = new List<FieldDetailsClass>();
      Map<String, FieldDetailsClass> mapForFieldLabelComparision = new Map<String, FieldDetailsClass>();

      for(FieldDetailsClass fieldObj : listOfFieldDetailsClass) {
        fieldNames.add(fieldObj.fieldLabel);
        mapForFieldLabelComparision.put(fieldObj.fieldLabel, fieldObj);
      }
      fieldNames.sort();

      for(String str : fieldNames) {
        if(mapForFieldLabelComparision.containsKey(str)){
          finalFieldNameSortedList.add(mapForFieldLabelComparision.get(str));
        }
      }
      return finalFieldNameSortedList;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in sortTheFieldLabels: ' + e.getMessage());
      return null;
    }
  }

  //TODO: Get All the Field Permissions from the table - COMPLETED

  //NOTE: This method is capable of retrieving Field permissions in a given Permission Set + Object Name
  //This is called when an object is expanded (+ is clicked) and all the fields are loaded

  @AuraEnabled
  public static List<FieldDetailsClass> getAllFieldDataWithPermissions(String objName, String pSetId) {
  try{
    System.debug('objName in getAllFieldDataWithPermissions: ' + objName);
    List<FieldDetailsClass> individualObjectAllFieldsListAsInput = get_IndividualObj_AllFieldData(objName);
    List<FieldPermissions> FieldPermissionsList =
    [SELECT Id, Field, Parent.Name, ParentId, SobjectType, PermissionsEdit, PermissionsRead FROM FieldPermissions WHERE ParentId = :pSetId AND SobjectType = :objName];
    Map<String, FieldPermissions> fieldPermissionsListMap;
    // if(!FieldPermissionsList.isEmpty()) {
      fieldPermissionsListMap = new Map<String, FieldPermissions>();
      //Converting FieldPermissions to Map
      for(FieldPermissions fper : FieldPermissionsList) {
        fieldPermissionsListMap.put((fper.Field).toLowerCase(), fper);
      }
    // }
    List<FieldDetailsClass> individualObjectAllFieldsFinalList = new List<FieldDetailsClass>();

    FieldPermissionsClass fieldPermissionsObj;

    for(FieldDetailsClass fieldClassObj : individualObjectAllFieldsListAsInput) {
      if(!fieldPermissionsListMap.isEmpty()) {

        System.debug('fieldPermissionsListMap is not empty');
        String fieldNameFromAllFields = objName.toLowerCase()+ '.' + fieldClassObj.fieldName.toLowerCase();
        if(fieldPermissionsListMap.containsKey(fieldNameFromAllFields)) {
          System.debug('fieldName have been compared and they are equal : ' + fieldNameFromAllFields);
          FieldPermissions fieldPer = fieldPermissionsListMap.get(fieldNameFromAllFields);
          fieldPermissionsObj = new FieldPermissionsClass(fieldPer.Id, fieldPer.PermissionsRead,fieldPer.PermissionsEdit);
          //break;
        }
        else {
          System.debug('fieldName have been compared and they NOT equal : ' + fieldNameFromAllFields);
          fieldPermissionsObj = new FieldPermissionsClass(null,false,false);
        }
        fieldClassObj.fieldPermissions = fieldPermissionsObj;
        individualObjectAllFieldsFinalList.add(fieldClassObj);
      }
      else {
        System.debug('No Field Permissions concerened to individual Psets and Objs');
        fieldPermissionsObj = new FieldPermissionsClass(null,false,false);
        fieldClassObj.fieldPermissions = fieldPermissionsObj;
        individualObjectAllFieldsFinalList.add(fieldClassObj);
        //break;
      }
    }
    System.debug('individualObjectAllFieldsFinalList : ' + individualObjectAllFieldsFinalList);
    return individualObjectAllFieldsFinalList;
  }
  catch(Exception e) {
    System.debug('The following exception has occurred in getAllFieldDataWithPermissions: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
    return null;
  }
  }

  //NOTE: All Server Functions to save data back to backend
  //SAVE Function forever
  @AuraEnabled
  public static Boolean savePSetDetailsChanges(String changesRecordedObj, String changedPSetData, String changedObjData) {
    try {
       Boolean checkChangesInPSetDetails =false;
       Boolean checkChangesInSavingObjDetails=false;
       Boolean checkChangesInSavingFieldDetails=false;

      System.debug('Its inside the savePSetDetailsChanges');
      System.debug('changes Recorded Obj: ' + changesRecordedObj);
      System.debug('changed PSet Data: ' + changedPSetData);
      System.debug('changed Obj Data: ' + changedObjData);

      List<PermissionSetClass> newPSetObj;
      List<ObjectDetailsClass> newObjDetailsObj;
      // this is to save PSet Details to salesforce database

      if(String.isNotEmpty(changedPSetData)) {
        //This is for PSet Changes
        System.debug('changedPSetData is not null');
        newPSetObj = (List<PermissionSetClass>)JSON.deSerialize(changedPSetData, List<PermissionSetClass>.class);
      }
      // if(String.isNotEmpty(changedObjData)) {
      System.debug('check whether is this called -1');

      if(String.isNotBlank(changedObjData)) {
        //This is for Object Changes
        System.debug('changedObjData is not null : ' + changedObjData);
        newObjDetailsObj = (List<ObjectDetailsClass>)JSON.deSerialize(changedObjData, List<ObjectDetailsClass>.class);
      }

      if(String.isNotBlank(changesRecordedObj)) {
        // Changes Recorded Object
        System.debug('changesRecordedObj is NOT null');
        ChangesrecordedfromUser ChangesrecordedfromUserObj = (ChangesrecordedfromUser)JSON.deSerialize(changesRecordedObj, ChangesrecordedfromUser.class);
          System.debug('ChangesrecordedfromUserObj: ' + ChangesrecordedfromUserObj);

          if(String.isNotBlank(ChangesrecordedfromUserObj.permissionSetId)) {
              System.debug('ChangesrecordedfromUserObj.permissionSetId is NOT null');
              if(ChangesrecordedfromUserObj.changesinPermissionSetDetails) {
                System.debug('Inside Permissions Set Changes');
                checkChangesInPSetDetails = savePSetDetails(newPSetObj, ChangesrecordedfromUserObj.permissionSetId);
                System.debug('check whether is this called 0');
              }
              else {
                checkChangesInPSetDetails = true;
              }
              if(newObjDetailsObj != null) {
                checkChangesInSavingObjDetails = object_ChangesSave(ChangesrecordedfromUserObj, newObjDetailsObj, null);
                System.debug('check whether is this called 1');

                System.debug('check whether is this called 2');
                checkChangesInSavingFieldDetails = field_ChangesSave(ChangesrecordedfromUserObj, newObjDetailsObj, null);
              }
              else {
                checkChangesInSavingObjDetails = true;
                checkChangesInSavingFieldDetails = true;
              }

              // if(!(ChangesrecordedfromUserObj.changesinObjPermissions).isEmpty()) {
              //   System.debug('Inside Obj Permissions Changes');
              //   System.debug('value of Obj: ' + ChangesrecordedfromUserObj.changesinObjPermissions[0].objKey);
              //   checkChangesInSavingObjDetails = saveObjectPermissionChanges(newObjDetailsObj, ChangesrecordedfromUserObj);
              //   //newObjDetailsObj
              // }
              // else {
              //   checkChangesInSavingObjDetails = true;
              // }


              // if(!(ChangesrecordedfromUserObj.changesinFieldPermissions).isEmpty()) {
              //   System.debug('Inside Field Permissions Changes : ' + ChangesrecordedfromUserObj.changesinFieldPermissions);
              //   System.debug('value of Field: ' + ChangesrecordedfromUserObj.changesinFieldPermissions[0].FieldName);
              //   checkChangesInSavingFieldDetails = saveFieldPermissionChanges(newObjDetailsObj, ChangesrecordedfromUserObj);
              //   System.debug('checkChangesInSavingFieldDetails: ' + checkChangesInSavingFieldDetails);
              // }
              // else {
              //   checkChangesInSavingFieldDetails = true;
              // }

          }
          else {
            System.debug('ChangesrecordedfromUserObj.permissionSetId is null');
          }
      }
      else {
        System.debug('changesRecordedObj is null');
      }
      System.debug('checkChangesInPSetDetails: ' + checkChangesInPSetDetails);
      System.debug('checkChangesInSavingObjDetails: ' + checkChangesInSavingObjDetails);
      System.debug('checkChangesInSavingFieldDetails: ' + checkChangesInSavingFieldDetails);
      if(checkChangesInPSetDetails && checkChangesInSavingObjDetails && checkChangesInSavingFieldDetails) {
          return true;
      }
      else {
        return false;
      }
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in savePSetDetailsChanges: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  private static Boolean object_ChangesSave(ChangesrecordedfromUser changesrecordedfromUserObj, List<ObjectDetailsClass> newObjDetailsObj, String pSetId) {
    try {
      Boolean checkChangesInSavingObjDetails = false;
      if(!(changesrecordedfromUserObj.changesinObjPermissions).isEmpty()) {
        System.debug('Inside Obj Permissions Changes is not empty');
        // System.debug('value of Obj: ' + changesrecordedfromUserObj.changesinObjPermissions[0].objKey);
        checkChangesInSavingObjDetails = saveObjectPermissionChanges(newObjDetailsObj, changesrecordedfromUserObj, pSetId);
      }
      else {
        System.debug('Inside Obj Permissions Changes is empty');
        checkChangesInSavingObjDetails = true;
      }
      return checkChangesInSavingObjDetails;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in object_ChangesSave: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  private static Boolean field_ChangesSave(ChangesrecordedfromUser changesrecordedfromUserObj, List<ObjectDetailsClass> newObjDetailsObj, String pSetId) {
    try {
      Boolean checkChangesInSavingFieldDetails = false;
      if(!(changesrecordedfromUserObj.changesinFieldPermissions).isEmpty()) {
        System.debug('Inside Field Permissions Changes : ' + changesrecordedfromUserObj.changesinFieldPermissions);
        System.debug('value of Field: ' + changesrecordedfromUserObj.changesinFieldPermissions[0].FieldName);
        checkChangesInSavingFieldDetails = saveFieldPermissionChanges(newObjDetailsObj, changesrecordedfromUserObj, pSetId);
        System.debug('checkChangesInSavingFieldDetails: ' + checkChangesInSavingFieldDetails);
      }
      else {
        checkChangesInSavingFieldDetails = true;
      }

      return checkChangesInSavingFieldDetails;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in field_ChangesSave: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  //save Permission Set Details to salesforce
  @AuraEnabled
  // public static Boolean create_New_PermissionSet_and_SaveConcerned_Obj_Field_Permissions(String pSet_label, String pSet_name, String pSet_UserLicenseId, String pSet_Description) {
  public static Boolean create_New_PermissionSet_and_SaveConcerned_Obj_Field_Permissions(String newly_Created_pSet_as_String, String object_Permission_Changes_as_String, String recorded_Changes_Obj_as_String) {
    try{
      // next steps:
      // json parse 'newly_Created_pSet_as_String' to json object and access required values.
      // check if object_Permission_Changes is not empty if then, json parse 'object_Permission_Changes'
      //to json obj and access required valued
      // first create the Pset and take the pSet Id
      // insert Object Permissions into concerned table with the pSet Id.

      Boolean check_Whether_PSet_isCreated = false;
      Boolean check_Whether_ChangesIn_Obj_Are_Saved=false;
      Boolean check_Whether_ChangesIn_Field_Are_Saved=false;

      System.debug('Its inside the create_New_PermissionSet_and_SaveConcerned_Obj_Field_Permissions');
      System.debug('changes Recorded Obj: ' + recorded_Changes_Obj_as_String);
      System.debug('new PSet Data: ' + newly_Created_pSet_as_String);
      System.debug('changed Obj Data: ' + object_Permission_Changes_as_String);

      PermissionSetClass new_PSetObj_for_creation;
      List<ObjectDetailsClass> objDetails_for_creation;
      ChangesrecordedfromUser changes_recorded;
      String newly_created_pSet_id = null;
      // this is to save PSet Details to salesforce database

      if(String.isNotBlank(newly_Created_pSet_as_String)) {
        //This is for PSet Changes
        new_PSetObj_for_creation = (PermissionSetClass)JSON.deSerialize(newly_Created_pSet_as_String, PermissionSetClass.class);
        check_Whether_PSet_isCreated = create_New_PermissionSet(new_PSetObj_for_creation);

        List<PermissionSet> pSetList_for_Getting_Last_PSet_Id = [SELECT Id,label,Name,Description,NamespacePrefix,UserLicenseId,CreatedDate FROM PermissionSet ORDER BY CreatedDate DESC];
        newly_created_pSet_id = pSetList_for_Getting_Last_PSet_Id[0].Id;
        System.debug('The newly created PSet Id: ' + newly_created_pSet_id);
      }

      System.debug('Just for gags: ' + recorded_Changes_Obj_as_String);
      if(String.isNotBlank(recorded_Changes_Obj_as_String)) {
        //This is for Changes Recorded Object
        System.debug('recorded_Changes_Obj_as_String is not null');
        changes_recorded = (ChangesrecordedfromUser)JSON.deSerialize(recorded_Changes_Obj_as_String, ChangesrecordedfromUser.class);
      }

      System.debug('Why is there an error 0');

      // if(object_Permission_Changes_as_String != null && String.isNotEmpty(object_Permission_Changes_as_String)) {
      if(String.isNotBlank(object_Permission_Changes_as_String)) {
        //This is for Object Changes
        System.debug('object_Permission_Changes_as_String is not null');
        objDetails_for_creation = (List<ObjectDetailsClass>)JSON.deSerialize(object_Permission_Changes_as_String, List<ObjectDetailsClass>.class);
      }

      System.debug('Why is there an error 1');

      if(changes_recorded != null && objDetails_for_creation != null) {
        check_Whether_ChangesIn_Obj_Are_Saved = object_ChangesSave(changes_recorded, objDetails_for_creation, newly_created_pSet_id);
        check_Whether_ChangesIn_Field_Are_Saved = field_ChangesSave(changes_recorded, objDetails_for_creation, newly_created_pSet_id);
      }
      else {
        check_Whether_ChangesIn_Obj_Are_Saved = true;
        check_Whether_ChangesIn_Field_Are_Saved = true;
      }

      System.debug('Why is there an error 2');

      if(check_Whether_PSet_isCreated && check_Whether_ChangesIn_Obj_Are_Saved && check_Whether_ChangesIn_Field_Are_Saved) {
          return true;
      }
      return false;
    }
    catch(Exception e){
      System.debug('The following exception has occurred in savePSetDetails: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  private static Boolean create_New_PermissionSet(PermissionSetClass pSetObj_As_Param) {
    try {
      //PermissionSetClass(string label, string apiName, string id, string description, string namespacePrefix, string userLicenseId, string createdDate)
      PermissionSet pSetObj = new PermissionSet();
      pSetObj.label = pSetObj_As_Param.label;
      pSetObj.name = pSetObj_As_Param.apiName;
      if(pSetObj_As_Param.userLicenseId == '') {
        pSetObj.UserLicenseId = null;
      }
      else {
        pSetObj.UserLicenseId = pSetObj_As_Param.userLicenseId;
      }
      pSetObj.description = pSetObj_As_Param.description;
      INSERT pSetObj;
      return true;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in create_New_PermissionSet: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  public static Boolean savePSetDetails(List<PermissionSetClass> allPSets, String changedPSetId) {
    try{
      Boolean returnVal = false;
      for(PermissionSetClass pSetObj : allPSets) {
        if(pSetObj.id == changedPSetId) {
          PermissionSet pSetObjforUpsert = new PermissionSet(Id = changedPSetId);
          pSetObjforUpsert.description = pSetObj.description;
          pSetObjforUpsert.label = pSetObj.label;
          pSetObjforUpsert.name = pSetObj.apiName;
          UPSERT pSetObjforUpsert;
          returnVal = true;
          break;
        }
      }
      return returnVal;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in savePSetDetails: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
       return false;
    }
  }

  public static Boolean saveObjectPermissionChanges(List<ObjectDetailsClass> objDetailsClassObject, ChangesrecordedfromUser changesObject, String pSetId) {
    try {
      System.debug('Exec is in saveObjectPermissionChanges');
      Boolean returnVal = false;

      for(ChangesinObjPermissions changeObj : changesObject.changesinObjPermissions) {
        for(ObjectDetailsClass changedObjDetailsObject : objDetailsClassObject) {
          ObjectPermissions objPerms;
          if(pSetId != null){
            objPerms = selectObjectPermissionsClassandFillDetails(changedObjDetailsObject.objPermissions, pSetId, changedObjDetailsObject.name);
          }
          else {
            objPerms = selectObjectPermissionsClassandFillDetails(changedObjDetailsObject.objPermissions, changedObjDetailsObject.pSetId, changedObjDetailsObject.name);
          }
          if(objPerms != null) {
            ObjectPermissionsClass objPermissionsObject = changedObjDetailsObject.objPermissions;
            //UPSERT objPerms;
            System.debug('objPermissionsObject.objPermissionsId: ' + objPermissionsObject.objPermissionsId);
            if(objPermissionsObject.objPermissionsId != null) {
              System.debug('It is an update on: obj name:  '+ changedObjDetailsObject.name +' , the obj id: ' + objPermissionsObject.objPermissionsId);
              objPerms.Id = objPermissionsObject.objPermissionsId;
              UPDATE objPerms;
              returnVal = true;
            }
            else {
              System.debug('It is an upsert');
              UPSERT objPerms;
              returnVal = true;
            }

            if(changeObj.objKey == 'Allqwerty') {
              //update all
              System.debug('Updating ALL Obj"s and Key is : ' + changeObj.objKey);
            }
            else if(changeObj.objKey == changedObjDetailsObject.key) {
              // update only individual
              System.debug('Updating INDIVIDUAL Obj and Key is : ' + changeObj.objKey);
              break;
            }
          }
          else {
            // it is null thus there is some error
            //returnVal = false;
            break;
          }
        }
      }
      return returnVal;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in savePSetDetailsChanges: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return false;
    }
  }

  public static Boolean saveFieldPermissionChanges(List<ObjectDetailsClass> objDetailsClassObject, ChangesrecordedfromUser changesObject, String pSetId) {
    Boolean returnVal = false;
    try {
      System.debug('Inside saveFieldPermissionChanges : objDetailsClassObject ## ' + objDetailsClassObject);
      System.debug('changesObject ## ' + changesObject);

      Map<String, ObjectDetailsClass> objDetailsMap = new Map<String, ObjectDetailsClass>();
      for(ObjectDetailsClass obj : objDetailsClassObject) {
        objDetailsMap.put(obj.key, obj);
      }

      List<FieldPermissionsClass> finalFieldPermissionsListForUpdating;
      for(ChangedFieldDetails changeObj : changesObject.changesinFieldPermissions) { // this is required to check if it is single Field Name or 'Allqwerty'
      // Allqwerty = loop through all the fields of particular object
      // individual FieldName = update only that particular field
        if(objDetailsMap.containsKey(changeObj.ObjKey)) {
          //System.debug('In saveFieldPermissionChanges inside Obj key comparision : ' + changeObj.ObjKey);
          ObjectDetailsClass tempObjDetailsClass = objDetailsMap.get(changeObj.ObjKey);
          List<FieldDetailsClass> changedObjectFieldDetailsList = tempObjDetailsClass.fieldDetails;

          for(FieldDetailsClass fieldDetailsObj : changedObjectFieldDetailsList) {
            //System.debug('In saveFieldPermissionChanges, inside looping of changedObjectFieldDetailsList value: ' + fieldDetailsObj);
            FieldPermissions changedFieldPermissions;
            if(changeObj.FieldName == 'Allqwerty' || changeObj.FieldName == fieldDetailsObj.fieldLabel) {
              System.debug('In saveFieldPermissionChanges inside check of field name : ' + fieldDetailsObj.fieldName);
              String fieldAPIName = tempObjDetailsClass.name + '.' + fieldDetailsObj.fieldName;
              if(pSetId != null) {
                changedFieldPermissions = selectedFieldPermisionsClassandFillDetails(fieldDetailsObj.fieldPermissions, pSetId, tempObjDetailsClass.name, fieldAPIName);
              }
              else {
                changedFieldPermissions = selectedFieldPermisionsClassandFillDetails(fieldDetailsObj.fieldPermissions, tempObjDetailsClass.pSetId, tempObjDetailsClass.name, fieldAPIName);
              }
              if(changedFieldPermissions != null) {
                System.debug('In saveFieldPermissionChanges inside check if changedFieldPermissions is empty : ' + changedFieldPermissions + '& fieldDetailsObj : ' + fieldDetailsObj);
                if(fieldDetailsObj.fieldPermissions.fieldPermissionsId != null) {
                  // update
                  System.debug('Update in Saving Field Permission Changes');
                  changedFieldPermissions.Id = fieldDetailsObj.fieldPermissions.fieldPermissionsId;
                  UPDATE changedFieldPermissions;
                  returnVal = true;
                }
                else {
                  //upsert
                  System.debug('Upsert in Saving Field Permission Changes');
                  UPSERT changedFieldPermissions;
                  returnVal = true;
                }
              }
              else {
                System.debug('In saveFieldPermissionChanges inside check if changedFieldPermissions is empty');
                // if changedFieldPermissions is null then theres an error
                //returnVal = false;
              }
            }
            else {
              System.debug('In saveFieldPermissionChanges outside check of field name :fieldDetailsObj.fieldName ##### ' + fieldDetailsObj.fieldName + '##### and changeObj.FieldName : ####' + changeObj.FieldName);
            }

            if(changeObj.FieldName == 'Allqwerty') {
              System.debug('The exec is IN Allqwerty value');
            }
            else if(changeObj.FieldName == fieldDetailsObj.fieldName) {
              System.debug('The exec is NOT in Allqwerty value');
              break;
            }
          }
        }
      }

      // List<FieldPermissionsClass> finalFieldPermissionsListForUpdating;
      // for(ChangedFieldDetails changeObj : changesObject.changesinFieldPermissions) { // this is required to check if it is single Field Name or 'Allqwerty'
      //   for(ObjectDetailsClass changedObjDetailsObject : objDetailsClassObject) {
      //     if(changeObj.ObjKey == changedObjDetailsObject.key) {
      //       for(FieldDetailsClass changedObjFieldDetails : changedObjDetailsObject.fieldDetails) {
      //         //objName.toLowerCase()+ '.' + fieldClassObj.fieldName.toLowerCase()
      //         if(changeObj.FieldName != 'Allqwerty') {
      //           System.debug('The exec is NOOOOOOOOOOOOOT in Allqwerty value');
      //           if(changeObj.FieldName == changedObjFieldDetails.fieldName){
      //             String fieldAPIName = changedObjDetailsObject.name + '.' + changedObjFieldDetails.fieldName;
      //             FieldPermissions changedFieldPermissions = selectedFieldPermisionsClassandFillDetails(changedObjFieldDetails.fieldPermissions, changedObjDetailsObject.pSetId, changedObjDetailsObject.name, fieldAPIName);
      //             if(changedObjFieldDetails.fieldPermissions.fieldPermissionsId != null) {
      //               // update
      //               UPDATE changedFieldPermissions;
      //             }
      //             else {
      //               //upsert
      //               UPSERT changedFieldPermissions;
      //             }
      //             break;
      //           }
      //         }
      //         else {
      //           System.debug('The exec is in Allqwerty value');
      //           System.debug('The label of current field is: ' + changedObjFieldDetails.fieldLabel);
      //           String fieldAPIName = changedObjDetailsObject.name + '.' + changedObjFieldDetails.fieldName;
      //           FieldPermissions changedFieldPermissions = selectedFieldPermisionsClassandFillDetails(changedObjFieldDetails.fieldPermissions, changedObjDetailsObject.pSetId, changedObjDetailsObject.name, fieldAPIName);
      //           if(changedObjFieldDetails.fieldPermissions.fieldPermissionsId != null) {
      //             // update
      //             UPDATE changedFieldPermissions;
      //           }
      //           else {
      //             //upsert
      //             UPSERT changedFieldPermissions;
      //           }
      //         }
      //       }
      //       break;
      //     }
      //   }
      // }

      //returnVal = true;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in saveFieldPermissionChanges: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      returnVal = false;
    }
    return returnVal;
  }

  private static ObjectPermissions selectObjectPermissionsClassandFillDetails(ObjectPermissionsClass objPermissionsObject, String permissionSetId, String sobjectName) {
    try{
      System.debug('Exec is in selectObjectPermissionsClassandFillDetails');
      ObjectPermissions objPerms = new ObjectPermissions(ParentId = permissionSetId, SobjectType = sobjectName);
      //System.debug('objPermissionsObject.modifyAll: ' + objPermissionsObject.modifyAll);
      objPerms.PermissionsModifyAllRecords = objPermissionsObject.modifyAll;
      //System.debug('objPermissionsObject.viewAll: ' + objPermissionsObject.viewAll);
      objPerms.PermissionsViewAllRecords = objPermissionsObject.viewAll;
      //System.debug('objPermissionsObject.deleteData: ' + objPermissionsObject.deleteData);
      objPerms.PermissionsDelete = objPermissionsObject.deleteData;
      //System.debug('objPermissionsObject.edit: ' + objPermissionsObject.edit);
      objPerms.PermissionsEdit = objPermissionsObject.edit;
      //System.debug('objPermissionsObject.create: ' + objPermissionsObject.create);
      objPerms.PermissionsCreate = objPermissionsObject.create;
      //System.debug('objPermissionsObject.read: ' + objPermissionsObject.read);
      objPerms.PermissionsRead = objPermissionsObject.read;

      return objPerms;
    }
    catch(Exception e){
      System.debug('The following exception has occurred in selectObjectPermissionsClassandFillDetails: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return null;
    }


  }

  private static FieldPermissions selectedFieldPermisionsClassandFillDetails(FieldPermissionsClass fieldPermissionsObject, String permissionSetId, String sobjectName, String fieldName) {
    try {
    FieldPermissions fieldPerms = new FieldPermissions(ParentId = permissionSetId, SobjectType = sobjectName, Field = fieldName);

    fieldPerms.PermissionsEdit = fieldPermissionsObject.fieldEdit;
    fieldPerms.PermissionsRead = fieldPermissionsObject.fieldRead;
    return fieldPerms;
    }
    catch(Exception e) {
      System.debug('The following exception has occurred in selectedFieldPermisionsClassandFillDetails: ' + e.getTypeName() +' : ' + e.getMessage() + ' -- ' + e.getCause());
      return null;
    }
  }

  //NOTE: Object Class is used for storing Object details

  public class PermissionSetClass {

    @AuraEnabled
    public string label {get;set;}
    @AuraEnabled
    public string apiName {get;set;}
    @AuraEnabled
    public string id {get;set;}
    @AuraEnabled
    public string description {get;set;}
    @AuraEnabled
    public string namespacePrefix {get;set;}
    @AuraEnabled
    public string userLicenseId {get;set;}
    @AuraEnabled
    public string createdDate {get;set;}

    public PermissionSetClass(string label, string apiName, string id, string description, string namespacePrefix, string userLicenseId, string createdDate)
    {
      this.label = label;
      this.apiName = apiName;
      this.id = id;
      this.description = description;
      this.namespacePrefix = namespacePrefix;
      this.userLicenseId = userLicenseId;
      this.createdDate = createdDate;
    }
  }

  public class ObjectDetailsClass {

    @AuraEnabled
    public string pluralLabel;
    @AuraEnabled
    public string label;
    @AuraEnabled
    public string name;
    @AuraEnabled
    public string key;
    @AuraEnabled
    public string pSetId;
    @AuraEnabled
    public ObjectPermissionsClass objPermissions;
    @AuraEnabled
    public List<FieldDetailsClass> fieldDetails;

    public ObjectDetailsClass(String pluralLabel, String label, String name, String key, String pSetId, ObjectPermissionsClass objPermissions, List<FieldDetailsClass> fieldDetails) {
      this.pluralLabel = pluralLabel;
      this.label = label;
      this.name = name;
      this.key = key;
      this.pSetId = pSetId;
      this.objPermissions = objPermissions;
      this.fieldDetails = fieldDetails;
    }
  }

  public class ObjectPermissionsClass {
    @AuraEnabled
    public String objPermissionsId {get;set;}
    @AuraEnabled
    public Boolean read {get;set;}
    @AuraEnabled
    public Boolean create {get;set;}
    @AuraEnabled
    public Boolean edit {get;set;}
    @AuraEnabled
    public Boolean deleteData {get;set;}
    @AuraEnabled
    public Boolean viewAll {get;set;}
    @AuraEnabled
    public Boolean modifyAll {get;set;}


    public ObjectPermissionsClass(String objPermissionsId, Boolean read, Boolean create, Boolean edit, Boolean deleteData, Boolean viewAll, Boolean modifyAll)
    {
      this.objPermissionsId = objPermissionsId;
      this.read = read;
      this.create = create;
      this.edit = edit;
      this.deleteData = deleteData;
      this.viewAll = viewAll;
      this.modifyAll = modifyAll;
    }
  }

  public class FieldDetailsClass {

    @AuraEnabled
    public string fieldName;
    @AuraEnabled
    public string fieldLabel;
    @AuraEnabled
    public FieldPermissionsClass fieldPermissions;

    public FieldDetailsClass(String fieldName, String fieldLabel, FieldPermissionsClass fieldPermissions) {
      this.fieldName = fieldName;
      this.fieldLabel = fieldLabel;
      this.fieldPermissions = fieldPermissions;
    }
  }

  public class FieldPermissionsClass {

    @AuraEnabled
    public String fieldPermissionsId;
    @AuraEnabled
    public Boolean fieldRead;
    @AuraEnabled
    public Boolean fieldEdit;

    public FieldPermissionsClass(String fieldPermissionsId, Boolean fieldRead, Boolean fieldEdit) {
      this.fieldPermissionsId = fieldPermissionsId;
      this.fieldRead = fieldRead;
      this.fieldEdit = fieldEdit;

    }
  }

  public class ChangesrecordedfromUser {
    @AuraEnabled
    public string permissionSetId;
    @AuraEnabled
    public Boolean changesinPermissionSetDetails;
    @AuraEnabled
    public ChangesinObjPermissions[] changesinObjPermissions;
    @AuraEnabled
    public ChangedFieldDetails[] changesinFieldPermissions;
  }

  public class ChangesinObjPermissions {
    @AuraEnabled
    public string objKey;
  }

  public class ChangedFieldDetails {
    @AuraEnabled
    public string FieldName;
    @AuraEnabled
    public string ObjKey;
  }

}


//NOTES

//TODO: Save Any Changes made to the Permissions on Objects or Field 1. Any changes should be recorded with a check, if the check is true then go see for which Permission have been Altered 2. Any change should be checked over a bunch of rules (find the rules in Images) 3. Separate check field should be available to see which part of the Permissions have been altered. 4. Try to handle check for a 'bunch of rules' in JavaScript

//TODO: Any Group Permission is checked or un checked then, run it against bunch of rules and handle it accordingly 1. Here, all the Group Permissions in Edit Permisisons on All Objs should be checked against Objects 2. all the Group Permissions in Edit Advanced Permissions on All Fields of All objs should be checked against Objs + Field combo

//NOTE: OBJECT Permission Rules:
// if(Modify All == true) then READ, EDIT, DELETE, VIEW ALL are TRUE
// if(CREATE == true) then READ is TRUE
// if(EDIT == true) then READ is TRUE
// if(DELETE == true) then READ, EDIT are TRUE
// if(VIEW ALL == true) then READ is TRUE

//TODO: Implementing EDIT button:
// 1. Only on Edit Click, anything should be able to edittable
// 2. All of it like, Permissions on Object or Field level should be editable only on edit button click

//TODO: Implementing CLONE button:
// 1. When Clone is clicked, all the Objects + Permissions and things should be copied and a small window to edit the Permission Set
// should be poped out.
// 2. This way, user will be able to edit the Permission Set name of the clone

//TODO: Implementing Create New button:
// 1. When Create New is clicked, then show a popup with all others in the background are in accessible.
// 2. I believe, Salesforce has got such a popup component

// Next Steps to do:
// 1. We already got all the Objects from ObjectPermisison table
// 2. Need to scroll through these Object names with All objects we have and update the List
// 3. Update with, Which Objects have got Permissions and which objects have not got the permissions
// 4. Then return that list front end

//Next Steps to do: V 2.0
// 1. Comparing and Merging the "ObjectwithPSetPermissionsClass" is already done
// 2. Once this hits front end
// 3. Do changes in front end like adding new elements/fields to accomidate permissions on each object
// 4. Send the whole List to Iterator in the front end
// 5. Make sure the right values are called in the right places
// 6. Also check the object names.
