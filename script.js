$(document).ready(function() {
    
    const customIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [35, 40],
        iconAnchor: [18, 40],
    });
    let map;
    let marker;

    const $inputIpAddress = $("#search-ip-address");
    const $searchButton = $("#search-btn");
    // console.log($inputIpAddress, $searchButton);

    const $ipAddressValue = $("#ip-address-value");
    const $locationValue = $("#location-value");
    const $timezoneValue = $("#timezone-value");
    const $ispValue = $("#isp-value");

    function displayIpDetails(jsonResponse) {
        $ipAddressValue.text(jsonResponse.ip);
        $locationValue.text(`${jsonResponse.location.city}, ${jsonResponse.location.region} ${jsonResponse.location.postalCode}`);
        $timezoneValue.text(`UTC ${jsonResponse.location.timezone}`);
        $ispValue.text(jsonResponse.isp);
    }

    function displayMapDetails(jsonResponse) {
        const zoomLevel = 16;
        if (!map) {
            map = L.map('map').setView([jsonResponse.location.lat, jsonResponse.location.lng], zoomLevel);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            marker = L.marker([jsonResponse.location.lat, jsonResponse.location.lng], { icon: customIcon }).addTo(map);
        } else {
            map.setView([jsonResponse.location.lat, jsonResponse.location.lng], zoomLevel);
            marker.setLatLng([jsonResponse.location.lat, jsonResponse.location.lng]);
        }
    }
       
    function isIpAddress(query) {
        const ipAddressRegExp = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){2}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
        return ipAddressRegExp.test(query);
    }

    async function fetchIpDetails(query) {
        let url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_k5hLEVgx6UV3FckAFM7cvEVDJJdBJ`;
        if (isIpAddress(query)) {
            url += `&ipAddress=${query}`;
        } else {
            url += `&domain=${query}`;
        }
        try {
            const response = await fetch(url);
            if (response.ok) {
                const jsonResponse = await response.json();
                displayIpDetails(jsonResponse);
                displayMapDetails(jsonResponse);
            }
        } catch(error) {
            console.log(error);
        }
    }

    $searchButton.on("click", () => {
        const ipQueryValue = $inputIpAddress.val().trim();
        if (!ipQueryValue) {
            alert("Please enter a valid IP address or domain name");
            return;
        }
        fetchIpDetails(ipQueryValue);
    })
    fetchIpDetails("");
})