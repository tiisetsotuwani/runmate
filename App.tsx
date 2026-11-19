import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LiveRunners } from './src/LiveRunners';
import { areas, runners, slots } from './src/demo';
import { findRunners, formatPace } from './src/domain.mjs';
import type { Runner } from './src/domain.mjs';

const photos: Record<string, number> = {
  'demo-1': require('./assets/runners/demo-1.jpg'),
  'demo-2': require('./assets/runners/demo-2.jpg'),
  'demo-3': require('./assets/runners/demo-3.jpg'),
  'demo-4': require('./assets/runners/demo-4.jpg'),
  'demo-5': require('./assets/runners/demo-5.jpg'),
  'demo-6': require('./assets/runners/demo-6.jpg'),
};
const sampleLikes = ['demo-1', 'demo-4', 'demo-5'];
const tabs = ['Discover', 'Matches', 'Profile', 'Live'] as const;
type Tab = typeof tabs[number];
type Profile = { name: string; area: string; distance: number; pace: number|null; slot: string; bio: string; photo: string };
type Activity = { choices: Record<string,'pass'|'like'>; chats: Record<string,string[]> };
const defaults: Profile = {name:'', area:areas[0], distance:5, pace:360, slot:slots[0], bio:'', photo:''};
const empty: Activity = {choices:{}, chats:{}};
const activityKey = 'runnerActivity.v2';
const profileKey = 'runnerProfile.v1';

function Action({label,onPress,secondary=false}:{label:string;onPress:()=>void;secondary?:boolean}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[s.button,secondary&&s.secondary]}>
    <Text style={s.buttonText}>{label}</Text></Pressable>;
}
function Select({title,values,selected,change}:{title:string;values:string[];selected:string;change:(value:string)=>void}) {
  return <View style={s.group}><Text style={s.label}>{title}</Text><View style={s.row}>{values.map(value=>
    <Pressable accessibilityRole="button" accessibilityState={{selected:selected===value}} style={[s.chip,selected===value&&s.on]} key={value} onPress={()=>change(value)}>
      <Text style={s.ink}>{value}</Text></Pressable>)}</View></View>;
}
function RunnerCard({runner,choose}:{runner:Runner;choose:(like:boolean)=>void}) {
  const x=useRef(new Animated.Value(0)).current;
  const gesture=PanResponder.create({
    onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dx)>10 && Math.abs(g.dx)>1.4*Math.abs(g.dy),
    onPanResponderMove:(_,g)=>x.setValue(g.dx),
    onPanResponderTerminationRequest:()=>false,
    onPanResponderTerminate:()=>x.setValue(0),
    onPanResponderRelease:(_,g)=>{
      if(Math.abs(g.dx)>=70) choose(g.dx>0);
      else Animated.spring(x,{toValue:0,useNativeDriver:true}).start();
    },
  });
  return <><Animated.View {...gesture.panHandlers} style={[s.card,{transform:[{translateX:x},{rotate:x.interpolate({inputRange:[-180,180],outputRange:['-8deg','8deg'],extrapolate:'clamp'})}]}]}>
    <Image source={photos[runner.id]} accessibilityLabel={'Sample portrait for '+runner.name} style={s.hero}/>
    <View style={s.details}><Text style={s.location}>{runner.area.toUpperCase()}</Text><Text style={s.name}>{runner.name}</Text>
    <Text style={s.metrics}>{runner.distance} km   ·   {formatPace(runner.pace)} /km   ·   {runner.slot}</Text><Text style={[s.body,{color:'#dce7dc'}]}>{runner.bio}</Text></View>
  </Animated.View>
  <View style={s.actions}><Action label="←  Pass" secondary onPress={()=>choose(false)}/><Action label="Like runner  →" onPress={()=>choose(true)}/></View></>;
}
export default function App() {
  const [tab,setTab]=useState<Tab>('Discover');
  const [profile,setProfile]=useState<Profile>(defaults);
  const [activity,setActivity]=useState<Activity>(empty);
  const [thread,setThread]=useState('');
  const [draft,setDraft]=useState('');
  const [notice,setNotice]=useState('');
  const [ready,setReady]=useState(false);
  const writeQueue=useRef(Promise.resolve());
  useEffect(()=>{
    let active=true;
    AsyncStorage.multiGet([profileKey,activityKey]).then(([[,p],[,a]])=>{
      if(!active)return;
      if(p){
        const old=JSON.parse(p);
        if(areas.includes(old.area)&&slots.includes(old.slot)&&[3,5,10].includes(old.distance)&&[300,360,420,null].includes(old.pace))
          setProfile({...defaults,...old});
      }
      if(a){const data=JSON.parse(a);if(data?.choices&&data?.chats)setActivity(data);}
    }).catch(()=>{if(active)setNotice('Could not load your saved demo.');}).finally(()=>{if(active)setReady(true)});
    return ()=>{active=false};
  },[]);
  useEffect(()=>{
    if(ready) writeQueue.current=writeQueue.current.then(()=>AsyncStorage.setItem(activityKey,JSON.stringify(activity)))
      .catch(()=>setNotice('Could not save this activity on your device.'));
  },[activity,ready]);
  const candidates=findRunners(runners,profile).filter(r=>!activity.choices[r.id]);
  const matches=runners.filter(r=>sampleLikes.includes(r.id)&&activity.choices[r.id]==='like');
  const partner=matches.find(r=>r.id===thread);
  function choose(like:boolean) {
    const runner=candidates[0];
    if(!runner)return;
    setActivity(a=>({...a,choices:{...a.choices,[runner.id]:like?'like':'pass'}}));
    setNotice(like&&sampleLikes.includes(runner.id)?'Demo match with '+runner.name+'! Open Matches to chat.':'');
  }
  function openTab(next:Tab){setTab(next);setThread('');setDraft('');setNotice('');}
  function edit<K extends keyof Profile>(key:K,value:Profile[K]){setProfile(p=>({...p,[key]:value}));setNotice('');}
  async function pickPhoto(){
    try{
      const selection=await File.pickFileAsync(undefined,'image/*');
      const file=Array.isArray(selection)?selection[0]:selection;
      if(!file)return;
      if(file.size>6*1024*1024){setNotice('Choose a picture smaller than 6 MB.');return;}
      await Image.getSize(file.uri);
      const target=new File(Paths.document,'runner-'+Date.now()+'.'+(file.extension.replace(/[^a-zA-Z0-9]/g,'')||'jpg'));
      file.copy(target);
      edit('photo',target.uri);setNotice('Picture selected. Save your profile to keep it.');
    } catch(error) {if(!String(error).toLowerCase().includes('cancel'))setNotice('Could not open that picture. Try a JPEG or PNG file.');}
  }
  async function saveProfile(){
    if(!profile.name.trim()){setNotice('Enter your running name first.');return;}
    try{await AsyncStorage.setItem(profileKey,JSON.stringify({...profile,name:profile.name.trim()}));setNotice('Profile saved on this device.');}
    catch{setNotice('Profile could not be saved.');}
  }
  function send(){
    const text=draft.trim();
    if(!partner||!text)return;
    setActivity(a=>({...a,chats:{...a.chats,[partner.id]:[...(a.chats[partner.id]||[]),text]}}));setDraft('');
  }
  return <SafeAreaProvider><SafeAreaView style={s.screen}><StatusBar style="dark"/>
    <View style={s.top}><Text style={s.brand}>AppRunmate</Text><Text style={s.demo}>{tab==='Live'?'LIVE':'RUNNER DEMO'}</Text></View>
    {tab==='Live'?<LiveRunners/>:<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.page}>
      {!ready?<Text>Loading your profile…</Text>:<>
      {tab==='Discover'&&<><Text style={s.title}>Find your partner.</Text><Text style={s.sub}>Swipe right to like a runner or left to pass.</Text>
        {candidates[0]?<RunnerCard key={candidates[0].id} runner={candidates[0]} choose={choose}/>:<View style={s.box}><Text style={s.head}>You’re all caught up.</Text><Text style={s.body}>Change your running preferences to see more sample runners.</Text>
        <Action label="Edit preferences" onPress={()=>openTab('Profile')}/></View>}</>}
      {tab==='Matches'&&<><Text style={s.title}>{partner?partner.name:'Your matches.'}</Text>
        {partner?<><Action secondary label="←  All matches" onPress={()=>{setThread('');setDraft('')}}/>
        <Text style={s.sub}>Demo conversation · messages stay on this device.</Text>
        {(activity.chats[partner.id]||[]).map((message,i)=><Text key={i} style={s.bubble}>{message}</Text>)}
        <TextInput accessibilityLabel="Message" placeholder="Ask about the next run…" style={s.input} multiline maxLength={1000} value={draft} onChangeText={setDraft}/><Action label="Send demo message" onPress={send}/></>:
        <><Text style={s.sub}>A chat opens when both runners like each other. Mutual likes here are simulated.</Text>
        {!matches.length&&<Text style={s.body}>Like a runner in Discover to try matching.</Text>}
        {matches.map(r=><Pressable key={r.id} accessibilityRole="button" onPress={()=>setThread(r.id)} style={s.match}>
          <Image source={photos[r.id]} style={s.avatar}/><View style={{flex:1}}><Text style={s.head}>{r.name}</Text><Text numberOfLines={1} style={s.body}>{activity.chats[r.id]?.at(-1)||r.area}</Text></View><Text>Chat →</Text></Pressable>)}</>}</>}
      {tab==='Profile'&&<><Text style={s.title}>Runner profile.</Text><View style={s.box}>
        {profile.photo?<Image source={{uri:profile.photo}} style={s.profilePic} accessibilityLabel="Your selected profile photo"/>:null}
        <Action secondary label={profile.photo?'Change profile picture':'Choose a profile picture'} onPress={pickPhoto}/>
        <Text style={s.label}>Running name</Text><TextInput style={s.input} accessibilityLabel="Running name" placeholder="Your name" maxLength={40} value={profile.name} onChangeText={v=>edit('name',v)}/>
        <Text style={s.label}>About your running</Text><TextInput style={s.input} accessibilityLabel="About your running" placeholder="What makes a good run for you?" multiline maxLength={250} value={profile.bio} onChangeText={v=>edit('bio',v)}/>
        <Select title="Area" values={areas} selected={profile.area} change={v=>edit('area',v)}/>
        <Select title="Distance (km)" values={['3','5','10']} selected={String(profile.distance)} change={v=>edit('distance',Number(v))}/>
        <Select title="Pace per km" values={['5:00','6:00','7:00','Any']} selected={profile.pace?formatPace(profile.pace):'Any'} change={v=>edit('pace',v==='Any'?null:parseInt(v)*60)}/>
        <Select title="Availability" values={slots} selected={profile.slot} change={v=>edit('slot',v)}/>
        <Action label="Save profile" onPress={saveProfile}/></View>
        <Action secondary label="Reset demo likes and messages" onPress={()=>{setActivity(empty);setNotice('Demo activity reset.')}}/></>}
      {!!notice&&<Text accessibilityLiveRegion="polite" style={s.status}>{notice}</Text>}</>}
    </ScrollView>}<View style={s.tabs}>{tabs.map(t=><Pressable key={t} accessibilityRole="tab" accessibilityState={{selected:t===tab}} onPress={()=>openTab(t)} style={[s.tab,t===tab&&s.on]}><Text style={s.buttonText}>{t}</Text></Pressable>)}</View>
    </SafeAreaView></SafeAreaProvider>;
}
const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:'#f6f6ef'},top:{paddingHorizontal:22,paddingVertical:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  brand:{fontSize:23,fontWeight:'900',letterSpacing:-1,color:'#1c3027'},demo:{fontSize:10,letterSpacing:1,fontWeight:'700',color:'#4c5d51'},
  page:{padding:20,gap:14,maxWidth:620,width:'100%',alignSelf:'center'},title:{fontSize:38,fontWeight:'900',letterSpacing:-1.8,color:'#162d23'},sub:{fontSize:15,lineHeight:22,color:'#526054'},
  card:{backgroundColor:'#193226',borderRadius:25,overflow:'hidden'},hero:{width:'100%',aspectRatio:1.35},details:{padding:20,gap:7},location:{color:'#c7f677',fontSize:11,fontWeight:'800',letterSpacing:1.3},
  name:{fontSize:34,fontWeight:'900',letterSpacing:-1.2,color:'white'},metrics:{fontSize:14,fontWeight:'700',color:'white'},body:{fontSize:15,lineHeight:22,color:'#516256'},
  actions:{flexDirection:'row',justifyContent:'space-evenly',gap:8},button:{paddingHorizontal:18,paddingVertical:14,minHeight:46,borderRadius:20,backgroundColor:'#b8e968',alignItems:'center',justifyContent:'center'},
  secondary:{backgroundColor:'#e6e9df'},buttonText:{fontWeight:'700',color:'#203126',fontSize:15},box:{padding:18,gap:12,borderRadius:20,backgroundColor:'white'},
  head:{fontSize:20,fontWeight:'800',color:'#1c3225'},label:{fontSize:14,fontWeight:'700',color:'#26382a'},row:{flexDirection:'row',flexWrap:'wrap',gap:6},group:{gap:6},
  input:{padding:12,minHeight:46,borderWidth:1,borderColor:'#c5cfc2',borderRadius:12,color:'#192e21'},chip:{paddingHorizontal:12,minHeight:44,justifyContent:'center',borderRadius:16,backgroundColor:'#eff1ec'},
  on:{backgroundColor:'#d2edaa'},ink:{color:'#26382a',fontWeight:'600'},tabs:{flexDirection:'row',padding:8,gap:4,borderTopWidth:1,borderColor:'#dae0d7',backgroundColor:'white'},
  tab:{flex:1,alignItems:'center',justifyContent:'center',minHeight:48,borderRadius:16},avatar:{width:60,height:60,borderRadius:20},
  profilePic:{width:112,height:112,borderRadius:24,alignSelf:'center'},match:{padding:12,flexDirection:'row',gap:12,backgroundColor:'white',alignItems:'center',borderRadius:18},
  bubble:{maxWidth:'85%',alignSelf:'flex-end',backgroundColor:'#ddedc8',borderRadius:16,padding:12,color:'#213323'},status:{color:'#26461e',fontWeight:'700',lineHeight:21}
});
