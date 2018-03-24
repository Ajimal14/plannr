let currentLocation = {};
let currentArray = [];
const fetchZomato = (inp) => fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${inp.lat}&lon=${inp.lng}`, { method: 'GET', headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
const findEstablishment = (id)=>fetch(`https://developers.zomato.com/api/v2.1/establishments?city_id=${id}`,{  method: 'GET',headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
const filterByEstablishment = (id)=> fetch(`https://developers.zomato.com/api/v2.1/search?lat=${currentLocation.lat}&lon=${currentLocation.lng}&establishment_type=${id}&sort=real_distance`,{ method: 'GET', headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
const showPlacesType = (arr)=> {document.querySelector('.filters ul').innerHTML = arr.map(a => `<li data-id="${a.establishment.id}">${a.establishment.name}</li>`).join('')}
const showPlaces = (arr) => {
  if(arr != undefined) document.querySelector('#rest').innerHTML = arr.map(a => `<li data-address='${a.restaurant.location.address.replace(' ','+')}'>${a.restaurant.name}</li>`).join('')
  else document.querySelector('#rest').innerHTML =  `<h1>Sorry We're Connecting Your City to the Grid</h1>`;
}
const saveMobileLocation = (inp)=>{
  currentLocation.lat =  inp.coords.latitude;
  currentLocation.lng =  inp.coords.longitude;
console.log(currentLocation.lat,currentLocation.lng);
}
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        if(navigator.geolocation) navigator.geolocation.getCurrentPosition(saveMobileLocation);
        fetchZomato(currentLocation).then(res => res.json()).then(data => {
          if(data.nearby_restaurants.length<1){
            document.querySelector('#rest').innerHTML =  `<h1>Sorry We're Not in your city yet</h1>`;
            findEstablishment(data.location.city_id).then(res => res.json()).then(data => showPlacesType(data.establishments));
          }
        })
    }
else {
  (async()=>{
    const data = await(await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBBI-8mtAhBWlHhS-pudH7xbi2IKMnMPOo',{ method : 'GET' , headers : new Headers({"considerIp": "false"}) })).json()
    currentLocation.lat = data.location.lat;
    currentLocation.lng = data.location.lng;
    console.log(data);
    let zomatoData = await( await fetchZomato(currentLocation)).json()
     let est = await ( await findEstablishment(zomatoData.location.city_id)).json()
     showPlacesType(est.establishments);
     currentArray = zomatoData.nearby_restaurants;
     console.log(currentArray);
    showPlaces(currentArray);
  })()
}
document.querySelector('#searchPlaces').addEventListener('click',()=> {
  (async()=>{
    let data = await(await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(document.querySelector('#getCity').value)}&key=AIzaSyDMiNEO6NFZZywezqZ0A8YLQ5cd-eMhb6M`)).json()
    currentLocation.lat = data.results[0].geometry.location.lat;
    currentLocation.lng = data.results[0].geometry.location.lng;
    let zomatoData = await( await fetchZomato(currentLocation)).json()
      currentArray = zomatoData.nearby_restaurants;
      showPlaces(currentArray);
      if(currentArray !== undefined) {
      let est = await ( await findEstablishment(zomatoData.location.city_id)).json()
      showPlacesType(est.establishments);
      }
})()
})
document.querySelector('#rest').addEventListener('click',(e)=> {
//This Will Directly Open it on the map app!
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
window.location.href = "https://www.google.com/maps/dir//"+encodeURIComponent(e.target.dataset.address);
}
else {
  document.querySelector('#map iframe').src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC3ZfZ4hgIuv1_tUADFvzgZFNInJILI3Rk&q="+encodeURIComponent(e.target.dataset.address)
}
})
document.querySelector('.filters ul').addEventListener('click',(e)=> {
  filterByEstablishment(e.target.dataset.id)
    .then(res => res.json())
      .then(data => {
        document.querySelector('.results').innerHTML = data.restaurants.map(a =>`<li data-address='${encodeURIComponent(a.restaurant.location.address)}'>${a.restaurant.name}</li>`).join('')
      })
});
document.querySelector('.results').addEventListener('click',(e)=>{
   let addr = e.target.dataset.address;
   document.querySelector('.popup').style.display  = 'block';
   // let data = fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${currentLocation.lat},${currentLocation.lng}&destinations=${addr}&key=AIzaSyC5b-rPcanrIQkMY4wd2Sq7C8jdjz-rZJc`)
   // .then(res => res.json())
   // .then(data => console.log(data));
   document.querySelector('.popup').innerHTML  = `<button class='navig'>Navigate</button>`;
   document.querySelector('.navig').addEventListener('click',(e)=> {
  window.location.href = "https://www.google.com/maps/dir//"+addr;
})
})
