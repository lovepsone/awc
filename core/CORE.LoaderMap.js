var CORE = CORE || {};
CORE.LoaderMap = CORE.LoaderMap || {};

//CORE.LoaderMap.manager	=  THREE.LoadingManager();
CORE.LoaderMap.loader		= new THREE.JSONLoader(/*CORE.LoaderMap.manager*/);
CORE.LoaderMap.Static		= {};
CORE.LoaderMap.MapMesh		= [];

CORE.LoaderMap.LoadObj = false;
CORE.LoaderMap.LoadFinish = false;

CORE.LoaderMap.loader.manager.onProgress = function(item, loaded, total)
{
	var v = Math.round(loaded*100/total).toFixed(0);
	//HANDLER.Interface.pLoaderMaps.val('10');
	$("#pLoaderMaps").val(v);
	$('.pvLoaderMaps').html(v + '%');
}

CORE.LoaderMap.loader.manager.onLoad = function()
{
	CORE.LoaderMap.LoadFinish = true;
	HANDLER.Interface.LoaderMaps.hide();
	HANDLER.Interface.CORE.show();
	console.log(1);
}

CORE.LoaderMap.LoadMap = function(_scene)
{
	
	for (var i = 0; i < CORE.Object3D.mps[1].length; i++)
	{
		CORE.LoaderMap.LoadSquareMap(_scene, CORE.Object3D.mp[CORE.Object3D.mps[1][i]].path, CORE.Object3D.mp[CORE.Object3D.mps[1][i]].name, CORE.Object3D.mp[CORE.Object3D.mps[1][i]].position);
	}
}

CORE.LoaderMap.LoadSquareMap = function(_scene, patch, name, pos)
{
	CORE.LoaderMap.loader.load(patch, function(geometry, materials)
	{
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();
		geometry.mergeVertices();
		geometry.sortFacesByMaterialIndex();
		
		for (var j = 0; j < materials.length; j++)
		{
			materials[j].map.wrapS = THREE.RepeatWrapping;
			materials[j].map.wrapT = THREE.RepeatWrapping;
			materials[j].map.anisotropy = 4;
			materials[j].needsUpdate = true;
			if (materials[j].name == 'alpha_map')
			{
				materials[j].map.repeat.set(1, 1);
				materials[j].transparent = true;
				materials[j].alphaMap.wrapS = THREE.RepeatWrapping;
				materials[j].alphaMap.wrapT = THREE.RepeatWrapping;
				materials[j].side = THREE.DoubleSide;
				materials[j].alphaTest = 0.5;
			}
			else if (materials[j].name == 'duable_map')
			{
				materials[j].map.repeat.set(1, 1);
				materials[j].side = THREE.DoubleSide;
			}
			else if (materials[j].name == 'prop_fake_occ_S')
			{
				materials[j].visible = false;
			}
			else if (materials[j].name == 'trees_fuflo_S' || materials[j].name == 'prop_fake_kollision_S')
			{
				materials[j].visible = false;
			}
		}
		var mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
		mesh.position.copy(pos);
		mesh.name = name;
		var n = name.split("_");
		mesh.visible = false;
		// временная затычка
		if (n[1] == 'c3')
		{
			mesh.visible = true;
		}
		mesh.matrixAutoUpdate = false;
		// --
		// требуется загрузить сетку для физики (физический движок пока не встроен)
		// ---
		CORE.LoaderMap.MapMesh.push(mesh);
		_scene.add(mesh);
	});
}