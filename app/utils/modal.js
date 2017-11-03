import Ember from 'ember';

const {computed} = Ember;
export default Ember.Object.extend({

	/**
	 * @Property
	 * Set on the modal and outlet.
	 * The modal element is suffixed with "-modal"
	 * by BsModalComponent, but the outlet is not.
	 * Therefore, use the computed property 'elementId'
	 * to access the DOM element.
	 */
	id: null,

	/**
	 * @Constructor
	 */
	init() {
		this.set('id', Math.random().toString(36).substr(2, 16));
	},

	/**
	 * @Property
	 * BsModalComponent appends '-modal'
	 * to this.id. Use this property to
	 * get the modal DOM element.
	 **/
	elementId: computed('id', function () {
		return `${this.get('id')}-modal`;
	}),

	/**
	 * @Property
	 */
	isOpen: false,

	/**
	 * @Property
	 * Controls the body template partial.
	 */
	controller: null,

	/**
	 * @Method
	 * @param {Ember.Controller} controller
	 */
	setController(controller) {
		this.set('controller', controller);
		return this;
	},
	/**
	 * @Property
	 * Holds model.
	 */
	model: null,

	/**
	 * @method
	 * Sets model on self and if given,
	 * the controller too.
	 * @param model
	 */
	setModel(model) {
		this.set('model', model);
		if (this.get('controller')) {
			this.get('controller').set('model', model);
		}
		return this;
	},

	/**
	 * @Property
	 */
	title: null,

	/**
	 * @method
	 * Not required.
	 * @param {string} title
	 */
	setTitle(title) {
		this.set('title', title);
		return this;
	},
	/**
	 * @Property
	 * This is the partial for the body.
	 */
	bodyTemplate: null,
	/**
	 * @method
	 * @param {string} template - partial path for the body
	 */
	setBodyTemplate(template) {
		this.set('bodyTemplate', template);
		return this;
	},
	/**
	 * @Method
	 * Sets isOpen to true.
	 * @param {Ember.Router|Ember.Route} context - to render the template and controller
	 */
	show(context) {
		this.set('isOpen', true);
		context.render(this.get('bodyTemplate'), {
			into: 'application',
			outlet: this.get('id'),
			controller: this.get('controller')
		});

		return this;
	},
	/**
	 * @method
	 */
	hide() {
		this.set('isOpen', false);
		return this;
	},

	/**
	 * @Property
	 */
	onClose: null,

	/**
	 * @Method
	 * @param {function} callback
	 */
	setOnCloseCallback(callback) {
		this.set('onClose', callback);
		return this;
	},

	/**
	 * @Method
	 * @param {function} callback
	 */
	setOnSubmitCallback(callback) {
		this.set('onSubmit', callback);
		return this;
	},

	/**
	 * @Property
	 */
	onHidden: null,
	/**
	 * @Property
	 */
	onShown: null,
	/**
	 * @Property
	 */
	onSubmit: null,

	/**
	 * @Property
	 * If false, use will not be able to close
	 * the modal by clicking the back drop.
	 */
	backdropClose: true,

	/**
	 * @method
	 * @param {boolean} [canClose = false]
	 */
	disableCloseOnOutsideClick(canClose = false) {
		this.set('backdropClose', canClose);
		return this;
	},
    
	/**
	 * @Property
	 */
	isWide: false,
    
	/**
	 * @method
	 * @param {boolean} [isWide = true]
	 */
	makeWide(isWide = true) {
		this.set('isWide', isWide);
		return this;
	},

	/**
	 * @Property
	 * Partial for the header template
	 */
	headerTemplate: null,

	/**
	 * @method
	 * @param {string} partial
	 */
	setHeaderTemplate(partial) {
		this.set('headerTemplate', partial);
		return this;
	},

	/**
	 * @property
	 */
	cancelLabel: 'Cancel',
	submitLabel: 'Submit',
	showCancelButton: false,
	showSubmitButton: false,
    
	/**
	 * @method
	 * @param {string} label
	 */
	setCancelLabel(label) {
		this.set('cancelLabel', label);
		this.displayCancelButton();
		return this;
	},
	/**
	 * @method
	 * @param {string} label
	 */
	setSubmitLabel(label) {
		this.set('submitLabel', label);
		this.displaySubmitButton();
		return this;
	},
	/**
	 * @method
	 * @param {boolean} [show = true]
	 */
	displayCancelButton(show = true) {
		this.set('showCancelButton', show);
		return this;
	},
	/**
	 * @method
	 * @param {boolean} [show = true]
	 */
	displaySubmitButton(show = true) {
		this.set('showSubmitButton', show);
		if (!this.get('onSubmit')) {
			console.error("Modal generated to display submit button, but no 'onSubmit' callback was set.");
		}
		return this;
	},

	/**
	 * @Property
	 */
	showFooter: computed('showCancelButton', 'showSubmitButton', function () {
		return this.get('showCancelButton')
			|| this.get('showSubmitButton');
	})

})