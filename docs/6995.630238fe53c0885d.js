"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[6995],{6995:(C,u,l)=>{l.r(u),l.d(u,{HomePageModule:()=>B});var d=l(177),p=l(4341),s=l(4742),h=l(70),m=l(467),t=l(4438);let g=(()=>{var n;class i{constructor(){this.combatBlock=null}ngOnInit(){console.log(this.combatBlock)}}return(n=i).\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.VBU({type:n,selectors:[["app-combat"]],decls:2,vars:0,template:function(e,o){1&e&&(t.j41(0,"p"),t.EFF(1," combat works!\n"),t.k0s())},styles:["*[_ngcontent-%COMP%]{color:#fff}"]}),i})();var y=l(1413);let f=(()=>{var n;class i{constructor(){this.game=[],this.items=[],this.defaultPlayerStats={health:100,AC:13,strength:16,dexterity:14,constitution:10,intelligence:12,wisdom:12},this.inventory=new y.B}intialiseGame(){var e=this;return(0,m.A)(function*(){try{yield fetch("assets/game.json").then(o=>o.json()).then(o=>{if(e.game=o,console.log(e.game),e.game.length<=0)throw new Error("No game data found");return e.gameState=localStorage.getItem("gameState"),e.gameState||(e.gameState={currentStory:0,inventory:[],playerStats:e.defaultPlayerStats}),e.inventory.next(e.gameState.inventory),localStorage.setItem("gameState",JSON.stringify(e.gameState)),e.gameState})}catch(o){console.log("err: ",o)}})()}getInventory(){return this.gameState.inventory}addItem(e){let o=this.items.find(r=>r.id===e);o&&(this.gameState.inventory.push(o),this.inventory.next(this.gameState.inventory),this.saveGameState())}loadNextScene(e){let o;return o=this.game.find(r=>r.id==e),o||{id:0,title:"Empty Story Block",pathway:"A blank moment in Darryn's journey.",description:"This block is intentionally left blank for future use.",items:[],options:[]}}saveGameState(){localStorage.setItem("gameState",JSON.stringify(this.gameState))}readJsonData(e){var o=this;return(0,m.A)(function*(){yield fetch(e).then(c=>c.json()).then(c=>{o.game=c})})()}}return(n=i).\u0275fac=function(e){return new(e||n)},n.\u0275prov=t.jDH({token:n,factory:n.\u0275fac,providedIn:"root"}),i})();function S(n,i){if(1&n){const a=t.RV6();t.j41(0,"ion-item",5),t.bIt("click",function(){const o=t.eBV(a).$implicit,r=t.XpG();return t.Njj(r.onOptionSelected(o.targetStoryBlock))}),t.EFF(1),t.k0s()}if(2&n){const a=i.$implicit;t.R7$(),t.Lme(" ",a.name," - ",a.description," ")}}const v=[{path:"",component:(()=>{var n;class i{constructor(e,o){this.gameService=e,this.modalController=o,this.activateOptions=!1,this.storyBlock={id:0,title:"Empty Story Block",pathway:"A blank moment in Darryn's journey.",description:"This block is intentionally left blank for future use.",items:[],options:[{name:"start",description:"Start Darryn's adventure",collectedItems:[],targetStoryBlock:1}]},this.displayedText="",this.typingSpeed=50}ngOnInit(){this.gameService.intialiseGame(),this.showStoryBlock(this.storyBlock)}showStoryBlock(e){this.activateOptions=!1,this.storyBlock=e,this.displayedText="",this.typeText(this.storyBlock.description)}typeText(e){var o=this;return(0,m.A)(function*(){let r=0;const c=()=>{r<e.length?(o.displayedText+=e.charAt(r),r++,setTimeout(c,o.typingSpeed)):o.activateOptions=!0};yield c()})()}onOptionSelected(e){if(this.activateOptions){let o=this.gameService.loadNextScene(e);if(null!=o&&o.isCombat)return void this.openCombat(o);this.storyBlock=o,this.showStoryBlock(this.storyBlock)}}openCombat(e){var o=this;return(0,m.A)(function*(){const r=yield o.modalController.create({component:g,componentProps:{combatBlock:e}});yield r.present(),r.onDidDismiss().then(c=>{console.log(c)})})()}}return(n=i).\u0275fac=function(e){return new(e||n)(t.rXU(f),t.rXU(s.W3))},n.\u0275cmp=t.VBU({type:n,selectors:[["app-home"]],decls:18,vars:6,consts:[[3,"translucent"],[3,"fullscreen"],["collapse","condense"],["size","large"],[3,"click",4,"ngFor","ngForOf"],[3,"click"]],template:function(e,o){1&e&&(t.j41(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),t.EFF(3," Game"),t.k0s()()(),t.j41(4,"ion-content",1)(5,"ion-header",2)(6,"ion-toolbar")(7,"ion-title",3),t.EFF(8,"home"),t.k0s()()(),t.j41(9,"ion-card")(10,"ion-card-header")(11,"ion-card-subtitle"),t.EFF(12),t.k0s(),t.j41(13,"ion-card-title"),t.EFF(14),t.k0s()(),t.j41(15,"ion-card-content"),t.EFF(16),t.k0s()(),t.DNE(17,S,2,2,"ion-item",4),t.k0s()),2&e&&(t.Y8G("translucent",!0),t.R7$(4),t.Y8G("fullscreen",!0),t.R7$(8),t.SpI(" ",o.storyBlock.pathway," "),t.R7$(2),t.SpI(" ",o.storyBlock.title," "),t.R7$(2),t.SpI(" ",o.displayedText," "),t.R7$(),t.Y8G("ngForOf",o.storyBlock.options))},dependencies:[d.Sq,s.b_,s.I9,s.ME,s.HW,s.tN,s.W9,s.eU,s.uz,s.BC,s.ai]}),i})()}];let k=(()=>{var n;class i{}return(n=i).\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.$C({type:n}),n.\u0275inj=t.G2t({imports:[h.iI.forChild(v),h.iI]}),i})(),B=(()=>{var n;class i{}return(n=i).\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.$C({type:n}),n.\u0275inj=t.G2t({imports:[d.MD,p.YN,s.bv,k]}),i})()}}]);