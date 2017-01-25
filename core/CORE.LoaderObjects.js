var CORE = CORE || {};
CORE.LoaderObjects = CORE.LoaderObjects || {};

//CORE.LoaderObjects.manager =  THREE.LoadingManager();
CORE.LoaderObjects.loader = new THREE.JSONLoader(/*CORE.Zone.manager*/);

CORE.LoaderObjects.Objects = [];
CORE.LoaderObjects.LoadObj = false;
CORE.LoaderObjects.LoadFinish = false;

CORE.LoaderObjects.loader.manager.onProgress = function(item, loaded, total)
{
	var v = Math.round(loaded*100/total).toFixed(0);
	//HANDLER.Interface.pLoaderObject.val(v);
	//$('.progress-value').html(v + '%');
}

CORE.LoaderObjects.loader.manager.onLoad = function()
{
	CORE.LoaderObjects.LoadFinish = true;
	HANDLER.Interface.LoaderObject.hide();
}

CORE.LoaderObjects.LoadObjects = function()
{
	for (var i = 0; i < CORE.Object3D.obj.length; i++)
	{
		CORE.LoaderObjects.LoadObject(i);
	}
}

CORE.LoaderObjects.LoadObject = function(id)
{
	CORE.LoaderObjects.loader.load(CORE.Object3D.obj[id].path, function(geometry, materials)
	{
		var texture = materials[0].map;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set(1, 1);
		geometry.computeVertexNormals();

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
				//materials[j].opacity = 0.5;
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
		}

		var faceMaterial = new THREE.MeshFaceMaterial(materials);
		var mesh = new THREE.Mesh(geometry, faceMaterial);
		mesh.name = id;
		mesh.visible = false;
		CORE.LoaderObjects.Objects[id] = {};
		CORE.LoaderObjects.Objects[id] = mesh;
		//CORE.LoaderObjects.Objects.push(mesh);
	});
	//console.log(CORE.LoaderObjects.Objects);
}

CORE.LoaderObjects.CloneObject = function(name, id, position, rotation)
{
	var mesh = CORE.LoaderObjects.Objects[id].clone();
	mesh.name = 'clone-'+name+'-'+id;
	mesh.rotation.x = rotation.x;
	mesh.rotation.y = rotation.y;
	mesh.rotation.z = rotation.z;
	mesh.position.set(position.x, position.y, position.z);
	mesh.visible = true;
	return mesh;
}
