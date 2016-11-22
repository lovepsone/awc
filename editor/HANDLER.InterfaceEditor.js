/** @namespace */
var HANDLER  = HANDLER || {};
HANDLER.Interface = HANDLER.Interface || {};
//HANDLER.Interface.SelObj = false;

$(document).ready(function()
{
	HANDLER.Interface.btnSelectMap = $("#btnSelectMap");
	HANDLER.Interface.btnCompile = $("#btnCompile");
	HANDLER.Interface.selObjects = $("#objects");
	HANDLER.Interface.selObjCat = $("#objCat");
	HANDLER.Interface.FixedAxis = $("#fixedO");
	HANDLER.Interface.RandAxis = $("#randO");
	
	$("#info").html(locInfo);
	$("#catInfo").html(locCatInfo);
	$("#listInfo").html(locListInfo);
	$("#locFixed").html(locFixed);
	$("#locRand").html(locRand);
	HANDLER.Interface.idMap = 0;
	
	/*for (var i = 0; i < CORE.Object3D.obj.length; i++)
	{
		HANDLER.Interface.selObjects.append( $('<option value="'+i+'">'+locObj[i]+'</option>'));	
	}*/

	for (var i = 0; i < typeOBJ.length; i++)
	{
		HANDLER.Interface.selObjCat.append( $('<option value="'+i+'">'+typeLoc[i]+'</option>'));
	}

	//$("#objects :nth-child(1)").attr("selected", "selected");

	HANDLER.Interface.selObjCat.change(function()
	{
		HANDLER.Interface.selObjects.empty();
		var c = $("#objCat :selected").val();
		for (var i = 0; i < typeOBJ[c].length; i++)
		{
			HANDLER.Interface.selObjects.append( $('<option value="'+typeOBJ[c][i]+'">'+locObj[typeOBJ[c][i]]+'</option>'));
		}
		
        }).trigger('change');
        
        $("#btnGenGrass").click(function()
        {
        	//$("#gCount").val();
        	CORE.MainEditor.LoadGrass($("#gCount").val(), $("#gW").val(), $("#gH").val());
        });
        
	HANDLER.Interface.btnSelectMap.click(function()
	{
		HANDLER.Interface.idMap = $("#map :selected").val();
		CORE.MainEditor.LoadMap(HANDLER.Interface.idMap);
		HANDLER.Interface.SelObj = true;
	});

	HANDLER.Interface.btnCompile.click(function()
	{
		var p = {x:0, y:0, z:0};
		var r = {x:0, y:0, z:0};
		var data = {id: 0, position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}};
		var mas = [];
		var c = 0;

		for (var i = 0; i < CORE.MainEditor.scene.children.length; i++)
		{
			var t = CORE.MainEditor.scene.children[i].name;
			var n = t.split("_");
			if (t != 'map' && t != '' && n[0] != 'map1')
			{
				var a = t.split(".");
				data.id = a[1];
				//mas[c] = data;
				mas[c] = {
					id: a[1],
					p: {x:CORE.MainEditor.scene.children[i].position.x, y:CORE.MainEditor.scene.children[i].position.y, z:CORE.MainEditor.scene.children[i].position.z},
					r: {x:CORE.MainEditor.scene.children[i].rotation.x, y:CORE.MainEditor.scene.children[i].rotation.y, z:CORE.MainEditor.scene.children[i].rotation.z},
					s: {x:CORE.MainEditor.scene.children[i].scale.x, y:CORE.MainEditor.scene.children[i].scale.y, z:CORE.MainEditor.scene.children[i].scale.z},
			/*colision*/	c: a[2]
				};
				c++;
			}
		}
		// перебразовываем в строку
		var buf = HANDLER.Interface.idMap + ':';
		for (var i = 0; i < mas.length; i++)
		{
			buf += mas[i].id + '|' + mas[i].p.x + '|' + mas[i].p.y + '|' + mas[i].p.z + '|'+ mas[i].r.x + '|' + mas[i].r.y + '|' + mas[i].r.z + '|'+ mas[i].s.x + '|' + mas[i].s.y + '|' + mas[i].s.z + '|' + mas[i].c;
			if (i < mas.length - 1)
			buf += ':';
		}

		$.ajax(
		{
			type: "POST",
			url: "editor/handler.php",
			data: {'data': buf},
			success: function(data)
			{
				alert('compilation was completed successfully');
			}
		});
	});
	
	$("input:checkbox[name=hm]").click(function()
	{
		var c = $(this);
		if (CORE.MainEditor.LoadMapId != 1)
			return;
		for (var i = 0; i < CORE.MainEditor.MapMesh.length; i++)
		{
			var t = c.val();
			var n = CORE.MainEditor.MapMesh[i].name.split("_");

			if (t == n[1])
			{
				if (c.prop("checked"))
				{
					CORE.MainEditor.MapMesh[i].visible = true;
				}
				else
				{
					CORE.MainEditor.MapMesh[i].visible = false;
				}
			}
		}

	});
});