var OSMPICKER = (function(){
	var app = {};
	
	var map;
	var marker;
	var circle;
	app.initmappicker = function(lat, lon, r, option){
		try{
			map = new L.Map('locationPicker');
		}catch(e){
			console.log(e);
		}
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
		var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 20, attribution: osmAttrib});		
		map.setView([lat, lon],10);
		map.addLayer(osm);
		if(!marker){
			marker = new L.marker([lat, lon], {draggable:'true'});
			circle = new L.circle([lat, lon], r, {
				weight: 2
			});
		}else{
			marker.setLatLng([lat, lon]);
			circle.setLatLng([lat, lon]);
		}
		
		marker.on('dragend', function(e){
			circle.setLatLng(e.target.getLatLng());
			map.setView(e.target.getLatLng());
			$("#"+option.latitudeId).val(e.target.getLatLng().lat);
			$("#"+option.longitudeId).val(e.target.getLatLng().lng);
		});
		map.addLayer(marker);
		map.addLayer(circle);

		$("#"+option.latitudeId).val(lat);
		$("#"+option.latitudeId).on('change', function(){
			marker.setLatLng([Number($(this).val()), marker.getLatLng().lng]);
			circle.setLatLng(marker.getLatLng());
			map.setView(marker.getLatLng());
		});

		$("#"+option.longitudeId).val(lon);
		$("#"+option.longitudeId).on('change', function(){
			marker.setLatLng([marker.getLatLng().lat, Number($(this).val())]);
			circle.setLatLng(marker.getLatLng());
			map.setView(marker.getLatLng());
		});

		$("#"+option.radiusId).val(r);
		$("#"+option.radiusId).on('change', function(){
			circle.setRadius(Number($(this).val()));
		});

		$("#"+option.addressId).on('change', function(){
			var item = searchLocation($(this).val(), newLocation);
		});

		function newLocation(item){
			$("#"+option.latitudeId).val(item.lat);
			$("#"+option.longitudeId).val(item.lon);
			marker.setLatLng([item.lat, item.lon]);
			circle.setLatLng([item.lat, item.lon]);
			map.setView([item.lat, item.lon]);
		}
		/*
		var osmGeocoder = new L.Control.OSMGeocoder({
			collapsed: false,
			position: 'bottomright',
			text: 'Find!',
		});
		map.addControl(osmGeocoder);
		*/
	};

	function searchLocation(text, callback){
		var requestUrl = "http://nominatim.openstreetmap.org/search?format=json&q="+text;
		$.ajax({
			url : requestUrl,
			type : "GET",
			dataType : 'json',
			error : function(err) {
				console.log(err);
			},
			success : function(data) {
				console.log(data);
				var item = data[0];
				callback(item);
			}
		});
	};
	
	return app;
})();