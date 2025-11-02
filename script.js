const MENU_DB=[
 {restaurant:"후문식당",name:"김치짜글이",price:7000,calorie:650,category:"한식"},
 {restaurant:"맛불",name:"짜장면",price:7000,calorie:670,category:"중식"},
 {restaurant:"윤스쿡",name:"돈가스",price:11000,calorie:800,category:"양식"},
 {restaurant:"하이레",name:"특등심카츠",price:15000,calorie:820,category:"양식"},
 {restaurant:"김가네",name:"라면김밥세트",price:6500,calorie:620,category:"분식"},
 {restaurant:"프랭크버거",name:"치즈버거세트",price:9500,calorie:950,category:"양식"},
 {restaurant:"뚝배기",name:"순두부찌개",price:7500,calorie:550,category:"한식"},
 {restaurant:"자취",name:"김치볶음밥",price:null,calorie:650,category:"자취요리"},
 {restaurant:"자취",name:"계란덮밥",price:null,calorie:580,category:"자취요리"},
 {restaurant:"자취",name:"참치마요덮밥",price:null,calorie:700,category:"자취요리"}];
const records=JSON.parse(localStorage.getItem("records")||"[]");
const $=id=>document.getElementById(id);
$("#recommendBtn").onclick=recommendMenu;
$("#retryBtn").onclick=recommendMenu;
$("#viewRecordsBtn").onclick=showRecords;
$("#backBtn").onclick=()=>{toggle("records",0);toggle("user-form",1);};
function toggle(id,show){$(id).classList.toggle("hidden",!show);}
function recommendMenu(){
 const n=$("#name").value.trim(),g=$("#gender").value,a=+$("#age").value,h=+$("#height").value,w=+$("#weight").value,t=$("#goal").value,c=$("#category").value;
 if(!n)return alert("이름을 입력하세요!");
 const bmr=10*w+6.25*h-5*a+(g=="M"?5:-161),ref=bmr*(t=="감량"?0.8:t=="증량"?1.2:1.0)/3;
 let list=MENU_DB; if(c)list=list.filter(m=>m.category==c);
 list=list.sort(()=>0.5-Math.random()).slice(0,5);
 $("#menu-list").innerHTML=list.map(m=>`<li>${m.name}(${m.category}) - ${m.calorie}kcal ${(m.price?`/ ${m.price}원 / ${m.restaurant}`:"(자취요리)")}<br><button onclick="selectMenu('${n}','${m.name}',${m.calorie})">선택</button></li>`).join("");
 toggle("user-form",0);toggle("recommendations",1);}
function selectMenu(u,m,cal){records.push({u,m,cal,date:new Date().toLocaleString()});localStorage.setItem("records",JSON.stringify(records));alert(`${m} 저장 완료!`);}
function showRecords(){
 toggle("recommendations",0);toggle("records",1);
 const today=new Date().toLocaleDateString(),r=records.filter(x=>x.date.includes(today));
 $("#record-list").innerHTML=r.length?r.map(x=>`<li>${x.m} - ${x.cal}kcal (${x.date})</li>`).join(""):"<li>오늘의 기록이 없습니다.</li>";
 if(!r.length)return;
 new Chart($("#calorieChart"),{type:"bar",data:{labels:r.map(x=>x.m),datasets:[{label:"칼로리(kcal)",data:r.map(x=>x.cal),backgroundColor:"#007bff"}]},options:{responsive:true,scales:{y:{beginAtZero:true}}}});
}