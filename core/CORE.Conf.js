/** @namespace */
var CORE  = CORE || {};
CORE.Conf = CORE.Conf || {};
CORE.Conf.WPN = CORE.Conf.WPN || {};
CORE.Conf.WPN.pm = CORE.Conf.WPN.pm || {};

CORE.Conf.WPN.bullet = CORE.Conf.WPN.bullet  || {};
CORE.Conf.WPN.bullet.b9x18 = CORE.Conf.WPN.bullet.b9x18   || {};

// ��������� ����������
CORE.Conf.SpeedForward 			= 70.0;
CORE.Conf.SpeedBackward 		= 35.0;
CORE.Conf.SpeedLR 			= 25.0;
CORE.Conf.Mass 				= 65.0;

CORE.Conf.url				= '192.168.12.100:9090';
//11 ��� 8 ���
// ��������� ��
CORE.Conf.WPN.pm.Return 		= 0.1;		// ������
CORE.Conf.WPN.pm.Rate			= 80;		// ���������������� (�/���)
CORE.Conf.WPN.pm.Weight			= 0.73;		// ��� (��)
CORE.Conf.WPN.pm.Store			= 8;		// ����������� ��������
CORE.Conf.WPN.pm.Distance		= 50;		// ��������� (�)
CORE.Conf.WPN.pm.Bullet			= CORE.Conf.WPN.bullet.b9x18; // ������� �������
CORE.Conf.WPN.pm.BulletBB		= CORE.Conf.WPN.bullet.b9x18; // �����������

// ��������� ������� 9�18
CORE.Conf.WPN.bullet.b9x18.V		= 10;		// ��������� �������� ���� (�/�) 350
CORE.Conf.WPN.bullet.b9x18.W		= 0.017;	// ��� (��)