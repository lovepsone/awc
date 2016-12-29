var io = require('socket.io').listen(9090);
var mysql = require('mysql');
var colors = require('colors');
var THREE = require('three');
var TypeLog = 1;

function LogN(str)
{
	console.log(str .green);
}

function LogE(str)
{
	console.log(str .green);
}

function LogD(str)
{
	if (TypeLog)
		console.log(str .blue);
}

function LogDD(str)
{
	if (TypeLog > 1)
		console.log(str);
}

var CLIENTS = [], PLAYERS = [], GAMEOBJECT = [];

var count_sd_player = [];
var clients_last_off = null;

var m_connection = mysql.createConnection({host: 'localhost', user: 'mangos', password: 'mangos', database: 'game', insecureAuth: true});

function GameTime()
{
	var d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
	var cek = m*60 + s; // реальные секунды
	// 5 сек реального времени = 1 мин игрового времени
	// переводим рел. сек. в игровые минуты
	var min = cek/5; // игровые минуты
	var hour = min/60; // игровые часы
	min = min %60
	if (h % 2 != 0)
	{
		//не четное
		hour = hour + 12;
	}
	if (hour == 24) hour = 0;
	
	var rh = parseInt(hour), rm = parseInt(min), time = {h:rh, m:rm};
	return time;
}

m_connection.connect(function(err)
{
	if (err)
	{
		LogE('MYSQL: Error connecting: ' + err.stack);
		return;
	}
	LogN('MYSQL: Connected as id ' + m_connection.threadId);
	// load users
	m_connection.query('SELECT * FROM users', function(err, rows, fields)
	{
		if (rows.length > 0 )
		{
			LogN("MYSQL: Loading data users");
			for (var i = 0; i < rows.length; i++)
			{
				var d = {
					id: 	  rows[i].id,
					sid:	  '',
					cid:	  null,
					login: 	  rows[i].login,
					online:   rows[i].online,
					key: 	  1,
					position: new THREE.Vector3(rows[i].x, rows[i].y, rows[i].z),
					rot_x:	  rows[i].rot_x,
					rot_y:	  rows[i].rot_x,
					rot_z:	  rows[i].rot_z,
					pRun:	  {For: false, Left: false, Back: false, Right: false},
					Weap:	  {w1: false, w2: false, reload: false},
					MoseClick:{m1: false, m2: false},
					bones	 : {
							bip01_spine2: { position: new THREE.Vector3(), rotation: new THREE.Vector3()}
						   },
					time	: GameTime(),
				};
				PLAYERS[i] = d;
				count_sd_player[i] = 0;
			}
			LogDD("PLAYERS:");
			LogDD(PLAYERS);
		}
		else
		{
			LogE("MYSQL: Error loading data users");
		}	
	});
	// load objects
	m_connection.query('SELECT * FROM game_object', function(err, rows, fields)
	{
		if (rows.length > 0 )
		{
			LogN("MYSQL: Loading game object");
			for (var i = 0; i < rows.length; i++)
			{
				GAMEOBJECT[i] = rows[i];
			}
			LogDD("GAMEOBJECT:");
			LogDD(GAMEOBJECT);
		}
		else
		{
			LogE("MYSQL: Error loading game object");
		}
	});
});

io.sockets.on('connection', function(socket)
{
	socket.on('SMG_AUTHCLIENT', function(data)
	{
		//socket.emit('SMG_GAMEOBJECT', GAMEOBJECT);
		var l = data['l'], p = data['p'];
		m_connection.query('SELECT * FROM users WHERE login = ? and password = ?', [l , p],  function(err, rows, fields)
		{
			if (rows.length < 1)
			{
				//абработчик случая не верного ввода
			}
			else
			{
				LogD('AUTH: ' + l + ' successfully logged on! sid:' + socket.id);
				count_sd_player[rows[0].id - 1] = 0;
				var data_u = {
					id: 	  rows[0].id,
					sid: 	  socket.id,
					cid:	  rows[0].id,
					login: 	  rows[0].login,
					online:   1,
					key: 	  1,
					position: new THREE.Vector3(rows[0].x, rows[0].y, rows[0].z),
					rot_x:	  rows[0].rot_x,
					rot_y:	  rows[0].rot_x,
					rot_z:	  rows[0].rot_z,
					pRun:	  {For: false, Left: false, Back: false, Right: false},
					Weap:	  {w1: false, w2: false, reload: false},
					MoseClick:{m1: false, m2: false},
					bones	 : {
							bip01_spine2: { position: new THREE.Vector3(), rotation: new THREE.Vector3()}
						   },
					time	: GameTime(), 
				};
				socket.emit('SMG_AUTHCLIENT', data_u);
			}
		});
	});

	socket.on('SMG_PLAYER', function(data)
	{
		PLAYERS[data.id - 1] = data;
		if (count_sd_player[data.id - 1] == 90)
		{
			var sql = 'UPDATE users SET online = ?, x = ?, y = ?, z = ?, rot_x = ?, rot_y = ?, rot_z = ? WHERE id= ?';
			m_connection.query(sql, [1, data.position.x, data.position.y, data.position.z, data.rot_x, data.rot_y, data.rot_z, data.id]);
			count_sd_player[data.id - 1] = 0;
		}
		count_sd_player[data.id - 1]++;

		var data_u = [];
		for (var i = 0; i < PLAYERS.length; i++)
		{
			if (PLAYERS[i].online == 1)
			{
				data_u[i] = PLAYERS[i];
				data_u[i].cid = data.id;
			}
		}
		socket.emit('SMG_PLAYER', data_u);
	});

	socket.on('SMG_TIMEGAME', function(data)
	{
		socket.emit('SMG_TIMEGAME', GameTime());
	});
	
	socket.on('disconnect', function()
	{
		for (var i = 0; i < PLAYERS.length; i++)
		{
			if (PLAYERS[i].sid == socket.id)
			{
				clients_last_off = PLAYERS[i].login;
				m_connection.query('UPDATE users SET online = ? WHERE id= ?', [0, PLAYERS[i].id]);
				PLAYERS[i].sid = '';
				PLAYERS[i].online = 0;
				LogD('AUTH: ' + PLAYERS[i].login + ' disconnect! sid:' + socket.id);
			}
		}
	});
});

console.log("Server started..");
//m_connection.end();