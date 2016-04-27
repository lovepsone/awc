/** @namespace */
var HANDLER  = HANDLER || {};
HANDLER.Interface = HANDLER.Interface || {};

$(document).ready(function()
{
	// BLOCKS
	HANDLER.Interface.blocker = $("#blocker");
	HANDLER.Interface.CORE = $("#CORE");
	HANDLER.Interface.auth = $("#auth");
	// NTN
	HANDLER.Interface.btnAuth = $("#btnAuth");

	HANDLER.Interface.blocker.hide();
	HANDLER.Interface.CORE.hide();

	HANDLER.Interface.btnAuth.click(function()
	{
		var l = $("#AuthLogin").val(), p = $("#AuthPassword").val();
		CORE.Network.SMG_AUTHCLIENT(l, p);
	});
});