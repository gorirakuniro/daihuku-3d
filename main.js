let scene, camera, renderer, controls, model, hemiLight, spotLight;
let mesh;
function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.CubeTextureLoader();
	scene.background = new THREE.Color(0xddddddd);

	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		5000
	);
	camera.position.set(7, 17, 15);

	hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
	scene.add(hemiLight);

	spotLight = new THREE.SpotLight(0xffa95c, 4);
	spotLight.castShadow = true;
	spotLight.shadow.bias = -0.0001;
	spotLight.shadow.mapSize.width = 1024 * 4;
	spotLight.shadow.mapSize.height = 1024 * 4;
	scene.add(spotLight);

	scene.add(new THREE.AxesHelper(500));
	
	// antialiasはギザギザを滑らかにする
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.toneMappingExposure = 2.3;
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	new THREE.GLTFLoader().load('model/model.gltf', (result) => {
		model = result.scene.children[0];
		model.scale.set(1, 1, 1);
		model.position.set(5, 15, 5);
		model.traverse((n) => {
			if (n.isMesh) {
				n.castShadow = true;
				n.receiveShadow = true;
				if (n.material.map) n.material.map.anisotropy = 16;
			}
		});
		scene.add(model);
		animate();
	});
}
function animate() {
	renderer.render(scene, camera);
	spotLight.position.set(
		camera.position.x + 10,
		camera.position.y + 10,
		camera.position.z + 10
	);
	requestAnimationFrame(animate);
	// model.rotation.x += 0.001;
	model.rotation.y += 0.001;

	const zoom = document.querySelector('#zoom');
	zoom.addEventListener('click', () => {
		camera.position.z -= 0.001;
	});

	const back = document.querySelector('#back');
	back.addEventListener('click', () => {
		camera.position.z += 0.001;
	});

	const rotate = document.querySelector('#rotate');
	rotate.addEventListener('click', () => {
		model.rotation.y -= 0.001;
	});
	const scale = document.querySelector('#scale');
	scale.addEventListener('click', () => {
		model.scale.x += 0.001;
		model.scale.y += 0.001;
		model.scale.z += 0.001;
	});
}

init();
