import Ember from 'ember';
const {inject: {serivce}} = Ember;
export default Ember.Route.extend({
    
    modals: service(),
    
    actions: {
        
        openLoginModal() {
            let loginModal = this.get('modals')
                .buildModal('application/modal/login')
                .setTitle('Login')
                .setController(this.controllerFor('application'))
                .show(this);
            
        },
        
        closeAllModals() {
            this.get('modals').closeAll();
        }
        
    }
    
});
