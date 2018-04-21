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
        setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceOut')},100);
        setTimeout(()=>{document.querySelector('.popup').classList.add('bounceIn')},100);
        document.querySelector('.popup').style.display  = 'block';
        document.querySelector('.popup-body').innerHTML  = `
        <h1 class="locationName"></h1>
          <div class='navig'>
                 <i class="fa fa-car" aria-hidden="true"></i><br>Navigate
         </div>
          <div class='plan'>
                 <i class="fa fa-users" aria-hidden="true"></i><br>Plan
          </div>
           `;
        document.querySelector('.close').addEventListener('click',()=> {
          setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceIn')},100);
          setTimeout(()=>{document.querySelector('.popup').classList.add('bounceOut')},100);
         })
        },
        close : ()=>{
          setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceIn')},100);
          setTimeout(()=>{document.querySelector('.popup').classList.add('bounceOut')},100);
        },
        login : ()=> {
          setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceOut')},100);
          setTimeout(()=>{document.querySelector('.popup').classList.add('bounceIn')},100);
          document.querySelector('.popup').style.display  = 'block';
          document.querySelector('.popup-body').innerHTML  =
          `<button class='login'>Login</button>
          <button class='signup'>Signup</button>
          <div class="containment animated"></div>`
          document.querySelector('.close').addEventListener('click',()=> {
            setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceIn')},100);
            setTimeout(()=>{document.querySelector('.popup').classList.add('bounceOut')},100);
           })
        }
    }
    // Search Places by Location
    document.querySelector('#search').addEventListener('click',()=> {
    document.querySelector('.navigation').innerHTML =
  `
    <input type='text' id ='getCity' class="animated slideInDown"></input>
    `;
    document.querySelector('#getCity').focus();
    document.querySelector('#getCity').addEventListener("keyup", function(e) {
    e.preventDefault();
    if (event.keyCode === 13) {
     (async()=>{
       popup.close();
       let data = await(await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(document.querySelector('#getCity').value)}&key=AIzaSyDMiNEO6NFZZywezqZ0A8YLQ5cd-eMhb6M`)).json()
       currentLocation.lat = data.results[0].geometry.location.lat;
       currentLocation.lng = data.results[0].geometry.location.lng;
       let zomatoData = await( await fetchZomato(currentLocation)).json()
      currentArray = zomatoData.nearby_restaurants;
      let est = await ( await findEstablishment(zomatoData.location.city_id)).json()
      showPlaces(currentArray);
      showPlacesType(est.establishments);
   })()
   document.querySelector('.navigation').innerHTML = `<span class="logo animated slideInDown">Plannr</span>`;
    }
    })
  });
  let spitLogin = (inp) => {
    if (inp =='login'){
  return `
  <input type="text" placeholder ="Username " class ="getID" class="animated jackInTheBox">
  <input type="password" placeholder="Password" class ="getPassword" class="animated jackInTheBox">`
    }
    else {
      return `
        <input type='text' placeholder = "User Name"  id="cu_username"required>
        <input type='text' placeholder = "Full Name" id="cu_fname" required>
        <input type='email' placeholder = "Email Address" id="cu_email" required> <br>
        <i class="fa fa-mars " aria-hidden="true"></i><input  class ="gender" type='radio' name='gender' value='Male'>
        <i class="fa fa-venus " aria-hidden="true"></i><input class ="gender" type='radio' name = 'gender'value='Female'>
        <i class="fa fa-genderless " aria-hidden="true"></i><input class ="gender" type='radio' name='gender' value='Others'>
        <input type='text' placeholder='Date Of Birth' id="cu_dob">
        <input type='password' placeholder='Enter Password' id="cu_password" required>
        <input type='password'  placeholder = 'Confirm Password' id="cu_password2" required>
        <button class='create'>Create Account</button>
  `
    }
  }
    document.querySelector('#login').addEventListener('click',()=> {
    popup.login();
    setTimeout(()=>{document.querySelector('.popup').classList.remove('bounceOut')},100);
    setTimeout(()=>{document.querySelector('.popup').classList.add('bounceIn')},100);

      document.querySelector('.login').addEventListener('click',function(){
        document.querySelector('.containment').innerHTML =  spitLogin('login')
        setTimeout(()=>{document.querySelector('.containment').classList.toggle('SlideInLeft')},100);
      });
      document.querySelector('.signup').addEventListener('click',()=> {
        setTimeout(()=>{document.querySelector('.containment').classList.toggle('SlideInLeft')},100);
        document.querySelector('.containment').innerHTML = spitLogin('signup')

        document.querySelector('.create').addEventListener('click',()=> {
          let cu_username = document.querySelector('#cu_username').value;
          console.log("You Entered " + cu_username);
          fetch('https://cors-anywhere.herokuapp.com/https://planrr.herokuapp.com/api/users/')
                .then(res => res.json())
                  .then(data => {
                        data.map(a =>
                          {
                            if(a.username == cu_username){
                            console.log('user exists');
                            }
                          }
                        )
          });
          let cu_fname = document.querySelector('#cu_fname').value;
          let cu_email = document.querySelector('#cu_email').value;
          let cu_gender = [...document.querySelectorAll('.gender')].filter(a => a.checked)[0].value;
          let cu_dob = document.querySelector('#cu_dob').value;
          let cu_password = document.querySelector('#cu_password').value === document.querySelector('#cu_password2').value ? document.querySelector('#cu_password').value : console.log('error');
          var formData = new FormData();
          formData.append('csrfmiddlewaretoken','aOXYV8DcJQauX5LU8hVdsSaJhMyzCeQ9AD7SwBhpRHyKLHoab2fVZLF1pXZ69WNp');
          formData.append('id_username',cu_username);
          formData.append('id_email',cu_email);
          formData.append('id_full_name',cu_fname);
          formData.append('id_gender',cu_gender);
          formData.append('id_birth_date',cu_dob);
          formData.append('id_password1',cu_password);
          formData.append('id_password2',cu_password);
          fetch('https://cors-anywhere.herokuapp.com/https://planrr.herokuapp.com/api/register/',{
            method : 'POST',
            headers : new Headers({'enctype':'multipart/form-data'}),
            body:formData
          }).then(res => console.log(res))
        })
      });
});

  //Impure Functions Altering The State
  const showPlacesType = (arr)=> {document.querySelector('.filters ul').innerHTML = arr.map(a => `<li data-id="${a.establishment.id}">${a.establishment.name}</li>`).join('')}
    const showPlaces = (arr) => {
      if(arr != undefined) document.querySelector('#rest').innerHTML = arr.map(a => `<li data-address='${a.restaurant.location.address}' data-location='${a.restaurant.location.latitude},${a.restaurant.location.longitude}'>${a.restaurant.name}</li>`).join('')
      else document.querySelector('#rest').innerHTML =  `<h1>Sorry We're Connecting Your City to the Grid</h1>`;
    }
    const saveMobileLocation = (inp)=>{
      currentLocation.lat =  inp.coords.latitude;
      currentLocation.lng =  inp.coords.longitude;
      fetchZomato(currentLocation).then(res => res.json()).then(data => {
        showPlaces(data.nearby_restaurants);
        if(data.nearby_restaurants.length<1){document.querySelector('#rest').innerHTML =  `<h1>Sorry We're Not in your city yet</h1>`;}
        else  findEstablishment(data.location.city_id).then(res => res.json()).then(data => showPlacesType(data.establishments));
      }).catch(err => console.log(err))
        }
  //This Check The Device and Method Type To Get The Location
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            if(navigator.geolocation) navigator.geolocation.getCurrentPosition(saveMobileLocation);
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
    document.querySelector('#rest').addEventListener('click',(e)=> {
    e.preventDefault();
    let addr = e.target.dataset.address;
    let loc = e.target.dataset.location;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      document.querySelector('.foods').style.display = 'none';
      popup.show(); //This Will Show The Popup
      document.querySelector('.locationName').textContent = e.target.textContent;
    let data = fetchTime(currentLocation,addr)
    .then(res => res.json())
    .then(data => {
     let time = data.rows[0].elements[0].duration.text;
     console.log(e.target.textContent);
     document.querySelector('.navig').innerHTML = '<i class="fa fa-car" aria-hidden="true"></i><br>'+`${time} away`;
   });
    document.querySelector('.navig').addEventListener('click',(e)=> {
    e.preventDefault();
    window.location.href = `http://www.google.com/maps/dir//${loc}`;
  })
    }
    else {
      document.querySelector('#map iframe').src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC3ZfZ4hgIuv1_tUADFvzgZFNInJILI3Rk&q="+addr;
    }
    })
  document.querySelector('.filters ul').addEventListener('click',(e)=> {
      e.preventDefault();
      //This is Returning the only type of place you want like fine dining or sweet shop
      filterByEstablishment(e.target.dataset.id)
        .then(res => res.json())
          .then(data => {
            document.querySelector('.results').innerHTML = data.restaurants.map(a =>`<li data-address='${a.restaurant.location.address}' data-location='${a.restaurant.location.latitude},${a.restaurant.location.longitude}'><i class="fa fa-cutlery" aria-hidden="true"></i>${a.restaurant.name}</li>`).join('')
            if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
              document.querySelector('.foods').style.display = 'block';
            }
          })
    });
    //All The Category Based restaurants Are Here
    document.querySelector('.results').addEventListener('click',(e)=>{
    e.preventDefault();
    let addr = e.target.dataset.address;
    let loc = e.target.dataset.location;
    popup.show();
    document.querySelector('.locationName').textContent = e.target.textContent;
    let data = fetchTime(currentLocation,addr)
    .then(res => res.json())
    .then(data => {
      let time = data.rows[0].elements[0].duration.text;
      document.querySelector('.navig').innerHTML = '<i class="fa fa-car" aria-hidden="true"></i><br>'+`${time} away`;
    });
      document.querySelector('.navig').addEventListener('click',(e)=> {
      e.preventDefault();
      window.location.href = `http://www.google.com/maps/dir//${addr}/@${loc}`;
      })
      document.querySelector('.plan').addEventListener('click',()=> {
        document.querySelector('.popup-body').innerHTML = `
        <div class="inputbox">Username:<input type="text" class ="getID" class="animated jackInTheBox"></div>
        <div class="inputbox">Password<input type="password" class="getPassword" class="animated jackInTheBox"></div>
        `
        })
    })
  })()
