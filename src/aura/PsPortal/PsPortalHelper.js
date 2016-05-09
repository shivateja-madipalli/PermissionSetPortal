({

	loadPermissionSetOptions: function(component) {
		//console.log("page load is called");
		this.clearAllAttributes(component);
		this.contactServertoGetPermissionSet(component);
		this.assigningValueToAInput(component);
	},

	pageRenderingCompleted : function(component, event) {
		// $(':input').attr('readonly','readonly');
	},

	showSpinnerHelperClass : function(component, event) {
		var spinner = component.find('spinner');
		var evt = spinner.get("e.toggle");
		evt.setParams({ isVisible : true });
		evt.fire();
	},

	assigningValueToAInput: function(cmp) {
		// var i = $('#permissionSetLi > : input');
		// i.val('@');

	},

	clearAllAttributes : function(cmp) {
		console.log('clearAllAttributes is called');
		var permissionSetNamesDataSetasInput_as_value = cmp.get("{!v.permissionSetNamesDataSetasInput}");
		if(permissionSetNamesDataSetasInput_as_value != undefined) {
			cmp.set("v.pSet_Values_for_comparisions", permissionSetNamesDataSetasInput_as_value);
			cmp.set("v.permissionSetNamesDataSetasInput", "");
		}
		var allPsDetails_as_value = cmp.get("{!v.allPsDetails}");
		if(allPsDetails_as_value != undefined) {
			cmp.set("v.allPsDetails", "");
		}
		var changedAllObjectDetails_as_value = cmp.get("{!v.changedAllObjectDetails}");
		if(changedAllObjectDetails_as_value != undefined) {
			cmp.set("v.changedAllObjectDetails", "");
		}

		//cmp.set("v.allObjectDetails", "");

		// cmp.set("v.objectNames", "");
		// cmp.set("v.fieldDetails", "");
	},

	//contact server to retrieve All Permission Sets of the Organization
	contactServertoGetPermissionSet: function(component) {
		var action = component.get('c.getAllPermissionSets');
		var all_permissionSet_details = component.get("{!v.allPsDetails}");
		if(all_permissionSet_details == null || all_permissionSet_details.length === 0) {
			action.setCallback(this, function(response) {
				var state = response.getState();

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
		}
	},

	addingPermissionSetNames : function(permissionSetNamesDataSetasInput) {

		var fragment = document.createDocumentFragment();
		var opt = document.createElement('option');
		opt.innerHTML = "Choose an option";
		opt.value = "NothingSelected";
		fragment.appendChild(opt);
		console.log('Everything is fine here 3');
		for(var i=0;i<permissionSetNamesDataSetasInput.length;i++) {

			opt = document.createElement('option');
			opt.innerHTML = permissionSetNamesDataSetasInput[i].label;
			opt.value = permissionSetNamesDataSetasInput[i].id;
			fragment.appendChild(opt);
		}
		var permissionsSet_Select = $('#permissionSetNamesddl');
		var length = permissionsSet_Select.children('option').length;
		if(length > 0 ) {
			permissionsSet_Select.empty();
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

	permissionSetNamesddlChangeHelperCall : function(component,event) {
		var selectedVal = $('#'+event.srcElement.id).val();
		if(selectedVal === "NothingSelected") {
			this.swapVisibilityOfButtons(true);
			this.swapObjectDivVisibility(false);
			this.swapPsDetailsDivVisibility(false,selectedVal);
		}
		else {
			this.swapEditCloneButtonsDisability(false);
			this.swapObjectDivVisibility(true);
			this.swapPsDetailsDivVisibility(true,selectedVal);
			this.getObjectPermissionsFromServer(component,event);
			this.disablingEverything();
		}
		$('creating_new_permissionSet_Details').hide();
	},

	//NOTE: Permission Set Edit Server call
	permissionSetEditServerCall: function(cmp, event){
		console.log("Edit click");
		this.enablingObjectLevelPermissions();
		this.enablingEverything();
		cmp.set("v.checkIf_edit_isClicked", true);
	},

	permissionSetCloneServerCall: function(){
		////console.log("Clone click");
	},

	swapEditCloneButtonsDisability: function(option){
		$('#permissionSetEditBtn').prop("disabled",option);
		//$('#permissionSetCloneBtn').prop("disabled",option);
	},

	swapObjectDivVisibility: function(option){
		if(option){
			$('#mainDivForAllSubDivs').show('slow');
		}
		else {
			$('#mainDivForAllSubDivs').slideUp('slow');
		}
	},

	swapPsDetailsDivVisibility: function(option,individualPSetId) {
		if(option) {
			$('#PermissionSetDetailsDiv').children().hide();
			console.log("showing PSet Details Div: " + individualPSetId);
			console.log('In swapPsDetailsDivVisibility: '+$('#'+individualPSetId+'IndividualDiv'));
			$('#PermissionSetDetailsDiv').show();
			$('#'+individualPSetId+'IndividualDiv').show('slow');
		}
		else {
			$('#PermissionSetDetailsDiv').children().hide();
			console.log("hiding PSet Details Div: " + individualPSetId);
			$('#PermissionSetDetailsDiv').hide();
			$('#'+individualPSetId+'IndividualDiv').slideUp('slow');
		}
	},

	getObjectPermissionsFromServer : function(component,event) {
		//getObjectPermissionsConcerningPermissionSet

		// var all_objectData = component.get("{!v.allObjectDetails}");
		// if(all_objectData == null || all_objectData.length === 0) {
		var action = component.get("c.getAllObjectData");
		action.setParams({ PSetId : $('#'+event.srcElement.id).val()});

		//var all_ObjectData = component.get("{!v.objectNames}");

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				console.log('callback in getObjectPermissionsFromServer is called');

				// ////console.log("response read : " + response.getReturnValue()[0].objPermissions.read);
				// ////console.log("response edit : " + response.getReturnValue()[0].objPermissions.edit);
				// ////console.log("response create : " + response.getReturnValue()[0].objPermissions.create);
				// ////console.log("response viewAll : " + response.getReturnValue()[0].objPermissions.viewAll);
				// ////console.log("response modifyAll : " + response.getReturnValue()[0].objPermissions.modifyAll);
				// ////console.log("response deleteData : " + response.getReturnValue()[0].objPermissions.deleteData);

				component.set("v.objectNames", response.getReturnValue());

				//console.log("Check this:" + response.getReturnValue());

				var objectDetailsWithPermissionsasJSON = JSON.stringify(response.getReturnValue());
				// console.log("objectDetailsWithPermissionsasJSON : " + objectDetailsWithPermissionsasJSON);

				// if(this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"objPermissions":')) {
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"read":false')){
					// make all read true
					// console.log('Inside READ');
					$('#readforAllObjsChkBox').prop('checked',true);
				}
				if(!this.checkIfDataHasRequiredString(objectDetailsWithPermissionsasJSON, '"viewAll":false')){
					// make all viewAll true
					// console.log('Inside VIEWALL');
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
				// }
				//component.set("v.allObjectDetails", "");
				//var x = this.addObjDetailsToListofObjs(response.getReturnValue(), $('#'+event.srcElement.id).val());
				//console.log('This should NOT BE EMPTY: ' + x);
				//component.set("v.allObjectDetails", x);
				// component.set("v.allObjectDetails", this.addObjDetailsToListofObjs(response.getReturnValue(), $('#'+event.srcElement.id).val()));
			}
			else if(state === "ERROR"){
				////console.log("There's an error at getObjectPermissionsFromServer");
				////console.log("Errors", response.getError());
			}
		});
		$A.enqueueAction(action);
		// }
		// else {
		// 	console.log('callback in getObjectPermissionsFromServer is NOT called');
		// }
	},

	//IDEA: For optimizing the code and to remove number of calls to server
	// 1) store every different PSet's object details in a list
	// 2) check if (the same Pset is selected again from the drop down list) object details are present in the list saved allObjsDataForChangingExpandBtnValue
	// 3) if they are available, populate to the front end
	//4) if not go touch server for data

	//IDEA: For code optimization and making fewer calls to server
	// while getting the Object details, we can also retrieve field details as the same DescribeSObject is used for retrieving
	// each Object's Fields
	// This way, only fewer calls are made to server
	// But, while retrieving Object details itself it may take longer time than expected

	//IDEA: For code optimization
	// While updating object / field permissions instead of updating single values, you can update a keyset
	// As of now, you are updating single values in each iteration like a for loop.

	checkIfDataHasRequiredString : function(Data, stringToSearch){

		if(Data.search(stringToSearch) == -1) {
			//console.log("INSIDE Couldn't find in checkIfDataHasRequiredString");
			return false;
		}
		else {
			//console.log("INSIDE found in checkIfDataHasRequiredString");
			return true;
		}
	},

	//NOTE: Permission Set CREATE NEW CLICK

	permissionSetCreateNewServerCall: function(component, event) {
		console.log("Create New click");

		//update global variable saying Create New is created
		component.set("v.checkIf_created_isClicked", true);

		//make visible false all required divs
		this.make_visible_false_AllRequiredDivs();

		//make visible true all required divs
		this.make_visible_true_AllRequiredDivs();

		//empty all the global variables
		this.clearAllAttributes(component);

		//empty extra global variables
		this.empty_extra_attributes(component);

		//close Edit Permissions On Individual Objs And Fields
		if($('#PointerForEditPermissionsonIndividualObjectsandFields').val() == "-") {
			this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
		}

		//load values into User License and make it visible
		this.loadUserLicenseValues(component);

		//load load all objects
		this.load_all_objects_forCreateNew(component);

		//make all checkbox's un select
		$("input:checkbox").removeAttr('checked');

		//enabling everything so that a new PSet details can be written
		this.enablingEverything();

		//disabling drop down list and edit button so that it their functionality will be locked
		this.disable_pSet_dropDownList_n_editBtn();
	},

	make_visible_false_AllRequiredDivs : function() {
		$('#PermissionSetDetailsDiv').slideUp('slow');
	},

	make_visible_true_AllRequiredDivs : function() {
		$('#mainDivForAllSubDivs').show('slow');
		$('#creating_new_permissionSet_Details').show('slow');
	},

	empty_extra_attributes : function(cmp) {
		//emptying extra global variables
		var allObjectDetails_as_Val = cmp.get("{!v.allObjectDetails}");
		var objectNames_as_Val = cmp.get("{!v.objectNames}");
		if(allObjectDetails_as_Val != undefined){
			cmp.set("v.allObjectDetails", "");
		}
		if(objectNames_as_Val != undefined) {
			cmp.set("v.objectNames", "");
		}
	},

	loadUserLicenseValues : function(component) {
		var action = component.get("c.getAllUserLicenses");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				this.adding_UserLicense_Names(response.getReturnValue());
			}
		});
		$A.enqueueAction(action);
	},

	adding_UserLicense_Names : function(userLicenseDataAsInput) {
		// console.log("inside adding_UserLicense_Names");
		var fragment = document.createDocumentFragment();
		var opt = document.createElement('option');
		opt.innerHTML = "Choose an option";
		opt.value = "NothingSelected";
		fragment.appendChild(opt);
		for(var i=0;i<userLicenseDataAsInput.length;i++) {
			opt = document.createElement('option');
			opt.innerHTML = userLicenseDataAsInput[i].Name;
			opt.value = userLicenseDataAsInput[i].Id;
			fragment.appendChild(opt);
		}

		var userLicense_Select = $('#creating_userLicenseddl');
		var length = userLicense_Select.children('option').length;
		if(length > 0 ) {
			userLicense_Select.empty();
		}

		$('#creating_userLicenseddl').append(fragment);
	},


	disable_pSet_dropDownList_n_editBtn : function(){
		$('#permissionSetNamesddl').attr('disabled', 'disabled');
		$('#permissionSetEditBtn').attr('disabled', 'disabled');
	},

	enable_pSet_dropDownList_n_editBtn : function(){
		$('#permissionSetNamesddl').removeAttr('disabled');
		$('#permissionSetEditBtn').removeAttr('disabled');
	},

	load_all_objects_forCreateNew : function(component) {
		//console.log('inside load_all_objects_forCreateNew');
		var action = component.get("c.getAllObjects");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS") {
				// console.log('state: success in load_all_objects_forCreateNew and result: ' + JSON.stringify(response.getReturnValue()));
				component.set("v.objectNames", response.getReturnValue());
				component.set("v.allObjectDetails", "");
				component.set("v.allObjectDetails", this.addObjDetailsToListofObjs(response.getReturnValue(), null));
			}
			else{
				console.log('state: error');
			}
		});
		$A.enqueueAction(action);
	},

	load_allFields_of_Individual_Object : function(component, event) {

		var allObjectData = component.get("v.objectNames");
		//var allObjDataForStoringFieldData = component.get("{!v.allObjectDetails}");
		if(!this.checkIf_objectRelated_FieldData_isPresent(event.srcElement.id, allObjectData)) {
			var action = component.get("c.get_IndividualObj_AllFieldData");
			action.setParams({ selectedObject : event.srcElement.id});
			action.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					if(response.getReturnValue() != null) {
						for(var i=0;i<allObjectData.length;i++) {
							if(allObjectData[i].key == event.srcElement.id) {
								if(allObjectData[i].fieldDetails == null) {
									console.log('inside allObjectData[i].fieldDetails is null and value is : ' + JSON.stringify(response.getReturnValue()));
									allObjectData[i].fieldDetails = response.getReturnValue();
									// var fieldDetails = [];
									// for(var fieldCount = 0;fieldCount<allObjectData[i].fieldDetails.length; fieldCount++) {
									// 	var fieldPermissionsConcerningObjnPSet = this.createFieldPermissionsClass(null, false, false);
									// 	var fieldDetailsObj = this.createFieldDetailsClass(allObjectData[i].fieldDetails[fieldCount].fieldName, allObjectData[i].fieldDetails[fieldCount].fieldLabel, fieldPermissionsConcerningObjnPSet);
									// 	fieldDetails.push(fieldDetailsObj);
									// }
									//allObjDataForStoringFieldData[i].fieldDetails = fieldDetails;
									component.set("v.objectNames",allObjectData);
									break;
								}
								else {
									console.log('inside allObjectData[i].fieldDetails is not null');
									break;
								}
							}
						}
						//component.set("v.allObjectDetails", allObjDataForStoringFieldData);
					}
				}
				else {
					console.log('state: error');
				}
			});
		}
		$A.enqueueAction(action);
	},

	checkIf_create_New_PSet_Object_isEmpty : function(component) {
		var newPSetObj = component.get('{!v.create_New_PSet_Object}');
		if(newPSetObj == null){
			return true;
		}
		else {
			return false;
		}
	},

	creating_pSetNameChangeHelperCall : function(component, event) {
		//createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
		var labelVal = $('#'+event.srcElement.id).val();
		var returnVal = this.check_Conditions_with_PSet_APIName(component, null, labelVal);
		// if(this.checkIf_create_New_PSet_Object_isEmpty(component)) {

		if(returnVal == false) {
			console.log('return val in Name change is false: ' + returnVal);
			$('#'+event.srcElement.id).focus();
			$('#successorErrorMessageLabel').css('color', 'red');
			$('#successorErrorMessageLabel').html("There's an error");
		}
		else {
			$('#successorErrorMessageLabel').html("");
			console.log('return val in Name change is not false: ' + returnVal);
			$('#'+event.srcElement.id).val(returnVal);
			$('#creating_pSetAPIName').val(returnVal);
			// var newPSetObj_For_Creation = component.set('v.create_New_PSet_Object', this.createAPermissionSetDetailsClass(returnVal, null, null, null, null, null, null));
		}
		// }
		// else {
		// 	var newPSetObj_For_Creation = component.get('{!v.create_New_PSet_Object}');
		// 	console.log('newPSetObj_For_Creation.pSetName: ' + newPSetObj_For_Creation);
		// 	newPSetObj_For_Creation.label = returnVal;
		//
		// }
	},

	creating_userLicenseddlChangeHelperCall : function(component, event) {
		//createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
		var userLicense = $('#'+event.srcElement.id).val();
		console.log('selected user License:' + userLicense);
		//if(this.checkIf_create_New_PSet_Object_isEmpty()){

		// this.createAPermissionSetDetailsClass(null, null, null, null, null, userLicense, null);
		// }
		// else {
		// 	var newPSetObj_For_Creation = component.get('{!v.create_New_PSet_Object}');
		// 	newPSetObj_For_Creation.pSetULicense = userLicense;
		// }
	},

	creating_pSetAPINameChangeHelperCall : function(component, event) {
		var apiName = $('#'+event.srcElement.id).val();
		var returnVal = this.check_Conditions_with_PSet_APIName(component, apiName, null);
		// if(this.checkIf_create_New_PSet_Object_isEmpty(component)) {
		if(returnVal == false) {
			console.log('return val in API NAME change is false: ' + returnVal);
			$('#'+event.srcElement.id).focus();
			$('#successorErrorMessageLabel').css('color', 'red');
			$('#successorErrorMessageLabel').html("There's an error");
		}
		else {
			$('#successorErrorMessageLabel').html("");
			console.log('return val in API Name change is not false: ' + returnVal);
			$('#'+event.srcElement.id).val(returnVal);
			// var newPSetObj_For_Creation = component.set('v.create_New_PSet_Object', this.createAPermissionSetDetailsClass(null, returnVal, null, null, null, null, null));
		}
		// }
		// else {
		// 	var newPSetObj_For_Creation = component.get('{!v.create_New_PSet_Object}');
		// 	newPSetObj_For_Creation.pSetName = returnVal;
		// }
	},

	creating_pSetDescriptionChangeHelperCall : function(component, event) {
		//createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
		// var description = $('#'+event.srcElement.id).val();
		// if(this.checkIf_create_New_PSet_Object_isEmpty(component)){

		// this.createAPermissionSetDetailsClass(null, null, null, description, null, null, null);
		//}
		// else {
		// 	var newPSetObj_For_Creation = component.get('{!v.create_New_PSet_Object}');
		// 	newPSetObj_For_Creation.pSetDescription = description;
		// }
	},

	check_Conditions_with_PSet_APIName : function(component, pSet_API_Name, pSet_Label) {
		console.log('pSet_Label: ' + pSet_Label);
		//check if PSet name and Label is already taken?

		//The Permission Set API Name can only contain underscores and alphanumeric characters.
		//It must be unique, begin with a letter, not include spaces, not end with an underscore,
		//and not contain two consecutive underscores
		//check whether it is already taken?

		// console.log(test);
		////createAPermissionSetDetailsClass : function(label, pSetName, pSetId, pSetDescription, pSetNameSpacePrefix, pSetULicense, pSetCreatedDate) {
		var permissionsSetNames = JSON.stringify(component.get("{!v.pSet_Values_for_comparisions}"));

		// console.log('permissionsSetNames.toLowerCase(): ' + permissionsSetNames.toLowerCase());
		// console.log('pSet_API_Name.toLowerCase() : ' + pSet_API_Name.toLowerCase());

		if (pSet_API_Name != null && permissionsSetNames.toLowerCase().indexOf(pSet_API_Name.toLowerCase()) == -1) {
			console.log('check true whether pSet name already exists');
			var returnVal = this.checkForPatterns(pSet_API_Name);
			if(!returnVal) {
				return false;
			}
			if(permissionsSetNames.toLowerCase().indexOf(returnVal.toLowerCase()) == -1){
				return returnVal;
			}
			else {
				return false;

			}
		}
		else if(pSet_Label != null && permissionsSetNames.toLowerCase().indexOf('"' + pSet_Label.toLowerCase() + '"') == -1) {
			var returnVal = this.checkForPatterns(pSet_Label);
			console.log('returnVal is : ' + returnVal);
			if(!returnVal) {
				console.log('value return false at !returnVal');
				return false;
			}
			console.log('returnVal.toLowerCase(): ' + returnVal.toLowerCase());
			console.log('permissionsSetNames.toLowerCase(): ' + permissionsSetNames.toLowerCase());
			console.log('permissionsSetNames.toLowerCase().indexOf(\b + returnVal.toLowerCase() + ): ' + permissionsSetNames.toLowerCase().indexOf('"' + returnVal.toLowerCase() + '"'));

			if(permissionsSetNames.toLowerCase().indexOf('"' + returnVal.toLowerCase() + '"') == -1) {
				return returnVal;
			}
			else {
				console.log('value return false at permissionsSetNames.toLowerCase().index(returnVal.toLowerCase()) != -1');
				return false;
			}
		}
		else{
			console.log('value return false at pSet_Label != null');
			return false;
		}
	},

	checkForPatterns : function(inputString) {
		var pattern_For_SpecialChars = /^[\w&.\-]+$/;
		var pattern_ToCheck_If_It_Starts_With_Letter = /[a-zA-Z_]/;
		var pattern_Should_Not_EndWith_Underscore = /[_]/;
		var pattern_ToCheck_If_ThereAre_Consecutive_Underscores = /^([^_]*(_[^_])?)*_?$/;

		//trim
		inputString = inputString.trim(inputString);

		//replace any space with '_'
		inputString = inputString.split(' ').join('_');

		if(
			pattern_For_SpecialChars.test(inputString)
			&& pattern_ToCheck_If_It_Starts_With_Letter.test(inputString[0])
			&& (!pattern_Should_Not_EndWith_Underscore.test(inputString[inputString.length - 1]))
			&& pattern_ToCheck_If_ThereAre_Consecutive_Underscores.test(inputString)
		) {
			console.log("TRUE");
			return inputString;
		}
		else {
			console.log("FALSE");
			return false;
		}
	},


	//END

	permissionSetClearChangesHelperCall : function() {
		//clear click
		$('#mainDivForAllSubDivs').slideUp('slow');
		$('#creating_new_permissionSet_Details').slideUp('slow');
		$('#PermissionSetDetailsDiv').show();
		this.enable_pSet_dropDownList_n_editBtn();
	},

	openFieldsDetailsHelperCall: function(cmp,event) {
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");

		if($('#'+event.srcElement.id).val() == '+') {
			if(createNew_isClicked == null) {
				this.contactServerForFields_withPermissions(cmp, event);
			}
			else {
				this.load_allFields_of_Individual_Object(cmp, event);
			}
			$('#'+event.srcElement.id).val('-');
			$('#'+event.srcElement.id + 'fieldDiv').show('slow');
			//this.disablingFieldLevelPermissions();
		}
		else {
			//console.log("inside object -");
			$('#'+event.srcElement.id).val('+');
			$('#'+event.srcElement.id + 'fieldDiv').slideUp('slow');
		}
	},

	contactServerForFields_withPermissions: function(component, event) {
		//get global stored objs data

		var allObjectData = component.get("v.objectNames");
		if(!this.checkIf_objectRelated_FieldData_isPresent(event.srcElement.id, allObjectData)) {
			console.log('Field Details are loaded from callback value');
			// var allObjDataForStoringFieldData = component.get("{!v.allObjectDetails}");
			var action = component.get("c.getAllFieldDataWithPermissions");
			action.setParams({ objName : event.srcElement.id, pSetId : $('#permissionSetNamesddl').val() });
			action.setCallback(this, function(response) {
				var state = response.getState();
				// console.log('The response state at contactServerForFields_withPermissions: ' + state);
				if (component.isValid() && state === "SUCCESS") {
					// console.log("result from contactServerForFields_withPermissions: " + response.getReturnValue());
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
						for(var i=0;i<allObjectData.length;i++) {
							if(allObjectData[i].key == event.srcElement.id) {
								// console.log("calling from inside for-> if condition of comparing object key value and assigning field details");
								if(allObjectData[i].fieldDetails == null) {
									// console.log("Field Data result: " + response.getReturnValue());
									allObjectData[i].fieldDetails = response.getReturnValue();
									var fieldDetails = [];
									for(var fieldCount = 0;fieldCount<allObjectData[i].fieldDetails.length; fieldCount++) {
										// //console.log('allObjectData[i].fieldDetails[fieldCount].fieldName : ' + allObjectData[i].fieldDetails[fieldCount].fieldName);
										// //console.log('allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId: ' + allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId);
										var fieldPermissionsConcerningObjnPSet = this.createFieldPermissionsClass(allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldPermissionsId, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldRead, allObjectData[i].fieldDetails[fieldCount].fieldPermissions.fieldEdit);
										var fieldDetailsObj = this.createFieldDetailsClass(allObjectData[i].fieldDetails[fieldCount].fieldName, allObjectData[i].fieldDetails[fieldCount].fieldLabel, fieldPermissionsConcerningObjnPSet);
										fieldDetails.push(fieldDetailsObj);
									}
									// allObjDataForStoringFieldData[i].fieldDetails = fieldDetails;
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
						//component.set("v.allObjectDetails", allObjDataForStoringFieldData);
					}
				}
				else if(state === "ERROR"){
					console.log("There's an error at contactServerForFields_withPermissions");
					console.log("Errors", response.getError());
				}

				//console.log("This is here");
			});
			$A.enqueueAction(action);
		}
		else {
			console.log('Field Details are NOT loaded from callback value');
		}
		//this.disablingFieldLevelPermissions(allObjectData[i].key, allObjectData[i].fieldDetails[fieldCount].fieldName);
	},

	checkIf_objectRelated_FieldData_isPresent : function(selected_Obj_Key, all_Obj_Data) {
		var returnVal = false;
		// if(all_Obj_Data)
		for(var i=0;i<all_Obj_Data.length;i++) {
			if(all_Obj_Data[i].key == selected_Obj_Key & all_Obj_Data[i].fieldDetails != null) {
				returnVal = true;
				break;
			}
		}
		return returnVal;
	},

	opennCloseEditPermissionsonAllObjs : function(cmp, event) {
		this.swapPlusandMinusButton('PointerForEditPermissionsonAllObjs','editPermissionsonAllObjs');
	},

	opennCloseEditPermissionsonAllFieldsofAllObjs : function(cmp, event) {
		this.swapPlusandMinusButton('PointerForEditPermissionsonAllFieldsofAllObjs','editPermissionsonAllFieldsofAllObjs');
	},

	opennCloseEditPermissionsonIndividualObjectsandFieldsHelperCall : function(cmp, event) {

		//check if create new is clicked?
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
			//change the expand object button value
			var allObjsDataForChangingExpandBtnValue = cmp.get("{!v.objectNames}");
			var edit_isClicked = cmp.get("{!v.checkIf_edit_isClicked}");
			for(var objClass = 0;objClass < allObjsDataForChangingExpandBtnValue.length; objClass++) {
				$('#' + allObjsDataForChangingExpandBtnValue[objClass].key).val('+');
				if(edit_isClicked == null) {
					this.disablingObjectLevelPermissions(allObjsDataForChangingExpandBtnValue[objClass].key);
				}
			}
		}
		else {
			// Assigining '+' to all Objects
			var allObjsDataForChangingExpandBtnValue = cmp.get("{!v.objectNames}");
			for(var objClass = 0;objClass < allObjsDataForChangingExpandBtnValue.length; objClass++) {
				$('#' + allObjsDataForChangingExpandBtnValue[objClass].key).val('+');
			}

			// make all checkboxes un check
			//$("input:checkbox").removeAttr('checked');

			// open 'editPermissionsonIndividualObjectsandFields' div
			this.swapPlusandMinusButton('PointerForEditPermissionsonIndividualObjectsandFields','editPermissionsonIndividualObjectsandFields');
		}
	},


	//common methods
	swapPlusandMinusButton : function(elementNameForPointer, displayElementName) {
		////console.log("plus clicked: " + $('#'+ elementNameForPointer).val());
		if($('#'+ elementNameForPointer).val() == '+'){
			$('#'+ displayElementName).show('slow');
			$('#'+ elementNameForPointer).val('-');
			return '+';

		}
		else if($('#'+ elementNameForPointer).val() == '-'){
			$('#'+ displayElementName).slideUp('slow');
			$('#'+ elementNameForPointer).val('+');
			return '-';
		}
	},

	//NOTE: Enabling and Disabling Input type="text box" & Input type="check box"

	methodToDisableEveryInputHelperCall : function(component, event) {

		var spinner = component.find('spinner');
		var evt = spinner.get("e.toggle");
		evt.setParams({ isVisible : false });
		evt.fire();
	},

	disablingEverything : function() {
		$(':input').attr('disabled', 'disabled');
		$("input:checkbox").attr('disabled', 'disabled');
		$('#permissionSetEditBtn').removeAttr('disabled');
		//$('#permissionSetCloneBtn').removeAttr('disabled');
		$('#permissionSetCreateNewBtn').removeAttr('disabled');
		$('#permissionSetSaveBtn').removeAttr('disabled');
		$('#permissionSetSaveBtn').removeAttr('disabled');
		$('#PointerForEditPermissionsonIndividualObjectsandFields').removeAttr('disabled');
		$('#PointerForEditPermissionsonAllFieldsofAllObjs').removeAttr('disabled');
		$('#permissionSetNamesddl').removeAttr('disabled');
	},

	enablingEverything : function() {
		$(':input').removeAttr('disabled');
		$('#permissionSetCloneBtn').attr('disabled', 'disabled');
		$('#readForAllFieldsOfAllObjs').attr('disabled', 'disabled');
		$('#editForAllFieldsOfAllObjs').attr('disabled', 'disabled');
	},

	disablingObjectLevelPermissions : function(objKey) {

		$('#' + objKey + 'ObjRead').attr('disabled', 'disabled');
		$('#' + objKey + 'ObjCreate').attr('disabled', 'disabled');
		$('#' + objKey + 'ObjEdit').attr('disabled', 'disabled');
		$('#' + objKey + 'ObjDelete').attr('disabled', 'disabled');
		$('#' + objKey + 'ObjViewAll').attr('disabled', 'disabled');
		$('#' + objKey + 'ObjModifyAll').attr('disabled', 'disabled');
	},

	enablingObjectLevelPermissions : function(objKey) {

		$('#' + objKey + 'ObjRead').removeAttr('disabled');
		$('#' + objKey + 'ObjCreate').removeAttr('disabled');
		$('#' + objKey + 'ObjEdit').removeAttr('disabled');
		$('#' + objKey + 'ObjDelete').removeAttr('disabled');
		$('#' + objKey + 'ObjViewAll').removeAttr('disabled');
		$('#' + objKey + 'ObjModifyAll').removeAttr('disabled');

	},

	disablingFieldLevelPermissions : function(objKey, fieldName) {
		// $('#' + objKey + 'readForAllFieldsofanIndividualObj').attr('disabled', 'disabled');
		// $('#' + objKey + 'editForAllFieldsofanIndividualObj').attr('disabled', 'disabled');
		// // for(var fieldData = 0;fieldData < fieldDetailsConcerningSingleObject.length; fieldData++) {
		// 	console.log("inside disablingFieldLevelPermissions : " + fieldName + 'indiFieldRead');
		// 	$('#' +fieldName + 'indiFieldRead').attr('disabled', 'disabled');
		// 	$('#' +fieldName + 'indiFieldEdit').attr('disabled', 'disabled');
		// // }
	},

	enablingFieldLevelPermissions : function(objKey, fieldDetailsConcerningSingleObject) {
		$('#' + objKey + 'readForAllFieldsofanIndividualObj').removeAttr('disabled');
		$('#' + objKey + 'editForAllFieldsofanIndividualObj').removeAttr('disabled');
		for(var fieldData = 0;fieldData < fieldDetailsConcerningSingleObject.length; fieldData++) {
			$('#' +fieldDetailsConcerningSingleObject[fieldData].fieldName + 'indiFieldRead').removeAttr('disabled');
			$('#' +fieldDetailsConcerningSingleObject[fieldData].fieldName + 'indiFieldEdit').removeAttr('disabled');
		}
	},

	//NOTE: All of the below methods are related to 'Individual Permission Check box Click Server Calls'

	individualObjectReadPermissionServerCall : function(cmpt, event) {
		//individual Object Read Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "read", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectCreatePermissionServerCall : function(cmpt, event) {
		////individual Object Create Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "create", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectEditPermissionServerCall : function(cmpt, event) {
		//individual Object Edit Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val() ,'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "edit", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectDeletePermissionServerCall : function(cmpt, event) {
		//individual Object Delete Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null,'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "deleteData", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectViewAllPermissionServerCall : function(cmpt, event) {
		//individual Object View All Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null, 'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "viewAll", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);
	},

	individualObjectModifyAllPermissionServerCall : function(cmpt, event) {

		//individual Object ModifyAll Permission
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmpt, $('#permissionSetNamesddl').val(),'Object', event.srcElement.value, null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmpt, null,'Object', event.srcElement.value, null);
		}
		var returnValOfAllObjDataAfterChanges = this.handleAllIndividualObjPermissionsCheckBox(cmpt.get("{!v.objectNames}"), event.srcElement.value, "modifyAll", $('#'+event.srcElement.id).is(':checked'));
		cmpt.set("v.objectNames" , returnValOfAllObjDataAfterChanges);
		cmpt.set("v.changedAllObjectDetails", returnValOfAllObjDataAfterChanges);

	},

	handleAllIndividualObjPermissionsCheckBox : function(allObjsDataForHandlingIndiObjPermissions, selectedPermissionObjKey, typeOfPermission, trueOrfalse) {

		for(var objCount = 0; objCount<allObjsDataForHandlingIndiObjPermissions.length ; objCount++){
			if(allObjsDataForHandlingIndiObjPermissions[objCount].key == selectedPermissionObjKey) {
				if(typeOfPermission == "read") {
					if(trueOrfalse) {
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						console.log("inside read false");
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
					}
				}
				else if(typeOfPermission == "create") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						console.log("inside create false");
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.create = false;
					}
				}
				else if(typeOfPermission == "edit") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						console.log("inside edit false");
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
					}
				}
				else if(typeOfPermission == "deleteData") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.edit = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						console.log("inside delete false");
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.deleteData = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
					}
				}
				else if(typeOfPermission == "viewAll") {
					if(trueOrfalse){
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = true;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.read = true;
					}
					else {
						console.log("inside view false");
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.viewAll = false;
						allObjsDataForHandlingIndiObjPermissions[objCount].objPermissions.modifyAll = false;
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
						console.log("inside modify false");
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
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.read = false;
				allObjects[i].objPermissions.create = false;
				allObjects[i].objPermissions.edit = false;
				allObjects[i].objPermissions.deleteData = false;
				allObjects[i].objPermissions.viewAll = false;
				allObjects[i].objPermissions.modifyAll = false;
			}
			$('#createforAllObjsChkBox').prop('checked',false);
			$('#editforAllObjsChkBox').prop('checked',false);
			$('#deleteforAllObjsChkBox').prop('checked',false);
			$('#viewAllforAllObjsChkBox').prop('checked',false);
			$('#modifyAllforAllObjsChkBox').prop('checked',false);
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}
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
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}
	},

	editforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check edit = true for all
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in editforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {

			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.edit = true;
				allObjects[i].objPermissions.read = true;
			}
			$('#readforAllObjsChkBox').prop('checked',true);
		}
		else {

			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.edit = false;
				allObjects[i].objPermissions.deleteData = false;
				allObjects[i].objPermissions.modifyAll = false;
			}
			$('#modifyAllforAllObjsChkBox').prop('checked',false);
			$('#deleteforAllObjsChkBox').prop('checked',false);
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}

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
			}
			$('#readforAllObjsChkBox').prop('checked',true);
			$('#editforAllObjsChkBox').prop('checked',true);
		}
		else {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.deleteData = false;
				allObjects[i].objPermissions.modifyAll = false;
			}
			$('#modifyAllforAllObjsChkBox').prop('checked',false);
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}

	},

	viewAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check viewAll = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		////console.log("event.srcElement.id in viewAllforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.viewAll = true;
				allObjects[i].objPermissions.read = true;
			}
			$('#readforAllObjsChkBox').prop('checked',true);
		}
		else {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.viewAll = false;
				allObjects[i].objPermissions.modifyAll = false;
			}
			$('#modifyAllforAllObjsChkBox').prop('checked',false);
			//}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}

	},

	modifyAllforAllObjsChkBoxClickServerCall : function(cmp, event) {
		// check modifyAll = true for all objs
		var allObjects = cmp.get("{!v.objectNames}");
		console.log("event.srcElement.id in modifyAllforAllObjsChkBoxClickServerCall: " + event.srcElement.id);
		if($('#'+event.srcElement.id).is(':checked')) {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.modifyAll = true;
				allObjects[i].objPermissions.read = true;
				allObjects[i].objPermissions.edit = true;
				allObjects[i].objPermissions.deleteData = true;
				allObjects[i].objPermissions.viewAll = true;
			}
			$('#readforAllObjsChkBox').prop('checked',true);
			$('#editforAllObjsChkBox').prop('checked',true);
			$('#deleteforAllObjsChkBox').prop('checked',true);
			$('#viewAllforAllObjsChkBox').prop('checked',true);
		}
		else {
			for(var i=0;i<allObjects.length;i++) {
				allObjects[i].objPermissions.modifyAll = false;
			}
		}
		cmp.set("v.objectNames",allObjects);
		cmp.set("v.changedAllObjectDetails", allObjects);
		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Object', 'Allqwerty', null);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null ,'Object', 'Allqwerty', null);
		}

	},

	//NOTE: Below two methods are related to Advanced Permissions on All Fields of All objects
	//NOTE: This method is to be implemented in version
	// readForAllFieldsOfAllObjsOnClickHelperCall : function(cmp, event) {
	// 	// read for all fields of all objects
	// 	var allObjectsData = cmp.get("{!v.objectNames}");
	// 	//loop through it and make every read of all the (objs) fields TRUE
	//
	// 	for(var i=0; i<allObjectsData.length; i++) {
	// 		if(allObjectsData[i].fieldDetails != null) {
	// 			var individualObjFieldsDataasJsonString = JSON.stringify(allObjectsData[i].fieldDetails);
	// 			// console.log("Field Details as String : " + individualObjFieldsDataasJsonString);
	// 			var parsedJsonData;
	// 			if($('#readForAllFieldsOfAllObjs').is(':checked')) {
	// 				// console.log("readForAllFieldsOfAllObjs is checked true");
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldRead":false', '"fieldRead":true'));
	// 				// console.log("field details after parsing back : " + JSON.stringify(parsedJsonData));
	// 				$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', true);
	// 			}
	// 			else {
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldRead":true', '"fieldRead":false'));
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(JSON.stringify(parsedJsonData), '"fieldEdit":true', '"fieldEdit":false'));
	// 				$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', false);
	// 				$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', false);
	// 			}
	// 			allObjectsData[i].fieldDetails = parsedJsonData;
	// 		}
	// 	}
	// 	cmp.set("v.objectNames", allObjectsData);
	// 	//id="{!objs.key + 'readForAllFieldsofanIndividualObj'}"
	// },
	//
	// editForAllFieldsOfAllObjsOnClickHelperCall : function(cmp, event) {
	// 	// edit for all fields of all objects
	// 	var allObjectsData = cmp.get("{!v.objectNames}");
	// 	//loop through it and make every read of all the (objs) fields TRUE
	//
	// 	for(var i=0; i< allObjectsData.length; i++) {
	// 		if(allObjectsData[i].fieldDetails != null) {
	// 			var individualObjFieldsDataasJsonString = JSON.stringify(allObjectsData[i].fieldDetails);
	// 			var parsedJsonData;
	// 			if($('#editForAllFieldsOfAllObjs').is(':checked')) {
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldEdit":false', '"fieldEdit":true'));
	// 				$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', true);
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(JSON.stringify(parsedJsonData), '"fieldRead":false', '"fieldRead":true'));
	// 				$('#' + allObjectsData[i].key + 'readForAllFieldsofanIndividualObj').prop('checked', true);
	// 			}
	// 			else {
	// 				parsedJsonData = JSON.parse(this.matchPatternandReplace(individualObjFieldsDataasJsonString, '"fieldEdit":true', '"fieldEdit":false'));
	// 				$('#' + allObjectsData[i].key + 'editForAllFieldsofanIndividualObj').prop('checked', false);
	// 			}
	// 			allObjectsData[i].fieldDetails = parsedJsonData;
	// 		}
	// 	}
	// 	cmp.set("v.objectNames", allObjectsData);
	// },
	//
	// matchPatternandReplace : function(dataString, searchString, replacementString){
	// 	//dataString.split(searchString).join(replacementString);
	// 	// dataString.replace(searchString, replacementString);
	// 	// new RegExp(search, 'g')
	// 	dataString = dataString.replace(new RegExp(searchString, 'g'), replacementString);
	// 	return dataString;
	// },

	//NOTE: METHODS to SAVE FIELD Level Changes

	readForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
		try{
			var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
			if(createNew_isClicked == null) {
				this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
			}
			else {
				this.updateChangesinObjorFieldPermissions(cmp, null, 'Field', event.srcElement.name, 'Allqwerty');
			}
			var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
			if($('#' + event.srcElement.id).is(':checked')) {
				console.log("Val is checked TRUE");
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', true);
				//console.log("All Objects Data after changes in Field Permissions @ READ: " + allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
			}
			else {
				console.log("Val is checked FALSE");
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'read', false);
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsDataAfterAllChanges, event.srcElement.name, 'edit', false);
				// $('#' + event.srcElement.id + 'readForAllFieldsofanIndividualObj').prop('checked', false);
				$('#' + event.srcElement.name + 'editForAllFieldsofanIndividualObj').prop('checked', false);

				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
			}
		}
		catch(error){
			//console.log("error at readForAllFieldsofanIndividualObjClickHelperCall: " + error);
		}
	},

	editForAllFieldsofanIndividualObjClickHelperCall : function(cmp,event) {
		try{
			//console.log("### inside EDIT & id of the checked CheckBox: " + event.srcElement.id);
			var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
			if(createNew_isClicked == null) {
				// console.log('inside create New  is null');
				this.updateChangesinObjorFieldPermissions(cmp,$('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, 'Allqwerty');
			}
			else {
				// console.log('inside create New  is NOT null');
				this.updateChangesinObjorFieldPermissions(cmp, null, 'Field', event.srcElement.name, 'Allqwerty');
			}
			var allObjDataForFieldsData = cmp.get("{!v.objectNames}");
			if($('#' + event.srcElement.id).is(':checked')) {
				// console.log('allObjDataForFieldsDataAfterAllChanges########: ' +JSON.stringify(allObjDataForFieldsData));
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', true);
				// console.log('allObjDataForFieldsDataAfterAllChanges value after edit : ' + allObjDataForFieldsDataAfterAllChanges);
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsDataAfterAllChanges, event.srcElement.name, 'read', true);
				// console.log('allObjDataForFieldsDataAfterAllChanges value after read : ' + JSON.stringify(allObjDataForFieldsDataAfterAllChanges));
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
				$('#' + event.srcElement.name + 'readForAllFieldsofanIndividualObj').prop('checked', true);
			}
			else {
				var allObjDataForFieldsDataAfterAllChanges = this.implementCheckboxManipulationforAllFields(allObjDataForFieldsData, event.srcElement.name, 'edit', false);
				cmp.set("v.objectNames", allObjDataForFieldsDataAfterAllChanges);
				cmp.set("v.changedAllObjectDetails", allObjDataForFieldsDataAfterAllChanges);
				// $('#' + event.srcElement.name + 'editForAllFieldsofanIndividualObj').prop('checked', false);
			}
		}
		catch(error){
			console.log("error at editForAllFieldsofanIndividualObjClickHelperCall: " + error);
		}
	},

	readForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp,event) {
		//Individual Obj Read Permissions Click
		// get field Label (which is combo of event.srcElement.id + 'indiFieldRead') with event.srcElement.id
		// compare it with looping through the list of fieldDetails
		// true the required Read value and you are good to go

		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val(), 'Field', event.srcElement.name, event.srcElement.value);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null,'Field', event.srcElement.name, event.srcElement.value);
		}
		var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualFields(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "read", $('#' + event.srcElement.id).is(':checked'));
		cmp.set("v.objectNames", allObjsDataforIndividualField);
		//console.log("allObjsDataforIndividualField : " + allObjsDataforIndividualField);
		cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);

	},

	editForanIndividualFieldofAnIndividualObjClickHelperCall : function(cmp, event) {
		//Individual Obj Edit Permissions Click

		var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
		if(createNew_isClicked == null) {
			this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);
		}
		else {
			this.updateChangesinObjorFieldPermissions(cmp, null,'Field', event.srcElement.name, event.srcElement.value);
		}
		var allObjsDataforIndividualField = this.implementCheckboxManipulationforIndividualFields(cmp.get("{!v.objectNames}"), event.srcElement.name, event.srcElement.value, "edit", $('#' + event.srcElement.id).is(':checked'));
		cmp.set("v.objectNames", allObjsDataforIndividualField);
		cmp.set("v.changedAllObjectDetails", allObjsDataforIndividualField);
	},

	//TODO:
	// have to implement, storing changeddata into global variable
	// store individual object n field permission changes in updateWhatsChanged and thus into global changed list

	implementCheckboxManipulationforAllFields : function(allObjDataForFieldsData, objectkey, readOredit, trueOrfalse) {
		try{
			//THIS isn't working, check stuff here
			//ERROR ERROR ERROR
			console.log("objectkey: "+ objectkey);
			console.log("readOredit: "+ readOredit);
			console.log("trueOrfalse: "+ trueOrfalse);

			for(var i = 0; i < allObjDataForFieldsData.length; i++) {
				// console.log('one');
				if(allObjDataForFieldsData[i].key == objectkey) {
					// console.log('two');

					//this.updateChangesinObjorFieldPermissions(cmp, $('#permissionSetNamesddl').val() ,'Field', event.srcElement.name, event.srcElement.value);

					for(var j=0;j<allObjDataForFieldsData[i].fieldDetails.length;j++) {
						// console.log('three');
						if(readOredit == 'read' && trueOrfalse) {
							// console.log('four');
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = true;
						}
						else if(readOredit == 'read' && (!trueOrfalse)) {
							// console.log('five');
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = false;
						}
						else if(readOredit == 'edit' && trueOrfalse) {
							// console.log('six');
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = true;
							// allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldRead = true;
						}
						else if(readOredit == 'edit' && (!trueOrfalse)) {
							// console.log('seven');
							allObjDataForFieldsData[i].fieldDetails[j].fieldPermissions.fieldEdit = false;
						}
					}
					break;
				}
			}
			return allObjDataForFieldsData;
		}
		catch(error) {
			console.log("error at implement Check Manipulation: " + error);
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

	addObjDetailsToListofObjs : function(objDetailsFromServer, pSetId) {
		try {
			// console.log('exec is in addObjDetailsToListofObjs and objDetailsFromServer value: ' + objDetailsFromServer);
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
				//console.log('exec is inside for loop of addObjDetailsToListofObjs and the length is' + objDetailsFromServer.length + ' i val: ' + i);
				if(Object.keys(objDetailsFromServer[i].objPermissions).length === 0){
					//console.log('inside length === 0');
					var objPermissionsAsObject = this.createObjPermissionsClass(null, false, false, false, false, false, false);
				}
				else{
					var objPermissionsAsObject = this.createObjPermissionsClass(objDetailsFromServer[i].objPermissions.objPermissionsId,objDetailsFromServer[i].objPermissions.read, objDetailsFromServer[i].objPermissions.create, objDetailsFromServer[i].objPermissions.edit, objDetailsFromServer[i].objPermissions.deleteData, objDetailsFromServer[i].objPermissions.viewAll, objDetailsFromServer[i].objPermissions.modifyAll);
				}

				// create Obj Details Object
				allObjDetails.push(this.createObjDetailsClass(objDetailsFromServer[i].pluralLabel, objDetailsFromServer[i].label, objDetailsFromServer[i].name, objDetailsFromServer[i].key, pSetId, objPermissionsAsObject, null));
			}
			return allObjDetails;
		}
		catch(error){
			console.log("Theres an error at addObjDetailsToListofObjs: " + error);
		}

	},


	//NOTE: Save function forever

	pSetChangesSave : function(cmp, event) {
		//testing pSetDescriptionChangeHelperCall
		try {
			var createNew_isClicked = cmp.get("{!v.checkIf_created_isClicked}");
			// console.log("createNew_isClicked: " + createNew_isClicked);
			if(createNew_isClicked == null) {
				var changedRecordedObj =  cmp.get("{!v.changedRecordedObj}");
				if(changedRecordedObj != null) {

					////console.log("changedRecordedObj in pSetChangesSave is not null");
					////console.log("exactly upfront to sending req to server: " + changedRecordedObj.PermissionSetId);
					var pSetDetailsObj = cmp.get("{!v.text}");
					var objFieldData = cmp.get("{!v.changedAllObjectDetails}");
					// console.log('calling from pSetChangesSave');
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
					// console.log("changedRecordedObjasJson val as String: " + changedRecordedObjasJson);
					// console.log("pSetDetailsObj val as String: " + pSetDetailsObjasJson);
					// console.log("objFieldDataasJson val as String: " + objFieldDataasJson);

					action.setParams({ changesRecordedObj : changedRecordedObjasJson, changedPSetData : pSetDetailsObjasJson, changedObjData : objFieldDataasJson });

					action.setCallback(this, function(response) {
						var state = response.getState();
						//console.log("response result: " + response.getReturnValue());
						if(state === "SUCCESS" && response.getReturnValue()) {
							$('#successorErrorMessageLabel').css('color', 'green');
							$('#successorErrorMessageLabel').html("Changes Saved!");
							// console.log("its a success");
						}
						else if(!response.getReturnValue()) {
							$('#successorErrorMessageLabel').css('color', 'red');
							$('#successorErrorMessageLabel').html("There's an Error");
							// console.log("its an error within success");
						}
						else if(state === "ERROR") {
							$('#successorErrorMessageLabel').css('color', 'red');
							$('#successorErrorMessageLabel').html("There's an Error");
							// console.log("its an error");
						}
					});

					$A.enqueueAction(action);
				}
				else {
					////console.log("changedRecordedObj in pSetChangesSave is null");
				}
			}
			else {
				var label = $('#creating_pSetName').val();
				console.log("label: " + label);
				console.log(jQuery.type(label));
				var apiName = $('#creating_pSetAPIName').val();
				console.log("apiName: " + apiName);
				var selectedUserLicense = $('#creating_userLicenseddl').val();
				console.log("selectedUserLicense: " + selectedUserLicense);
				var description = $('#creating_pSetDescription').val();
				console.log("description: " + description);

				if(selectedUserLicense != "NothingSelected") {
					$('#successorErrorMessageLabel').html("");
					if(!(jQuery.isEmptyObject(label)) && !(jQuery.isEmptyObject(apiName))) {
						console.log("inside label and apiname not null");
						$('#successorErrorMessageLabel').html("");
						var action = cmp.get("c.create_New_PermissionSet_and_SaveConcerned_Obj_Field_Permissions");
						var newly_created_PSet = this.createAPermissionSetDetailsClass(label, apiName, "", description, "", selectedUserLicense, "");
						var changedRecordedObj =  cmp.get("{!v.changedRecordedObj}");
						if(changedRecordedObj == undefined) {
							console.log('changedRecordedObj is undefined : ' + changedRecordedObj);
							changedRecordedObj = undefined;
						}
						else {
							console.log('changedRecordedObj is NOT undefined: ');
						}

						var objFieldData = cmp.get("{!v.changedAllObjectDetails}");
						if(objFieldData == undefined) {
							console.log('objFieldData is undefined: ' + objFieldData);
							objFieldData = undefined;
						}
						else {
							console.log('objFieldData is not undefined: ');
						}

						console.log("newly_created_PSet val as String: " + JSON.stringify(newly_created_PSet));
						console.log("objFieldData val as String: " + JSON.stringify(objFieldData));
						console.log("changedRecordedObj val as String: " + JSON.stringify(changedRecordedObj));

						action.setParams({newly_Created_pSet_as_String : JSON.stringify(newly_created_PSet), object_Permission_Changes_as_String : JSON.stringify(objFieldData), recorded_Changes_Obj_as_String : JSON.stringify(changedRecordedObj)});
						action.setCallback(this, function(response) {
							var state = response.getState();
							console.log("state: " + state);
							console.log("response result: " + response.getReturnValue());
							if(state === "SUCCESS" && response.getReturnValue()) {
								$('#successorErrorMessageLabel').css('color', 'green');
								$('#successorErrorMessageLabel').html("New Permission Set Created!");
								console.log("its a success");
								this.contactServertoGetPermissionSet(cmp);
								setTimeout(function() {
									// hide things concerned to create new
									// $('#mainDivForAllSubDivs').hide('slow');
									// this.callBack_for_hiding_clearing_Data

									//enabling permissionSetNamesddl
									// $('#permissionSetNamesddl').removeAttr('disabled');

									//clear success message
									// $('#successorErrorMessageLabel').html("");

									location.reload();
									// cmp.set("v.truthy","false")
								}, 2000, cmp);

								// $A.get('e.force:refreshView').fire();
							}
							else if(!response.getReturnValue()) {
								$('#successorErrorMessageLabel').css('color', 'red');
								$('#successorErrorMessageLabel').html("There's an Error while creating new permission Set");
								console.log("its an error within success");
							}
							else if(state === "ERROR") {
								$('#successorErrorMessageLabel').css('color', 'red');
								$('#successorErrorMessageLabel').html("There's an Error while creating new permission Set");
								console.log("its an error");
							}
						});
						$A.enqueueAction(action);
					}
					else {
						$('#successorErrorMessageLabel').css('color', 'red');
						$('#successorErrorMessageLabel').html("Enter Name");
					}
				}
				else {
					$('#creating_userLicenseddl').focus();
					$('#successorErrorMessageLabel').css('color', 'red');
					$('#successorErrorMessageLabel').html("Select a User License");
				}
			}
		}
		catch(error) {
			////console.log("error at pSetChangesSave: " + error);
		}
	},

	callBack_for_hiding_clearing_Data : function(component, event) {
		this.clearAllAttributes(component);
		this.empty_extra_attributes(component);
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
