import type {Runner} from './domain.mjs';
export const areas=['Pretoria East','Centurion','Johannesburg'];
export const slots=['Any time','Early morning','Evening','Weekend'];
export const runners:Runner[]=[
  {id:'demo-1',name:'Lebo',area:'Pretoria East',pace:360,distance:5,slot:'Early morning',bio:'Easy kilometres, good company. Building a consistent running habit.'},
  {id:'demo-2',name:'Alex',area:'Pretoria East',pace:330,distance:5,slot:'Evening',bio:'A relaxed after-work loop at a conversational pace.'},
  {id:'demo-3',name:'Thandi',area:'Pretoria East',pace:390,distance:7,slot:'Weekend',bio:'Weekend road runs and a coffee afterwards. No pressure to race.'},
  {id:'demo-4',name:'Sam',area:'Centurion',pace:360,distance:5,slot:'Early morning',bio:'A short morning run before the workday starts.'},
  {id:'demo-5',name:'Neo',area:'Johannesburg',pace:300,distance:10,slot:'Weekend',bio:'Training for a 10K with a steady weekend pace.'},
  {id:'demo-6',name:'Jamie',area:'Centurion',pace:420,distance:3,slot:'Evening',bio:'New to running. Short distances and friendly encouragement.'}
];
