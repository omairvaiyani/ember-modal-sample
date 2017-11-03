import Ember from 'ember';
import Modal from '../utils/modal';

export default Ember.Service.extend({
	/**
	 * @Property
	 */
	activeModals: new Ember.A(),

	/**
	 * @Property
	 * Saves having to get the DOM element
	 * each time. Its needed to ensure
	 * the 'modal-open' class is set on
	 * the body.
	 */
	bodyElement: null,

	/**
	 * @method
	 * @param {string} bodyTemplate - partial for the main body template
	 * @param {object} [options] - title
	 */
	buildModal(bodyTemplate, options = {}) {
		let modal = Modal.create();

		if (!this.get('bodyElement')) {
			Ember.run.later(() => {
				this.set('bodyElement', Ember.$("body"));
			}, 100);
		}

		modal.setBodyTemplate(bodyTemplate);
		modal.set('onHidden', (function () {
			// First fire onClose callback if provided
			// modal controller is required.
			if (modal.get('onClose')) {
				if (!modal.get('controller')) {
					throw new Error("Cannot build modal: given onClose but no controller provided.");
				}
				modal.get('onClose')(modal.get('controller'));
			}
			// Then fire the removeModal method.
			this.removeModal(modal.get('id'));

			// Check if another modal has been opened whilst this one was close
			// If so, ensure that the body element has class 'modal-open'
			if (this.get('activeModals.length') && !this.get('bodyElement').hasClass('modal-open')) {
				Ember.run.later(() => {
					this.get('bodyElement').addClass('modal-open')
				}, 100);
			}

		}.bind(this)));

		if (options.disableOutsideClick) {
			modal.disableCloseOnOutsideClick()
		}

		if (options.wide) {
			modal.makeWide();
		}

		if (options.onClose) {
			modal.setOnCloseCallback(options.onClose);
		}
		if (options.onSubmit) {
			modal.setOnSubmitCallback(options.onSubmit);
		}

		if (options.title) {
			modal.setTitle(options.title);
		}

		if (options.showSubmitButton) {
			modal.displaySubmitButton();
		}
		if (options.showCancelButton) {
			modal.displayCancelButton();
		}
		if (options.submitLabel) {
			modal.setSubmitLabel(options.submitLabel);
		}
		if (options.cancelLabel) {
			modal.setCancelLabel(options.cancelLabel);
		}

		this.get('activeModals').pushObject(modal);

		return modal;
	},


	/**
	 * @method
	 * Finds, removes and destroys
	 * modal.
	 * @param {String} modalId
	 */
	removeModal(modalId) {
		if (!modalId) {
			return;
		}
		let modal = this.get('activeModals').findBy('id', modalId);
		if (modal) {
			this.get('activeModals').removeObject(modal);
			modal.destroy();
		}
		return this;
	},

	/**
	 * @Method
	 * @param {Modal} modal
	 * @param {Ember.Controller} context
	 */
	showOnly(modal, context) {
		modal.show(context);
		Ember.run.later(() => {
			this.closeAll(modal);
		}, 100);
		return this;
	},

	/**
	 * @Method
	 * Closes and destroys all modals.
	 * @param {Modal} [exceptThisModal]
	 */
	closeAll(exceptThisModal) {
		this.get('activeModals').forEach((modal) => {
			if (!exceptThisModal || modal.get('id') !== exceptThisModal.get('id')) {
				modal.hide();
			}
		});
		return this;
	}
});