console.log('✅ KW BOB v3 script loaded');

function $(id){return document.getElementById(id)}
function toggle(id,show){$(id).classList.toggle('hidden',!show)}

const page = location.pathname.split('/').pop() || 'index.html';

/* ---------------- 로그인 / 회원가입 ---------------- */
if(page === 'index.html'){
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  $('showRegister').onclick=()=>{toggle('login-section',false);toggle('register-section',true)};
  $('showLogin').onclick=()=>{toggle('login-section',true);toggle('register-section',false)};

  $('registerBtn').onclick=()=>{
    const name=$('regName').value.trim(),id=$('regId').value.trim(),pw=$('regPw').value.trim();
    const gender=$('regGender').value,age=+$('regAge').value,height=+$('regHeight').value,weight=+$('regWeight').value,goal=$('regGoal').value;
    const idRule=/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    const pwRule=/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if(!name||!id||!pw||!age||!height||!weight){alert('모든 항목을 입력하세요.');return;}
    if(!idRule.test(id)){alert('아이디는 영문과 숫자를 포함한 8자 이상이어야 합니다.');return;}
    if(!pwRule.test(pw)){alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');return;}
    if(users.find(u=>u.id===id)){alert('이미 존재하는 아이디입니다.');return;}

    users.push({id,pw,name,gender,age,height,weight,goal});
    localStorage.setItem('users',JSON.stringify(users));
    alert('회원가입 완료! 로그인해주세요.');
    toggle('register-section',false);toggle('login-section',true);
  };

  $('loginBtn').onclick=()=>{
    const id=$('loginId').value.trim(),pw=$('loginPw').value.trim();
    const users=JSON.parse(localStorage.getItem('users')||'[]');
    const user=users.find(u=>u.id===id&&u.pw===pw);
    if(!user){alert('아이디 또는 비밀번호가 올바르지 않습니다.');return;}
    localStorage.setItem('currentUser',JSON.stringify(user));
    location.href='main.html';
  };
}

/* ---------------- 메인 페이지 ---------------- */
if(page==='main.html'){
  const current=JSON.parse(localStorage.getItem('currentUser'));
  if(!current){location.href='index.html';}
  $('welcome').innerText=`${current.name}님, 환영합니다 👋`;
  $('logoutBtn').onclick=()=>{localStorage.removeItem('currentUser');location.href='index.html';};

  const MENU_DB=[
   {restaurant:'후문식당',name:'김치짜글이',price:7000,calorie:650,category:'한식'},
   {restaurant:'맛불',name:'짜장면',price:7000,calorie:670,category:'중식'},
   {restaurant:'윤스쿡',name:'돈가스',price:11000,calorie:800,category:'양식'},
   {restaurant:'하이레',name:'특등심카츠',price:15000,calorie:820,category:'양식'},
   {restaurant:'김가네',name:'라면김밥세트',price:6500,calorie:620,category:'분식'},
   {restaurant:'프랭크버거',name:'치즈버거세트',price:9500,calorie:950,category:'양식'},
   {restaurant:'뚝배기',name:'순두부찌개',price:7500,calorie:550,category:'한식'},
   {restaurant:'자취',name:'김치볶음밥',price:null,calorie:650,category:'자취요리'},
   {restaurant:'자취',name:'계란덮밥',price:null,calorie:580,category:'자취요리'},
   {restaurant:'자취',name:'참치마요덮밥',price:null,calorie:700,category:'자취요리'}
  ];

  window.addEventListener('click', e => {
    if (e.target.id === 'recommendBtn') recommendMenu();
    if (e.target.id === 'retryBtn') recommendMenu();
    if (e.target.id === 'viewRecordsBtn') showRecords();
    if (e.target.id === 'backBtn') {toggle('records', false);toggle('user-form', true);}
  });

  function recommendMenu(){
    const user=current;
    const category=$('category').value;
    const bmr=10*user.weight+6.25*user.height-5*user.age+(user.gender==='M'?5:-161);
    const refCal=bmr*(user.goal==='감량'?0.8:user.goal==='증량'?1.2:1.0);
    const refMeal=Math.round(refCal/3);

    let filtered=MENU_DB;
    if(category) filtered=filtered.filter(m=>m.category===category);
    const randomMenus=filtered.sort(()=>0.5-Math.random()).slice(0,5);

    const list=$('menu-list');list.innerHTML='';
    randomMenus.forEach(m=>{
      const li=document.createElement('li');
      li.innerHTML=`${m.name} (${m.category}) - ${m.calorie} kcal ${(m.price?`/ ${m.price}원 / ${m.restaurant}`:'(자취요리)')}<br><button onclick="selectMenu('${m.name}',${m.calorie})">선택</button>`;
      list.appendChild(li);
    });
    toggle('user-form',false);toggle('recommendations',true);
  }

  function selectMenu(menu,calorie){
    const user=current.id;
    const key=`records_${user}`;
    const recs=JSON.parse(localStorage.getItem(key)||'[]');
    recs.push({menu,calorie,date:new Date().toLocaleString()});
    localStorage.setItem(key,JSON.stringify(recs));
    alert(`${menu} 저장 완료!`);
  }

  function showRecords(){
    toggle('recommendations',false);toggle('records',true);
    const key=`records_${current.id}`;
    const recs=JSON.parse(localStorage.getItem(key)||'[]');
    const today=new Date().toLocaleDateString();
    const todayRecords=recs.filter(r=>r.date.includes(today));
    const list=$('record-list');
    list.innerHTML=todayRecords.length?todayRecords.map(r=>`<li>${r.menu} - ${r.calorie} kcal (${r.date})</li>`).join(''):'<li>오늘의 기록이 없습니다.</li>';
    if(!todayRecords.length)return;
    new Chart($('calorieChart'),{type:'bar',data:{labels:todayRecords.map(r=>r.menu),datasets:[{label:'칼로리(kcal)',data:todayRecords.map(r=>r.calorie),backgroundColor:'#007bff'}]},options:{responsive:true,scales:{y:{beginAtZero:true}}}});
  }
}