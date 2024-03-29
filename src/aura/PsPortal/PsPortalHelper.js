({

	loadPermissionSetOptions: function(component) {
		//console.log("page load is called");
		this.clearAllAttributes(component);
		this.contactServertoGetPermissionSet(component);
		this.assigningValueToAInput(component);
	},

	assigningValueToAInput: function(cmp) {
		// var i = $('#permissionSetLi > : input');
		// i.val('@');
		//cmp.set("v.objExpandingInput", '+');
	},

	clearAllAttributes : function(cmp) {
		cmp.set("v.permissionSetNamesDataSetasInput", "");
		cmp.set("v.allPsDetails", "");
		cmp.set("v.allObjectDetails", "");
		cmp.set("v.changedAllObjectDetails", "");
		cmp.set("v.objectNames", "");
		cmp.set("v.fieldDetails", "");
	},

	//contact server to retrieve All Permission Sets of the Organization
	contactServertoGetPermissionSet: function(component) {
		var action = component.get('c.getAllPermissionSets');
		////console.log('calling getAllPermissionSets from PsPortal');
		action.setCallback(this, function(response) {
			var state = response.getState();
			////console.log("Set of All Permission Sets: "+ response.getState());

			if (component.isValid() && state === "SUCCESS") {
				//console.write("Data: " + response.getReturnValue());
				////console.log("Data: "+ response.getReturnValue());
				this.addingPermissionSetNames(response.getReturnValue());
				component.set("v.permissionSetNamesDataSetasInput", response.getReturnValue());

				//NOTE: adding PSet Details to PsPortalHelper.js PSetDetails Class

				component.set("v.allPsDetails", this.addPSetDetailsToListofPSets(response.getReturnValue()));
			}
		});
		$A.enqueueAction(action);
	},

	addingPermissionSetNames : function(permissionSetNamesDataSetasInput) {

		var fragment = document.createDocumentFragment();
		var opt = document.createElement('option');
		opt.innerHTML = "Choose an option";
		opt.value = "NothingSelected";
		fragment.appendChild(opt);

		for(var i=0;i<permissionSetNamesDataSetasInput.length;i++) {
			opt = document.createElement('option');
			opt.innerHTML = permissionSetNamesDataSetasInput[i].label;
			opt.value = permissionSetNamesDataSetasInput[i].id;
			fragment.appendChild(opt);
		}

		$('#permissionSetNamesddl').append(fragment);
	},

	//NOTE: Method for adding Individual Permission Set Class Object to "allPSetDetails" Global variable
	addPSetDetailsToListofPSets : function(pSetDetailsFromServer){
		var allPSetDetails = [];
		for(var i=0;i<pSetDetailsFromServer.length;i++) {
			allPSetDetails.push(this.createAPermissionSetDetailsClass(pSetDetailsFromServer[i].label, pSetDetailsFromServer[i].name, pSetDetailsFromServer[i].id, pSetDetailsFromServer[i].description, pSetDetailsFromServer[i].namespacePrefix, pSetDetailsFromServer[i].userLicenseId,pSetDetailsFromServer[i].createdDate));
		}
		return allPSetDetails;
	},

	permissionSetNameSelected : function(component,event){
		var selectedVal = $('#'+event.srcElement.id).val();
		if(selectedVal === "NothingSelected") {
			this.swapEditCloneButtonsDisability(true);
			this.swapObjectDivVisibility(false);
			this.swapPsDetailsDivVisibility(false,selectedVal);
		}
		else {
			this.swapEditCloneButtonsDisability(false);
			this.swapObjectDivVisibility(true);
			this.swapPsDetailsDivVisibility(true,selectedVal);
			this.getObjectPermissionsFromServer(component,event);
		}
	},

	permissionSetEditServerCall: function(){
		////console.log("Edit click");
	},

	permissionSetCloneServerCall: function(){
		////console.log("Clone click");
	},

	swapEditCloneButtonsDisability: function(option){
		$('#permissionSetEditBtn').prop("disabled",option);
		$('#permissionSetCloneBtn').prop("disabled",option);
	},

	swapObjectDivVisibility: function(option){
		if(option){
			$('#mainDivForAllSubDivs').show('slow');
		}
		else {
			$('#mainDivForAllSubDivs').slideUp('slow');
		}
	},

	swapPsDetailsDivVisibility: function(option,individualPSetId){
		if(option){
			$('#PermissionSetDetailsDiv').children().hide();
			//////console.log("showing PSet Details Div: " + individualPSetId);
			$('#'+individualPSetId+'IndividualDiv').show('slow');
		}
		else {
			$('#PermissionSetDetailsDiv').children().hide();
			//////console.log("hiding PSet Details Div: " + individualPSetId);
			$('#'+individualPSetId+'IndividualDiv').slideUp('slow');
		}
	},

	getObjectPermissionsFromServer : function(component,event) {
		//getObjectPermissionsConcerningPermissionSet

		////console.log("Calling getAllObjectData from PsObject id: " + $('#'+event.srcElement.id).val());

		var action = component.get("c.getAllObjectData");
		action.setParams({ PSetId : $('#'+event.srcElement.id).val()});

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				////console.log("response of first obj's fieldDetails: " + response.getReturnValue()[0].fieldDetails);

				// ////console.log("response read : " + response.getReturnValue()[0].objPermissions.read);
				// ////console.log("response edit : " + response.getReturnValue()[0].objPermissions.edit);
				// ////console.log("response create : " + response.getReturnValue()[0].objPermissions.create);
				// ////console.log("response viewAll : " + response.getReturnValue()[0].objPermissions.viewAll);
				// ////console.log("response modifyAll : " + response.getReturnValue()[0].objPermissions.modifyAll);
				// ////console.log("response deleteData : " + response.getReturnValue()[0].objPermissions.deleteData);

				component.set("v.objectNames", response.getReturnValue());
				//console.log("Check this:" + response.getReturnValue());

				var objectDetailsWithPermissionsasJSON = JSON.stringify(response.getReturnValue());
				//console.log("objectDetailsWithPermissionsasJSON : " + objectDetailsWithPermissionsasJSON);

				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"read":false')){
					// make all read true
					$('#readforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"viewAll":false')){
					// make all viewAll true
					$('#viewAllforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"modifyAll":false')){
					// make all modifyAll true
					$('#modifyAllforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"edit":false')){
					// make all edit true
					$('#editforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"deleteData":false')){
					// make all deleteData true
					$('#deleteforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"create":false')){
					// make all create true
					$('#createforAllObjsChkBox').prop('checked',true);
				}

				component.set("v.allObjectDetails", this.addObjDetailsToListofObjs(response.getReturnValue(), $('#'+event.srcElement.id).val()));
			}
			else if(state === "ERROR"){
				////console.log("There's an error at getObjectPermissionsFromServer");
				////console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
		// }
	},

	checkIfDataHasRequiredString : function(Data, stringToSearch){

		if(Data.search(stringToSearch) == -1) {
			return false;
		}
		else {
			return true;
		}
	},

	permissionSetCreateNewServerCall: function(option){
		////console.log("Create New click");
	},

	// contactServerForObjs : function(component) {
	// 	//creating a DS for storing Key - Obj pair
	// 	var keyObjPair = new Array();
	// 	var action = component.get("c.getAllObjects");
	// 	////console.log("Calling getAllObjects from PsObject");
	// 	action.setCallback(this, function(response) {
	// 		var state = response.getState();
	// 		$A.log("Check Status: "+ response.getState());
	//
	// 		if (component.isValid() && state === "SUCCESS") {
	// 			////console.log("response.getReturnValue()[0].objName : " + response.getReturnValue()[0].objName);
	// 			component.set("v.objectNames",response.getReturnValue());
	// 			component.set("v.allObjectDetails", response.getReturnValue());
	// 		}
	// 		else if(state === "ERROR"){
	// 			////console.log("There's an error");
	// 			////console.log("Errors", response.getError());
	// 		}
	// 	});
	// 	$A.enqueueAction(action);
	//
	// },

	// objectSelected: function(cmp,event) {
	// 	if($('#'+event.srcElement.id).val() == '+') {
	// 		//console.log("inside object +");
	// 		this.contactServerForFields();
	// 		// $('#'+event.srcElement.id).val('-');
	// 		$('#'+event.srcElement.id + 'fieldDiv').show('slow');
	// 	}
	// 	else {
	// 		//console.log("inside object -");
	// 		$('#'+event.srcElement.id).val('+');
	// 		$('#'+event.srcElement.id + 'fieldDiv').slideUp('slow');
	// 	}
	// },


	objectSelected: function(cmp,event) {
		if($('#'+event.srcElement.id).val() == '+') {
			//console.log("inside object +");
			this.contactServerForFields(cmp, event);
			$('#'+event.srcElement.id).val('-');
			$('#'+event.srcElement.id + 'fieldDiv').show('slow');
		}
		else {
			//console.log("inside object -");
			$('#'+event.srcElement.id).val('+');
			$('#'+event.srcElement.id + 'fieldDiv').slideUp('slow');
		}
	},

	contactServerForFields: function(component, event) {
		//creating a DS for storing Key - Obj pair
		var keyFieldPair = new Array();

		////console.log("Obj Key: " + event.srcElement.id);

		//get global stored objs data
		var allObjDataForStoringFieldData = component.get("{!v.allObjectDetails}");
		var action = component.get("c.getAllFieldData");
		action.setParams({ selectedObject : event.srcElement.id , selectedPSet : $('#permissionSetNamesddl').val() });
		////console.log("Calling getAllFieldData from contactServerForFields");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				//////console.log("result from contactServerForFields: " + response.getReturnValue());
				if(response.getReturnValue() != null) {
					var fieldDetailsWithPermissionsasJSON = JSON.stringify(response.getReturnValue());
					// console.log("fieldDetailsWithPermissionsasJSON : " + fieldDetailsWithPermissionsasJSON);
					if(!this.checkIfDataHasRequiredString(fieldDetailsWithPermissionsasJSON, '"fieldRead":false')){
						// make all read true
						$('#' + event.srcElement.id + 'readForAllFieldsofanIndividualObj').prop('checked',true);
					}
					if(!this.checkIfDataHasRequiredString(fieldDetailsWithPermissionsasJSON, '"fieldEdit":false')){
						// make all edit true
						$('#' + event.srcElement.id + 'editForAllFieldsofanIndividualObj').prop('checked',true);
					}


					var allObjectData = component.get("v.objectNames");
					////console.log("check mate: " + allObjectData);
					for(var i=0;i<allObjectData.length;i++) {
						if(allObjectData[i].key == event.srcElement.id) {
							////console.log("calling from inside for-> if condition of comparing object key value and assigning field details");
							if(allObjectData[i].fieldDetails == null) {
								////console.log("Contacting Server for Field Data");
								allObjectData[i].fieldDetails = response.getReturnValue();
								var fieldDetails = [];
								for(var fieldCount = 0;fieldCount<allObjectData[i].fieldDetails.length; fieldCount++) {
									// //console.log('allObjectData[i].fieldDetails[fieldCount].fieldName : ' + allObjectData[i].fieldDetails[fieldCount].fieldName);
									// //console.log('allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId: ' + allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId);
									var fieldPermissionsConcerningObjnPSet = this.createFieldPermissionsClass(allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldRead, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldEdit);
									var fieldDetailsObj = this.createFieldDetailsClass(allObjectData[i].fieldDetails[fieldCount].fieldName, allObjectData[i].fieldDetails[fieldCount].fieldLabel, fieldPermissionsConcerningObjnPSet);
									fieldDetails.push(fieldDetailsObj);
								}
								allObjDataForStoringFieldData[i].fieldDetails = fieldDetails;
								//component.set("v.allObjectDetails", this.addFieldDetailsToListofObjs(component,response.getReturnValue(), event.srcElement.id, $('#permissionSetNamesddl').val()));
								////console.log("After adding Field Details to the global variable: " + component.get("v.allObjectDetails"));
								component.set("v.objectNames",allObjectData);
								break;
							}
							else {
								break;
							}
						}
					}
					component.set("v.allObjectDetails", allObjDataForStoringFieldData);
				}
			}
			else if(state === "ERROR"){
				////console.log("There's an error at contactServerForFields");
				////console.log("Errors", response.getError());
			}

			//console.log("This is here");
		});
		$A.enqueueAction(action);
	},

	// getFieldPermissionsFromServer : function(component, event) {
	// 	//getFieldPermissionsConcerningPSetnObj
	// 	// try{
	//
	// 	////console.log("Calling getFieldPermissionsConcerningPSetnObj from PsObject id: " + $('#'+event.srcElement.id).val());
	// 	var action = component.get("c.getFieldPermissionsConcerningPSetnObj");
	// 	action.setParams({ PSetId : $('#permissionSetNamesddl').val()});
	// 	action.setParams({ ObjName : $('#' + event.srcElement.id).val()});
	// 	action.setCallback(this, function(response) {
	// 		var state = response.getState();
	// 		////console.log("Check Status: "+ response.getState());
	//
	// 		if (component.isValid() && state === "SUCCESS") {
	// 			////console.log("response from getFieldPermissionsFromServer : " + response.getReturnValue());
	// 			//////console.log("0th value Obj Name: "+response.getReturnValue()[0].objectClassObject.objName);
	// 			//////console.log("1st value Obj Name: "+response.getReturnValue()[1].objectClassObject.objName);
	// 			//////console.log("2nd value Obj Name: "+response.getReturnValue()[2].objectClassObject.objName);
	// 			//component.set("v.objectNames",response.getReturnValue());
	//
	// 		}
	// 		else if(state === "ERROR"){
	// 			////console.log("There's an error at getFieldPermissionsFromServer");
	// 			////console.log("Errors", response.getError());
	// 		}
	// 	});
	// 	$A.enqueueAction(action);
	//
	// },

	opennCloseEditPermissionsonAllObjs : function(cmp, event) {
		this.swapPlusandMinusButton('PointerForEditPermissionsonAllObjs','editPermissionsonAllObjs');
	},

	opennCloseEditPermissionsonAllFieldsofAllObjs : function(cmp, event) {
		this.swapPlusandMinusButton('PointerForEditPermissionsonAllFieldsofAllObjs','editPermissionsonAllFieldsofAllObjs');
	},

	opennCloseEditPermissionsonIndividualObjectsandFields : function(cmp, event) {
		this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
	},

	//common methods
	swapPlusandMinusButton : function(elementNameForPointer, displayElementName) {
		////console.log("plus clicked: " + $('#'+ elementNameForPointer).val());
		if($('#'+ elementNameForPointer).val() == '*' ||$('#'+ elementNameForPointer).val() == '+'){
			$('#'+ displayElementName).show('slow');
			$('#'+ elementNameForPointer).val('-');
			return '+';
			//this.contactServerForFields(cmp,event);
		}
		else if($('#'+ elementNameForPointer).val() == '-'){
			$('#'+ displayElementName).slideUp('slow');
			$('#'+ elementNameForPointer).val('+');
			return '-';
		}
	},

	//NOTE: All of the below methods are related to 'Individual Permission Check box Click Server Calls'

	individualObjectReadPermissionServerCall : function(cmpt, event) {
		//individual Object Read Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "read", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectCreatePermissionServerCall : function(cmpt, event) {
		////individual Object Create Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "create", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectEditPermissionServerCall : function(cmpt, event) {
		//individual Object Edit Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "edit", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectDeletePermissionServerCall : function(cmpt, event) {
		//individual Object Delete Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "deleteData", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectViewAllPermissionServerCall : function(cmpt, event) {
		//individual Object View All Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "viewAll", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectModifyAllPermissionServerCall : function(cmpt, event) {

		//individual Object ModifyAll Permission
		this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "modifyAll", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);

	},

	handleAllIndividualObjPermissionsCheckBox : function(allObjsDataForHandlingIndiObjPermissions, selectedPermissionObjKey, typeOfPermission, trueOrfalse) {

		//////console.log("inside handleAllIndividualObjPermissionsCheckBox: " + allObjsDataForHandlingIndiObjPermissions);
		for(var objCount = 0; objCount<allObjsDataForHandlingIndiObjPermissions.length ; objCount++){
			//////console.log("inside for loop of handleAllIndividualObjPermissionsCheckBox: " + allObjsDataForHandlingIndiObjPermissions[objCount].key);
			if(allObjsDataForHandlingIndiObjPermissions[objCount].key == selectedPermissionObjKey) {
				//////console.log("inside if condition of obj key comparision");
				if(typeOfPermission == "read") {

					if(trueOrfalse) {
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						if((allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create == false) && (allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit == false) && (allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData == false) && (allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll == false) && (allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll == false)) {
							allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = false;
						}
					}
				}
				else if(typeOfPermission == "create") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = false;
					}
				}
				else if(typeOfPermission == "edit") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						if((allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData == false) && (allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll == false)) {
							allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = false;
						}
					}
				}
				else if(typeOfPermission == "deleteData") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						if((allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll == false)) {
							allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
						}

					}
				}
				else if(typeOfPermission == "viewAll") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						if((allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll == false)) {
							allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = false;
						}
					}
				}
				else if(typeOfPermission == "modifyAll") {
					//////console.log("inside modifyAll on indi obj");
					if(trueOrfalse){
						//////console.log("inside modifyAll on indi obj trueOrfalse, " + trueOrfalse);
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = true;
					}
					else {
						//////console.log("inside modifyAll on indi obj trueOrfalse, " + trueOrfalse);
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
					}
				}

			}
		}

		return allObjsDataForHandlingIndiObjPermissions;
	},

	//NOTE: All of the below methods are related to 'All group Permission Check box Click Server Calls'

	readforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// read for All Objs Check box
		// check read = true for all objs
		//readforAllObjsChkBox

		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in readforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.read = true;
			}
		}
		else {
			if($('#createforAllObjsChkBox').is(':checked')) {
				$('#readforAllObjsChkBox').prop('checked',true);
			}
			else if($('#editforAllObjsChkBox').is(':checked') ) {
				$('#readforAllObjsChkBox').prop('checked',true);
			}
			else if($('#deleteforAllObjsChkBox').is(':checked')){
				$('#readforAllObjsChkBox').prop('checked',true);
			}
			else if($('#viewAllforAllObjsChkBox').is(':checked')) {
				$('#readforAllObjsChkBox').prop('checked',true);
			}
			else if($('#modifyAllforAllObjsChkBox').is(':checked')) {
				$('#readforAllObjsChkBox').prop('checked',true);
			}
			else {
				for(var i=0;i<allObjects.length;i++) {
					allObjects[i].objPermissions.read = false;
				}
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
	},

	createforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check create = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in createforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.create = true;
				allObjects[i].objPermissions.read = true;
				$('#readforAllObjsChkBox').prop('checked',true);
			}
		}
		else {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.create = false;
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
	},

	editforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check edit = true for all
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in editforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {

			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.edit = true;
				allObjects[i].objPermissions.read = true;
				$('#readforAllObjsChkBox').prop('checked',true);
			}
		}
		else {
			if($('#deleteforAllObjsChkBox').is(':checked')) {
				$('#editforAllObjsChkBox').prop('checked',true);
			}
			else if($('#modifyAllforAllObjsChkBox').is(':checked')) {
				$('#editforAllObjsChkBox').prop('checked',true);
			}
			else {
				for(var i=0;i<allObjects.length;i++) {
					allObjects[i].objPermissions.edit = false;
				}
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);

	},

	deleteforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check delete = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in deleteforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.deleteData = true;
				allObjects[i].objPermissions.read = true;
				allObjects[i].objPermissions.edit = true;
				$('#readforAllObjsChkBox').prop('checked',true);
				$('#editforAllObjsChkBox').prop('checked',true);
			}
		}
		else {
			if($('#modifyAllforAllObjsChkBox').is(':checked')) {
				$('#deleteforAllObjsChkBox').prop('checked',true);
			}
			else {
				for(var i=0;i<allObjects.length;i++) {
					allObjects[i].objPermissions.deleteData = false;
				}
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);

	},

	viewAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check viewAll = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in viewAllforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.viewAll = true;
				allObjects[i].objPermissions.read = true;
				$('#readforAllObjsChkBox').prop('checked',true);
			}
		}
		else {
			if($('#modifyAllforAllObjsChkBox').is(':checked')) {
				$('#viewAllforAllObjsChkBox').prop('checked',true);
			}
			else {
				for(var i=0;i<allObjects.length;i++) {
					allObjects[i].objPermissions.viewAll = false;
				}
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);

	},

	modifyAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check modifyAll = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in modifyAllforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.modifyAll = true;
				allObjects[i].objPermissions.read = true;
				allObjects[i].objPermissions.edit = true;
				allObjects[i].objPermissions.deleteData = true;
				allObjects[i].objPermissions.viewAll = true;
				$('#readforAllObjsChkBox').prop('checked',true);
				$('#editforAllObjsChkBox').prop('checked',true);
				$('#deleteforAllObjsChkBox').prop('checked',true);
				$('#viewAllforAllObjsChkBox').prop('checked',true);
			}
		}
		else {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.modifyAll = false;
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);

	},

	//NOTE: Below two methods are related to Advanced Permissions on All Fields of All objects

	readForAllFieldsOfAllObjsOnClickHelperCall : function(cmp, event) {
		// read for all fields of all objects
		var allObjectsData = cmp.get("{!v.objectNames}");
		//loop through it and make every read of all the (objs) fields TRUE

		for(var i=0; i<allObjectsData.length; i++) {
			if(allObjectsData[i].fieldDetails != null) {
				var individualObjFieldsDataasJsonString = JSON.stringify(allObjectsData[i].fieldDetails);
				// console.log("Field Details as String : " + individualObjFieldsDataasJsonString);
				var parsedJsonData;
				if($('#readForAllFieldsOfAllObjs').is(':checked')) {
					// console.log("readForAllFieldsOfAllObjs is checked true");
					parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldRead":false', '"fieldRead":true'));
					// console.log("field details after parsing back : " + JSON.stringify(parsedJsonData));
					$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', true);
				}
				else {
					parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldRead":true', '"fieldRead":false'));
					parsedJsonData = JSON.parse(this.matchPatternandReplace(JSON.stringify(parsedJsonData), '"fieldEdit":true', '"fieldEdit":false'));
					$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', false);
					$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', false);
				}
				allObjectsData[i].fieldDetails = parsedJsonData;
			}
		}
		cmp.set("v.objectNames", allObjectsData);
		//id="{!objs.key + 'readForAllFieldsofanIndividualObj'}"
	},

	editForAllFieldsOfAllObjsOnClickHelperCall : function(cmp, event) {
		// edit for all fields of all objects
		var allObjectsData = cmp.get("{!v.objectNames}");
		//loop through it and make every read of all the (objs) fields TRUE

		for(var i=0; i< allObjectsData.length; i++) {
			if(allObjectsData[i].fieldDetails != null) {
				var individualObjFieldsDataasJsonString = JSON.stringify(allObjectsData[i].fieldDetails);
				var parsedJsonData;
				if($('#editForAllFieldsOfAllObjs').is(':checked')) {
					parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldEdit":false', '"fieldEdit":true'));
					$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', true);
					parsedJsonData = JSON.parse(this.matchPatternandReplace(JSON.stringify(parsedJsonData), '"fieldRead":false', '"fieldRead":true'));
					$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', true);
				}
				else {
					parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldEdit":true', '"fieldEdit":false'));
					$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', false);
				}
				allObjectsData[i].fieldDetails = parsedJsonData;
			}
		}
		cmp.set("v.objectNames", allObjectsData);
	},

	matchPatternandReplace : function(dataString, searchString, replacementString){
		//dataString.split(searchString).join(replacementString);
		// dataString.replace(searchString, replacementString);
		// new RegExp(search, 'g')
		dataString = dataString.replace(new RegExp(searchString, 'g'), replacementString);
		return dataString;
	},

	//NOTE: METHODS to SAVE FIELD Level Changes

	readForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
		//console.log("### inside READ & id of the checked CheckBox: " + event.srcElement.id);
		try{
			this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
			var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
			if($('#' + event.srcElement.id).is(':checked')) {
				//make it true
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', true);
				//console.log("All Objects Data after changes in Field Permissions @ READ: " + allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
			}
			else {
				//check if edit is true?
				$('#' + event.srcElement.id).prop('checked', true);
				if(!($('#editForAllFieldsofanIndividualObj').is(':checked'))) {
					//make it false only when edit is false
					$('#' + event.srcElement.id).prop('checked', false);
					var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', false);
					cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
					cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
				}
			}
		}
		catch(error){
			//console.log("error at readForAllFieldsofanIndividualObjClickHelperCall: " + error);
		}
	},

	editForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
		try{
			//console.log("### inside EDIT & id of the checked CheckBox: " + event.srcElement.id);
			this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
			var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
			if($('#' + event.srcElement.id).is(':checked')) {
				//make it true
				//console.log("Obj Key value at Field All Edit checkbox: " + event.srcElement.name);
				//console.log("For All edit is checked true");
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', true);
				//console.log("All Objects Data after changes in Field Permissions @ EDIT: " + allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
				$('#' + event.srcElement.name + 'readForAllFieldsofanIndividualObj').prop('checked', true);
			}
			else {
				//console.log("For All edit is checked false");
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', false);
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
			}
		}
		catch(error){
			//console.log("error at editForAllFieldsofanIndividualObjClickHelperCall: " + error);
		}
	},

	readForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp,event) {
		//Individual Obj Read Permissions Click
		// get field Label (which is combo of event.srcElement.id + 'indiFieldRead') with event.srcElement.id
		// compare it with looping through the list of fieldDetails
		// true the required Read value and you are good to go


		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);
		var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualFields(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "read", $('#' + event.srcElement.id).is(':checked'));
		cmp.set("v.objectNames", allObjsDataforIndividualField);
		//console.log("allObjsDataforIndividualField : " + allObjsDataforIndividualField);
		cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);

	},

	editForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp, event) {
		//Individual Obj Edit Permissions Click
		this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);
		var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualFields(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "edit", $('#' + event.srcElement.id).is(':checked'));
		cmp.set("v.objectNames", allObjsDataforIndividualField);
		cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);
	},


	//TODO:
	// have to implement, storing changeddata into global variable
	// store individual object n field permission changes in updateWhatsChanged and thus into global changed list


	implementCheckboxManipulationforAllFields : function(allObjDataForFieldsData, objectkey, readOredit, trueOrfalse) {
		try{
			// //console.log("allObjDataForFieldsData: "+ allObjDataForFieldsData);
			// //console.log("objectkey: "+ objectkey);
			// //console.log("readOredit: "+ readOredit);
			// //console.log("trueOrfalse: "+ trueOrfalse);

			for(var i = 0; i < allObjDataForFieldsData.length; i++) {
				if(allObjDataForFieldsData[i].key == objectkey) {

					//this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);

					for(var j=0;j<allObjDataForFieldsData[i].fieldDetails.length;j++) {

						if(readOredit == 'read' && trueOrfalse){
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = true;
						}
						else if(readOredit == 'read' && (!trueOrfalse)){
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = false;
						}
						else if(readOredit == 'edit' && trueOrfalse) {
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = true;
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = true;
						}
						else if(readOredit == 'edit' && (!trueOrfalse)) {
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = false;
						}
					}

					break;
				}
			}
			return allObjDataForFieldsData;
		}
		catch(error) {
			//console.log("error at implement Check Manipulation: " + error);
		}
	},


	//NOTE: Implementing Individual Field Read/Edit CheckBox

	implementCheckboxManipulationforIndividualFields : function(allObjsNamesForIndiFieldData, indiCheckBoxNameForObjKey, indiCheckBoxValueForFieldLabel, readOredit, trueOrfalse) {

		try{
			////console.log("Indi Field Details: ");
			////console.log("indiCheckBoxNameForObjKey: " + indiCheckBoxNameForObjKey);
			////console.log("indiCheckBoxValueForFieldLabel: " + indiCheckBoxValueForFieldLabel);
			// ////console.log("readOredit: " + readOredit);
			// ////console.log("trueOrfalse: " + trueOrfalse);

			for(var objCount = 0; objCount < allObjsNamesForIndiFieldData.length; objCount++) {
				if(allObjsNamesForIndiFieldData[objCount].key == indiCheckBoxNameForObjKey) {
					////console.log("inside obj comparision");
					for(var fieldCount = 0;fieldCount < allObjsNamesForIndiFieldData[objCount].fieldDetails.length; fieldCount++) {
						if(allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldLabel == indiCheckBoxValueForFieldLabel) {
							// //console.log("inside field label comparision: " + allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldLabel);
							// //console.log("readOredit: " + readOredit);
							// //console.log("trueOrfalse: " + trueOrfalse);
							//console.log("This is pretty important check regarding field Permission Changed Id : " + allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId);
							if(readOredit == "read" && trueOrfalse == true) {
								////console.log("inside read and true");
								allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = true;
							}
							else if(readOredit == "read" && trueOrfalse == false) {
								if(allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit == false) {
									allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = false;
								}
							}
							if(readOredit == "edit" && trueOrfalse == true) {
								////console.log("inside edit and true");
								allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldRead = true;
								allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit = true;
							}
							if(readOredit == "edit" && trueOrfalse == false) {
								allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldPermissions.fieldEdit = false;
							}
							break;
						}
						else {
							////console.log("outside field label comparision: " + allObjsNamesForIndiFieldData[objCount].fieldDetails[fieldCount].fieldLabel);
						}
						//var requiredFieldDetails = allObjsNamesForIndiFieldData[objCount].fieldDetails;
						//this.implementCheckboxManipulationforIndividualFields(indiCheckBoxId)
					}
					break;
				}
			}
			return allObjsNamesForIndiFieldData;
		}
		catch(error) {
			////console.log("error at implement Check Manipulation: " + error);
		}
	},

	createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
		var PermissionSetDetails = {
			label : label,
			apiName : pSetName,
			id : pSetId,
			description : pSetDescription,
			namespacePrefix : pSetNameSpacePrefix,
			userLicenseId : pSetULicense,
			createdDate : pSetCreatedDate
		}
		return PermissionSetDetails;
	},

	createObjDetailsClass : function(objpluralLabel, objLabel, objName, objKey, pSetId, objPermissions, fieldDetails) {
		var objDetails = {
			pluralLabel : objpluralLabel,
			label : objLabel,
			name : objName,
			key : objKey,
			pSetId : pSetId,
			objPermissions : objPermissions,
			fieldDetails : fieldDetails
		}

		return objDetails;
	},

	createObjPermissionsClass : function(objPermissionId, objRead, objCreate, objEdit, objDelete, objviewAll, objmodifyAll) {
		var objPermissions = {
			objPermissionId : objPermissionId,
			read : objRead,
			create : objCreate,
			edit : objEdit,
			delete : objDelete,
			viewAll : objviewAll,
			modifyAll : objmodifyAll
		}

		return objPermissions;
	},

	createFieldPermissionsClass : function(fieldPermissionsId, fieldRead, fieldEdit) {
		var fieldPermisisons = {
			fieldPermissionsId : fieldPermissionsId,
			fieldRead : fieldRead,
			fieldEdit : fieldEdit
		}

		return fieldPermisisons;
	},

	createFieldDetailsClass : function(fieldName, fieldLabel, fieldPermissions) {
		var fieldDetails = {
			fieldName : fieldName,
			fieldLabel : fieldLabel,
			fieldPermissions : fieldPermissions
		}
		return fieldDetails;
	},



	addObjDetailsToListofObjs : function(objDetailsFromServer, pSetId){
		try {
			//NOTE:Add all the object details here
			//TODO: Adding Obj Details to the json (being used here as class)
			var allObjDetails = [];

			for(var i=0;i<objDetailsFromServer.length;i++) {
				//create Field Details Object
				// var fieldDetails = [];
				// for(var fieldCount; objDetailsFromServer.fieldDetails.length; fieldCount++){
				// 		var fieldPermissionsConcerningObjnPSet = createFieldPermissionsClass(objDetailsFromServer.fieldDetails[fieldCount].fieldPermissions.fieldRead, objDetailsFromServer.fieldDetails[fieldCount].fieldPermissions.fieldEdit);
				// 		var fieldDetailsObj = createFieldDetailsClass(objDetailsFromServer.fieldDetails[fieldCount].fieldName, objDetailsFromServer.fieldDetails[fieldCount].fieldLabel, fieldPermissionsConcerningObjnPSet);
				// 		fieldDetails.push(fieldDetailsObj);
				// }

				// create Obj Permisisons Object
				//objectPermissionsObj
				var objPermissionsAsObject = this.createObjPermissionsClass(objDetailsFromServer[i].objPermissions.objPermissionsId,objDetailsFromServer[i].objPermissions.read, objDetailsFromServer[i].objPermissions.create, objDetailsFromServer[i].objPermissions.edit, objDetailsFromServer[i].objPermissions.deleteData, objDetailsFromServer[i].objPermissions.viewAll, objDetailsFromServer[i].objPermissions.modifyAll);

				// create Obj Details Object
				allObjDetails.push(this.createObjDetailsClass(objDetailsFromServer[i].pluralLabel, objDetailsFromServer[i].label, objDetailsFromServer[i].name, objDetailsFromServer[i].key, pSetId, objPermissionsAsObject, null));


			}


			return allObjDetails;
		}
		catch(error){
			////console.log("Theres an error at addObjDetailsToListofObjs: " + error);
		}

	},

	addFieldDetailsToListofObjs : function(component,fieldDetailsConcerningObj, ObjKey, pSetId) {
		//allObjectDetails
		var allObjectDetailswithOutConcernedFieldDetails = component.get("{!v.allObjectDetails}");
		var allFieldDetailsOfanObj = [];
		for(var i=0; i<fieldDetailsConcerningObj.length; i++) {
			//creating Field Permissions Obj
			var individualFieldPermissions = this.createFieldPermissionsClass(fieldDetailsConcerningObj[i].fieldPermissions.fieldPermissionsId,fieldDetailsConcerningObj[i].fieldPermissions.read,fieldDetailsConcerningObj[i].fieldPermissions.edit);

			//creating Field Details Obj

			allFieldDetailsOfanObj.push(this.createFieldDetailsClass(fieldDetailsConcerningObj[i].name, fieldDetailsConcerningObj[i].label, individualFieldPermissions));
		}

		for(var objCount; objCount<allObjectDetailswithOutConcernedFieldDetails.length; objCount++) {
			if(allObjectDetailswithOutConcernedFieldDetails[objCount].Key == ObjKey && allObjectDetailswithOutConcernedFieldDetails[objCount].PSetId == pSetId) {
				allObjectDetailswithOutConcernedFieldDetails[objCount].FieldDetails = allFieldDetailsOfanObj;
				break;
			}
		}
		return allObjectDetailswithOutConcernedFieldDetails;

	},

	//NOTE: Save function forever
	pSetChangesSave : function(cmp, event) {
		//testing pSetDescriptionChangeHelperCall
		try {
			var changedRecordedObj =  cmp.get("{!v.changedRecordedObj}");
			if(changedRecordedObj != null) {

				////console.log("changedRecordedObj in pSetChangesSave is not null");
				////console.log("exactly upfront to sending req to server: " + changedRecordedObj.PermissionSetId);
				var pSetDetailsObj = cmp.get("{!v.text}");
				var objFieldData = cmp.get("{!v.changedAllObjectDetails}");
				console.log('calling from pSetChangesSave');
				var action = cmp.get("c.savePSetDetailsChanges");
				//console.log("Json String of Changes Recorded : " + JSON.stringify(changedRecordedObj));
				//////console.log("JSON.stringify(pSetDetailsObj): " + JSON.stringify(pSetDetailsObj));
				//console.log("JSON String of Obj n Field Changes : " + JSON.stringify(objFieldData));

				var changedRecordedObjasJson;
				var pSetDetailsObjasJson;
				var objFieldDataasJson;

				changedRecordedObjasJson = JSON.stringify(changedRecordedObj);

				//if(typeof(pSetDetailsObj) !== "undefined" || pSetDetailsObj !== null)
				if(pSetDetailsObj) {
					////console.log("pSetDetailsObj val: " + pSetDetailsObj);
					pSetDetailsObjasJson = JSON.stringify(pSetDetailsObj);
				}
				else {
					pSetDetailsObjasJson = null;
				}
				if(objFieldData != null) {
					objFieldDataasJson = JSON.stringify(objFieldData);
				}
				else {
					objFieldDataasJson = null;
				}
				action.setParams({ changesRecordedObj : changedRecordedObjasJson, changedPSetData : pSetDetailsObjasJson, changedObjData : objFieldDataasJson });

				action.setCallback(this, function(response) {
					var state = response.getState();
					//console.log("response result: " + response.getReturnValue());
					if(state === "SUCCESS" && response.getReturnValue()) {
						$('#successorErrorMessageLabel').css('color', 'green');
						$('#successorErrorMessageLabel').html("Changes Saved!");
						//console.log("its a success");
					}
					else if(!response.getReturnValue()){
						$('#successorErrorMessageLabel').css('color', 'red');
						$('#successorErrorMessageLabel').html("There's an Error");
						//console.log("its an error");
					}
					else if(state === "ERROR") {
						$('#successorErrorMessageLabel').css('color', 'red');
						$('#successorErrorMessageLabel').html("There's an Error");
						//console.log("its an error");
					}
				});

				$A.enqueueAction(action);
			}
			else {
				////console.log("changedRecordedObj in pSetChangesSave is null");
			}
		}
		catch(error) {
			////console.log("error at pSetChangesSave: " + error);
		}
	},

	//NOTE: PermissionSet Details Elements on change helper Events

	pSetDescriptionChangeHelperCall : function(cmp, event) {
		//NOTE: PSet Description limit is 255 chars ONLY
		////console.log("Description Change fired");
		requiredChangedObject = cmp.get("{!v.text}")

		if(requiredChangedObject == null) {
			//////console.log("its inside undefined and now setting up value and value of allPsDetails: " + cmp.get("{!v.allPsDetails}"));
			var actualPSetDetails = cmp.get("{!v.allPsDetails}");
			cmp.set("v.text", actualPSetDetails);
		}

		requiredChangedObject = cmp.get("{!v.text}");

		var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
		var descriptionChangedText = $('#'+event.srcElement.id).val();

		for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
			if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
				////console.log("inside if conditions and descriptionChangedText val: " + descriptionChangedText);
				requiredChangedObject[pSetCount].description = descriptionChangedText;
				break;
			}
		}

		var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
		if(changedRecordedObj == null) {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
		}
		else {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
		}
		cmp.set("v.text", requiredChangedObject);
	},

	pSetNameChangeHelperCall : function(cmp, event) {
		////console.log("APIName Change fired");
		requiredChangedObject = cmp.get("{!v.text}");
		if(requiredChangedObject == null) {
			//////console.log("its inside undefined and now setting up value and value of allPsDetails: " + cmp.get("{!v.allPsDetails}"));
			var actualPSetDetails = cmp.get("{!v.allPsDetails}");
			cmp.set("v.text", actualPSetDetails);
		}

		requiredChangedObject = cmp.get("{!v.text}");

		var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
		var apiNameChangedText = $('#'+event.srcElement.id).val();

		for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
			if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
				//////console.log("inside if conditions and apiNameChangedText val: " + apiNameChangedText);
				requiredChangedObject[pSetCount].apiName = apiNameChangedText;
				break;
			}
		}
		//cmp.set("v.changedRecordedObj",this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
		var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
		if(changedRecordedObj == null) {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
		}
		else {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
		}
		cmp.set("v.text", requiredChangedObject);
	},

	pSetLabelChangeHelperCall : function(cmp, event) {
		////console.log("Name Change fired");
		requiredChangedObject = cmp.get("{!v.text}");
		if(requiredChangedObject == null) {
			var actualPSetDetails = cmp.get("{!v.allPsDetails}");
			cmp.set("v.text", actualPSetDetails);
		}

		requiredChangedObject = cmp.get("{!v.text}");

		var pSetIdOfThisElement = $('#'+event.srcElement.id).attr('name');
		var nameChangedText = $('#'+event.srcElement.id).val();

		for(var pSetCount=0; pSetCount < requiredChangedObject.length; pSetCount++) {
			if(requiredChangedObject[pSetCount].id == pSetIdOfThisElement) {
				requiredChangedObject[pSetCount].label = nameChangedText;
				break;
			}
		}
		var changedRecordedObj = cmp.get("{!v.changedRecordedObj}");
		if(changedRecordedObj == null) {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, null, null));
		}
		else {
			cmp.set("v.changedRecordedObj", this.updateWhatsChanged(pSetIdOfThisElement, true, changedRecordedObj.changesinObjPermissions, changedRecordedObj.changesinFieldPermissions));
		}
		cmp.set("v.text", requiredChangedObject);
	},


	// NOTE: This is for updating the Changes Object Data

	updateWhatsChanged: function(pSetId, permissionSetDetailsTorF, objPermissions, fieldPermissions) {
		changesInData = {
			PermissionSetId : pSetId,
			changesinPermissionSetDetails : permissionSetDetailsTorF,
			changesinObjPermissions :objPermissions,
			changesinFieldPermissions : fieldPermissions
		}
		return changesInData;
	},

	changesinObjPermsfxnCall : function(changedObjKey) {
		changedObjDetails = {
			Objkey : changedObjKey
		}
		return changedObjDetails;
	},

	changesinFieldPermsfxnCall : function(changedFieldName, changedObjKey) {
		changedFieldDetails = {
			FieldName : changedFieldName,
			Objkey : changedObjKey
		}
		return changedFieldDetails;
	},

	updateChangesinObjorFieldPermissions : function(cmp, pSetid, objOrField, changedObjKey, changedfieldName) {
		try {
			var objPermCHangesList = [];
			var FieldPermCHangesList = [];
			var changes = cmp.get("{!v.changedRecordedObj}");

			if(changedObjKey != null && changedfieldName == null) {
				////console.log("changedObjKey: " + changedObjKey);
				objPermCHangesList.push(this.changesinObjPermsfxnCall(changedObjKey));
			}
			if(changedObjKey != null && changedfieldName != null) {
				FieldPermCHangesList.push(this.changesinFieldPermsfxnCall(changedfieldName, changedObjKey));
			}

			if(changes == null) {
				////console.log("Inside changes is equal to null");
				changes = this.updateWhatsChanged(pSetid, false, objPermCHangesList, FieldPermCHangesList);
			}
			else {
				//var whatHaveChanged = cmp.get("{!v.changedRecordedObj}");
				if(objOrField == "Object" && changes.changesinObjPermissions == null) {
					changes.changesinObjPermissions = objPermCHangesList;
				}
				else if(objOrField == "Object" && changes.changesinObjPermissions != null) {
					////console.log("inside !null on changesinObjPermissions");

					if(changedObjKey != "Allqwerty") {
						var checkIfObjKeyAlreadyPresent = false;
						for(var changedObjCount = 0; changedObjCount<changes.changesinObjPermissions.length; changedObjCount++) {
							////console.log("changes.changesinObjPermissions[changedObjCount].Objkey: " + changes.changesinObjPermissions[changedObjCount].Objkey);
							if(changes.changesinObjPermissions[changedObjCount].Objkey == changedObjKey || changes.changesinObjPermissions[changedObjCount].Objkey == 'Allqwerty') {
								checkIfObjKeyAlreadyPresent = true;
								break;
							}
						}
						if(!checkIfObjKeyAlreadyPresent) {
							changes.changesinObjPermissions.push(this.changesinObjPermsfxnCall(changedObjKey));
						}
					}
					else {
						//empty the list and add only 'Allqwerty' to the List
						changes.changesinObjPermissions = objPermCHangesList;
					}
				}
				else if(objOrField == "Field" && changes.changesinFieldPermissions == null) {
					////console.log("inside objOrField = Field");
					changes.changesinFieldPermissions = FieldPermCHangesList;
				}
				else if(objOrField == "Field" && changes.changesinFieldPermissions != null) {

					if(changedfieldName != "Allqwerty") {
						var checkIfObjKeynFieldAlreadyPresent = false;
						for(var changedFieldCount = 0; changedFieldCount<changes.changesinFieldPermissions.length; changedFieldCount++) {
							if(changes.changesinFieldPermissions[changedFieldCount].Objkey == changedObjKey && (changes.changesinFieldPermissions[changedFieldCount].FieldName == changedfieldName || changes.changesinFieldPermissions[changedFieldCount].FieldName == 'Allqwerty')){
								////console.log("#################### its inside field change comparision");
								checkIfObjKeynFieldAlreadyPresent = true;
								break;
							}
						}
						if(!checkIfObjKeynFieldAlreadyPresent){
							changes.changesinFieldPermissions.push(this.changesinFieldPermsfxnCall(changedfieldName, changedObjKey));
						}
					}
					else {
						//empty the list and add only 'Allqwerty' to the List
						changes.changesinFieldPermissions = FieldPermCHangesList;
					}
				}
			}
			cmp.set("v.changedRecordedObj", changes);
		}
		catch(error) {
			////console.log("errors in updateChangesinObjorFieldPermissions: " + error);
		}
	}
	//}

})


//NOTE: changedRecordedObj : is the object of updateWhatsChanged

//NOTE: text : is the object of Permissions Set Changes

//NOTE: changedAllObjectDetails : Is the object of Object Details Changes
