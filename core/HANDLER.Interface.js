/** @namespace */
var HANDLER  = HANDLER || {};
HANDLER.Interface = HANDLER.Interface || {};

$(document).ready(function()
{
	// BLOCKS
	HANDLER.Interface.blocker = $("#blocker");
	HANDLER.Interface.CORE = $("#CORE");
	HANDLER.Interface.auth = $("#auth");
	HANDLER.Interface.glow = $("#glow");
	HANDLER.Interface.flobby = $("#flobby");

	HANDLER.Interface.LoaderObject = $("#LoaderObject");
	// BTN
	HANDLER.Interface.btnAuth = $("#btnAuth");
	HANDLER.Interface.btnClose = $("#btnClose"); //btn lobby
	HANDLER.Interface.pLoaderObject = $("#pLoaderObject");

	HANDLER.Interface.blocker.hide();
	HANDLER.Interface.CORE.hide();
	HANDLER.Interface.LoaderObject.hide();
	HANDLER.Interface.glow.hide();
	HANDLER.Interface.flobby.hide();

	HANDLER.Interface.btnAuth.click(function()
	{
		var l = $("#AuthLogin").val(), p = $("#AuthPassword").val();
		CORE.Network.SMG_AUTHCLIENT(l, p);
	});
	
	HANDLER.Interface.btnClose.click(function()
	{
		HANDLER.Interface.flobby.hide();
		CORE.Lobby.MoveCamera.m2 = true;
	});

});