"use strict";

var CORE = CORE || {};
CORE.LoaderMap = CORE.LoaderMap || {};

CORE.LoaderMap = function(_scene, _mp, _mps)
{
	var manager = new THREE.LoadingManager();
	var loader = new THREE.JSONLoader(manager);

	var scene = _scene;

	this.mp = _mp;
	this.mps = _mps;
	this.MapMesh = [];

	manager.onProgress = function(item, loaded, total)
	{
		var v = Math.round(loaded*100/total).toFixed(0);
		$("#pLoaderMaps").val(v);
		$('.pvLoaderMaps').html(v + '%');
	}

	manager.onLoad = function()
	{
		HANDLER.Interface.LoaderMaps.hide();
		HANDLER.Interface.CORE.show();
	}

	this.LoadSquareMap = function(_scene, _group, _patch, _name, _position)
	{
		loader.load(_patch, function(geometry, materials)
		{
			var texture = materials[0].map;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
			texture.repeat.set(1, 1);
			geometry.computeVertexNormals();
			geometry.mergeVertices();
			geometry.sortFacesByMaterialIndex();
			
			for (var j = 0; j < materials.length; j++)
			{
				materials[j].map.wrapS = materials[j].map.wrapT = THREE.RepeatWrapping;
				materials[j].map.anisotropy = 4;
				materials[j].needsUpdate = true;
				if (materials[j].name == 'alpha_map')
				{
					materials[j].map.repeat.set(1, 1);
					materials[j].transparent = true;
					materials[j].alphaMap.wrapS = materials[j].alphaMap.wrapT = THREE.RepeatWrapping;
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
			mesh.position.copy(_position);
			mesh.name = _name;
			var n = _name.split("_");
			mesh.visible = false;
			// временная затычка
			if (n[1] == 'c3' || n[1] == 'c4' || n[1] == 'c2')
			{
				mesh.visible = true;
			}
			mesh.matrixAutoUpdate = false;
			// --
			// требуется загрузить сетку для физики (физический движок пока не встроен)
			// ---
			_group.push(mesh);
			_scene.add(mesh);
		});		
	};
	
	this.LoadMap = function()
	{
		for (var i = 0; i < this.mps.length; i++)
		{
			this.LoadSquareMap(scene, this.MapMesh, this.mp[this.mps[i]].path, this.mp[this.mps[i]].name, this.mp[this.mps[i]].position);
		}
	}
};