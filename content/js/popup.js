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
