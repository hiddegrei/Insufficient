import React,{forwardRef,useState,useEffect} from "react";
import "../../css/Post.css";
import {Avatar,IconButton,Button} from "@material-ui/core";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PublishIcon from '@material-ui/icons/Publish';
import {Link,useHistory} from "react-router-dom";
import {useStateValue} from "../../Stateprovider";
import PostFooter from "./PostFooter";
import { db } from "../../firebase";
import firebase from "firebase";
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
        
function Post({
     audio,
    token,
    userId,
    username,
    verified,
    text,
    image,
    avatar,
    createdAt,
    likes,
    comments,
    shares,
    option1,
    option2,
    option3,
    option4,
    votes1,
    votes2,
    votes3,
    votes4, 
    Rusername,
    Rtext,
    Ravatar,
    Rtweeter,
    RcreatedAt,
    liker,
    likerCreatedAt,
    widget, 
   
}){
         const[{user,profile,handle,profilepop},dispatch]=useStateValue();
         const[poster,setPoster]=useState([]);
         const[follow,setFollow]=useState(false);
         const[allow,setAllow]=useState(false);
         const [vote1,setVote1]=useState(false)
         const [vote2,setVote2]=useState(false)
         const [vote3,setVote3]=useState(false)
         const [vote4,setVote4]=useState(false)
         const [allowVote,setAllowVote]=useState(false)
         const[usersign,setUsersign]=useState([]);
         const [weretweeter,setWeretweeter]=useState(false)
         const totalVotes=votes1+votes2+votes3+votes4;
         const[newTex,setNewTex]=useState(text)
          const[newTexR,setNewTexR]=useState(Rtext)
         const[newTex2,setNewTex2]=useState('')
         const [stop,setStop]=useState(false)
         const history=useHistory();
         const [statemes,setStatemes]=useState('')
          const [statemesR,setStatemesR]=useState('')

         const [newname,setNewname]=useState('');
         const [newnameR,setNewnameR]=useState('');
         const [stopi,setStopi]=useState(true);
         const [oldtime,setOldtime]=useState(createdAt);
          const [oldtimeR,setOldtimeR]=useState(RcreatedAt);
           const [oldtimeL,setOldtimeL]=useState(likerCreatedAt);
         const [newTime,setNewTime]=useState('');
         const Nvotes1=Math.round((votes1/totalVotes)*100);
         const Nvotes2=Math.round((votes2/totalVotes)*100);
           const Nvotes3=Math.round((votes3/totalVotes)*100);
            const Nvotes4=Math.round((votes4/totalVotes)*100);
         
        
         
         let newText
         let newTextR
         let naam
         let naamR

         
         

         
useEffect(()=>{
    let testmessage=newTex
   
let newmes=/@[\w]+/i.exec(testmessage)



if(newmes!=null){
let testmes=newmes[0].split('@')
let num=-1

testmes.forEach(function(val){
    if(num<0){
        num++
    }else{
      naam=val
      setNewname(naam)
    }
})


  //newText=testmessage.replace(/@[a-z]+/i,`<Link>${newmes}</Link>`)
  newText=testmessage.replace(/@[\w]+/i,`<strong><a id=\x22clicke\x22 >${newmes} </a></strong>`)
   //newText=testmessage.replace(/@[a-z]+/i,`<strong><p onClick={console.log('hi')}>${newmes}</p></strong>`)
 // href={/profile/${naam}}
 
 
 let texte=document.getElementById('posttext')
 
 if(newText!=null){
 texte.innerHTML=newText
 
 setStatemes(newText)
}
}
         },[])

         useEffect(()=>{
             let isSubscribed = true
var toggle = document.getElementById('clicke')

if(toggle!=null&&isSubscribed){
    
toggle.addEventListener('click',checklinkclick)
return ()=>{
            
            toggle.removeEventListener('click',checklinkclick)
        }  
}

return () => isSubscribed = false
         })

         const checklinkclick=(e)=>{
             
  e.stopImmediatePropagation();
     e.preventDefault()
    
     
  history.push(`/profile/${newname}`)
  
  
  
         }
    
        
         
         useEffect(()=>{
             let isSubscribed = true
             if(Rtext&&isSubscribed){
         let testmessage=newTexR
let newmesR=/@[\w]+/i.exec(testmessage)
if(newmesR!=null){
let testmes=newmesR[0].split('@')
let num=-1

testmes.forEach(function(val){
    if(num<0){
        num++
    }else{
      naamR=val
      setNewnameR(naam)
    }
})


  //newText=testmessage.replace(/@[a-z]+/i,`<Link>${newmes}</Link>`)
  newText=testmessage.replace(/@[\w]+/i,`<strong><a id=\x22clicker\x22 >${newmesR} </a></strong>`)
 
 let texte=document.getElementById('posttextR')
 if(newTextR!=null){
 texte.innerHTML=newTextR
 setStatemesR(newTextR)
 }
}
}
return () => isSubscribed = false
         },[])

          useEffect(()=>{
             let isSubscribed = true
var toggleR = document.getElementById('clicker')

if(toggleR!=null&&isSubscribed){
    
toggleR.addEventListener('clickr',checklinkclickr)
return ()=>{
            
            toggleR.removeEventListener('clickr',checklinkclickr)
        }  
}

return () => isSubscribed = false
         })

         const checklinkclickr=(e)=>{
             
  e.stopImmediatePropagation();
     e.preventDefault()
    
     
  history.push(`/profile/${newnameR}`)
  
  
  
         }
         
        
        
         
        
useEffect(()=>{
    let isSubscribed = true
    db.collection('users').doc(`${userId}`).get().then((dat)=>(
        (isSubscribed?
         setPoster(dat.data()):null) 
    )).catch(error => (isSubscribed ? console.log(error) : null))
     if(user){
         db.collection('users').doc(`${user.uid}`).get().then((dat)=>(
         (isSubscribed?
         setUsersign(dat.data()):null)
            )).catch(error => (isSubscribed ? console.log(error) : null))
        }else{console.log('no user')}
            setTimeout(()=>{
                if(isSubscribed){
                setAllow(true)
                }else{console.log('error')}
                },100)
         return () => isSubscribed = false
        },[follow])

useEffect(()=>{
let isSubscribed = true
if(Rusername&&isSubscribed){
   
    setWeretweeter(true)
}else if(isSubscribed){setWeretweeter(false)}else{console.log('error')}
return () => isSubscribed = false
},[])
        
       
        
useEffect(()=>{
    
if((vote1||vote2||vote3||vote4)&&allowVote&&profile.username&&token){
    if(vote1){
db.collection('users').doc(profile.username).collection('votes').doc(token).set({
    post:token,
    option1:vote1,
    username:profile.username
    

}).catch((error)=>console.log(error))}
if(vote2){
db.collection('users').doc(profile.username).collection('votes').doc(token).set({
    post:token,
    option2:vote2,
     username:profile.username

}).catch((error)=>console.log(error))}
if(vote3){
db.collection('users').doc(profile.username).collection('votes').doc(token).set({
    post:token,
    option3:vote3,
     username:profile.username

}).catch((error)=>console.log(error))}
if(vote4){
db.collection('users').doc(profile.username).collection('votes').doc(token).set({
    post:token,
    option4:vote4,
    username:profile.username
    

}).catch((error)=>console.log(error))}

}
if((vote1||vote2||vote3||vote4)&&allowVote&&profile.username){
if(vote1){
db.collection('posts').doc(token).update({
    votes1:firebase.firestore.FieldValue.increment(1)
})
}
if(vote2){
db.collection('posts').doc(token).update({
    votes2:firebase.firestore.FieldValue.increment(1)
})
}
if(vote3){
db.collection('posts').doc(token).update({
    votes3:firebase.firestore.FieldValue.increment(1)
})
}
if(vote4){
db.collection('posts').doc(token).update({
    votes4:firebase.firestore.FieldValue.increment(1)
})
}

}
},[vote1,vote2,vote3,vote4])

useEffect(()=>{
   let  isSubscribed=true
    if(user&&option1&&profile.username&&token){
        
db.collection('users').doc(profile.username).collection('votes').doc(token).get().then((doc)=>{
    
    if(doc.exists&&isSubscribed){
        if(doc.data().option1){
            
            setVote1(true)
        }
        if(doc.data().option2){
           setVote2(true)
            
        }
        if(doc.data().option3){
            setVote3(true)
             
        }
        if(doc.data().option4){
            setVote4(true)
             
        }
    }else if(isSubscribed){
        setAllowVote(true)
        }else{console.log('doc does not exists')}
}).catch(error => (isSubscribed ? console.log(error) : null))

    }
    return () => isSubscribed = false
},[user,profile.username])


const clickImage=(e)=>{
     e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${username}`)
}
const clickImageR=(e)=>{
     e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${Rusername}`)
}
      const handletag =(e)=>{
           e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${username}`)
      }   
      
      useEffect(()=>{
          let  isSubscribed=true
          var date1
          if(oldtimeR){
         date1=oldtimeR
          }else if(oldtime){
              date1=oldtime
          }else{
              date1=oldtimeL
          }
         
        var date2=new Date().getTime().toString()

       var diff = (date2 - date1)/1000;
    diff = Math.abs(Math.floor(diff));

    var days = Math.floor(diff/(24*60*60));
    var leftSec = diff - days * 24*60*60;

    var hrs = Math.floor(leftSec/(60*60));
    var leftSec = leftSec - hrs * 60*60;

    var min = Math.floor(leftSec/(60));
    var leftSec = leftSec - min * 60;

    let newtime
    if(days<1&&hrs<1&&min<1){
 newtime=` ${leftSec}s`
    }
    else if(days<1&&hrs<1){
         newtime=`${min}m`
    }
    else if(days<1){
    newtime=`${hrs}h`
    }else{
        newtime=`${days}d`
    }
    if(isSubscribed){
 setNewTime(newtime)
    }else{console.log('post line 353, component not mounted')}
  return () => isSubscribed = false
      },[])

     
     
     

     if(!Rusername&&!Rtext&&!option1&&!audio&&!Rtweeter&&!liker){return(
        //
         //NORMAL POST
         //
         
<div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="post">
    <div  className="post__avatar">
        
                {/* <Link to={`/profile/${username}`}> */}
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
                {/* </Link> */}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
          
          <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}
          
             


      </div>
      </div>
    {image&&
    <img className="post__img"src={image} alt=""></img>}
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image} option1={option1} widget/>
:<div></div>}
</div>
    
</div>

     )}
        
    //
    //
    //
    if(option1&&!audio&&!Rtweeter&&!Rtext&&!liker){return(
        //
        //NORMAL POST + POLL
        //

        <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
            
           <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}

      </div>
      </div>
      {/* //
      //HIERONDER ZIT DE POLL(ONDERDEEL VAN NORMALE POST POLL)
      // */}
    <div className="post__poll">
        {!vote1&&!vote2&&!vote3&&!vote4&&profile.username?
        <div>
            <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
             e.preventDefault()
            setVote1(true)}} className="post__poll__option">
        <h1 >{option1}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes1}%</h2>
        </div>
        
        </div>
        
         <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote2(true)}} className="post__poll__option">
         <h1 >{option2}</h1> 
     
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes2}%</h2>
       
        </div>
        
        </div>
        
        {option3&&
        <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote3(true)}} className="post__poll__option">
        <h1 >{option3}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes3}%</h2>
        </div>
        
        </div>}
        {option4&&
        <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote4(true)}} className="post__poll__option">
        <h1 >{option4}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes4}%</h2>
        </div>
        
        </div>}
        <div className="poll__totalvotes">Total Votes: {totalVotes}</div>
        </div>
        
        :
        
        
 <div>
            <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option1}</h1>
        {vote1&& <CheckCircleOutlineOutlinedIcon className="poll__CheckBox"/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes1}%</h2>
        </div>
        
        </div>
        
         <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option2}</h1>
        <div>
        {vote2&& < CheckCircleOutlineOutlinedIcon className="poll__CheckBox"/>}
        </div>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes2}%</h2>
        </div>
        
        </div>
        
        {option3&&
        <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option3}</h1>
        {vote3&& <CheckCircleOutlineOutlinedIcon/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes3}%</h2>
        </div>
        
        </div>}
        {option4&&
        <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option4}</h1>
        {vote4&& <CheckCircleOutlineOutlinedIcon/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{Nvotes4}%</h2>
        </div>
        
        </div>}
        <div className="poll__totalvotes">Total Votes: {totalVotes}</div>
        </div>
}
        
        

        </div>
    
    {/* //
    //
    //HIER BOVEN ZIT DE POLL(ONDERDEEL VAN NORMALE POST POLL) */}
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}  widget/>
:<div></div>}
</div>
    
</div>

    )}

//
//HIERONDER ZIT DE NORMALE RETWEET ZONDER TEKST
//
    if((Rtweeter||liker)&&!audio&&!option1&&!Rtext){return(
        
    
        <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="retweetpostExtra">
     {/* <div className="retweetpostExtra"> */}

{Rtweeter&&
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${Rtweeter}`)
        }} className="post__retweeter">
    <RepeatIcon/>
    {Rtweeter} has reposted
</div>}

{liker&&<div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${liker}`)
        }} className="post__retweeter">
    <FavoriteIcon styles={{fontSize:'small'}}/>
    {liker} has liked this
</div>}
        
       
       <div className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
  <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}


      </div>
      
    {image&&
    <img className="post__img"src={image} alt=""></img>}
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}  widget/>
:<div></div>}
</div>
    
</div>
</div>
    </div>
    )}
    if(audio&&!Rusername){return(
      <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="post">  
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
            <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}


      </div>
      </div>
    <audio className="audio" controls src={audio}></audio>
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}audio={audio}  widget/>
:<div></div>}
</div>
    
</div>
    )}
    if(option1&&Rtweeter){return(


         <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="retweetpostExtra">

        <div className="post__retweeter">
    <RepeatIcon/>
    {Rusername} has retweeted
</div>
<div className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
             <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}

      </div>
      </div>
      {/* //
      //HIERONDER ZIT DE POLL(ONDERDEEL VAN NORMALE POST POLL)
      // */}
    <div className="post__poll">
        {!vote1&&!vote2&&!vote3&&!vote4&&profile.username?
        <div>
            <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
             e.preventDefault()
            setVote1(true)}} className="post__poll__option">
        <h1 >{option1}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes1}</h2>
        </div>
        
        </div>
        
         <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote2(true)}} className="post__poll__option">
         <h1 >{option2}</h1> 
     
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes2}</h2>
       
        </div>
        
        </div>
        
        {option3&&
        <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote3(true)}} className="post__poll__option">
        <h1 >{option3}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes3}</h2>
        </div>
        
        </div>}
        {option4&&
        <div className="post__poll__optionContainer">
        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
            setVote4(true)}} className="post__poll__option">
        <h1 >{option4}</h1>
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes4}</h2>
        </div>
        
        </div>}
        <div className="poll__totalvotes">Total Votes: {totalVotes}</div>
        </div>
        
        :
        
        
 <div>
            <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option1}</h1>
        {vote1&& <CheckCircleOutlineOutlinedIcon className="poll__CheckBox"/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes1}</h2>
        </div>
        
        </div>
        
         <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option2}</h1>
        {vote2&& < CheckCircleOutlineOutlinedIcon className="poll__CheckBox"/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes2}</h2>
        </div>
        
        </div>
        
        {option3&&
        <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option3}</h1>
        {vote3&& <CheckCircleOutlineOutlinedIcon/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes3}</h2>
        </div>
        
        </div>}
        {option4&&
        <div className="post__poll__optionContainer">
        <div  className="post__poll__optionVoted">
        <h1 >{option4}</h1>
        {vote4&& <CheckCircleOutlineOutlinedIcon/>}
        </div>
        <div className="post__poll__optionh__votes">
        <h2 >{votes4}</h2>
        </div>
        
        </div>}
        <div className="poll__totalvotes">Total Votes: {totalVotes}</div>
        </div>
}
        
        
</div>
        </div>
    
    {/* //
    //
    //HIER BOVEN ZIT DE POLL(ONDERDEEL VAN NORMALE POST POLL) */}
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}  widget/>
:<div></div>}
</div>
    
</div>
    )}
    if(audio&&Rusername&&!Rtext){return(
        <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="retweetpostExtra">
     {/* <div className="retweetpostExtra"> */}

        <div onClick={(e)=>{
             e.stopPropagation();
     e.preventDefault()
     history.push(`/profile/${Rtweeter}`)
        }} className="post__retweeter">
    <RepeatIcon/>
    {Rtweeter} has reposted
</div>
        
       
       <div className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {username}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
  <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}


      </div>
      
    {image&&
    <img className="post__img"src={image} alt=""></img>}
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}Rusername={Rusername}   widget/>
:<div></div>}
</div>
    
</div>
</div>
    </div>
    )}
    if(audio&&Rusername&&Rtext){return(
        <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImageR}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImageR} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {Rusername}{""}
                 <span className="post__headerSpecial">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{Rusername}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
        <p id="posttextR"></p>
         {!statemesR&& <p>{Rtext}</p>}
           

      </div>
      </div>
    
    {/* //
    //HIERONDER POST VAN DE GE-RETWEETDE USER
    //
    // */}
    <div className="postRR">
           <div className="post__avatar">
        
                 {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
         
            </div>
     <div className="post__bodyRR">
                <div className="post__header">
            <div className="post__headerTextRR">
             <h3> {username}{""}
                 <span className="post__headerSpecialRR">
                {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>}
                @{username}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
              <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}


      </div>
      </div>
      {audio&&<audio className="audioR" controls src={audio}></audio>}
      </div>
    </div>

    {/* //
    //
    //HIERBOVEN POST VAN DE GE-RETWEETDE USER
    // */}
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}  widget/>
:<div></div>}
</div>
    
</div>
    )}
return(
//
//retweet met tekst
//
        
       <div id="clickable" onClick={(e)=>{
    
    if(e.target.closest('form')===null){
        history.push(`/post/${username}/${token}`)
    }
    }} className="post">
    <div className="post__avatar">
        
                {avatar?
                 
                <img onClick={clickImageR}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImageR} className="post__profile__pic" src=''/>}
         
    </div>

    <div className="post__body">
      <div className="post__header">
            <div className="post__headerText">
             <h3> {Rusername}{""}
                 <span className="post__headerSpecial">
                 {/* {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>} */}
                @{Rusername}
                <FiberManualRecordIcon style={{fontSize:'small',marginLeft:'2px'}} />{newTime}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
        <p id="posttextR"></p>
         {!statemesR&& <p>{Rtext}</p>}
           

      </div>
      </div>
    
    {/* //
    //HIERONDER POST VAN DE GE-RETWEETDE USER
    //
    // */}
    <div className="postRR">
           <div className="post__avatar">
        
                 {avatar?
                 
                <img onClick={clickImage}src={avatar} className="post__profile__pic"/>
                :<Avatar onClick={clickImage} className="post__profile__pic" src=''/>}
         
         
            </div>
     <div className="post__bodyRR">
                <div className="post__header">
            <div className="post__headerTextRR">
             <h3> {username}{""}
                 <span className="post__headerSpecialRR">
                {/* {verified&&<VerifiedUserIcon className="post__badge"></VerifiedUserIcon>} */}
                @{username}
                 </span>
            </h3>
    
            </div>

      <div className="post__headerDescription">
              <p id="posttext"></p>
         {!statemes&& <p>{text}</p>}


      </div>
      </div>
      {image&&
    <img className="post__img"src={image} alt=""></img>}
      </div>
    </div>

    {/* //
    //
    //HIERBOVEN POST VAN DE GE-RETWEETDE USER
    // */}
    
     {user&&allow?
<PostFooter userId={userId} token={token} likes={likes}comments={comments}shares={shares} username={username} avatar={avatar} verified={verified}text={text}image={image}option1={option1}  widget/>
:<div></div>}
</div>
    
</div>

    


    )
}
//)

export default Post