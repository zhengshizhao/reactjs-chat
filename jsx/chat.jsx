'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');  
//var socket = io.connect();
var socket = io(window.location.origin); 
 
var UsersList = React.createClass({
	render() {
		return (
			<div className='users'>
				<h5>Online </h5>
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
		var messageClassnames = classNames({
				'message': true,
				'mymessage': this.props.user === 'Me',
				'othersmessage': this.props.user !== 'Me',
				'anouncement': this.props.user === 'System anouncement:'
	   });
		 
		return ( 
			
			<div className={messageClassnames}>
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
		this.setState({ text: ''});
	},
	//when clicked, shows this is typing
	handleClick(e) {
		e.preventDefault();
		var message = {
			user : this.props.user
		}
		this.props.onMessageClick(message);
	},

	changeHandler(e) {
		this.setState({ text : e.target.value});
		if (this.state.text) {
			var message = {
				user : this.props.user
		    }
			this.props.onMessageClick(message);
		}
	},

	render() {
		return(
			<div className='message_form'>
				<form onSubmit={this.handleSubmit}>
					<input
						onChange={this.changeHandler} onClick={this.handleClick}
						value={this.state.text} placeholder={this.props.typing}
					/> <button>Send</button>
				</form>
			</div>
		);
	}
});

var ChatApp = React.createClass({

	getInitialState() {
		return {users: [], messages:[], text: '', typing:''};
	},

	componentDidMount() {
		socket.on('init', this._initialize);
		socket.on('send:message', this._messageRecieve);
		socket.on('user:join', this._userJoined);
		socket.on('user:typing', this._userTyping);
		socket.on('user:left', this._userLeft);
	},
	_initialize(data) {
		var {users, name} = data;
		this.setState({users, user: name});
	},
	
	_messageRecieve(message) {
		var {users, messages, typing} = this.state;
		var {typing} = "";
		messages.push(message);
		this.setState({users,messages,typing});
	},
	_userJoined(data) {
	var {users, messages} = this.state;
	var {name} = data;
	users.push(name);
	messages.push({
		user: 'System anouncement:',
		text : name +' Joined'
	});
    this.setState({users, messages});
	},
	//_usertyping added
	_userTyping(data) {
        var {typing} = this.state;
		var {typing} = data
		//messages.push(data);
		this.setState({typing});
	},

	_userLeft(data) {
		var {users, messages} = this.state;
		var {name} = data;
		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'System anouncement:',
			text : name +' Left'
		});
		this.setState({users, messages});
	},

	handleMessageFormClick(message) {
		socket.emit('user:typing',message);
	},

	handleMessageSubmit(message) {
		socket.emit('send:message', message);
	},
	render() {
		return (
			<div className="chat-window">
				<UsersList
					users={this.state.users}
				/>
				<MessageList
					messages={this.state.messages}
				/>
				<MessageForm
					onMessageSubmit={this.handleMessageSubmit} 
					onMessageClick={this.handleMessageFormClick}
					typing={this.state.typing}
				/>			
			</div>
		);
	}
});

ReactDOM.render(<ChatApp/>, document.getElementById('app'));




