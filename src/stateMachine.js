export default class StateMachine {
	get previousStateName()	{
    return this.previousState ? this.previousState.name : '';
	}
	constructor(context, id) {
		this.id = id || (++StateMachine.idCount).toString();
		this.context = context;
    this.states = new Map();  
    this.previousState = null;
    this.currentState = null;
    this.isChangingState = false;
    this.changeStateQueue = [];
	}
	isCurrentState(name) {
    return this.currentState ? this.currentState.name === name : false;
	}
	addState(name, config) {
		const context = this.context;		
		this.states.set(name, {
			name,
			onEnter: config.onEnter ? config.onEnter.bind(context) : null,
			onUpdate: config.onUpdate ? config.onUpdate.bind(context) : null,
			onExit: config.onExit ? config.onExit.bind(context) : null,
		})
		return this;
	}
	setState(name) {
		if (!this.states.has(name))	{
			console.warn(`Tried to change to unknown state: ${name}`);
			return;
		}
		if (this.isCurrentState(name)) {
			return;
		}
		if (this.isChangingState)	{
			this.changeStateQueue.push(name);
			return
		}
		this.isChangingState = true;
		console.log(`[StateMachine (${this.id})] change from ${this.currentState ? this.currentState.name : 'none'} to ${name}`);
		if (this.currentState && this.currentState.onExit) {
			this.currentState.onExit();
		}
		this.previousState = this.currentState;
		this.currentState = this.states.get(name);
		if (this.currentState.onEnter) {
			this.currentState.onEnter();
		}
		this.isChangingState = false;
	}
	update(dt) {
		if (this.changeStateQueue.length > 0)	{
			this.setState(this.changeStateQueue.shift())
			return;
		}
		if (this.currentState && this.currentState.onUpdate) {
			this.currentState.onUpdate(dt);
		}
	}
}
StateMachine.idCount = 0;