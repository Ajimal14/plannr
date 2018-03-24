(()=>{
  let currentLocation = {};
  let currentArray = [];

//Pure Function Returning Promises
  const fetchZomato = (inp) => fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${inp.lat}&lon=${inp.lng}`, { method: 'GET', headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
  const findEstablishment = (id)=>fetch(`https://developers.zomato.com/api/v2.1/establishments?city_id=${id}`,{  method: 'GET',headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
  const filterByEstablishment = (id)=> fetch(`https://developers.zomato.com/api/v2.1/search?lat=${currentLocation.lat}&lon=${currentLocation.lng}&establishment_type=${id}&sort=real_distance`,{ method: 'GET', headers: new Headers({'user-key': '4319603cbb48b9c4fb5a3211714b89d1'})})
  const fetchTime = (origin,destination) => fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.lat},${origin.lng}&destinations=${destination}&key=AIzaSyC5b-rPcanrIQkMY4wd2Sq7C8jdjz-rZJc`,{method: 'GET',mode: 'cors',headers : new Headers({'Access-Control-Allow-Origin' : '*'})})
  //Markup of Popup
  const popup = {
      show : () => {
      document.querySelector('.popup').style.display  = 'block';
      document.querySelector('.popup').innerHTML  = `
        <span class="close"><i class="fa fa-times-circle" aria-hidden="true"></i></span>
        <div class='navig'>
               <i class="fa fa-car" aria-hidden="true"></i><br>Navigate
       </div>
        <hr>
        <div class='plan'>
               <i class="fa fa-users" aria-hidden="true"></i><br>Plan
        </div>
         `;
      },
      close : ()=>{ document.querySelector('.close').addEventListener('click',()=> {  document.querySelector('.popup').style.display = 'none'})}
  }

//Impure Functions Altering The State
const showPlacesType = (arr)=> {document.querySelector('.filters ul').innerHTML = arr.map(a => `<li data-id="${a.establishment.id}">${a.establishment.name}</li>`).join('')}
  const showPlaces = (arr) => {
    if(arr != undefined) document.querySelector('#rest').innerHTML = arr.map(a => `<li data-address='${encodeURIComponent(a.restaurant.location.address)}'>${a.restaurant.name}</li>`).join('')
    else document.querySelector('#rest').innerHTML =  `<h1>Sorry We're Connecting Your City to the Grid</h1>`;
  }
const saveMobileLocation = (inp)=>{
currentLocation.lat =  inp.coords.latitude;
  currentLocation.lng =  inp.coords.longitude;
    }

//This Check The Device and Method Type To Get The Location
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
    (async ()=>{
      let data = await(await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBVoJk_jr6_n2l3FoYdhjg1sVSQUrtOk6g',{ method : 'POST' , headers : new Headers({"considerIp": "true"}) })).json()
      currentLocation.lat = data.location.lat;
      currentLocation.lng = data.location.lng;
      let zomatoData = await( await fetchZomato(currentLocation)).json()
       let est = await ( await findEstablishment(zomatoData.location.city_id)).json()
       showPlacesType(est.establishments);
       currentArray = zomatoData.nearby_restaurants;
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
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    let addr = e.target.dataset.address;
    document.querySelector('.foods').style.display = 'none';
     popup.show(); //This Will Show The Popup
  let data = fetchTime(currentLocation,addr)
  .then(res => res.json())
  .then(data => {
   let time = data.rows[0].elements[0].duration.text;
   document.querySelector('.navig').innerHTML = '<i class="fa fa-car" aria-hidden="true"></i><br>'+`${time} away`;
 });
  popup.close();
  document.querySelector('.navig').addEventListener('click',(e)=> {
  window.location.href = "https://www.google.com/maps/dir//"+addr;
                                                                      })
  }
  else {
    document.querySelector('#map iframe').src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC3ZfZ4hgIuv1_tUADFvzgZFNInJILI3Rk&q="+encodeURIComponent(e.target.dataset.address)
  }
  })
  document.querySelector('.filters ul').addEventListener('click',(e)=> {
    //This is Returning the only type of place you want like fine dining or sweet shop
    filterByEstablishment(e.target.dataset.id)
      .then(res => res.json())
        .then(data => {
          document.querySelector('.results').innerHTML = data.restaurants.map(a =>`<li data-address='${encodeURIComponent(a.restaurant.location.address)}'>${a.restaurant.name}</li>`).join('')
          if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            document.querySelector('.foods').style.display = 'block';
          }
        })
  });
  //All The Category Based restaurants Are Here
  document.querySelector('.results').addEventListener('click',(e)=>{
     let addr = e.target.dataset.address;
    popup.show();
  let data = fetchTime(currentLocation,addr)
  .then(res => res.json())
  .then(data => {
    let time = data.rows[0].elements[0].duration.text;
    document.querySelector('.navig').innerHTML = '<i class="fa fa-car" aria-hidden="true"></i><br>'+`${time} away`;
  });
  popup.close();
     document.querySelector('.navig').addEventListener('click',(e)=> {window.location.href = "https://www.google.com/maps/dir//"+addr;})
  })
})()
