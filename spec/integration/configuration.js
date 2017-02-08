module.exports = {
	connection: {
		name: 'default',
		user: 'guest',
		pass: 'guest',
		server: '127.0.0.1',
		port: 5672,
		vhost: '%2f',
		replyQueue: 'customReplyQueue'
	},

	exchanges: [
		{
			name: 'hermes-ex.direct',
			type: 'direct',
			autoDelete: true
		},
		{
			name: 'hermes-ex.topic',
			type: 'topic',
			alternate: 'hermes-ex.alternate',
			autoDelete: true
		},
		{
			name: 'hermes-ex.fanout',
			type: 'fanout',
			autoDelete: true
		},
		{
			name: 'hermes-ex.request',
			type: 'fanout',
			autoDelete: true
		},
		{
			name: 'hermes-ex.deadend',
			type: 'fanout',
			alternate: 'hermes-ex.alternate',
			autoDelete: true
		},
		{
			name: 'hermes-ex.alternate',
			type: 'fanout',
			autoDelete: true
		},
		{
			name: 'hermes-ex.deadletter',
			type: 'fanout',
			autoDelete: true
		},
		{
			name: 'hermes-ex.consistent-hash',
			type: 'x-consistent-hash',
			autoDelete: true,
			arguments: {
				'hash-header': 'CorrelationId'
			}
		},
		{
			name: 'hermes-ex.no-batch',
			type: 'direct',
			autoDelete: true
		}
	],

	queues: [
		{
			name: 'hermes-q.direct',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.topic',
			autoDelete: true,
			subscribe: true,
			deadletter: 'hermes-ex.deadletter'
		},
		{
			name: 'hermes-q.general1',
			noAck: true,
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.general2',
			noAck: true,
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.request',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.alternate',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.deadletter',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.hashed1',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.hashed2',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.hashed3',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.hashed4',
			autoDelete: true,
			subscribe: true
		},
		{
			name: 'hermes-q.no-batch',
			autoDelete: true,
			subscribe: true,
			noBatch: true,
			limit: 5
		}
	],

	bindings: [
		{
			exchange: 'hermes-ex.direct',
			target: 'hermes-q.direct',
			keys: ''
		},
		{
			exchange: 'hermes-ex.topic',
			target: 'hermes-q.topic',
			keys: 'this.is.*'
		},
		{
			exchange: 'hermes-ex.fanout',
			target: 'hermes-q.general1',
			keys: []
		},
		{
			exchange: 'hermes-ex.fanout',
			target: 'hermes-q.general2',
			keys: []
		},
		{
			exchange: 'hermes-ex.request',
			target: 'hermes-q.request',
			keys: []
		},
		{
			exchange: 'hermes-ex.deadletter',
			target: 'hermes-q.deadletter',
			keys: []
		},
		{
			exchange: 'hermes-ex.alternate',
			target: 'hermes-q.alternate',
			keys: []
		},
		{
			exchange: 'hermes-ex.consistent-hash',
			target: 'hermes-q.hashed1',
			keys: '100'
		},
		{
			exchange: 'hermes-ex.consistent-hash',
			target: 'hermes-q.hashed2',
			keys: '100'
		},
		{
			exchange: 'hermes-ex.consistent-hash',
			target: 'hermes-q.hashed3',
			keys: '100'
		},
		{
			exchange: 'hermes-ex.consistent-hash',
			target: 'hermes-q.hashed4',
			keys: '100'
		},
		{
			exchange: 'hermes-ex.no-batch',
			target: 'hermes-q.no-batch'
		}
	]
};
