'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const STORAGE='ai-workshop-platform-v2';
const LEGACY_STORAGE='ai-workshop-platform-v1';
// 純前端密碼只能避免誤觸，無法提供真正的存取控制；研習前可在此更換。
const INSTRUCTOR_PASSWORD='teacher2026';
const INSTRUCTOR_SESSION='ai-workshop-instructor-unlocked';
const missions=$$('.mission');
let currentIndex=0;

function getState(){
  try{return JSON.parse(localStorage.getItem(STORAGE))||{}}catch{return {}}
}
function migrateLegacy(){
  if(localStorage.getItem(STORAGE)||!localStorage.getItem(LEGACY_STORAGE))return;
  try{
    const old=JSON.parse(localStorage.getItem(LEGACY_STORAGE))||{};
    localStorage.setItem(STORAGE,JSON.stringify({...old,missions:[old.missions?.[0],old.missions?.[1],false,old.missions?.[2],old.missions?.[3],old.missions?.[4],old.missions?.[5],old.missions?.[6]],mode:'learner',current:0}));
  }catch{/* 保留舊資料，不中斷頁面 */}
}
function collectState(){
  return {
    missions:$$('.mission-check').map(x=>x.checked),
    tasks:$$('.task-check').map(x=>x.checked),
    results:$$('.result-check').map(x=>x.checked),
    notes:Object.fromEntries($$('[data-note]').map(x=>[x.dataset.note,x.value])),
    fields:Object.fromEntries($$('[data-field]').map(x=>[x.dataset.field,x.value])),
    mode:document.body.classList.contains('instructor-mode')?'instructor':'learner',
    current:currentIndex
  };
}
function save(){localStorage.setItem(STORAGE,JSON.stringify(collectState()));updateProgress()}
function load(){
  migrateLegacy();
  const s=getState();
  $$('.mission-check').forEach((x,i)=>x.checked=!!s.missions?.[i]);
  $$('.task-check').forEach((x,i)=>x.checked=!!s.tasks?.[i]);
  $$('.result-check').forEach((x,i)=>x.checked=!!s.results?.[i]);
  $$('[data-note]').forEach(x=>x.value=s.notes?.[x.dataset.note]||'');
  $$('[data-field]').forEach(x=>x.value=s.fields?.[x.dataset.field]||'');
  const instructorUnlocked=sessionStorage.getItem(INSTRUCTOR_SESSION)==='true';
  setMode(s.mode==='instructor'&&instructorUnlocked?'instructor':'learner',false);
  currentIndex=Math.min(Number.isInteger(s.current)?s.current:0,missions.length-1);
  setCurrent(currentIndex,false);
  updateProgress();
}
function updateProgress(){
  const checks=$$('.mission-check'),done=checks.filter(x=>x.checked).length,pct=Math.round(done/checks.length*100);
  $('#bar').style.width=pct+'%';$('#progressText').textContent=pct+'%';$('#missionCount').textContent=`${done} / ${checks.length} 關`;
  $('.track').setAttribute('aria-valuenow',String(pct));
  const results=$$('.result-check'),resultDone=results.filter(x=>x.checked).length;
  $('#completionSummary').textContent=resultDone===results.length?'六項成果皆已確認，可以匯出研習紀錄。':`成果驗收：已確認 ${resultDone} / ${results.length} 項。`;
}
function setMode(mode,persist=true){
  document.body.classList.toggle('instructor-mode',mode==='instructor');
  $$('.mode-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
  if(persist)save();
}
function requestInstructorMode(){
  if(sessionStorage.getItem(INSTRUCTOR_SESSION)==='true'){
    setMode('instructor');
    return;
  }
  $('#instructorPassword').value='';
  $('#passwordError').hidden=true;
  $('#passwordDialog').showModal();
  setTimeout(()=>$('#instructorPassword').focus(),0);
}
function setCurrent(index,scroll=true){
  currentIndex=Math.max(0,Math.min(index,missions.length-1));
  const mission=missions[currentIndex];
  $('#currentMission').textContent=`關卡 ${currentIndex}｜${mission.dataset.title}`;
  $('#suggestedTime').textContent=`建議 ${mission.dataset.time} 分鐘`;
  $('#stageStatus').textContent=`關卡 ${currentIndex} / ${missions.length-1}`;
  $('#prevMission').disabled=currentIndex===0;$('#nextMission').textContent=currentIndex===missions.length-1?'前往成果驗收 →':'下一關 →';
  $$('.mission-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#m${currentIndex}`));
  if(scroll)mission.scrollIntoView({behavior:'smooth',block:'start'});
  save();
}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>el.classList.remove('show'),1800)}

document.addEventListener('input',e=>{if(e.target.matches('input,textarea'))save()});
document.addEventListener('change',e=>{
  if(!e.target.matches('input[type=checkbox]'))return;
  save();
  if(e.target.classList.contains('mission-check')&&e.target.checked){
    const index=Number(e.target.closest('.mission').dataset.mission);
    toast(index<missions.length-1?`關卡 ${index} 已完成，即將前往下一關。`:'8 關完成，前往成果驗收。');
    setTimeout(()=>index<missions.length-1?setCurrent(index+1):$('#finish').scrollIntoView({behavior:'smooth'}),650);
  }
});
$$('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>btn.dataset.mode==='instructor'?requestInstructorMode():setMode('learner')));
$('#passwordForm').addEventListener('submit',event=>{
  event.preventDefault();
  const input=$('#instructorPassword');
  if(input.value!==INSTRUCTOR_PASSWORD){
    $('#passwordError').hidden=false;
    input.value='';
    input.focus();
    return;
  }
  sessionStorage.setItem(INSTRUCTOR_SESSION,'true');
  $('#passwordDialog').close();
  setMode('instructor');
  toast('講師模式已解鎖');
});
$('#cancelPassword').addEventListener('click',()=>$('#passwordDialog').close());
$$('.mission-nav a[href^="#m"]').forEach(a=>a.addEventListener('click',()=>{const match=a.hash.match(/#m(\d+)/);if(match){currentIndex=Number(match[1]);setCurrent(currentIndex,false)}}));
$('#prevMission').addEventListener('click',()=>setCurrent(currentIndex-1));
$('#nextMission').addEventListener('click',()=>currentIndex===missions.length-1?$('#finish').scrollIntoView({behavior:'smooth'}):setCurrent(currentIndex+1));

$$('.copy').forEach(btn=>btn.addEventListener('click',async()=>{
  const text=$('#'+btn.dataset.target).innerText;
  try{await navigator.clipboard.writeText(text);toast('Prompt 已複製');const old=btn.textContent;btn.textContent='已複製';setTimeout(()=>btn.textContent=old,1100)}catch{alert('瀏覽器無法自動複製，請手動選取 Prompt。')}
}));

let seconds=0,timerId=null;
function drawTimer(){const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('#timer').textContent=`${m}:${s}`}
$('#timerStart').addEventListener('click',()=>{if(!timerId)timerId=setInterval(()=>{seconds++;drawTimer()},1000)});
$('#timerPause').addEventListener('click',()=>{clearInterval(timerId);timerId=null});
$('#timerReset').addEventListener('click',()=>{clearInterval(timerId);timerId=null;seconds=0;drawTimer()});

$('#resetAll').addEventListener('click',()=>{if(confirm('確定清除全部研習進度、輸入與筆記？此動作無法復原。')){localStorage.removeItem(STORAGE);sessionStorage.removeItem(INSTRUCTOR_SESSION);location.reload()}});
function exportMarkdown(){
  const s=collectState(),titles=missions.map(x=>x.dataset.title),lines=['# AI 輔助教材轉譯｜我的研習紀錄','',`- 匯出時間：${new Date().toLocaleString('zh-TW')}`,'', '## 關卡完成狀態',...titles.map((title,i)=>`- [${s.missions[i]?'x':' '}] 關卡 ${i}：${title}`),'','## 三個教學部分',`- 部分一：${s.fields.mod1||''}`,s.notes.mod1d||'',`- 部分二：${s.fields.mod2||''}`,s.notes.mod2d||'',`- 部分三：${s.fields.mod3||''}`,s.notes.mod3d||'',`- 三者關係：${s.notes.m3relation||''}`,''];
  const noteTitles={m0:'實作範圍',m1:'上傳與來源',m2:'教材分析',m4:'學生版教學語言',m5:'填空心智圖',m6:'教師檢查定稿',m7:'Skill 流程草案',final:'研習後行動'};
  Object.entries(noteTitles).forEach(([key,title])=>lines.push(`## ${title}`,s.notes[key]||'',''));
  lines.push('## 成果驗收',...$$('.result-check').map((x,i)=>`- [${x.checked?'x':' '}] ${x.parentElement.textContent.trim()}`));
  const blob=new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='我的AI教材轉譯研習紀錄.md';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('研習紀錄已匯出');
}
$('#exportNotes').addEventListener('click',exportMarkdown);$('#exportNotesBottom').addEventListener('click',exportMarkdown);

const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const index=Number(visible.target.dataset.mission);if(index!==currentIndex){currentIndex=index;setCurrent(index,false)}}},{threshold:[.25,.55]});
missions.forEach(m=>observer.observe(m));
load();drawTimer();
