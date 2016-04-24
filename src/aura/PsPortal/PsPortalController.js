({

		//NOTE: This is onPageload in PsPortalController.js
		onPageload : function(component, event, helper) {
			helper.loadPermissionSetOptions(component);
		},

		doneRendering : function(component, event, helper) {
			helper.pageRenderingCompleted(component, event);
		},

		permissionSetNamesddlChange : function(component, event, helper) {
			helper.permissionSetNameSelected(component,event);
		},

		permissionSetEditClick: function(component, event, helper) {
				helper.permissionSetEditServerCall();
		},

		permissionSetCloneClick: function(component, event, helper) {
				helper.permissionSetCloneServerCall();
		},

		permissionSetCreateNewClick: function(component, event, helper) {
				helper.permissionSetCreateNewServerCall();
		},

		openFieldsDetails : function(component, event, helper) {
				helper.objectSelected(component, event);
		},

		opennCloseEditPermissionsonAllObjs : function(component, event, helper){
				helper.opennCloseEditPermissionsonAllObjs(component, event);
		},

		opennCloseEditPermissionsonAllFieldsofAllObjs : function(component, event, helper){
				helper.opennCloseEditPermissionsonAllFieldsofAllObjs(component, event);
		},

		opennCloseEditPermissionsonIndividualObjectsandFields : function(component, event, helper){
				helper.opennCloseEditPermissionsonIndividualObjectsandFields(component, event);
		},


		// Individual Object Permission Check box Click
		individualObjectReadPermissionClick : function(component, event, helper) {
				helper.individualObjectReadPermissionServerCall(component, event);
		},

		individualObjectCreatePermissionClick : function(component, event, helper) {
				helper.individualObjectCreatePermissionServerCall(component, event);
		},

		individualObjectEditPermissionClick : function(component, event, helper) {
				helper.individualObjectEditPermissionServerCall(component, event);
		},

		individualObjectDeletePermissionClick : function(component, event, helper) {
				helper.individualObjectDeletePermissionServerCall(component, event);
		},

		individualObjectViewAllPermissionClick : function(component, event, helper) {
				helper.individualObjectViewAllPermissionServerCall(component, event);
		},

		individualObjectModifyAllPermissionClick : function(component, event, helper) {
				helper.individualObjectModifyAllPermissionServerCall(component, event);
		},

		// All group Permission Check box Click
		readforAllObjsChkBoxClick : function(component, event, helper) {
				helper.readforAllObjsChkBoxClickServerCall(component, event);
		},

		createforAllObjsChkBoxClick : function(component, event, helper) {
				helper.createforAllObjsChkBoxClickServerCall(component, event);
		},

		editforAllObjsChkBoxClick : function(component, event, helper) {
				helper.editforAllObjsChkBoxClickServerCall(component, event);
		},

		deleteforAllObjsChkBoxClick : function(component, event, helper) {
				helper.deleteforAllObjsChkBoxClickServerCall(component, event);
		},

		viewAllforAllObjsChkBoxClick : function(component, event, helper) {
				helper.viewAllforAllObjsChkBoxClickServerCall(component, event);
		},

		modifyAllforAllObjsChkBoxClick : function(component, event, helper) {
				helper.modifyAllforAllObjsChkBoxClickServerCall(component, event);
		},

		readForAllFieldsofanIndividualObjClick: function(component, event, helper) {
				helper.readForAllFieldsofanIndividualObjClickHelperCall(component, event);
		},

		editForAllFieldsofanIndividualObjClick : function(component, event, helper) {
			 	helper.editForAllFieldsofanIndividualObjClickHelperCall(component, event);
		},

		readForanIndividualFieldofAnIndividualObjClick : function(component, event, helper) {
				helper.readForanIndividualFieldofAnIndividualObjClickHelperCall(component, event);
		},

		editForanIndividualFieldofAnIndividualObjClick : function(component, event, helper) {
				helper.editForanIndividualFieldofAnIndividualObjClickHelperCall(component, event);
		},

		pSetDescriptionChange : function(component, event, helper) {
				helper.pSetDescriptionChangeHelperCall(component, event);
		},

		permissionSetSaveChanges: function(component, event, helper) {
				helper.pSetChangesSave(component, event);
		},

		pSetAPINameChange : function(component, event, helper) {
				helper.pSetNameChangeHelperCall(component, event);
		},

		pSetNameChange : function(component, event, helper) {
				helper.pSetLabelChangeHelperCall(component, event);
		},

		readForAllFieldsOfAllObjsOnClick : function(component, event, helper) {
				helper.readForAllFieldsOfAllObjsOnClickHelperCall(component, event);
		},

		editForAllFieldsOfAllObjsOnClick : function(component, event, helper) {
				helper.editForAllFieldsOfAllObjsOnClickHelperCall(component, event);
		},

		methodToDisableEveryInput: function(component, event, helper) {
			helper.methodToDisableEveryInputHelperCall(component, event);
		},

		showSpinner : function(component, event, helper) {
			helper.showSpinnerHelperClass(component, event);
		}
})
