var CORE = CORE || {};
CORE.WPNConf = CORE.WPNConf || {};
CORE.WPNConf.pm = CORE.WPNConf.pm || {};

CORE.WPNConf.pm.Name 		= 'wpn_pm';
CORE.WPNConf.pm.NameFile 	= 'wpn_pm.js';
CORE.WPNConf.pm.NameFileHud	= 'wpn_pm_hud.js';
CORE.WPNConf.pm.Character	= CORE.Conf.WPN.pm;

CORE.WPNConf.pm.Anims		= [0, 1, 2]; // idle, reload, shoot
CORE.WPNConf.pm.Times		= [0, 1.425, 0.16875];
CORE.WPNConf.pm.LoopOnce	= [1, 2];

CORE.WPNConf.pm.AnimsHand	= [0, 1, 2, 3, 4, 5, 6]; // draw, holster, idle_aim, moving, reload, shoot, sprint
CORE.WPNConf.pm.HandTimes	= [0.45625, 0.45625, 0, 0, 2, 0.225, 0];
CORE.WPNConf.pm.LoopOnceHand	= [0, 1, 4, 5];

CORE.WPNConf.pm.Sil		= 1; // 1 - может иметь глушитель, 0 - нет
CORE.WPNConf.pm.TSil		= 1; // номер текстуры глушителя
CORE.WPNConf.pm.WType		= 1; // 1 - pistol 2 - burp gun 3 - automatic

CORE.WPNConf.pm.BulletOffset	= new THREE.Vector3(0.12, 0.1, /*-0.6*/0);
CORE.WPNConf.pm.BulletOffset2	= new THREE.Vector3(0.12, 0.1, /*-0.6*/0);

CORE.WPNConf.pm.ShellBone	= 0; // номер кости привязки худа рук к оружию

CORE.WPNConf.pm.idBonePos	= [0, 1];
CORE.WPNConf.pm.BonePos		= [
				new THREE.Vector3(-0.013, 0, -0.006),
				new THREE.Vector3(0.013, 0, 0),
				];

CORE.WPNConf.pm.idBoneRot	= [0, 1];
CORE.WPNConf.pm.BoneRot		= [
				new THREE.Vector3(-1.5707969669156445, -1.5707963267948966, 0),
				new THREE.Vector3(1.2907963267948965, 0.24, -0.01),
				];