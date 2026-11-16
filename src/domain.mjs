/**
 * @typedef {{id:string,name:string,area:string,pace:number,distance:number,slot:string,bio:string}} Runner
 * @typedef {{area:string,pace:number|null,distance:number,slot:string,selfId?:string,blockedIds?:string[]}} Filters
 * @typedef {{runnerId:string,status:'pending'|'cancelled'}} Invitation
 */
/** @param {number} seconds */
export function formatPace(seconds) {
  if (!Number.isFinite(seconds) || seconds<=0) throw new Error('Invalid pace');
  const rounded=Math.round(seconds);
  return Math.floor(rounded/60)+':'+String(rounded%60).padStart(2,'0');
}
/** @param {Runner[]} runners @param {Filters} filters @returns {Runner[]} */
export function findRunners(runners,filters) {
  if (!filters.area || !filters.slot || !Number.isFinite(filters.distance) || filters.distance<=0 ||
    (filters.pace!==null && (!Number.isFinite(filters.pace) || filters.pace<=0))) throw new Error('Invalid search');
  return runners.filter(r=>
    r.id!==filters.selfId && !filters.blockedIds?.includes(r.id) &&
    Number.isFinite(r.pace) && r.pace>0 && Number.isFinite(r.distance) && r.distance>0 &&
    r.area===filters.area && (filters.slot==='Any time' || r.slot===filters.slot) &&
    (filters.pace===null || Math.abs(r.pace-filters.pace)<=60) && Math.abs(r.distance-filters.distance)<=2
  ).sort((a,b)=>{
    const scoreA=(filters.pace===null?0:Math.abs(a.pace-filters.pace))+Math.abs(a.distance-filters.distance)*30;
    const scoreB=(filters.pace===null?0:Math.abs(b.pace-filters.pace))+Math.abs(b.distance-filters.distance)*30;
    return scoreA-scoreB || a.id.localeCompare(b.id);
  });
}
/** Demo only. Real transitions must be authorized on the server.
 * @param {Invitation[]} invitations @param {string} runnerId @param {'invite'|'cancel'} action
 * @returns {Invitation[]}
 */
export function updateInvitation(invitations,runnerId,action) {
  if (!runnerId.trim()) throw new Error('Runner is required');
  if (action==='cancel') return invitations.map(i=>i.runnerId===runnerId?{...i,status:'cancelled'}:i);
  if (action!=='invite') throw new Error('Unknown action');
  if (invitations.some(i=>i.runnerId===runnerId && i.status==='pending')) return invitations;
  return [...invitations.filter(i=>i.runnerId!==runnerId),{runnerId,status:'pending'}];
}
