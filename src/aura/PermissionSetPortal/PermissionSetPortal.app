<aura:application useAppcache="false">
	<!-- Define the Design System static resource (version 1.0.0) -->
    <ltng:require styles="/resource/slds100/assets/styles/salesforce-lightning-design-system.min.css"/>
    <div class="slds">
        <div class="slds-page-header">
          <div class="slds-grid">
            <div class="slds-col slds-has-flexi-truncate">
              <div class="slds-grid">
                <div class="slds-grid slds-type-focus slds-no-space">
                  <h1 class="slds-text-heading--medium slds-truncate" title="Permission Set Portal">Permission Set Portal</h1>
                </div>
              </div>
            </div>

          </div>
          <div class="slds-col--padded slds-p-top--large">
            	<c:PsPortal />
          </div>
        </div>
    </div>
</aura:application>
