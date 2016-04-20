({
	contactServerForObjs : function(component) {
		var action = component.get("c.getAllObjects");
		console.log("Calling getAllObjects from PsObject");
		action.setCallback(this, function(response) {
        	var state = response.getState();
            $A.log("Check Status: "+ response.getState());
            if (component.isValid() && state === "SUCCESS") {
                //console.write("Data: " + response.getReturnValue());
                $A.log("Data: "+ response.getReturnValue());
								console.log("result from getAllObjects: " + response.getReturnValue());
                component.set("v.ObjectNames", response.getReturnValue());
                //this.updateTotal(component);
            }
        });
        $A.enqueueAction(action);
	}
})
