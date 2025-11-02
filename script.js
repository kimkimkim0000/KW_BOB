console.log('✅ script.js loaded!');

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
const records=JSON.parse(localStorage.getItem('records')||'[]');
function $(id){return document.getElementById(id)}
window.addEventListener('DOMContentLoaded',()=>{
 $('recommendBtn').addEventListener('click',recommendMenu);
 $('retryBtn').addEventListener('click',recommendMenu);
 $('viewRecordsBtn').addEventListener('click',showRecords);
 $('backBtn').addEventListener('click',()=>{toggle('records',false);toggle('user-form',true);});
});
function toggle(id,show){$(id).classList.toggle('hidden',!show)}
function recommendMenu(){
 const name=$('name').value.trim(),gender=$('gender').value,age=+$('age').value,height=+$('height').value,weight=+$('weight').value,goal=$('goal').value,category=$('category').value;
 if(!name)return alert('이름을 입력하세요!');
 const bmr=10*weight+6.25*height-5*age+(gender==='M'?5:-161);
 const refCal=bmr*(goal==='감량'?0.8:goal==='증량'?1.2:1.0);
 const refMeal=Math.round(refCal/3);
 let filtered=MENU_DB;if(category)filtered=filtered.filter(m=>m.category===category);
 const randomMenus=filtered.sort(()=>0.5-Math.random()).slice(0,5);
 const list=$('menu-list');list.innerHTML='';
 randomMenus.forEach(m=>{
  const li=document.createElement('li');
  li.innerHTML=`${m.name} (${m.category}) - ${m.calorie} kcal ${(m.price?`/ ${m.price}원 / ${m.restaurant}`:'(자취요리)')}<br><button onclick="selectMenu('${name}','${m.name}',${m.calorie})">선택</button>`;
  list.appendChild(li);
 });
 toggle('user-form',false);toggle('recommendations',true);
}
function selectMenu(username,menu,calorie){
 const record={username,menu,calorie,date:new Date().toLocaleString()};
 records.push(record);
 localStorage.setItem('records',JSON.stringify(records));
 alert(`${menu} 저장 완료!`);
}
function showRecords(){
 toggle('recommendations',false);toggle('records',true);
 const today=new Date().toLocaleDateString();
 const todayRecords=records.filter(r=>r.date.includes(today));
 const list=$('record-list');
 list.innerHTML=todayRecords.length?todayRecords.map(r=>`<li>${r.menu} - ${r.calorie} kcal (${r.date})</li>`).join(''):'<li>오늘의 기록이 없습니다.</li>';
 if(!todayRecords.length)return;
 new Chart($('calorieChart'),{type:'bar',data:{labels:todayRecords.map(r=>r.menu),datasets:[{label:'칼로리(kcal)',data:todayRecords.map(r=>r.calorie),backgroundColor:'#007bff'}]},options:{responsive:true,scales:{y:{beginAtZero:true}}}});
}