'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
//var socket = io.connect();
var socket = io(window.location.origin); 
 
var UsersList = React.createClass({
	render() {
		return (
			<div className='users'>
				<h3> Who is online </h3>
				<ul>
					{
						this.props.users.map((user, i) => {
							return (
								<li key={i}>
									{user}
								</li>
							);
						})
					}
				</ul>				
			</div>
		);
	}
});
var Message = React.createClass({
	render() {
		return (
			<div className="message">
				<strong>{this.props.user} </strong> 
				<span>{this.props.text}</span>		
			</div>
		);
	}
});

var MessageList = React.createClass({
	render() {
		return (
			<div className='messages'>
				{
					this.props.messages.map((message, i) => {
						return (
							<Message
								key={i}
								user={message.user}
								text={message.text} 
							/>
						);
					})
				} 
			</div>
		);
	}
});
var MessageForm = React.createClass({

	getInitialState() {
		return {text: ''};
	},

	handleSubmit(e) {
		e.preventDefault();
		var message = {
			user : this.props.user,
			text : this.state.text
		}
		this.props.onMessageSubmit(message);	
		this.setState({ text: '' });
	},

	changeHandler(e) {
		this.setState({ text : e.target.value });
	},

	render() {
		return(
			<div className='message_form'>
				<form onSubmit={this.handleSubmit}>
					<input
						onChange={this.changeHandler}
						value={this.state.text}
					/> <button className="send_btn">Send</button>
				</form>
			</div>
		);
	}
});

var ChatApp = React.createClass({

	getInitialState() {
		return {users: [], messages:[], text: ''};
	},

	componentDidMount() {
		socket.on('init', this._initialize);
		socket.on('send:message', this._messageRecieve);
		socket.on('user:join', this._userJoined);
		socket.on('user:left', this._userLeft);
	},
	_initialize(data) {
		var {users, name} = data;
		this.setState({users, user: name});
	},
	
	_messageRecieve(message) {
		var {users, messages} = this.state;
		messages.push(message);
		this.setState({users,messages});
	},
	_userJoined(data) {
	var {users, messages} = this.state;
	var {name} = data;
	users.push(name);
	messages.push({
		user: 'System anounce',
		text : name +' Joined'
	});
    this.setState({users, messages});
	},

	_userLeft(data) {
		var {users, messages} = this.state;
		var {name} = data;
		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'System anounce',
			text : name +' Left'
		});
		this.setState({users, messages});
	},

	handleMessageSubmit(message) {
		var {messages} = this.state;
		//messages.push(message);
		this.setState({messages});
		socket.emit('send:message', message);
	},
	render() {
		return (
			<div>
				<UsersList
					users={this.state.users}
				/>
				<MessageList
					messages={this.state.messages}
				/>
				<MessageForm
					onMessageSubmit={this.handleMessageSubmit}
				/>			
			</div>
		);
	}
});

ReactDOM.render(<ChatApp/>, document.getElementById('app'));




