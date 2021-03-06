/** @namespace */
var CORE	= CORE 		|| {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
CORE.WindowResize = function(renderer, camera, W, H)
{
	var callback	= function()
	{
		// notify the renderer of the size change
		renderer.setSize( W, H );
		// update the camera
		camera.aspect	= W / H;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}