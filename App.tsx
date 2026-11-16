import React,{useMemo,useState} from 'react';
import {Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {areas,slots,runners} from './src/demo';
import {findRunners,formatPace,updateInvitation} from './src/domain.mjs';
import type {Invitation} from './src/domain.mjs';
type Tab='Discover'|'My runs'|'About';
function Choice({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected}} onPress={onPress} style={[s.choice,selected&&s.selected]}><Text style={[s.choiceText,selected&&s.white]}>{label}</Text></Pressable>;
}
export default function App() {
  const [tab,setTab]=useState<Tab>('Discover');
  const [area,setArea]=useState(areas[0]);
  const [pace,setPace]=useState<number|null>(360);
  const [distance,setDistance]=useState(5);
  const [slot,setSlot]=useState('Any time');
  const [blockedIds,setBlockedIds]=useState<string[]>([]);
  const [invitations,setInvitations]=useState<Invitation[]>([]);
  const matches=useMemo(()=>findRunners(runners,{area,pace,distance,slot,blockedIds}),[area,pace,distance,slot,blockedIds]);
  const pending=invitations.filter(i=>i.status==='pending');
  return <SafeAreaProvider><SafeAreaView style={s.screen}>
    <StatusBar style="dark"/>
    <View style={s.top}><Text style={s.brand}>AppRunmate.</Text><Text style={s.kicker}>RUN TOGETHER</Text></View>
    <View style={s.banner}><Text style={s.notice}>DEMO · Fictional runners. No real messages or bookings.</Text></View>
    <ScrollView contentContainerStyle={s.content}>
      {tab==='Discover'&&<>
        <Text style={s.kicker}>YOUR NEXT RUN STARTS HERE</Text>
        <Text accessibilityRole="header" style={s.title}>Find your pace.{'\n'}Find your people.</Text>
        <Text style={s.body}>A familiar route. A new running partner. Choose where and how you like to run.</Text>
        <View style={s.card}>
          <Text style={s.label}>WHERE ARE WE RUNNING?</Text>
          <View style={s.row}>{areas.map(v=><Choice key={v} label={v} selected={area===v} onPress={()=>setArea(v)}/>)}</View>
          <Text style={s.label}>COMFORTABLE PACE · MIN/KM</Text>
          <View style={s.row}>{[300,360,420,null].map(v=><Choice key={String(v)} label={v===null?'Not sure yet':formatPace(v)} selected={pace===v} onPress={()=>setPace(v)}/>)}</View>
          <Text style={s.label}>DISTANCE</Text>
          <View style={s.row}>{[3,5,10].map(v=><Choice key={v} label={v+' km'} selected={distance===v} onPress={()=>setDistance(v)}/>)}</View>
          <Text style={s.label}>WHEN IT WORKS FOR YOU</Text>
          <View style={s.row}>{slots.map(v=><Choice key={v} label={v} selected={slot===v} onPress={()=>setSlot(v)}/>)}</View>
        </View>
        <Text accessibilityRole="header" style={s.heading}>Your running people · {matches.length}</Text>
        <Text style={s.small}>Matches share your area, distance within 2 km and pace within 1 min/km. No live locations are shown.</Text>
        {matches.length===0&&<View style={s.card}><Text style={s.heading}>A little quiet here</Text><Text style={s.body}>Try another area, time, pace or distance to explore more sample runners.</Text></View>}
        {matches.map(r=>{
          const sent=pending.some(i=>i.runnerId===r.id);
          return <View key={r.id} style={s.card}>
            <View style={s.row}><View style={s.avatar}><Text style={s.avatarText}>{r.name[0]}</Text></View><View style={{flex:1}}><Text style={s.heading}>{r.name}</Text><Text style={s.small}>{r.area} · Sample profile</Text></View></View>
            <Text style={s.body}>{r.bio}</Text>
            <View style={s.row}><Text style={s.pill}>{formatPace(r.pace)} /km</Text><Text style={s.pill}>{r.distance} km</Text><Text style={s.pill}>{r.slot}</Text></View>
            <Pressable accessibilityRole="button" accessibilityState={{disabled:sent}} accessibilityLabel={'Demo invitation to '+r.name} disabled={sent} onPress={()=>setInvitations(items=>updateInvitation(items,r.id,'invite'))} style={[s.button,sent&&s.disabled]}><Text style={s.buttonText}>{sent?'Demo invitation pending':'Invite for a run →'}</Text></Pressable>
            <Pressable accessibilityRole="button" style={s.linkButton} onPress={()=>{setBlockedIds(ids=>[...new Set([...ids,r.id])]);setInvitations(items=>updateInvitation(items,r.id,'cancel'));}}><Text style={s.link}>Hide sample runner</Text></Pressable>
          </View>;
        })}
      </>}
      {tab==='My runs'&&<>
        <Text style={s.kicker}>MAKE TIME FOR THE MILES</Text><Text accessibilityRole="header" style={s.title}>My runs</Text>
        <Text style={s.body}>Local demo invitations only. Nothing is sent to another person, and no run is confirmed.</Text>
        {!pending.length&&<View style={s.card}><Text style={s.heading}>Your next run is ahead of you</Text><Text style={s.body}>Open Discover to try inviting a sample runner.</Text></View>}
        {pending.map(i=>{
          const r=runners.find(r=>r.id===i.runnerId)!;
          return <View key={r.id} style={s.card}><Text style={s.kicker}>DEMO · PENDING</Text><Text style={s.heading}>Run with {r.name}</Text><Text style={s.body}>{r.area} · {r.distance} km · {formatPace(r.pace)} /km</Text><Text style={s.small}>No date or public meeting place has been agreed. Real invitations will require both.</Text><Pressable accessibilityRole="button" style={s.linkButton} onPress={()=>setInvitations(items=>updateInvitation(items,r.id,'cancel'))}><Text style={s.link}>Cancel demo invitation</Text></Pressable></View>;
        })}
      </>}
      {tab==='About'&&<>
        <Text style={s.kicker}>BUILT AROUND RUNNING</Text><Text accessibilityRole="header" style={s.title}>Good company.{'\n'}Clear boundaries.</Text>
        <View style={s.card}><Text style={s.heading}>An early mobile prototype</Text><Text style={s.body}>All profiles are fictional. No accounts, real chat, bookings or GPS tracking exist yet. Your selections and invitations reset when the app restarts.</Text></View>
        <View style={s.card}><Text style={s.heading}>Running comes first</Text><Text style={s.body}>The planned pilot is for adult runners, including beginners. Choose public meeting places, agree on the route and pace, and respect each other's boundaries.</Text><Text style={s.body}>Discovery should show approximate areas. Verification is never a guarantee of personal safety.</Text></View>
        <Pressable accessibilityRole="button" style={s.button} onPress={()=>{setInvitations([]);setBlockedIds([]);}}><Text style={s.buttonText}>Reset demo activity</Text></Pressable>
      </>}
      <Text style={s.footer}>STRICTLY FOR RUNNERS · START WITH ONE GOOD RUN</Text>
    </ScrollView>
    <View style={s.tabs}>{(['Discover','My runs','About'] as const).map(v=><Pressable key={v} accessibilityRole="tab" accessibilityState={{selected:tab===v}} onPress={()=>setTab(v)} style={[s.tab,tab===v&&s.activeTab]}><Text style={s.tabText}>{v}{v==='My runs'&&pending.length?' ('+pending.length+')':''}</Text></Pressable>)}</View>
  </SafeAreaView></SafeAreaProvider>;
}
const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:'#F7F8F2'},top:{paddingHorizontal:22,paddingVertical:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8},
  brand:{fontSize:25,fontWeight:'900',color:'#173C32',letterSpacing:-1},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:'#476445'},
  banner:{backgroundColor:'#E6EEDC',paddingHorizontal:22,paddingVertical:10},notice:{fontSize:12,lineHeight:18,color:'#294332',fontWeight:'600'},
  content:{padding:22,gap:16,maxWidth:680,width:'100%',alignSelf:'center'},title:{fontSize:38,lineHeight:43,fontWeight:'900',color:'#173C32',letterSpacing:-1.2},
  body:{fontSize:15,lineHeight:24,color:'#43594B'},small:{fontSize:12,lineHeight:19,color:'#526257'},card:{padding:19,borderRadius:22,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E0E6DA',gap:14},
  label:{fontSize:10,fontWeight:'800',letterSpacing:1,color:'#466254'},row:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8},
  choice:{minHeight:44,paddingHorizontal:14,paddingVertical:12,borderRadius:22,borderWidth:1,borderColor:'#D9E0D4',justifyContent:'center'},selected:{backgroundColor:'#173C32',borderColor:'#173C32'},choiceText:{fontSize:13,color:'#334C3D',fontWeight:'600'},white:{color:'#FFFFFF'},
  heading:{fontSize:20,fontWeight:'800',color:'#173C32'},avatar:{width:48,height:48,borderRadius:24,backgroundColor:'#E6EEDC',alignItems:'center',justifyContent:'center'},avatarText:{fontSize:21,color:'#294332',fontWeight:'800'},
  pill:{backgroundColor:'#F0F4E9',paddingHorizontal:10,paddingVertical:7,borderRadius:9,fontSize:12,color:'#294332',fontWeight:'600'},
  button:{minHeight:48,borderRadius:14,backgroundColor:'#173C32',padding:14,alignItems:'center',justifyContent:'center'},disabled:{backgroundColor:'#526257'},buttonText:{color:'#FFFFFF',fontSize:14,fontWeight:'700',textAlign:'center'},
  linkButton:{minHeight:44,alignItems:'center',justifyContent:'center'},link:{fontSize:13,color:'#345C40',textDecorationLine:'underline'},
  tabs:{flexDirection:'row',padding:8,borderTopWidth:1,borderTopColor:'#DDE4D7',backgroundColor:'#FFFFFF',gap:6},tab:{flex:1,minHeight:48,justifyContent:'center',alignItems:'center',borderRadius:14},activeTab:{backgroundColor:'#E6EEDC'},tabText:{fontSize:13,fontWeight:'700',color:'#173C32'},
  footer:{fontSize:9,lineHeight:16,letterSpacing:1,color:'#526257',textAlign:'center',marginVertical:14}
});
